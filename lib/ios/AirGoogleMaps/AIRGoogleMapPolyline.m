//
//  AIRGoogleMapPolyline.m
//
//  Created by Nick Italiano on 10/22/16.
//
#import <UIKit/UIKit.h>
#import "AIRGoogleMapPolyline.h"
#import "AIRGMSPolyline.h"
#import "AIRMapCoordinate.h"
#import "AIRGoogleMapMarker.h"
#import "AIRGoogleMapMarkerManager.h"
#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTUtils.h>

@implementation AIRGoogleMapPolyline

- (instancetype)init
{
  if (self = [super init]) {
    _polyline = [[AIRGMSPolyline alloc] init];
  }
  return self;
}

-(void)setCoordinates:(NSArray<AIRMapCoordinate *> *)coordinates
{
  _coordinates = coordinates;

  GMSMutablePath *path = [GMSMutablePath path];
  for(int i = 0; i < coordinates.count; i++)
  {
    [path addCoordinate:coordinates[i].coordinate];
  }
  if (_scale) {
    [self updateLineDash:_scale];
  }
   _polyline.path = path;
}

-(void)setStrokeColor:(UIColor *)strokeColor
{
  _strokeColor = strokeColor;
  _polyline.strokeColor = strokeColor;
}

-(void)setStrokeWidth:(double)strokeWidth
{
  _strokeWidth = strokeWidth;
  _polyline.strokeWidth = strokeWidth;
}
-(void)setLineDashPattern:(NSArray <NSNumber *> *)lineDashPattern {
  _lineDashPattern = lineDashPattern;
}
-(void)updateLineDashPattern:(double)scale {
  
  // scale = 1.0 / mapView.projection.pointsForMeters(1, atCoordinate: mapView.camera.target)
//  NSArray *lengths = @[@25, @20];
  NSMutableArray *scalePatterns = [[NSMutableArray alloc] init];
  for(int i=0; i< _lineDashPattern.count; i++){
    [scalePatterns addObject:@(_lineDashPattern[i].intValue * scale)];
  }
  _scale = scale;
  NSArray *styles = @[[GMSStrokeStyle solidColor: _strokeColor],
                      [GMSStrokeStyle solidColor:[UIColor clearColor]]];
  _polyline.spans = GMSStyleSpans(_polyline.path, styles, scalePatterns, kGMSLengthRhumb);
}

-(void)updateLineDash:(double)scale {

  NSMutableArray *scalePatterns = [[NSMutableArray alloc] init];
  for(int i=0; i< _lineDashPattern.count; i++){
    [scalePatterns addObject:@(_lineDashPattern[i].intValue * scale)];
  }
  NSArray *styles = @[[GMSStrokeStyle solidColor: _strokeColor],
                      [GMSStrokeStyle solidColor:[UIColor clearColor]]];
    if (_polyline) {
        @try {
            _polyline.spans = GMSStyleSpans(_polyline.path, styles, scalePatterns, kGMSLengthRhumb);
        } @catch (NSException *exception) {
            
        }
    }
}

-(void)setFillColor:(UIColor *)fillColor
{
  _fillColor = fillColor;
  _polyline.spans = @[[GMSStyleSpan spanWithColor:fillColor]];
}

-(void)setGeodesic:(BOOL)geodesic
{
  _geodesic = geodesic;
  _polyline.geodesic = geodesic;
}

-(void)setTitle:(NSString *)title
{
  _title = title;
  _polyline.title = _title;
}

-(void) setZIndex:(int)zIndex
{
  _zIndex = zIndex;
  _polyline.zIndex = zIndex;
}

-(void)setTappable:(BOOL)tappable
{
  _tappable = tappable;
  _polyline.tappable = tappable;
}

- (void)setOnPress:(RCTBubblingEventBlock)onPress {
  _polyline.onPress = onPress;
}

@end
