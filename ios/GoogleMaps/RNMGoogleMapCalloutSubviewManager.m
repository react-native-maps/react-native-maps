//
//  RNMGoogleMapCalloutSubviewManager.m
//  RNMaps
//
//  Created by Denis Oblogin on 10/8/18.
//
//

#ifdef HAVE_GOOGLE_MAPS

#import "RNMGoogleMapCalloutSubviewManager.h"
#import "RNMGoogleMapCalloutSubview.h"
#import <React/RCTView.h>

@implementation RNMGoogleMapCalloutSubviewManager
RCT_EXPORT_MODULE()

- (UIView *)view
{
  RNMGoogleMapCalloutSubview *calloutSubview = [RNMGoogleMapCalloutSubview new];
  return calloutSubview;
}

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

@end

#endif
