//
//  RNMGoogleMapCircleManager.m
//
//  Created by Nick Italiano on 10/24/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import "RNMGoogleMapCircleManager.h"
#import "RNMGoogleMapCircle.h"
#import <React/RCTBridge.h>
#import <React/UIView+React.h>

@interface RNMGoogleMapCircleManager()

@end

@implementation RNMGoogleMapCircleManager

RCT_EXPORT_MODULE(RNMGoogleMapCircle)

- (UIView *)view
{
  RNMGoogleMapCircle *circle = [RNMGoogleMapCircle new];
  return circle;
}

RCT_EXPORT_VIEW_PROPERTY(radius, double)
RCT_REMAP_VIEW_PROPERTY(center, centerCoordinate, CLLocationCoordinate2D)
RCT_EXPORT_VIEW_PROPERTY(strokeColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(strokeWidth, double)
RCT_EXPORT_VIEW_PROPERTY(fillColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(zIndex, int)

@end

#endif
