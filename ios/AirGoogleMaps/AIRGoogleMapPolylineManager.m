//
//  AIRGoogleMapPolylineManager.m
//
//  Created by Nick Italiano on 10/22/16.
//

#import "AIRGoogleMapPolylineManager.h"

#import "RCTBridge.h"
#import "RCTConvert.h"
#import "RCTConvert+CoreLocation.h"
#import "RCTConvert+MoreMapKit.h"
#import "RCTEventDispatcher.h"
#import "UIView+React.h"
#import "RCTViewManager.h"
#import "AIRGoogleMapPolyline.h"

@interface AIRGoogleMapPolylineManager()

@end

@implementation AIRGoogleMapPolylineManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  AIRGoogleMapPolyline *polyline = [AIRGoogleMapPolyline new];
  return polyline;
}

RCT_EXPORT_VIEW_PROPERTY(coordinates, AIRMapCoordinateArray)
RCT_EXPORT_VIEW_PROPERTY(fillColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(strokeColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(strokeWidth, double)
RCT_EXPORT_VIEW_PROPERTY(geodesic, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zIndex, int)

@end
