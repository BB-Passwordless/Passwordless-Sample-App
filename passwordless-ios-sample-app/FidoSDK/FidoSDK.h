//
//  FidoSDK.h
//  FidoSDK

//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN


@protocol FidoSDKDelegate <NSObject>
-(void) didReceivedResponseFromFidoSDK:(NSDictionary<NSString *,id> *) response;
-(void) didReceivedErrorFidoSDK:(NSString*) error;
@end

@interface FidoSDK : NSObject

-(void)setupRegistrationClient:(NSString*)originStr
                          :(UIViewController*)viewController;

-(void)setupLoginClient:(NSString*)originStr
                          :(UIViewController*)viewController;
-(void)loadSDK:(NSString*)URL;

-(void)registerWithFido:(NSString *)userId clientId:(NSString*)clientId originStr:(NSString*)originStr viewcontroller:(UIViewController*)viewController;

-(void)loginWithFido:(NSString *)userId clientId:(NSString*)clientId originStr:(NSString*)originStr viewcontroller:(UIViewController*)viewController;
-(void)getLogoName:(NSString*)clientId;// new
@property (nonatomic, weak) id <FidoSDKDelegate> fidoDelegate;

@end

NS_ASSUME_NONNULL_END
