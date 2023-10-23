//
//  RNMUrlTileOverlay.h
//  RNMaps
//
//  Created by cascadian on 3/19/16.
//  Copyright © 2016. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <MapKit/MapKit.h>
#import <UIKit/UIKit.h>

#import <React/RCTComponent.h>
#import <React/RCTView.h>
#import "RNMMapCoordinate.h"
#import "RNMMap.h"
#import "RCTConvert+RNMMap.h"
#import "RNMMapUrlTileCachedOverlay.h"

@interface RNMMapUrlTile : MKAnnotationView <MKOverlay> {
    BOOL _urlTemplateSet;
    BOOL _tileSizeSet;
    BOOL _flipYSet;
    BOOL _tileCachePathSet;
    BOOL _tileCacheMaxAgeSet;
    BOOL _maximumNativeZSet;
    BOOL _cachedOverlayCreated;
    BOOL _opacitySet;
}

@property (nonatomic, weak) RNMMap *map;

@property (nonatomic, strong) RNMMapUrlTileCachedOverlay *tileOverlay;
@property (nonatomic, strong) MKTileOverlayRenderer *renderer;
@property (nonatomic, copy) NSString *urlTemplate;
@property NSInteger maximumZ;
@property NSInteger maximumNativeZ;
@property NSInteger minimumZ;
@property BOOL flipY;
@property BOOL shouldReplaceMapContent;
@property BOOL showLabels;
@property NSInteger tileSize;
@property (nonatomic, copy) NSString *tileCachePath;
@property NSInteger tileCacheMaxAge;
@property BOOL offlineMode;
@property CGFloat opacity;

- (void)updateProperties;
- (void)update;

#pragma mark MKOverlay protocol

@property(nonatomic, readonly) CLLocationCoordinate2D coordinate;
@property(nonatomic, readonly) MKMapRect boundingMapRect;
//- (BOOL)intersectsMapRect:(MKMapRect)mapRect;
- (BOOL)canReplaceMapContent;

@end
