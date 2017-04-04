//
//  GlobalVars.m
//  EvoApp
//
//  Created by Eric Kim on 2017-04-04.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "GlobalVars.h"

@implementation GlobalVars

@synthesize image = _image;

+ (GlobalVars *)sharedInstance {
  static dispatch_once_t onceToken;
  static GlobalVars *instance = nil;
  dispatch_once(&onceToken, ^{
    instance = [[GlobalVars alloc] init];
  });
  return instance;
}

- (UIImage *)getSharedUIImage:(NSString *)imageSrc {
  
  CGImageRef cgref = [[GlobalVars sharedInstance].image CGImage];
  CIImage *cim = [[GlobalVars sharedInstance].image CIImage];
  
  if (cim == nil && cgref == NULL) {
    if ([imageSrc hasPrefix:@"http://"] || [imageSrc hasPrefix:@"https://"]){
      NSURL *url = [NSURL URLWithString:imageSrc];
      NSData *data = [NSData dataWithContentsOfURL:url];
      [GlobalVars sharedInstance].image = [UIImage imageWithData:data scale:[UIScreen mainScreen].scale];
    } else {
      [GlobalVars sharedInstance].image = [UIImage imageWithContentsOfFile:imageSrc];
    }
    return [GlobalVars sharedInstance].image;
  } else {
    return [GlobalVars sharedInstance].image;
  }
}

- (id)init {
  self = [super init];
  if (self) {
    image = nil;
  }
  return self;
}

@end
