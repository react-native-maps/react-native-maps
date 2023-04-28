/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <React/RCTViewManager.h>
#import "RNMMap.h"

#define MERCATOR_RADIUS 85445659.44705395
#define MERCATOR_OFFSET 268435456

@interface RNMMapManager : RCTViewManager


- (void)setCenterCoordinate:(CLLocationCoordinate2D)centerCoordinate
    zoomLevel:(double)zoomLevel
    animated:(BOOL)animated
    mapView:(RNMMap *)mapView;

- (MKCoordinateRegion)coordinateRegionWithMapView:(RNMMap *)mapView
                                 centerCoordinate:(CLLocationCoordinate2D)centerCoordinate
                                                     andZoomLevel:(double)zoomLevel;
- (double) zoomLevel:(RNMMap *)mapView;

@end
