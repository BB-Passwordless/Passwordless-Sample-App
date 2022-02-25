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

    @IBOutlet weak var lblTitle: UILabel!
    @IBOutlet weak var logoImage: UIImageView!
    @IBOutlet weak var subView: UIView!
    @IBOutlet weak var userText: UITextField!
    
    var userNameStr : String?
    var baseUrl = String()
    var sdk = FidoSDK()
    var clientID = String()
    var originStr = String()
    override func viewDidLoad() {
        
        super.viewDidLoad()
        
        baseUrl = "https://api.passwordless4u.com/v1"//"https://home.passwordless.com.au" // change base url
        
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
        
        let originStr = "https://test-or9t8esvh5.passwordless4u.com"   //chnage origin here
        
        clientID = "X4k_74f3hvQhmLX-65QcDBpt7QO8W8NRWdHfS4DtgzpwQHhiQA" //Change client id
        
        sdk.setupLoginClient(originStr, self)
        sdk.getLogoName(clientID)
    }
    @IBAction func loginBtnTapped(_ sender: Any) {
        print("Login")
       
        sdk.login(withFido: userText.text!,clientId:clientID, originStr: originStr  ,viewcontroller: self)
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

    }
    
   //MARK:- sdk delegate response
    
    func didReceivedResponse(fromFidoSDK response: [String : Any]) {
        print("didReceivedResponse")
        print(response)
        if response["verified"] == nil {
            
            lblTitle.text = "\(response["name"] as? String ?? "") Register"
            guard let url = URL(string:response["logo"] as? String ?? "" ) else { return  }
            let data = try? Data(contentsOf: url)

            if let imageData = data {
                logoImage.image = UIImage(data: imageData)
            }
        }else {
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
        
    }
    
    func didReceivedErrorFidoSDK(_ error: String) {
        print("didReceivedErrorFidoSDK")
        print(error)
        AlertView.alertView.showAlert(message:error, imageName: "failed", btnTitle: .Success)
    }
    
    
}
