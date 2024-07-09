//
//  PasswordlessClientSdk.h
//  PasswordlessClientSdk
//
//  Created by Sumit on 26/05/23.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@protocol PasswordlessClientSdkDelegate <NSObject>
-(void) didReceivedResponseFromSdk:(NSDictionary<NSString *,id> *) response;
-(void) didReceivedErrorSdk:(NSString*) error;
@end

@interface PasswordlessClientSdk : NSObject


-(void)loadSDK:(NSString*)URL;

-(void)setupRegistrationClient:(NSString*)originStr
                          :(UIViewController*)viewController;

-(void)registerWithPasswordless:(NSString *)userId reqOrigin:(NSString *)reqOrigin clientId:(NSString*)clientId viewcontroller:(UIViewController*)viewController;


-(void)setupLoginClient:(NSString*)originStr
                          :(UIViewController*)viewController;

-(void)loginWithPasswordless:(NSString *)userId reqOrigin:(NSString *)reqOrigin clientId:(NSString*)clientId viewcontroller:(UIViewController*)viewController;
-(void)getApplicationDetails:(NSString*)clientId;
@property (nonatomic, weak) id <PasswordlessClientSdkDelegate> sdkDelegate;

@end
