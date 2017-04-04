//
//  GlobalVars.h
//  EvoApp
//
//  Created by Eric Kim on 2017-04-04.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface GlobalVars : NSObject
{
  UIImage *image;
}

+ (GlobalVars *)sharedInstance;

- (UIImage *)getSharedUIImage:(NSString *)imageSrc;

@property(strong, nonatomic, readwrite) UIImage *image;

@end
