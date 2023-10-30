//
//  RNMMapWMSTile.h
//  RNMaps
//
//  Created by nizam on 10/28/18.
//  Copyright © 2018. All rights reserved.
//


#import <Foundation/Foundation.h>
#import <MapKit/MapKit.h>
#import <UIKit/UIKit.h>

#import <React/RCTComponent.h>
#import <React/RCTView.h>
#import "RNMMapCoordinate.h"
#import "RNMMap.h"
#import "RCTConvert+RNMMap.h"
#import "RNMMapUrlTile.h"
#import "RNMMapUrlTileCachedOverlay.h"

@interface RNMMapWMSTile : RNMMapUrlTile <MKOverlay>
@end

@interface RNMMapWMSTileOverlay : MKTileOverlay
@end

@interface RNMMapWMSTileCachedOverlay : RNMMapUrlTileCachedOverlay
@end

@interface RNMMapWMSTileHelper : NSObject

+ (NSURL *)URLForTilePath:(MKTileOverlayPath)path withURLTemplate:(NSString *)URLTemplate withTileSize:(NSInteger)tileSize;

@end
