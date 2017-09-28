//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import "AIRMapOverlay.h"
#import "AIRMapImageOverlay.h"
#import "AirMapOverlayRenderer.h"
#import <React/UIView+React.h>
#import <React/RCTBridge.h>


@implementation AIRMapOverlay

@synthesize boundingMapRect;
@synthesize coordinate;


- (void)setCoordinates:(NSArray<AIRMapCoordinate *> *)coordinates {
    _coordinates = coordinates;
    [self initialize];
}

- (void)setImageSrc:(NSString *)imageSrc {
  if (imageSrc != nil) {
    _imageSrc = imageSrc;
    [self initialize];
  }
  }

- (void)setBearing:(CGFloat)bearing {
  if (_bearing != bearing) {
    _bearing = bearing;
    [self update];
  }
}

- (void)setResizeMode:(RCTResizeMode)resizeMode {
  if (_resizeMode != resizeMode) {
    _resizeMode = resizeMode;
    [self update];
  }
}

- (void)initialize {
  if (_coordinates != nil && [_coordinates count] == 2 &&
      _imageSrc != nil) {

    CLLocationCoordinate2D nw = CLLocationCoordinate2DMake(_coordinates[0].coordinate.latitude,
                                                           _coordinates[1].coordinate.longitude);
    MKMapPoint northWest = MKMapPointForCoordinate(nw);
    MKMapPoint northEast = MKMapPointForCoordinate(_coordinates[0].coordinate);
    MKMapPoint southWest = MKMapPointForCoordinate(_coordinates[1].coordinate);
    double width = fabs(northEast.x - southWest.x);
    double height = fabs(northEast.y - southWest.y);
    boundingMapRect = MKMapRectMake(northWest.x,
                                    northWest.y,
                                    width,
                                    height);

    CLLocationDegrees midLat = (_coordinates[0].coordinate.latitude + _coordinates[1].coordinate.latitude)/2;
    CLLocationDegrees midLong = (_coordinates[0].coordinate.longitude + _coordinates[1].coordinate.longitude)/2;
    coordinate = CLLocationCoordinate2DMake(midLat,
                                            midLong);

    _renderer = [[AIRMapOverlayRenderer alloc] initWithOverlay:self
                                                  withImageURL:_imageSrc
                                                    withBridge:_bridge];
    [self update];
  }
}

- (void) update
{
    if (!_renderer) return;
    _renderer.bearing = _bearing;
    _renderer.resizeMode = _resizeMode;

    if (_map == nil) return;
    [_map removeOverlay:self];
    [_map addOverlay:self];
}

#pragma mark MKOverlay implementation

- (CLLocationCoordinate2D) coordinate
{
  return coordinate;
}

- (MKMapRect) boundingMapRect
{
  return boundingMapRect;
}

- (BOOL)intersectsMapRect:(MKMapRect)mapRect
{
  return MKMapRectIntersectsRect(mapRect, boundingMapRect);
}

- (BOOL)canReplaceMapContent
{
  return YES;
}

@end
