//
//  RNMGoogleMapPolylineManager.m
//
//  Created by Nick Italiano on 10/22/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import "RNMGoogleMapPolylineManager.h"

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTConvert+CoreLocation.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTViewManager.h>
#import <React/UIView+React.h>
#import "RCTConvert+RNMMap.h"
#import "RNMGoogleMapPolyline.h"

@interface RNMGoogleMapPolylineManager()

@end

@implementation RNMGoogleMapPolylineManager

RCT_EXPORT_MODULE(RNMGoogleMapPolyline)

- (UIView *)view
{
  RNMGoogleMapPolyline *polyline = [RNMGoogleMapPolyline new];
  polyline.bridge = self.bridge;
  return polyline;
}

RCT_EXPORT_VIEW_PROPERTY(coordinates, RNMMapCoordinateArray)
RCT_EXPORT_VIEW_PROPERTY(fillColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(strokeColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(strokeColors, UIColorArray)
RCT_EXPORT_VIEW_PROPERTY(strokeWidth, double)
RCT_EXPORT_VIEW_PROPERTY(lineDashPattern, NSArray)
RCT_EXPORT_VIEW_PROPERTY(geodesic, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zIndex, int)
RCT_EXPORT_VIEW_PROPERTY(tappable, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

@end

#endif
