//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import "AIRMapCircle.h"
#import "AIRMap.h"
#import <React/UIView+React.h>

@implementation AIRMapCircle {
    // CAShapeLayer for high-performance rendering
    CAShapeLayer *_shapeLayer;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        // Initialize default values
        _strokeWidth = 1.0;
        _strokeColor = [UIColor blackColor];
        _fillColor = [UIColor clearColor];
        _lineCap = kCGLineCapRound;
        _lineJoin = kCGLineJoinRound;
        _centerCoordinate = kCLLocationCoordinate2DInvalid;
        _radius = 0;
    }
    return self;
}

- (void)setupRenderer {
    if (!_shapeLayer) {
        _shapeLayer = [CAShapeLayer layer];
        _shapeLayer.lineWidth = _strokeWidth;
        _shapeLayer.strokeColor = _strokeColor.CGColor;
        _shapeLayer.fillColor = _fillColor.CGColor;
        _shapeLayer.lineCap = kCALineCapRound;
        _shapeLayer.lineJoin = kCALineJoinRound;
    }
    
    // Always try to add to map view layer if we have a map
    AIRMap *mapView = (AIRMap *)self.map;
    if (mapView && _shapeLayer.superlayer != mapView.layer) {
        [mapView.layer addSublayer:_shapeLayer];
    }
    
    // Update path immediately if we have valid center and radius
    [self updatePath];
}

- (void)teardownRenderer {
    if (_shapeLayer) {
        [_shapeLayer removeFromSuperlayer];
        _shapeLayer = nil;
    }
}

- (void)updatePath {
    if (!CLLocationCoordinate2DIsValid(_centerCoordinate) || _radius <= 0) return;
    
    AIRMap *mapView = (AIRMap *)self.map;
    if (!mapView || !_shapeLayer) return;
    
    // Ensure the layer is properly positioned relative to the map view
    _shapeLayer.frame = mapView.bounds;
    
    // Convert center coordinate to screen point
    CGPoint centerPoint = [mapView convertCoordinate:_centerCoordinate toPointToView:mapView];
    
    // Calculate radius in screen coordinates
    // Create a coordinate that's _radius meters away from center
    CLLocationCoordinate2D edgeCoordinate = [self coordinateAtDistance:_radius fromCoordinate:_centerCoordinate];
    CGPoint edgePoint = [mapView convertCoordinate:edgeCoordinate toPointToView:mapView];
    
    // Calculate screen radius
    CGFloat screenRadius = sqrt(pow(edgePoint.x - centerPoint.x, 2) + pow(edgePoint.y - centerPoint.y, 2));
    
    // Create circular path
    CGRect circleRect = CGRectMake(centerPoint.x - screenRadius, 
                                   centerPoint.y - screenRadius, 
                                   screenRadius * 2, 
                                   screenRadius * 2);
    
    CGMutablePathRef path = CGPathCreateMutable();
    CGPathAddEllipseInRect(path, NULL, circleRect);
    
    // Update layer path
    _shapeLayer.path = path;
    CGPathRelease(path);
    
    // Update visual properties
    [self updateVisualProperties];
}

- (CLLocationCoordinate2D)coordinateAtDistance:(CLLocationDistance)distance fromCoordinate:(CLLocationCoordinate2D)coordinate {
    // Simple approximation: move east by the specified distance
    // This is used to calculate screen radius, so precision isn't critical
    double earthRadius = 6371000; // meters
    double deltaLongitude = distance / (earthRadius * cos(coordinate.latitude * M_PI / 180));
    
    return CLLocationCoordinate2DMake(coordinate.latitude, coordinate.longitude + deltaLongitude * 180 / M_PI);
}

- (void)updateVisualProperties {
    if (!_shapeLayer) return;
    
    _shapeLayer.strokeColor = (_strokeColor ?: [UIColor blackColor]).CGColor;
    _shapeLayer.fillColor = (_fillColor ?: [UIColor clearColor]).CGColor;
    _shapeLayer.lineWidth = _strokeWidth > 0 ? _strokeWidth : 1.0;
    _shapeLayer.lineCap = (_lineCap == kCGLineCapRound) ? kCALineCapRound : 
                          (_lineCap == kCGLineCapSquare) ? kCALineCapSquare : kCALineCapButt;
    _shapeLayer.lineJoin = (_lineJoin == kCGLineJoinRound) ? kCALineJoinRound :
                           (_lineJoin == kCGLineJoinBevel) ? kCALineJoinBevel : kCALineJoinMiter;
    
    // Handle dash pattern
    if (_lineDashPattern && _lineDashPattern.count > 0) {
        NSMutableArray *dashPattern = [NSMutableArray array];
        for (NSNumber *dash in _lineDashPattern) {
            [dashPattern addObject:dash];
        }
        _shapeLayer.lineDashPattern = dashPattern;
        _shapeLayer.lineDashPhase = _lineDashPhase;
    } else {
        _shapeLayer.lineDashPattern = nil;
    }
}

// Handle map region changes for smooth movement during pan/zoom
- (void)mapViewRegionDidChange {
    [self updatePath];
}

// Override setMap to setup the shape layer when added to map
- (void)setMap:(AIRMap *)map {
    if (self.map && _shapeLayer) {
        [self teardownRenderer];
    }
    
    [super setMap:map];
    
    if (map) {
        [self setupRenderer];
    }
}

- (void)setFillColor:(UIColor *)fillColor {
    _fillColor = fillColor;
    [self updateVisualProperties];
}

- (void)setStrokeColor:(UIColor *)strokeColor {
    _strokeColor = strokeColor;
    [self updateVisualProperties];
}

- (void)setStrokeWidth:(CGFloat)strokeWidth {
    _strokeWidth = strokeWidth;
    [self updateVisualProperties];
}

- (void)setLineJoin:(CGLineJoin)lineJoin {
    _lineJoin = lineJoin;
    [self updateVisualProperties];
}

- (void)setLineCap:(CGLineCap)lineCap {
    _lineCap = lineCap;
    [self updateVisualProperties];
}

- (void)setMiterLimit:(CGFloat)miterLimit {
    _miterLimit = miterLimit;
    if (_shapeLayer) {
        _shapeLayer.miterLimit = miterLimit;
    }
}

- (void)setLineDashPhase:(CGFloat)lineDashPhase {
    _lineDashPhase = lineDashPhase;
    [self updateVisualProperties];
}

- (void)setLineDashPattern:(NSArray <NSNumber *> *)lineDashPattern {
    _lineDashPattern = lineDashPattern;
    [self updateVisualProperties];
}

// Simple radius setting - always use CAShapeLayer
- (void)setRadius:(CLLocationDistance)radius {
    _radius = radius;
    [self updatePath];
}

// Simple center coordinate setting - always use CAShapeLayer
- (void)setCenterCoordinate:(CLLocationCoordinate2D)centerCoordinate{
    _centerCoordinate = centerCoordinate;
    [self updatePath];
}

#pragma mark MKOverlay implementation

- (CLLocationCoordinate2D) coordinate
{
    return _centerCoordinate;
}

- (MKMapRect) boundingMapRect
{
    if (!CLLocationCoordinate2DIsValid(_centerCoordinate) || _radius <= 0) {
        return MKMapRectNull;
    }
    
    MKMapPoint centerPoint = MKMapPointForCoordinate(_centerCoordinate);
    
    // Convert radius from meters to map points
    // Approximate conversion (not perfectly accurate but sufficient for bounding rect)
    double metersPerMapPoint = MKMetersBetweenMapPoints(centerPoint, MKMapPointMake(centerPoint.x + 1, centerPoint.y));
    double radiusInMapPoints = _radius / metersPerMapPoint;
    
    return MKMapRectMake(centerPoint.x - radiusInMapPoints, 
                         centerPoint.y - radiusInMapPoints, 
                         radiusInMapPoints * 2, 
                         radiusInMapPoints * 2);
}

- (BOOL)intersectsMapRect:(MKMapRect)mapRect
{
    return MKMapRectIntersectsRect(self.boundingMapRect, mapRect);
}

- (BOOL)canReplaceMapContent
{
    return NO;
}

#pragma mark AIRMapSnapshot implementation

- (void) drawToSnapshot:(MKMapSnapshot *) snapshot context:(CGContextRef) context
{
    // For snapshots, we need to draw the circle manually since CAShapeLayer won't be captured
    if (!CLLocationCoordinate2DIsValid(_centerCoordinate) || _radius <= 0) return;
    
    CGContextSetFillColorWithColor(context, (_fillColor ?: [UIColor clearColor]).CGColor);
    CGContextSetStrokeColorWithColor(context, (_strokeColor ?: [UIColor blackColor]).CGColor);
    CGContextSetLineWidth(context, _strokeWidth > 0 ? _strokeWidth : 1.0);
    CGContextSetLineCap(context, _lineCap);
    CGContextSetLineJoin(context, _lineJoin);
    
    if (_lineDashPattern && _lineDashPattern.count > 0) {
        CGFloat *dashLengths = malloc(sizeof(CGFloat) * _lineDashPattern.count);
        for (NSUInteger i = 0; i < _lineDashPattern.count; i++) {
            dashLengths[i] = [_lineDashPattern[i] floatValue];
        }
        CGContextSetLineDash(context, _lineDashPhase, dashLengths, _lineDashPattern.count);
        free(dashLengths);
    }
    
    // Convert center coordinate to screen point
    CGPoint centerPoint = [snapshot pointForCoordinate:_centerCoordinate];
    
    // Calculate radius in screen coordinates
    CLLocationCoordinate2D edgeCoordinate = [self coordinateAtDistance:_radius fromCoordinate:_centerCoordinate];
    CGPoint edgePoint = [snapshot pointForCoordinate:edgeCoordinate];
    CGFloat screenRadius = sqrt(pow(edgePoint.x - centerPoint.x, 2) + pow(edgePoint.y - centerPoint.y, 2));
    
    // Create circular path
    CGRect circleRect = CGRectMake(centerPoint.x - screenRadius, 
                                   centerPoint.y - screenRadius, 
                                   screenRadius * 2, 
                                   screenRadius * 2);
    
    CGContextBeginPath(context);
    CGContextAddEllipseInRect(context, circleRect);
    
    // Fill and stroke
    if (_fillColor && ![_fillColor isEqual:[UIColor clearColor]]) {
        CGContextFillPath(context);
        
        // Redraw path for stroke if needed
        if (_strokeColor && _strokeWidth > 0) {
            CGContextBeginPath(context);
            CGContextAddEllipseInRect(context, circleRect);
            CGContextStrokePath(context);
        }
    } else if (_strokeColor && _strokeWidth > 0) {
        CGContextStrokePath(context);
    }
}

- (void)dealloc {
    [self teardownRenderer];
}

@end
