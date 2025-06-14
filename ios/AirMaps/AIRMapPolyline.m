//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import "AIRMapPolyline.h"
#import "AIRMapPolylineRenderer.h"
#import <React/UIView+React.h>

@implementation AIRMapPolyline {
    NSArray<AIRMapCoordinate *> *_pendingCoordinates;
}

- (void)setFillColor:(UIColor *)fillColor {
    _fillColor = fillColor;
    [self update];
}

- (void)setStrokeColor:(UIColor *)strokeColor {
    _strokeColor = strokeColor;
    [self update];
}

- (void)setStrokeColors:(NSArray<UIColor *> *)strokeColors {
    _strokeColors = strokeColors;
    if ((self.renderer != nil) && ![_renderer isKindOfClass:[AIRMapPolylineRenderer class]]) {
        self.renderer = [self createRenderer];
    }
    [self update];
}

- (void)setStrokeWidth:(CGFloat)strokeWidth {
    _strokeWidth = strokeWidth;
    [self update];
}

- (void)setLineJoin:(CGLineJoin)lineJoin {
    _lineJoin = lineJoin;
    [self update];
}

- (void)setLineCap:(CGLineCap)lineCap {
    _lineCap = lineCap;
    [self update];
}

- (void)setMiterLimit:(CGFloat)miterLimit {
    _miterLimit = miterLimit;
    [self update];
}

- (void)setLineDashPhase:(CGFloat)lineDashPhase {
    _lineDashPhase = lineDashPhase;
    [self update];
}

- (void)setLineDashPattern:(NSArray <NSNumber *> *)lineDashPattern {
    _lineDashPattern = lineDashPattern;
    [self update];
}

-(void)setGeodesic:(BOOL)geodesic
{
  _geodesic = geodesic;
    if(_coordinates){
        [self setCoordinates:_coordinates];
    }
}

// PERFORMANCE OPTIMIZATION: Use base class batch update for coordinates
- (void)setCoordinates:(NSArray<AIRMapCoordinate *> *)coordinates {
    _pendingCoordinates = coordinates;
    [self scheduleBatchedUpdate];
}

- (void)performBatchedUpdate {
    if (!_pendingCoordinates) return;
    
    // Apply the batched coordinate update
    _coordinates = _pendingCoordinates;
    _pendingCoordinates = nil;
    
    CLLocationCoordinate2D *coords = calloc(_coordinates.count, sizeof(CLLocationCoordinate2D));
    for(int i = 0; i < _coordinates.count; i++)
    {
        coords[i] = _coordinates[i].coordinate;
    }
    if(_geodesic){
        self.polyline = [MKGeodesicPolyline polylineWithCoordinates:coords count:_coordinates.count];
    } else {
        self.polyline = [MKPolyline polylineWithCoordinates:coords count:_coordinates.count];
    }
    free(coords);
    
    // Always recreate renderer when coordinates change to ensure it gets the new polyline
    self.renderer = [self createRenderer];
    
    [self update];
}

- (MKOverlayPathRenderer*)createRenderer {
    if (self.polyline == nil) return nil;
    if (self.strokeColors == nil) {
        return [[MKPolylineRenderer alloc] initWithPolyline:self.polyline];
    }
    else {
        return [[AIRMapPolylineRenderer alloc] initWithOverlay:self polyline:self.polyline];
    }
}

- (void) update
{
    if (!_renderer) return;
    [self updateRenderer:_renderer];
    
    [self refreshOverlayOnMap];
}

- (void) updateRenderer:(MKOverlayPathRenderer*)renderer {
    renderer.fillColor = _fillColor;
    renderer.strokeColor = _strokeColor;
    renderer.lineWidth = _strokeWidth;
    renderer.lineCap = _lineCap;
    renderer.lineJoin = _lineJoin;
    renderer.miterLimit = _miterLimit;
    renderer.lineDashPhase = _lineDashPhase;
    renderer.lineDashPattern = _lineDashPattern;
    
    if ([renderer isKindOfClass:[AIRMapPolylineRenderer class]]) {
        ((AIRMapPolylineRenderer*)renderer).strokeColors = _strokeColors;
    }
}

#pragma mark MKOverlay implementation

- (CLLocationCoordinate2D) coordinate
{
    return self.polyline.coordinate;
}

- (MKMapRect) boundingMapRect
{
    return self.polyline.boundingMapRect;
}

- (BOOL)intersectsMapRect:(MKMapRect)mapRect
{
    BOOL answer = [self.polyline intersectsMapRect:mapRect];
    return answer;
}

- (BOOL)canReplaceMapContent
{
    return NO;
}

#pragma mark AIRMapSnapshot implementation

- (void) drawToSnapshot:(MKMapSnapshot *) snapshot context:(CGContextRef) context
{
    AIRMapPolylineRenderer* renderer = [[AIRMapPolylineRenderer alloc] initWithSnapshot:snapshot overlay:self polyline:self.polyline];
    [self updateRenderer:renderer];
    [renderer drawWithZoomScale:2 inContext:context];
}

@end
