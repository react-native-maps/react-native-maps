//
//  AIRWeakTimerReference.m
//  AirMaps
//
//  Created by Michael Kugler on 27.02.19.
//  Copyright © 2019 Christopher. All rights reserved.
//

#import "AIRWeakTimerReference.h"

@implementation AIRWeakTimerReference
{
    __weak NSObject *_target;
    SEL _selector;
}


- (instancetype)initWithTarget:(id)target andSelector:(SEL)selector {
        self = [super init];
        if (self) {
            _target = target;
            _selector = selector;
        }
        return self;
}


- (void)timerDidFire:(NSTimer *)timer
{
    if(_target)
    {
        [_target performSelector:_selector withObject:timer];
    }
    else
    {
        [timer invalidate];
    }
}


@end
