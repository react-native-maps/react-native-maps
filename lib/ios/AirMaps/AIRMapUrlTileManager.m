//
//  AIRMapUrlTileManager.m
//  AirMaps
//
//  Created by cascadian on 3/19/16.
//  Copyright © 2016. All rights reserved.
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
#import "AIRMapUrlTile.h"

#import "AIRMapUrlTileManager.h"

@interface AIRMapUrlTileManager()

@end

@implementation AIRMapUrlTileManager


RCT_EXPORT_MODULE()

- (UIView *)view
{
    AIRMapUrlTile *tile = [AIRMapUrlTile new];
    return tile;
}

RCT_EXPORT_VIEW_PROPERTY(urlTemplate, NSString)
RCT_EXPORT_VIEW_PROPERTY(maximumZ, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(minimumZ, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(shouldReplaceMapContent, BOOL)

@end
