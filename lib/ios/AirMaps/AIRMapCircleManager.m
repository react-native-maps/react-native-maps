/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AIRMapCircleManager.h"

#if __has_include(<React/RCTBridge.h>)
    #import <React/RCTBridge.h>
#else
    #import "RCTBridge.h"
#endif
#if __has_include(<React/RCTConvert.h>)
    #import <React/RCTConvert.h>
#else
    #import "RCTConvert.h"
#endif
#if __has_include(<React/RCTConvert+CoreLocation.h>)
    #import <React/RCTConvert+CoreLocation.h>
#else
    #import "RCTConvert+CoreLocation.h"
#endif
#if __has_include(<React/RCTEventDispatcher.h>)
    #import <React/RCTEventDispatcher.h>
#else
    #import "RCTEventDispatcher.h"
#endif
#if __has_include(<React/RCTViewManager.h>)
    #import <React/RCTViewManager.h>
#else
    #import "RCTViewManager.h"
#endif
#if __has_include(<React/UIView+React.h>)
    #import <React/UIView+React.h>
#else
    #import "UIView+React.h"
#endif
#import "AIRMapMarker.h"
#import "AIRMapCircle.h"

@interface AIRMapCircleManager()

@end

@implementation AIRMapCircleManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    AIRMapCircle *circle = [AIRMapCircle new];
    return circle;
}

RCT_REMAP_VIEW_PROPERTY(center, centerCoordinate, CLLocationCoordinate2D)
RCT_EXPORT_VIEW_PROPERTY(radius, CLLocationDistance)
RCT_EXPORT_VIEW_PROPERTY(fillColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(strokeColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(strokeWidth, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(lineCap, CGLineCap)
RCT_EXPORT_VIEW_PROPERTY(lineJoin, CGLineJoin)
RCT_EXPORT_VIEW_PROPERTY(miterLimit, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(lineDashPhase, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(lineDashPattern, NSArray)

// NOTE(lmr):
// for now, onPress events for overlays will be left unimplemented. Seems it is possible with some work, but
// it is difficult to achieve in both ios and android so I decided to leave it out.
//RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

@end
