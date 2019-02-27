//
//  AIRWeakTimerReference.h
//  AirMaps
//
//  Created by Michael Kugler on 27.02.19.
//  Copyright © 2019 Christopher. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface AIRWeakTimerReference : NSObject

- (instancetype)initWithTarget:(id)target andSelector:(SEL)selector;
- (void)timerDidFire:(NSTimer *)timer;

@end

NS_ASSUME_NONNULL_END
