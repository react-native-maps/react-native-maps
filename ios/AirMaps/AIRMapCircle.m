//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import "AIRMapCircle.h"
#import <React/UIView+React.h>

@implementation AIRMapCircle {
    BOOL _radiusSet;
    BOOL _centerSet;
    
    // PERFORMANCE OPTIMIZATION: Batch updates
    CLLocationCoordinate2D _pendingCenterCoordinate;
    CLLocationDistance _pendingRadius;
    BOOL _hasPendingCenter;
    BOOL _hasPendingRadius;
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

// PERFORMANCE OPTIMIZATION: Use base class batch update for radius
- (void)setRadius:(CLLocationDistance)radius {
    _pendingRadius = radius;
    _hasPendingRadius = YES;
    [self scheduleBatchedUpdate];
}

// PERFORMANCE OPTIMIZATION: Use base class batch update for center coordinate
- (void)setCenterCoordinate:(CLLocationCoordinate2D)centerCoordinate{
    _pendingCenterCoordinate = centerCoordinate;
    _hasPendingCenter = YES;
    [self scheduleBatchedUpdate];
}

- (void)performBatchedUpdate {
    BOOL needsUpdate = NO;
    
    if (_hasPendingRadius) {
        _radius = _pendingRadius;
        _radiusSet = YES;
        _hasPendingRadius = NO;
        needsUpdate = YES;
    }
    
    if (_hasPendingCenter) {
        _centerCoordinate = _pendingCenterCoordinate;
        _centerSet = YES;
        _hasPendingCenter = NO;
        needsUpdate = YES;
    }
    
    if (needsUpdate) {
        [self createCircleAndRendererIfPossible];
        [self update];
    }
}

- (void) createCircleAndRendererIfPossible
{
    if (!_centerSet || !_radiusSet) return;
    self.circle = [MKCircle circleWithCenterCoordinate:_centerCoordinate radius:_radius];
    self.renderer = [[MKCircleRenderer alloc] initWithCircle:self.circle];
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
    return self.circle.coordinate;
}

- (MKMapRect) boundingMapRect
{
    return self.circle.boundingMapRect;
}

- (BOOL)intersectsMapRect:(MKMapRect)mapRect
{
    BOOL answer = [self.circle intersectsMapRect:mapRect];
    return answer;
}

- (BOOL)canReplaceMapContent
{
    return NO;
}

@end
