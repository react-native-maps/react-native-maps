/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AIRMapOverlayManager.h"

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTConvert+CoreLocation.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTViewManager.h>
#import <React/UIView+React.h>
#import <React/RCTResizeMode.h>
#import "RCTConvert+AirMap.h"
#import "AIRMapOverlay.h"

@interface AIRMapOverlayManager()

@end

@implementation AIRMapOverlayManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    AIRMapOverlay *overlay = [AIRMapOverlay new];
    overlay.bridge = self.bridge;
    overlay.resizeMode = RCTResizeModeCenter;
    return overlay;
}

RCT_REMAP_VIEW_PROPERTY(bounds, coordinates, AIRMapCoordinateArray)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_REMAP_VIEW_PROPERTY(image, imageSrc, NSString)
RCT_EXPORT_VIEW_PROPERTY(bearing, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(resizeMode, RCTResizeMode)


@end
