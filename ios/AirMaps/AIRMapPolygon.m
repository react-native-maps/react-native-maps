//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import "AIRMapPolygon.h"
#import <React/UIView+React.h>


@implementation AIRMapPolygon {

}

- (void)setFillColor:(UIColor *)fillColor {
    _fillColor = fillColor;
    [self updateStyle];
}

- (void)setStrokeColor:(UIColor *)strokeColor {
    _strokeColor = strokeColor;
    [self updateStyle];
}

- (void)setStrokeWidth:(CGFloat)strokeWidth {
    _strokeWidth = strokeWidth;
    [self updateStyle];
}

- (void)setLineJoin:(CGLineJoin)lineJoin {
    _lineJoin = lineJoin;
    [self updateStyle];
}

- (void)setLineCap:(CGLineCap)lineCap {
    _lineCap = lineCap;
    [self updateStyle];
}

- (void)setMiterLimit:(CGFloat)miterLimit {
    _miterLimit = miterLimit;
    [self updateStyle];
}

- (void)setLineDashPhase:(CGFloat)lineDashPhase {
    _lineDashPhase = lineDashPhase;
    [self updateStyle];
}

- (void)setLineDashPattern:(NSArray <NSNumber *> *)lineDashPattern {
    _lineDashPattern = lineDashPattern;
    [self updateStyle];
}

- (void)setCoordinates:(NSArray<AIRMapCoordinate *> *)coordinates {
    _coordinates = coordinates;
    CLLocationCoordinate2D coords[coordinates.count];
    for(int i = 0; i < coordinates.count; i++)
    {
        coords[i] = coordinates[i].coordinate;
    }
    self.polygon = [MKPolygon polygonWithCoordinates:coords count:coordinates.count interiorPolygons:_interiorPolygons];
    // TODO: we could lazy-initialize the polygon, since we don't need it until the
    // polygon is in view.
    self.renderer = [[MKPolygonRenderer alloc] initWithPolygon:self.polygon];
    [self update];
}

- (void)setHoles:(NSArray<NSArray<AIRMapCoordinate *> *> *)holes {
    _holes = holes;
    if (holes.count)
    {
        NSMutableArray<MKPolygon *> *polygons = [NSMutableArray array];
        for(int h = 0; h < holes.count; h++)
        {
            CLLocationCoordinate2D coords[holes[h].count];
            for(int i = 0; i < holes[h].count; i++)
            {
                coords[i] = holes[h][i].coordinate;
            }
            [polygons addObject:[MKPolygon polygonWithCoordinates:coords count:holes[h].count]];
        }
        _interiorPolygons = polygons;
    }
}

// Style-only changes (colors, width, dash) update the existing renderer and
// ask it to redraw. Removing and re-adding the overlay re-renders its tiles,
// so animating a fill or stroke color flickered on every step. Geometry
// changes (`setCoordinates:`) still go through `update`, because they replace
// the renderer itself.
- (void) updateStyle
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
    [_renderer setNeedsDisplay];
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

    if (_map == nil) return;
    [_map removeOverlay:self];
    [_map addOverlay:self];
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
