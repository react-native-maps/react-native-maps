//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import "UIView+AirMap.h"

@implementation UIView (AirMap)

- (UIView *) getPaperViewFromChildComponentView {
    // Check if the childComponentView responds to the "adapter" selector
    if ([self respondsToSelector:@selector(paperView)]) {
        // Safely return the paperView
        return [self valueForKey:@"paperView"];
    }
    // Return nil if paperView is not accessible
    return nil;
}

@end
