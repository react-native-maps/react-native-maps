//
//  AIRGoogleMapCalloutManager.m
//  AirMaps
//
//  Created by Gil Birman on 9/6/16.
//
//

#import "AIRGoogleMapCalloutManager.h"
#import "AIRGoogleMapCallout.h"
#if __has_include(<React/RCTView.h>)
    #import <React/RCTView.h>
#else
    #import "RCTView.h"
#endif

@implementation AIRGoogleMapCalloutManager
RCT_EXPORT_MODULE()

- (UIView *)view
{
  AIRGoogleMapCallout *callout = [AIRGoogleMapCallout new];
  return callout;
}

RCT_EXPORT_VIEW_PROPERTY(tooltip, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

@end
