//
//  LoginAuthenticateVC.swift
//  WebAuthnKitDemo
//
//  Created by mac mini on 10/14/21.
//  Copyright © 2021 Lyo Kato. All rights reserved.
//

import UIKit


class LoginAuthenticateVC: UIViewController, PasswordlessClientSdkDelegate, AlertViewDelegate {


    @IBOutlet weak var lblTitle: UILabel!
    @IBOutlet weak var logoImage: UIImageView!
    @IBOutlet weak var subView: UIView!
    @IBOutlet weak var userText: UITextField!
    
    var userNameStr : String?
    var sdk = PasswordlessClientSdk()
    
    
    var baseUrl = "https://api.passwordless4u.com/v1"
    let originStr = "https://api.passwordless4u.com"
    var clientID = "CrJj_dCdvbyWitjTch5V-t6FhC9tLlHPAPGG-n6lOfD-XQm9YC"
    
    
    @objc func dismissKeyboard() {
        view.endEditing(true)
    }
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(UIInputViewController.dismissKeyboard))
        view.addGestureRecognizer(tap)
        
      
        sdk.sdkDelegate=self
        sdk.load(baseUrl)
        
        sdk.setupLoginClient(originStr, self)
        sdk.getApplicationDetails(clientID)
    }


  
    @IBAction func loginBtnTapped(_ sender: Any) {
        print("Login")
       
        sdk.login(withPasswordless: userText.text!, reqOrigin: originStr, clientId: clientID, viewcontroller: self)
        
    }
    
    @IBAction func alreadyLoginBtnTapped(_ sender: Any) {
        
        let RegisterAuthenticateVC = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "RegisterAuthenticateVC") as! RegisterAuthenticateVC
         self.navigationController?.pushViewController(RegisterAuthenticateVC, animated: true)
    }
    
    func didReceivedResponse(fromSdk response: [String : Any]) {
        print("didReceivedResponse")
        print(response)
        if response["verified"] == nil {
            
            lblTitle.text = "\(response["name"] as? String ?? "") Login"
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
    
    func didReceivedErrorSdk(_ error: String!) {
        print("didReceivedErrorFidoSDK")
        print(error)
        AlertView.alertView.showAlert(message:error, imageName: "failed", btnTitle: .Success)
    }
    
 
    
    func alertViewRemoved() {

     }
    
}


