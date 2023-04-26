//
//  RNMMapCalloutSubviewManager.m
//  RNMaps
//
//  Created by Denis Oblogin on 10/8/18.
//
//

#import "RNMMapCalloutSubviewManager.h"
#import "RNMMapCalloutSubview.h"
#import <React/RCTView.h>

@implementation RNMMapCalloutSubviewManager
RCT_EXPORT_MODULE(RNMMapCalloutSubview)

- (UIView *)view
{
  RNMMapCalloutSubview *calloutSubview = [RNMMapCalloutSubview new];
  return calloutSubview;
}

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

@end
