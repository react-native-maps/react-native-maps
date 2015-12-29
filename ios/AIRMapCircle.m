//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import "AIRMapCircle.h"
#import "UIView+React.h"


@implementation AIRMapCircle {
    BOOL _radiusSet;
    BOOL _centerSet;
}

- (void)setFillColor:(UIColor *)fillColor {
    _fillColor = fillColor;
    [self applyPropsToRenderer];
}

- (void)setStrokeColor:(UIColor *)strokeColor {
    _strokeColor = strokeColor;
    [self applyPropsToRenderer];
}

- (void)setStrokeWidth:(CGFloat)strokeWidth {
    _strokeWidth = strokeWidth;
    [self applyPropsToRenderer];
}

- (void)setLineJoin:(CGLineJoin)lineJoin {
    _lineJoin = lineJoin;
    [self applyPropsToRenderer];
}

- (void)setLineCap:(CGLineCap)lineCap {
    _lineCap = lineCap;
    [self applyPropsToRenderer];
}

- (void)setMiterLimit:(CGFloat)miterLimit {
    _miterLimit = miterLimit;
    [self applyPropsToRenderer];
}

- (void)setRadius:(CLLocationDistance)radius {
    _radius = radius;
    _radiusSet = YES;
    [self createCircleAndRendererIfPossible];
    [self applyPropsToRenderer];
}

- (void)setCenterCoordinate:(CLLocationCoordinate2D)centerCoordinate{
    _centerCoordinate = centerCoordinate;
    _centerSet = YES;
    [self createCircleAndRendererIfPossible];
    [self applyPropsToRenderer];
}

- (void) createCircleAndRendererIfPossible
{
    if (!_centerSet || !_radiusSet) return;
    self.circle = [MKCircle circleWithCenterCoordinate:_centerCoordinate radius:_radius];
    self.renderer = [[MKCircleRenderer alloc] initWithCircle:self.circle];
}

- (void) applyPropsToRenderer
{
    if (!_renderer) {
        return;
    };
    _renderer.fillColor = _fillColor;
    _renderer.strokeColor = _strokeColor;
    _renderer.lineWidth = _strokeWidth;
    _renderer.lineCap = _lineCap;
    _renderer.lineJoin = _lineJoin;
    _renderer.miterLimit = _miterLimit;
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