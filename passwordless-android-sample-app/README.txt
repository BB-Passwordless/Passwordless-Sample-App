Add sdk into your libs folder

Add libs folder into project leven build.gradle

flatDir{ dirs 'libs' }

Implement sdk into app level build.gradle
implementation(name:'PasswordlessClient_-release', ext:'aar'){ dependencies { implementation 'com.android.volley:volley:1.2.1' implementation 'com.google.android.gms:play-services-fido:18.1.0' } }

Create connector class object Connector connector = new Connector(Activity);

Initialize using connector class object

connector.init("RP_ID","MAIN_URL","CLIENT_ID");

a. RP_ID - where your .well-known/assetlinks.json published

Ex-"https://home.your_site.com.au/.well-known/assetlinks.json" This is your assetlinks.json url Then "home.your_site.com.au" is your rp_id

b. MAIN_URL- you will get this when you create your mobile application on passwordless web

for this application you can use following details to create app on dashboard

dashboard url :- https://home.passwordless.com.au/register

app package name :- com.bluebricks.passwordlessclient sha256 fingerprint :- 9B:DD:1F:4F:CB:A8:28:53:D1:02:E2:5E:C3:65:64:58:F3:57:89:4E:65:E2:40:AA:8A:29:B7:DF:53:FF:E9:8D

c. CLIENT_ID – client id also get from dashboard after create app

get App detils

connector.getApplicationDetails(new PasswordlessResponse() { @Override public void response(int resultCode, String resultMessage, JSONObject resultJson) { if(resultCode==0) { //success } else { //fail } } });

Register connector.register(“username”,new PasswordlessResponse() { @Override public void response(int resultCode, String resultMessage, JSONObject resultJson) { if(resultCode==0) { //success } else { //fail } } });

Login connector.login(“username”, new PasswordlessResponse() { @Override public void response(int resultCode, String resultMessage, JSONObject resultJson) { if(resultCode==0) { //success } else { //fail } } });

. now copy the following code and paste it after "onCreate" on your activity where you are using passwordless that means you need to pass activity result to passwordless.

@Override protected void onActivityResult(int requestCode, int resultCode, Intent data) { super.onActivityResult(requestCode, resultCode, data); connector.onActivityResult(requestCode,resultCode,data); }

Interface methods
boolean init (String rpId, String baseUrl, String clientId) throws Exception;

void getApplicationDetails(PasswordlessResponse passwordlessResponse); void login(String userName, PasswordlessResponse passwordlessResponse); void register(String userName, PasswordlessResponse passwordlessResponse);

void onActivityResult(int requestCode, int resultCode, Intent data);