//
//  WebAuthManager.swift
//  WebAuthnKitDemo
//
//  Created by admin on 09/07/21.
//  Copyright © 2021 Lyo Kato. All rights reserved.
//

import Foundation
import UIKit
import WebAuthnKit
import PromiseKit
import CryptoSwift
import Alamofire




@objc protocol WebAuthManagerDelegate:AnyObject{
    @objc optional func fidoResponseData(json:Dictionary<String, Any>)
    @objc optional func failureResult(error:String)
}


public enum FormError : Error {
    case missing(String)
    case empty(String)
}
@objc class WebAuthManager: NSObject{
    
    @objc static let sharedInstance = WebAuthManager()
    @objc var delegate: WebAuthManagerDelegate?
    var webAuthnClient: WebAuthnClient!
    var userConsentUI: UserConsentUI!
    var details = [String:Any]()
    var type = Int()
    var userNameStr : String?
    var nameStr : String?
    var clientIdStr:String?
    var challangeCodeStr : String?
    var rpIdStr : String?
    var displayNameStr : String?
    var attestationStr = String()
    var userVerificationStr = String()
    var requireResidentKeyStr = Bool()
    var baseUrl = String()
    var userVerification:      UISegmentedControl!
    var attestationConveyance: UISegmentedControl!
    var attestationObject = String()
    var clientDataJSON = String()
    var credentialId = String()
    var asscredentialId : String?
    var rawId = String()
    var typePublic = String()
    var assertionId = String()
    var assertionRawId = String()
    var assertionAuthentuicationData = String()
    var assertionSignature = String()
    var assertionUserHandle = String()
    var assertionClientDataJson = String()
    var assertType = String()
    var assertionChallange : String?
    var assertionRpId : String?
    
    @objc func loadSDK(baseurl:NSString) {
        
        self.baseUrl = baseurl as String
        //self.delegate=self
    }
    
    override init() {
        
    }
    
    @objc  func setupWebAuthnClient(originStr:String,viewController:UIViewController) {
        
        self.userConsentUI = UserConsentUI(viewController: viewController)
        
        let authenticator = InternalAuthenticator(ui: self.userConsentUI)
        
        self.webAuthnClient = WebAuthnClient(
            origin:        originStr,
            authenticator: authenticator
        )
    }
    
    @objc func setupWebLoginClient(originStr:String,viewController:UIViewController) {
        WAKLogger.available = true
        self.userConsentUI = UserConsentUI(viewController: viewController)
        self.userConsentUI.config.alwaysShowKeySelection = true
        
        let authenticator = InternalAuthenticator(ui: self.userConsentUI)
        
        self.webAuthnClient = WebAuthnClient(
            origin:        originStr,
            authenticator: authenticator
        )
        
    }

    func startRegistration(viewController:UIViewController) {
        
        guard let challenge = challangeCodeStr else {
            self.showErrorPopup(FormError.missing("challenge"),viewController: viewController)
            return
        }
        if challenge.isEmpty {
            self.showErrorPopup(FormError.empty("challenge"),viewController: viewController)
            return
        }
        
        guard let userId = userNameStr else {
            self.showErrorPopup(FormError.missing("userId"),viewController: viewController)
            return
        }
        if userId.isEmpty {
            self.showErrorPopup(FormError.empty("userId"),viewController: viewController)
            return
        }
        
        guard let userName = userNameStr else {
            self.showErrorPopup(FormError.missing("userName"),viewController: viewController)
            return
        }
        if userName.isEmpty {
            self.showErrorPopup(FormError.empty("userName"),viewController: viewController)
            return
        }
        
        guard let displayName = displayNameStr else {
            self.showErrorPopup(FormError.missing("displayName"),viewController: viewController)
            return
        }
        if displayName.isEmpty {
            self.showErrorPopup(FormError.empty("displayName"),viewController: viewController)
            return
        }
        
        guard let rpId = rpIdStr else {
            self.showErrorPopup(FormError.missing("rpId"),viewController: viewController)
            return
        }
        if rpId.isEmpty {
            self.showErrorPopup(FormError.empty("rpId"),viewController: viewController)
            return
        }
        
        let attestation = [
            AttestationConveyancePreference.direct,
            AttestationConveyancePreference.indirect,
            AttestationConveyancePreference.none,
        ][0]
        
        let verification = [
            UserVerificationRequirement.required,
            UserVerificationRequirement.preferred,
            UserVerificationRequirement.discouraged
        ][0]
        
        let requireResidentKey = true
        let valueChallange = Bytes.fromString(challenge)
        print("valueChallange == \(valueChallange)")
        var options = PublicKeyCredentialCreationOptions()
        options.challenge = Bytes.fromString(challenge)
        options.user.id = Bytes.fromString(userId)
        options.user.name = userName
        options.user.displayName = displayName
        
        options.user.icon = "https://demo.axiomprotect.com:4443/sonickyc/logo.jpeg"
        options.rp.id = rpId
        options.rp.name = rpId
        options.rp.icon = "https://developers.google.com/identity/images/g-logo.png"
        
        options.attestation = attestation
        options.addPubKeyCredParam(alg: .es256)
        options.authenticatorSelection = AuthenticatorSelectionCriteria(
            requireResidentKey: requireResidentKey,
            userVerification: verification
        )
        // options.timeout = UInt64(120)
        
        print("==========================================")
        print("rp.id: " + (options.rp.id ?? "nil"))
        print("user.id: " + Base64.encodeBase64URL(options.user.id))
        print("challenge: " + Base64.encodeBase64URL(options.challenge))
        print("==========================================")
        
        //self.webAuthnClient.minTimeout = 5
        //self.webAuthnClient.defaultTimeout = 5
        
        firstly {
            
            self.webAuthnClient.create(options)
            
        }.done { credential in
            
            print("==========================================")
            print("credentialId: " + credential.id)
            print("rawId: " + Base64.encodeBase64URL(credential.rawId))
            print("attestationObject: " + Base64.encodeBase64URL(credential.response.attestationObject))
            print("clientDataJSON: " + Base64.encodeBase64URL(credential.response.clientDataJSON.data(using: .utf8)!))
            
            print("type: " + credential.type.rawValue)
            print("==========================================")
            
            self.attestationObject = Base64.encodeBase64URL(credential.response.attestationObject)
            self.rawId = Base64.encodeBase64URL(credential.rawId)
            self.typePublic = credential.type.rawValue
            self.clientDataJSON = Base64.encodeBase64URL(credential.response.clientDataJSON.data(using: .utf8)!)
            self.credentialId = credential.id
            self.verifyRegistrationResponse()
        }.catch { error in
            
            self.showErrorPopup(error,viewController: viewController)
        }
        
    }
    
@objc func verifyToken(accessToken:String) {
        
        let url = self.baseUrl + "verifyToken"
        let parameter = ["accessToken":accessToken] as! [String:Any]
        
        print(parameter)
        
        AF.request(url, method: .post, parameters: parameter, encoding:JSONEncoding.default,headers: nil).responseJSON { response in
            print(response)
            
            if let json = response.value as? [String:Any] {
                do{
                    self.delegate?.fidoResponseData?(json: json)
                    
                }catch let err{
                    
                    
                    self.delegate?.failureResult?(error: err.localizedDescription)
                
                }
            }else{
                print(response.value)
                let json = response.value as? [String:Any]
                if(json?.count != 0)
                {
                    self.delegate?.fidoResponseData?(json: json!)
                }else{
                    self.delegate?.failureResult?(error: response.error!.localizedDescription)
                }
            }
        }
        
    }
    //register
    func verifyRegistrationResponse(){
       
        let url = self.baseUrl + "verify-registerUser-attestation-ios"
        
        let parameter = ["username":self.userNameStr!,
                         "challenge":self.challangeCodeStr!,
                         "clientId":clientIdStr!,
                         "credential":[ "id":self.credentialId,
                                        "rawId":self.rawId,
                                        "type": self.typePublic,
                                     
                                        "response":["attestationObject":self.attestationObject,
                                                    "clientDataJSON":self.clientDataJSON]],
                        
                         
        ] as! [String:Any]
        print(parameter)
        AF.request(url, method: .post, parameters: parameter, encoding:JSONEncoding.default,headers: nil).responseJSON { response in
            print(response)
            
            if let json = response.value as? [String:Any] {
                do{
                 
                    self.delegate?.fidoResponseData?(json: json)
                    
           
                }catch let err{
                    
                    
                    self.delegate?.failureResult?(error: err.localizedDescription)
                    print(err)
               
                }
            }else{
                print(response.value)
                let json = response.value as? [String:Any]
                
                if(json?.count != 0)
                {
                    self.delegate?.fidoResponseData?(json: json ?? ["":""])
                }else{
                    self.delegate?.failureResult?(error: response.error!.localizedDescription)
                }
            }
        }
        
    }
    
 //register
    @objc func generateAttestationOptions(userId:String,clientId:String,rpId:String,viewController:UIViewController){
        userNameStr=userId
        clientIdStr=clientId
        let url = baseUrl + "registerUser"
        print(url)
        let parameter = ["username":userNameStr,
                         //"name":nameStr,
                         "clientId":clientIdStr] as! [String:String]
        print(parameter)
        AF.request(url, method: .post, parameters: parameter, encoding:JSONEncoding.default,headers: nil).responseJSON { response in
            print(response)
            print(response.error?.localizedDescription)
            
            if let json = response.data {
                do{
                    let decoder = JSONDecoder()
                    let resp = try decoder.decode(FIDOModal.self, from: json)
                        
                    //WebAuthManager.sharedInstance.challangeCodeStr = resp.challenge
                    self.challangeCodeStr = resp.challenge
                    self.userNameStr = resp.user.name
                    self.rpIdStr = rpId//"home.passwordless.com.au"//resp.rp.id ??
                    self.displayNameStr = resp.user.displayName
                    self.attestationStr = resp.attestation ?? "direct"
                    self.userVerificationStr = resp.authenticatorSelection.userVerification ?? "required"
                    self.requireResidentKeyStr = resp.authenticatorSelection.requireResidentKey
                    self.startRegistration(viewController: viewController)
                }catch let err{
                    
                    print(response.value)
                    let json = response.value as? [String:Any]
                    if(json?.count != 0)
                    {
                        self.delegate?.fidoResponseData?(json: json!)
                    }else{
                        self.delegate?.failureResult?(error: err.localizedDescription)
                    }
                    
                    print(err)
                    
                }
            }else{
                if((response.error?.localizedDescription) !=  nil)
                {
                    self.delegate?.failureResult?(error: response.error?.localizedDescription ?? "")
                }
            }
        }
    }
    
    //login//
    @objc func generateAssertionOptions(userId:String,clientId:String,viewController:UIViewController){
        
        userNameStr=userId
        clientIdStr=clientId
        
        let url = baseUrl + "LoginUser"
        print(url)
        let parameter = ["username":userNameStr,
                         //"name":nameStr,
                         "clientId":clientIdStr] as! [String:String]
        print(parameter)
        AF.request(url, method: .post, parameters: parameter, encoding:JSONEncoding.default,headers: nil).responseJSON { response in
            print(response)
            
            if let json = response.data {
                do{
                    let decoder = JSONDecoder()
                    let resp = try decoder.decode(AssertionModal.self, from: json)
                    self.assertionChallange = resp.challenge
                    self.assertionRpId = resp.rpID
                    self.asscredentialId = resp.allowCredentials[0].id
                    print(self.asscredentialId)
                    self.userVerificationStr = resp.userVerification ?? "required"
                    self.startAuthentication(viewController: viewController)
                }catch let err{
                    let json = response.value as? [String:Any]
                    if(json?.count != 0)
                    {
                    self.delegate?.fidoResponseData?(json: json!)
                    }else{
                        self.delegate?.failureResult?(error: err.localizedDescription)
                    }
                    print(err)
                    
                }
            }else{
                print(response.value)
                let json = response.value as? [String:Any]
                if(json?.count != 0)
                {
                    self.delegate?.fidoResponseData?(json: json!)
                }else{
                    self.delegate?.failureResult?(error: response.error!.localizedDescription)
                }
            }
        }
    }
    
    
    
    
    private func startAuthentication(viewController:UIViewController) {
        
        guard let challenge = assertionChallange else {
            self.showErrorPopup(FormError.missing("challenge"),viewController:viewController)
            return
        }
        
        if challenge.isEmpty {
            self.showErrorPopup(FormError.empty("challenge"),viewController:viewController)
            return
        }
        
        guard let rpId = assertionRpId else {
            self.showErrorPopup(FormError.missing("rpId"),viewController:viewController)
            return
        }
        
        if rpId.isEmpty {
            self.showErrorPopup(FormError.empty("rpId"),viewController:viewController)
            return
        }
        
        let verification = [
            UserVerificationRequirement.required,
            UserVerificationRequirement.preferred,
            UserVerificationRequirement.discouraged
        ][0]
        
        var options = PublicKeyCredentialRequestOptions()
        options.challenge = Bytes.fromString(challenge)
        options.rpId = rpId
        options.userVerification = verification
        
        if let credId = asscredentialId {
            if !credId.isEmpty {
                options.addAllowCredential(
                    credentialId: Bytes.fromHex(credId),
                    transports:   [.internal_]
                    // typePublic: "public-key"
                )
                
            }
            
        }
        //print("credentialId ==")
        //options.timeout = UInt64(120)
        
        print("==========================================")
        print("challenge: " + Base64.encodeBase64URL(options.challenge))
        print("==========================================")
        
        //self.webAuthnClient.minTimeout = 5
        //self.webAuthnClient.defaultTimeout = 5
        
        firstly {
            
            self.webAuthnClient.get(options)
            
        }.done { assertion in
            
            print("==========================================")
            
            print("credentialId: " + assertion.id)
            print("rawId: " + Base64.encodeBase64URL(assertion.rawId))
            print("authenticatorData: " + Base64.encodeBase64URL(assertion.response.authenticatorData))
            print("signature: " + Base64.encodeBase64URL(assertion.response.signature))
            print("userHandle: " + Base64.encodeBase64URL(assertion.response.userHandle!))
            print("clientDataJSON: " + Base64.encodeBase64URL(assertion.response.clientDataJSON.data(using: .utf8)!))
            print("==========================================")
            // self.showResult(assertion)
            //self.assertionSignature = Base64.encodeBase64URL(assertion.response.signature)
            self.assertType = assertion.type.rawValue
            self.assertionId = assertion.id
            self.assertionRawId = Base64.encodeBase64URL(assertion.rawId)
            self.assertionAuthentuicationData = Base64.encodeBase64URL(assertion.response.authenticatorData)
            self.assertionSignature = Base64.encodeBase64URL(assertion.response.signature)
            self.assertionUserHandle = Base64.encodeBase64URL(assertion.response.userHandle!)
            self.assertionClientDataJson = Base64.encodeBase64URL(assertion.response.clientDataJSON.data(using: .utf8)!)
            
            self.verifyLoginResponse()
            
        }.catch { error in
            
            self.showErrorPopup(error,viewController:viewController)
        }
        
    }
    
    
    
    
    private func showResult(_ credential: WebAuthnClient.CreateResponse,viewController:UIViewController) {
        
        //        let rawId             = credential.rawId.toHexString()
        //        let credId            = credential.id
        //        let clientDataJSON    = credential.response.clientDataJSON
        //        let attestationObject = Base64.encodeBase64URL(credential.response.attestationObject)
        //
        //        let vc = ResultViewController(
        //            rawId:             rawId,
        //            credId:            credId,
        //            clientDataJSON:    clientDataJSON,
        //            attestationObject: attestationObject
        //        )
        //
        //        viewController.present(vc, animated: true, completion: nil)
    }
    
    //login
    func verifyLoginResponse(){
        
        let url = self.baseUrl + "verify-loginUser-assertion-ios"
        print(url)
        let parameter = ["username":self.userNameStr!,
                        // "name":nameStr!,
                         "id":assertionId,
                         "rawId":assertionRawId,
                         "type": assertType,
                         "challenge": assertionChallange!,
                         "clientId":clientIdStr!,
                         "response":["authenticatorData":assertionAuthentuicationData,
                                     "clientDataJSON":assertionClientDataJson,
                                     "userHandle":assertionUserHandle,
                                     "signature":assertionSignature]
        ] as! [String:Any]
        print(parameter)
        AF.request(url, method: .post, parameters: parameter, encoding:JSONEncoding.default,headers: nil).responseJSON { response in
            print(response)
            
            if let json = response.value as? [String:Any] {
                do{
                  
                    self.delegate?.fidoResponseData?(json: json)
           
                    
                }catch let err{
                    self.delegate?.failureResult?(error: err.localizedDescription)
                    print(err)
                 
                }
            }
        }
        
    }
    
    
    
    private func showErrorPopup(_ error: Error,viewController:UIViewController) {
        
        let alert = UIAlertController.init(
            title:          "ERROR",
            message:        "failed: \(error)",
            preferredStyle: .alert
        )
        
        let okAction = UIAlertAction.init(title: "OK", style: .default)
        alert.addAction(okAction)
        
        viewController.present(alert, animated: true, completion: nil)
    }
    
    func postData(data: String , key:String) {
        //   let socket = manager.defaultSocket
        // socket.emit(key, data)
        
    }
    
}
public extension String {
    
    
    var base64Decoded: String? {
        guard let decodedData = Data(base64Encoded: self) else { return nil }
        return String(data: decodedData, encoding: .utf8)
    }
    
    var base64Encoded: String? {
        let plainData = data(using: .utf8)
        return plainData?.base64EncodedString()
    }
}
extension String {
    
    func fromBase64URL() -> String? {
        var base64 = self
        base64 = base64.replacingOccurrences(of: "-", with: "+")
        base64 = base64.replacingOccurrences(of: "_", with: "/")
        while base64.count % 4 != 0 {
            base64 = base64.appending("=")
        }
        guard let data = Data(base64Encoded: base64) else {
            return nil
        }
        return String(data: data, encoding: .utf8)
    }
    
    func toBase64URL() -> String {
        var result = Data(self.utf8).base64EncodedString()
        result = result.replacingOccurrences(of: "+", with: "-")
        result = result.replacingOccurrences(of: "/", with: "_")
        result = result.replacingOccurrences(of: "=", with: "")
        return result
    }
}
