import { Controller, Get, Post, Res, Req } from '@nestjs/common';
import { ServiceProviderService } from './service-provider.service';

@Controller('sp')
export class ServiceProviderController {
  constructor(
    private readonly serviceProviderService: ServiceProviderService,
  ) {}

  @Get('login')
  async spInitiatedRedirect(@Res() res: any, @Req() req: any) {
    await this.serviceProviderService.spInitiatedRedirect(req, res);
  }

  @Get('login-post')
  async spInitiatedPost(@Res() res: any, @Req() req: any) {
    await this.serviceProviderService.spInitiatedPost(req, res);
  }

  @Post('acs')
  async acs(@Res() res: any, @Req() req: any) {
    await this.serviceProviderService.acs(req, res);
  }
}
