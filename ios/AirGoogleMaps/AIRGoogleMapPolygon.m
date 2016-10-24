//
//  AIRGoogleMapPolygon.m
//
//  Created by Nick Italiano on 10/22/16.
//

#import "AIRGoogleMapPolygon.h"
#import <GoogleMaps/GoogleMaps.h>

@implementation AIRGoogleMapPolygon

- (instancetype)init
{
  if (self = [super init]) {
    _polygon = [[GMSPolygon alloc] init];
  }

  return self;
}

- (void)setCoordinates:(NSArray<AIRMapCoordinate *> *)coordinates
{
  _coordinates = coordinates;

  GMSMutablePath *path = [GMSMutablePath path];
  for(int i = 0; i < coordinates.count; i++)
  {
    [path addCoordinate:coordinates[i].coordinate];
  }

  _polygon.path = path;
}

-(void)setFillColor:(UIColor *)fillColor
{
  _fillColor = fillColor;
  _polygon.fillColor = fillColor;
}

-(void)setStrokeWidth:(double)strokeWidth
{
  _strokeWidth = strokeWidth;
  _polygon.strokeWidth = strokeWidth;
}

-(void)setStrokeColor:(UIColor *) strokeColor
{
  _strokeColor = strokeColor;
  _polygon.strokeColor = strokeColor;
}

-(void)setGeodesic:(BOOL)geodesic
{
  _geodesic = geodesic;
  _polygon.geodesic = geodesic;
}

-(void)setZIndex:(int)zIndex
{
  _zIndex = zIndex;
  _polygon.zIndex = zIndex;
}

@end
