//
//  AIRMapLocalTileManager.m
//  AirMaps
//
//  Created by Peter Zavadsky on 01/12/2017.
//  Copyright © 2017 Christopher. All rights reserved.
//

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
#import "AIRMapLocalTile.h"

#import "AIRMapLocalTileManager.h"

@interface AIRMapLocalTileManager()

@end

@implementation AIRMapLocalTileManager


RCT_EXPORT_MODULE()

- (UIView *)view
{
    AIRMapLocalTile *tile = [AIRMapLocalTile new];
    return tile;
}

RCT_EXPORT_VIEW_PROPERTY(pathTemplate, NSString)
RCT_EXPORT_VIEW_PROPERTY(tileSize, CGFloat)

@end
