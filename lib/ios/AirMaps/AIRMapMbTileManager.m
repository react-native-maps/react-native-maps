//
//  AIRMapMbTileManager.m
//  AirMaps
//
//  Created by Christoph Lambio on 27/03/2018.
//  Based on AIRMapLocalTileManager.m
//  Copyright (c) 2017 Christopher. All rights reserved.
//

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTConvert+CoreLocation.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTViewManager.h>
#import <React/UIView+React.h>
#import "AIRMapMarker.h"
#import "AIRMapMbTile.h"

#import "AIRMapMbTileManager.h"

@interface AIRMapMbTileManager()

@end

@implementation AIRMapMbTileManager


RCT_EXPORT_MODULE()

- (UIView *)view
{
    AIRMapMbTile *tile = [AIRMapMbTile new];
    return tile;
}

RCT_EXPORT_VIEW_PROPERTY(pathTemplate, NSString)
RCT_EXPORT_VIEW_PROPERTY(tileSize, CGFloat)

@end

