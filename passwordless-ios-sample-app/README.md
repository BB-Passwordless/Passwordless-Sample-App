1. Add sdk files into your app 
   1. libPasswordlessClientSdk.a
   2. PasswordlessClientSdk.h


2. If your project is in swift then create bridging header file and import “PasswordlessClientSdk.h”.
   1. Eg -   #import "lib/PasswordlessClientSdk.h"
I have created lib group and putted sdk files into it


3. Create sdk object 
   1. var sdk = PasswordlessClientSdk()


4. Declare 3 variables 
   1. Like - 


let baseUrl = "https://api.passwordless4u.com/v1"
let originStr = "https://api.passwordless4u.com"
let clientID = "eq-H8DjXiEHUaQGsDaz_tNlwfOOWvSdY2xkfpWKlJsNPuWHSqm"


        
5. Register - In viewDidLoad add delegate and load using base url and setup using website url/ origin
   1. Like - 
                
                sdk.sdkDelegate=self
                        sdk.load(baseUrl)
                        sdk.setupRegistrationClient(originStr, self)


6. Get application details - call sdks get application details method to get logo and app name 
   1. Like 


sdk.getApplicationDetails(clientID)


7. Login - In viewDidLoad add delegate and load using base url and setup using website url/ origin
   1. Like - 
                
                sdk.sdkDelegate=self
                        sdk.load(baseUrl)
                        sdk.setupLoginClient(originStr, self)




Delegate methods 


Add delegate


class ViewController: UIViewController, PasswordlessClientSdkDelegate{
…
…
…
}


Methods
1. func didReceivedResponse(fromSdk response: [String : Any]) {
            if response["verified"] == nil {
            
           Let appName = "\(response["name"] as? String ?? "")"
            guard let appLogo = URL(string:response["logo"] as? String ?? "" ) else { return  }
            let data = try? Data(contentsOf: appLogo)


            if let imageData = data {
                logoImage.image = UIImage(data: imageData)
            }


        }
else 
{
            let verified = response["verified"] as? Bool ?? false
            print(verified)
            
            let errorCode = response["errorCode"] as? Int
            print(errorCode)
            
            if(verified)
            {
                //Success
              
            }else if(errorCode != nil){
                
                let message = response["errorMessage"] as? String
                // error message
            }else{
                //error
            }
            
        }
        
    }
2. 

func didReceivedErrorSdk(_ error: String!) {
        print(error)
            }