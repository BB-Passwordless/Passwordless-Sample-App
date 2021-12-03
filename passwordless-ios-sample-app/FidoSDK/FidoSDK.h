//
//  FidoSDK.h
//  FidoSDK
//
//  Created by mac mini on 9/27/21.
//  Copyright © 2021 Lyo Kato. All rights reserved.
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

-(void)registerWithFido:(NSString *)userId clientId:(NSString*)clientId rpId:(NSString *)rpId viewcontroller:(UIViewController*)viewController;

-(void)loginWithFido:(NSString *)userId clientId:(NSString*)clientId viewcontroller:(UIViewController*)viewController;

@property (nonatomic, weak) id <FidoSDKDelegate> fidoDelegate;

@end

NS_ASSUME_NONNULL_END
