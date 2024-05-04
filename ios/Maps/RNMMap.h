/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <MapKit/MapKit.h>
#import <UIKit/UIKit.h>

#import <React/RCTComponent.h>
#import "SMCalloutView.h"
#import "RCTConvert+RNMMap.h"
#import "RNMMapCalloutSubview.h"

@class RNMMapMarker;

extern const NSTimeInterval RNMMapRegionChangeObserveInterval;
extern const CGFloat RNMMapZoomBoundBuffer;
extern const NSInteger RNMMapMaxZoomLevel;

@interface RNMMap: MKMapView<SMCalloutViewDelegate>

@property (nonatomic, assign) BOOL cacheEnabled;
@property (nonatomic, assign) BOOL followUserLocation;
@property (nonatomic, assign) BOOL hasStartedRendering;
@property (nonatomic, assign) BOOL ignoreRegionChanges;
@property (nonatomic, assign) BOOL mapLoaded;
@property (nonatomic, assign) BOOL userLocationCalloutEnabled;
@property (nonatomic, assign) BOOL mapChangedFromUserInteraction;
@property (nonatomic, assign) CGFloat maxDelta;
@property (nonatomic, assign) CGFloat maxZoomLevel;
@property (nonatomic, assign) CGFloat minDelta;
@property (nonatomic, assign) CGFloat minZoomLevel;
@property (nonatomic, assign) CGPoint compassOffset;
@property (nonatomic, assign) CLLocationCoordinate2D pendingCenter;
@property (nonatomic, assign) MKCoordinateRegion initialRegion;
@property (nonatomic, assign) MKCoordinateSpan pendingSpan;
@property (nonatomic, assign) MKMapCamera *initialCamera;
@property (nonatomic, assign) UIEdgeInsets legalLabelInsets;
@property (nonatomic, assign) UIEdgeInsets mapPadding;
@property (nonatomic, copy) NSString *userLocationAnnotationTitle;
@property (nonatomic, strong) SMCalloutView *calloutView;
@property (nonatomic, strong) UIImageView *cacheImageView;

@property (nonatomic, copy) RCTBubblingEventBlock onChange;
@property (nonatomic, copy) RCTBubblingEventBlock onDoublePress;
@property (nonatomic, copy) RCTBubblingEventBlock onLongPress;
@property (nonatomic, copy) RCTBubblingEventBlock onMapReady;
@property (nonatomic, copy) RCTBubblingEventBlock onPanDrag;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@property (nonatomic, copy) RCTBubblingEventBlock onTilesRendered;
@property (nonatomic, copy) RCTBubblingEventBlock onUserLocationChange;
@property (nonatomic, copy) RCTDirectEventBlock onCalloutPress;
@property (nonatomic, copy) RCTDirectEventBlock onMarkerDeselect;
@property (nonatomic, copy) RCTDirectEventBlock onMarkerDrag;
@property (nonatomic, copy) RCTDirectEventBlock onMarkerDragEnd;
@property (nonatomic, copy) RCTDirectEventBlock onMarkerDragStart;
@property (nonatomic, copy) RCTDirectEventBlock onMarkerPress;
@property (nonatomic, copy) RCTDirectEventBlock onMarkerSelect;
@property (nonatomic, copy) RCTDirectEventBlock onRegionChange;

- (void)cacheViewIfNeeded;
- (void)finishLoading;
- (NSArray *)getMapBoundaries;

- (RNMMapMarker*) markerAtPoint:(CGPoint)point;
- (NSDictionary*) getMarkersFramesWithOnlyVisible:(BOOL)onlyVisible;

@end
