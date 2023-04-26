//
//  RNMMapLocalTileManager.m
//  RNMaps
//
//  Created by Peter Zavadsky on 01/12/2017.
//  Copyright © 2017 Christopher. All rights reserved.
//

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTConvert+CoreLocation.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTViewManager.h>
#import <React/UIView+React.h>
#import "RNMMapMarker.h"
#import "RNMMapLocalTile.h"

#import "RNMMapLocalTileManager.h"

@interface RNMMapLocalTileManager()

@end

@implementation RNMMapLocalTileManager


RCT_EXPORT_MODULE()

- (UIView *)view
{
    RNMMapLocalTile *tile = [RNMMapLocalTile new];
    return tile;
}

RCT_EXPORT_VIEW_PROPERTY(pathTemplate, NSString)
RCT_EXPORT_VIEW_PROPERTY(tileSize, CGFloat)

@end
