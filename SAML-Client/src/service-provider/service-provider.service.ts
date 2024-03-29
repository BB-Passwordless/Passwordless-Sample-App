import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as samlify from 'samlify';
import * as fs from 'fs';
import * as validator from '@authenio/samlify-xsd-schema-validator';
samlify.setSchemaValidator(validator);

@Injectable()
export class ServiceProviderService {
  private readonly logger = new Logger('ServiceProviderService');
  constructor(private readonly httpService: HttpService) {}

  private idp: any;
  private sp: any;

  async getIdpMetadata(): Promise<any> {
    try {
      this.logger.log('Getting IDP from metadata url');
      const response = await firstValueFrom(
        this.httpService.get(process.env.IDP_METADATA_URL),
      );
      this.idp = samlify.IdentityProvider({
        metadata: response.data,
      });
      this.logger.log('IDP metadata loaded');
    } catch (error) {
      this.logger.error('Error in Getting Metadata: ' + error.message);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }

  getSp() {
    try {
      this.logger.log('Getting Service Provider from metadata file');
      const sp = samlify.ServiceProvider({
        // metadata: fs.readFileSync(
        //   './src/service-provider/sp-metadata.xml',
        //   'utf8',
        // ),

        privateKey: fs.readFileSync('./encryptKey.pem'),
        entityID: `http://localhost:5000/sp/test`,
        assertionConsumerService: [
          {
            Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
            Location: `http://localhost:5000/sp/acs`,
          },
        ],

        //wantMessageSigned: true,
        authnRequestsSigned: false,

        signingCert: fs.readFileSync('./encryptionCert.pem'),
      });
      this.sp = sp;
      this.logger.log(
        'Service Provider loaded',
        sp.entityMeta.getAssertionConsumerService('post'),
      );
      this.logger.log('Service Provider metadata loaded');
    } catch (error) {
      this.logger.error('Error in getSp: ' + error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async spInitiatedRedirect(req: any, res: any) {
    try {
      const result = this.sp.createLoginRequest(this.idp, 'redirect');

      const { context } = result;
      return res.redirect(context);
    } catch (err) {
      this.logger.error(
        'Error while creating login redirect request: ' + err.message,
      );
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async spInitiatedPost(req: any, res: any) {
    try {
      const result = this.sp.createLoginRequest(this.idp, 'post');
      return res.render('sp-post', result);
    } catch (err) {
      this.logger.error('Error in creating login post request: ' + err.message);
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async spInitiatedLogout(req: any, res: any) {
    try {
      const result = this.sp.createLogoutRequest(this.idp, 'post', {
        logoutNameID: 'user@esaml2',
      });
      console.log(result);
      return res.render('sp-post', result);
    } catch (err) {
      this.logger.error('Error in creating logout request: ' + err.message);
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async acs(req: any, res: any) {
    this.logger.log('ACS request received');
    try {
      // const decodedString = Buffer.from(
      //   req.body.SAMLResponse,
      //   'base64',
      // ).toString('ascii');
      // const { issuer } = samlify.Extractor.extract(decodedString, [
      //   {
      //     key: 'issuer',
      //     localPath: ['Response', 'Issuer'],
      //     attributes: [],
      //   },
      // ]);

      const result = await this.sp.parseLoginResponse(this.idp, 'post', req);

      const { extract } = result;
      this.logger.log(`ACS recieved data parsed: ${JSON.stringify(extract)}`);
      return res.send(JSON.stringify(extract, null, 4));
    } catch (err) {
      this.logger.error('Error in acs: ', err);
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async slo(req: any, res: any) {
    this.logger.log('SLO request received');
    try {
      const result = await this.sp.parseLogoutResponse(this.idp, 'post', req);
      const { extract } = result;
      this.logger.log(`SLO recieved data parsed: ${JSON.stringify(extract)}`);
      return res.send(JSON.stringify(extract, null, 4));
    } catch (err) {
      this.logger.error('Error in slo: ', err);
      throw new HttpException(err.message, err.status || 500);
    }
  }
}
