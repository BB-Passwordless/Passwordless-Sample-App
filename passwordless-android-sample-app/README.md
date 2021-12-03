# PasswordlessClient



	1. add passwordlessClient_ sdk in app (App Level Build)

		 implementation(name:'PasswordlessClient_-release', ext:'aar'){
			dependencies {
			    implementation 'com.android.volley:volley:1.2.1'
			    implementation 'com.google.android.gms:play-services-fido:18.1.0'
			}
		  }
  
  	2. create connector class object

		Connector connector = new Connector(Activity);
  
  	3. Initialize:- using connector class object 
  
   		connector.init("RP_ID","MAIN_URL","CLIENT_ID");
   
	   a. RP_ID - where your .well-known/assetlinks.json published that url body
   
		eg- if this is link 
      			https://home.your_site.com.au/.well-known/assetlinks.json
      
    		then your rp id is 
      			home.your_site.com.au
      
	   b. Mian url and client id you will get in 
        	https://home.passwordless.com.au/login 
		
		also you will get assetlinks.json 
		
		sha256 for sample app - 9B:DD:1F:4F:CB:A8:28:53:D1:02:E2:5E:C3:65:64:58:F3:57:89:4E:65:E2:40:AA:8A:29:B7:DF:53:FF:E9:8D
		package name- com.bluebricks.passwordlessclient
		
			here when you create your android application for passwordless
        
        
   	4. Register - 
   
    		connector.register("Username", new PasswordlessResponse() {
                        @Override
                        public void response(int resultCode, String resultMessage, JSONObject resultJson)
                        {
                            if(resultCode==0)
                            {
                              // Success
                            }
                            else
                            {
                               // Fail
                            }
                        }
                    });
                    
    	5. Login -
    
       		connector.Login("Username", new PasswordlessResponse() {
                        @Override
                        public void response(int resultCode, String resultMessage, JSONObject resultJson)
                        {
                            if(resultCode==0)
                            {
                              // Success
                            }
                            else
                            {
                               // Fail
                            }
                	}
        	});
  
