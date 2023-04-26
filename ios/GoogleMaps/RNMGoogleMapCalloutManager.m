//
//  RNMGoogleMapCalloutManager.m
//  RNMaps
//
//  Created by Gil Birman on 9/6/16.
//
//

#ifdef HAVE_GOOGLE_MAPS

#import "RNMGoogleMapCalloutManager.h"
#import "RNMGoogleMapCallout.h"
#import <React/RCTView.h>

@implementation RNMGoogleMapCalloutManager
RCT_EXPORT_MODULE(RNMGoogleMapCallout)

- (UIView *)view
{
  RNMGoogleMapCallout *callout = [RNMGoogleMapCallout new];
  return callout;
}

RCT_EXPORT_VIEW_PROPERTY(tooltip, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(alphaHitTest, BOOL)

@end

#endif
