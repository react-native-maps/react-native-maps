//
//  AIRMapGSUrlTileManager
//  AirMaps
//
//  Created by nizam on 10/28/18.
//  Copyright © 2018. All rights reserved.
//


#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTConvert+CoreLocation.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTViewManager.h>
#import <React/UIView+React.h>
#import "AIRMapMarker.h"
#import "AIRMapGSUrlTile.h"

#import "AIRMapGSUrlTileManager.h"

@interface AIRMapGSUrlTileManager()

@end

@implementation AIRMapGSUrlTileManager


RCT_EXPORT_MODULE()

- (UIView *)view
{
    AIRMapGSUrlTile *tile = [AIRMapGSUrlTile new];
    return tile;
}

RCT_EXPORT_VIEW_PROPERTY(urlTemplate, NSString)
RCT_EXPORT_VIEW_PROPERTY(maximumZ, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(minimumZ, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(tileSize, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(shouldReplaceMapContent, BOOL)

@end
