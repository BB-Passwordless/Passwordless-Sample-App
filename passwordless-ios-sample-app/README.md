# Passwordless Sample App 


## Requirement :

Step 1: This sample App you need to:

1. base url 
2. rpId  
3. client Id 

Step 1 : You need to create add  Application on passwordless dashboard  then create app  you got client id , baseUrl .

step 2:  download sample app :-


          
Changes Required: 

    1)  RegisterAuthenticateVC.swift file : 

	Changes required  below fields- 

          baseUrl = “Add you Base url”  eg. https://home.passwordless.com.au/api/ 

	func ShowDetails(){
        
        let originStr = “Same as base url”	 eg: "https://home.passwordless.com.au" 
        clientID = “Your Client Id ” 			eg: "cPiGnj-KxYvWsIXNvBVFqZ......"
        self.rpId = “RPId”      				eg: "home.passwordless.com.au"
        
    }

 2) LoginAuthenticateVC.swift file:

   baseUrl = “Add you Base url”  eg. https://home.passwordless.com.au/api/ 

	func ShowDetails(){
        
        let originStr = “Same as base url”	 eg: "https://home.passwordless.com.au" 
        clientID = “Your Client Id ” 			eg: "cPiGnj-KxYvWsIXNvBVFqZfG6........"
               
    }


Additional Steps: if you have create separate sample app you need to add 
1) Add FidoSDK.h file 
2) libFidoSDK.a 
Note: require first you have register client and after you get login process . 
