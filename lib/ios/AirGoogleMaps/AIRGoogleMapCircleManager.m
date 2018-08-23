//
//  AIRGoogleMapCircleManager.m
//
//  Created by Nick Italiano on 10/24/16.
//

#import "AIRGoogleMapCircleManager.h"
#import "AIRGoogleMapCircle.h"
#if __has_include(<React/RCTBridge.h>)
    #import <React/RCTBridge.h>
#else
    #import "RCTBridge.h"
#endif
#if __has_include(<React/UIView+React.h>)
    #import <React/UIView+React.h>
#else
    #import "UIView+React.h"
#endif

@interface AIRGoogleMapCircleManager()

@end

@implementation AIRGoogleMapCircleManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  AIRGoogleMapCircle *circle = [AIRGoogleMapCircle new];
  return circle;
}

RCT_EXPORT_VIEW_PROPERTY(radius, double)
RCT_REMAP_VIEW_PROPERTY(center, centerCoordinate, CLLocationCoordinate2D)
RCT_EXPORT_VIEW_PROPERTY(strokeColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(strokeWidth, double)
RCT_EXPORT_VIEW_PROPERTY(fillColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(zIndex, int)

@end
