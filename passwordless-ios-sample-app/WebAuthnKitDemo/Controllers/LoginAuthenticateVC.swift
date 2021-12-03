//
//  LoginAuthenticateVC.swift
//  WebAuthnKitDemo
//
//  Created by mac mini on 10/14/21.
//  Copyright © 2021 Lyo Kato. All rights reserved.
//

import UIKit
import WebAuthnKit
import PromiseKit
import CryptoSwift
import Alamofire
import ProgressHUD

class LoginAuthenticateVC: UIViewController, FidoSDKDelegate{

    @IBOutlet weak var subView: UIView!
    @IBOutlet weak var userText: UITextField!
    
    var userNameStr : String?
    var baseUrl = String()
    var sdk = FidoSDK()
    var clientID = String()
    override func viewDidLoad() {
        super.viewDidLoad()
        baseUrl = "https://home.passwordless.com.au/api/"
        sdk.fidoDelegate=self
        sdk.load(baseUrl)
        ShowDetails()
    }

    override func viewWillAppear(_ animated: Bool) {
        navigationController?.navigationBar.isHidden = true
        subView.layer.cornerRadius = 10

    }
    func ShowDetails(){
        
        userNameStr = userText.text
        let originStr = "https://home.passwordless.com.au"
        clientID = "cPiGnj-KxYvWsIXNvBVFqZfG65UIR8WkHGIgX35piZpHGTD0bi"
        sdk.setupLoginClient(originStr, self)

    }
    @IBAction func loginBtnTapped(_ sender: Any) {
        print("Registration")
       
        sdk.login(withFido: userText.text!,clientId:clientID  ,viewcontroller: self)
    }
    
    @IBAction func alreadyLoginBtnTapped(_ sender: Any) {
        
        let testVC = RegisterAuthenticateVC(nibName: "RegisterAuthenticateVC", bundle: nil)
       
        self.navigationController?.pushViewController(testVC, animated: true)
    }
    
    func base64urlToBase64(base64url: String) -> String {
        var base64 = base64url
            .replacingOccurrences(of: "-", with: "+")
            .replacingOccurrences(of: "_", with: "/")
        if base64.characters.count % 4 != 0 {
            base64.append(String(repeating: "=", count: 4 - base64.characters.count % 4))
        }
        return base64
    }
}
extension LoginAuthenticateVC:AlertViewDelegate{
   func alertViewRemoved() {
//        let appDelegate = UIApplication.shared.delegate! as! AppDelegate
//        let rootController = HomeVC(nibName: "HomeVC", bundle: nil)
//        let navigationBar = UINavigationController.init(rootViewController: rootController)
//        appDelegate.window?.rootViewController = navigationBar
    }
    
    
    func didReceivedResponse(fromFidoSDK response: [String : Any]) {
        print("didReceivedResponse")
        print(response)
        let verified = response["verified"] as? Bool ?? false
        print(verified)
        
        let errorCode = response["errorCode"] as? Int
        print(errorCode)
        
        if(verified)
        {
            AlertView.alertView.showAlert(message:"Client logged in successfully", imageName: "success", btnTitle: .Success)
          
        }else if(errorCode != nil){
            
            let message = response["errorMessage"] as? String
            AlertView.alertView.showAlert(message:message ?? "Failed to get response", imageName: "failed", btnTitle: .Success)
        }else{
            AlertView.alertView.showAlert(message:"failed to login user", imageName: "success", btnTitle: .Success)
        }
        
    }
    
    func didReceivedErrorFidoSDK(_ error: String) {
        print("didReceivedErrorFidoSDK")
        print(error)
        AlertView.alertView.showAlert(message:error, imageName: "failed", btnTitle: .Success)
    }
    
    
}
