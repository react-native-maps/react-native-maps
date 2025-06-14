//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import "AIRMapPolygon.h"
#import <React/UIView+React.h>

@implementation AIRMapPolygon {
    NSArray<AIRMapCoordinate *> *_pendingCoordinates;
    NSArray<NSArray<AIRMapCoordinate *> *> *_pendingHoles;
}

- (void)setFillColor:(UIColor *)fillColor {
    _fillColor = fillColor;
    [self update];
}

- (void)setStrokeColor:(UIColor *)strokeColor {
    _strokeColor = strokeColor;
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

// PERFORMANCE OPTIMIZATION: Use base class batch update for coordinates
- (void)setCoordinates:(NSArray<AIRMapCoordinate *> *)coordinates {
    _pendingCoordinates = coordinates;
    [self scheduleBatchedUpdate];
}

- (void)setHoles:(NSArray<NSArray<AIRMapCoordinate *> *> *)holes {
    _pendingHoles = holes;
    [self scheduleBatchedUpdate];
}

- (void)performBatchedUpdate {
    BOOL coordinatesChanged = (_pendingCoordinates != nil);
    BOOL holesChanged = (_pendingHoles != nil);
    
    if (coordinatesChanged) {
        _coordinates = _pendingCoordinates;
        _pendingCoordinates = nil;
    }
    
    if (holesChanged) {
        _holes = _pendingHoles;
        _pendingHoles = nil;
        
        if (_holes.count) {
            NSMutableArray<MKPolygon *> *polygons = [NSMutableArray array];
            for(int h = 0; h < _holes.count; h++) {
                CLLocationCoordinate2D coords[_holes[h].count];
                for(int i = 0; i < _holes[h].count; i++) {
                    coords[i] = _holes[h][i].coordinate;
                }
                [polygons addObject:[MKPolygon polygonWithCoordinates:coords count:_holes[h].count]];
            }
            _interiorPolygons = polygons;
        }
    }
    
    if (coordinatesChanged && _coordinates) {
        CLLocationCoordinate2D coords[_coordinates.count];
        for(int i = 0; i < _coordinates.count; i++) {
            coords[i] = _coordinates[i].coordinate;
        }
        self.polygon = [MKPolygon polygonWithCoordinates:coords count:_coordinates.count interiorPolygons:_interiorPolygons];
        self.renderer = [[MKPolygonRenderer alloc] initWithPolygon:self.polygon];
    }
    
    if (coordinatesChanged || holesChanged) {
        [self update];
    }
}

- (void) update
{
    if (!_renderer) return;
    _renderer.fillColor = _fillColor;
    _renderer.strokeColor = _strokeColor;
    _renderer.lineWidth = _strokeWidth;
    _renderer.lineCap = _lineCap;
    _renderer.lineJoin = _lineJoin;
    _renderer.miterLimit = _miterLimit;
    _renderer.lineDashPhase = _lineDashPhase;
    _renderer.lineDashPattern = _lineDashPattern;

    [self refreshOverlayOnMap];
}

#pragma mark MKOverlay implementation

- (CLLocationCoordinate2D) coordinate
{
    return self.polygon.coordinate;
}

- (MKMapRect) boundingMapRect
{
    return self.polygon.boundingMapRect;
}

- (BOOL)intersectsMapRect:(MKMapRect)mapRect
{
    BOOL answer = [self.polygon intersectsMapRect:mapRect];
    return answer;
}

- (BOOL)canReplaceMapContent
{
    return NO;
}

@end
