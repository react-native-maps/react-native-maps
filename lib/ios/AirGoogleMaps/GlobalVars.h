//
//  GlobalVars.h
//
//  Created by Eric Kim on 2017-04-04.
//  Copyright © 2017 Apply Digital. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface GlobalVars : NSObject
{
  NSMutableDictionary *dict;
}

+ (GlobalVars *)sharedInstance;

- (UIImage *)getSharedUIImage:(NSString *)imageSrc;

@property(strong, nonatomic, readwrite) NSMutableDictionary *dict;

@end
