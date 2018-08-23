//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#if __has_include(<React/RCTView.h>)
    #import <React/RCTView.h>
#else
    #import "RCTView.h"
#endif


@interface AIRMapCallout : RCTView

@property (nonatomic, assign) BOOL tooltip;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

@end
