1. Create an application on a passwordless dashboard.
1. To create an application you need 
   1. Your application package name
   2. Your application she256 fingerprint 
3. For the sha256 fingerprint run the following command 
keytool -list -v -keystore <keystore path> -alias <key alias> -storepass <store password> -keypass <key password> 
4. Define signing config in android application for release and debug ..like given below  
5. Add password-less sdk into libs folder 
 
6. Implement sdk into app level build.gradle 
implementation files('libs/PasswordlessClient_-release.aar'){
    dependencies {
        implementation 'com.android.volley:volley:1.2.1'
        implementation 'com.google.android.gms:play-services-fido:18.1.0'
    }
}
7. Sync project 
8. Create connector class object 
Connector connector = new Connector(this);
9. Initialise sdk ising init method 
connector.init("https://api.passwordless4u.com",
        "https://api.passwordless4u.com/v1",
        "api.passwordless4u.com",
        "gk33r_r0GSAErsOvPTIQ5tRiKiAt68HbzvnQ5NrEt_SqA9B1UF"
);
Param 1 : Your website url (if you don’t have website url use from password less dashboard)
Param 2 : Base url given on password less dashboard
Param 3 : RP id (RP id is body of your website url where asset link.json is published)
Param 4 : Client id given on password less dashboard 
10. Get application details 
You can get your application details using this 
connector.getApplicationDetails(new PasswordlessResponse() {
    @Override
    public void response(int resultCode, String resultMessage, JSONObject resultJson) {
        
    }
});
11. Register
connector.register(“username”, new PasswordlessResponse() {
   @Override
   public void response(int resultCode, String resultMessage, JSONObject resultJson)
   {
       if(resultCode==0)
       {
             //success
        }
       else
       {
             //fail
        }
   }
});
12. Login
connector.login(“username”, new PasswordlessResponse() {
   @Override
   public void response(int resultCode, String resultMessage, JSONObject resultJson)
   {
       if(resultCode==0)
       {
             //success
        }
       else
       {
             //fail
           }
   }
});
13. now copy the following code and paste it after "onCreate" on your activity where you are using passwordless that means you need to pass activity result to passwordless.
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data)
{
   super.onActivityResult(requestCode, resultCode, data);
   connector.onActivityResult(requestCode,resultCode,data);
}
1. Interface methods
boolean init (String yourWebsiteUrl, String baseUrl, String raid, String clientId) throws Exception;

void login(String userName, PasswordlessResponse passwordlessResponse);
void register(String userName, PasswordlessResponse passwordlessResponse);
void getApplicationDetails(PasswordlessResponse passwordlessResponse);


void onActivityResult(int requestCode, int resultCode, Intent data);