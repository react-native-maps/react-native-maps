//
//  AIRGoogleMapOverlayManager.m
//
//  Created by Srikanth Kyatham on 26/09/17.
//

#import "AIRGoogleMapOverlayManager.h"

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTConvert+CoreLocation.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTViewManager.h>
#import <React/UIView+React.h>
#import <React/RCTResizeMode.h>
#import "RCTConvert+AirMap.h"
#import "AIRGoogleMapOverlay.h"

@interface AIRGoogleMapOverlayManager()

@end

@implementation AIRGoogleMapOverlayManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    AIRGoogleMapOverlay *overlay = [AIRGoogleMapOverlay new];
    overlay.bridge = self.bridge;
    overlay.resizeMode = RCTResizeModeCenter;
    return overlay;
}

RCT_REMAP_VIEW_PROPERTY(bounds, coordinates, AIRMapCoordinateArray)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_REMAP_VIEW_PROPERTY(image, imageSrc, NSString)
RCT_EXPORT_VIEW_PROPERTY(bearing, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(resizeMode, RCTResizeMode)
RCT_EXPORT_VIEW_PROPERTY(zoomLevel, CGFloat)

@end
