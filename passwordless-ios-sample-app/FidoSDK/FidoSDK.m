//
//  FidoSDK.m
//  FidoSDK
//

//

#import "FidoSDK.h"
#import "FidoSDK-Swift.h"

@interface FidoSDK ()<WebAuthManagerDelegate>

@end


@implementation FidoSDK

-(void)loadSDK:(NSString*)URL{

    [[WebAuthManager sharedInstance] loadSDKWithBaseurl:URL];
    [[WebAuthManager sharedInstance] setDelegate:self];
}


-(void)setupRegistrationClient:(NSString*)originStr
                          :(UIViewController*)viewController{
    
    [[WebAuthManager sharedInstance] setupWebAuthnClientWithOriginStr:originStr viewController:viewController];
}

-(void)setupLoginClient:(NSString*)originStr
                          :(UIViewController*)viewController
{

    [[WebAuthManager sharedInstance] setupWebLoginClientWithOriginStr:originStr viewController:viewController];

}

-(void)registerWithFido:(NSString *)userId clientId:(NSString*)clientId originStr:(NSString*)originStr viewcontroller:(UIViewController*)viewController{
    
    
    [[WebAuthManager sharedInstance] generateAttestationOptionsWithUserId:userId clientId:clientId originStr:originStr viewController:viewController];
    
}
-(void)loginWithFido:(NSString *)userId clientId:(NSString*)clientId originStr:(NSString*)originStr viewcontroller:(UIViewController*)viewController
{
    
    [[WebAuthManager sharedInstance] generateAssertionOptionsWithUserId:userId clientId:clientId originStr:originStr  viewController:viewController];
   
}
-(void)getLogoName:(NSString *)clientId {
    [[WebAuthManager sharedInstance]getLogoNameWithClientId:clientId];
}


- (void)fidoResponseDataWithJson:(NSDictionary<NSString *,id> *)json{
    
    [self.fidoDelegate didReceivedResponseFromFidoSDK:json];
    
}

- (void)failureResultWithError:(NSString *)error{
    
    [self.fidoDelegate didReceivedErrorFidoSDK:error];
    
}

@end

