//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import "AIRMapPolygon.h"
#import "AIRMap.h"
#import <React/UIView+React.h>

@implementation AIRMapPolygon {
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
    
    // Update path immediately if we have coordinates
    [self updatePath];
}

- (void)teardownRenderer {
    if (_shapeLayer) {
        [_shapeLayer removeFromSuperlayer];
        _shapeLayer = nil;
    }
}

- (void)updatePath {
    if (!_coordinates || _coordinates.count < 3) return; // Polygon needs at least 3 points
    
    AIRMap *mapView = (AIRMap *)self.map;
    if (!mapView || !_shapeLayer) return;
    
    // Ensure the layer is properly positioned relative to the map view
    _shapeLayer.frame = mapView.bounds;
    
    // Create path in screen coordinates
    CGMutablePathRef path = CGPathCreateMutable();
    
    // Add main polygon path
    BOOL first = YES;
    for (AIRMapCoordinate *coord in _coordinates) {
        CGPoint screenPoint = [mapView convertCoordinate:coord.coordinate toPointToView:mapView];
        
        if (first) {
            CGPathMoveToPoint(path, NULL, screenPoint.x, screenPoint.y);
            first = NO;
        } else {
            CGPathAddLineToPoint(path, NULL, screenPoint.x, screenPoint.y);
        }
    }
    CGPathCloseSubpath(path); // Close the polygon
    
    // Add holes if they exist
    if (_holes && _holes.count > 0) {
        for (NSArray<AIRMapCoordinate *> *hole in _holes) {
            if (hole.count < 3) continue; // Hole needs at least 3 points
            
            BOOL firstHole = YES;
            for (AIRMapCoordinate *coord in hole) {
                CGPoint screenPoint = [mapView convertCoordinate:coord.coordinate toPointToView:mapView];
                
                if (firstHole) {
                    CGPathMoveToPoint(path, NULL, screenPoint.x, screenPoint.y);
                    firstHole = NO;
                } else {
                    CGPathAddLineToPoint(path, NULL, screenPoint.x, screenPoint.y);
                }
            }
            CGPathCloseSubpath(path); // Close the hole
        }
        
        // Use even-odd fill rule for holes
        _shapeLayer.fillRule = kCAFillRuleEvenOdd;
    } else {
        _shapeLayer.fillRule = kCAFillRuleNonZero;
    }
    
    // Update layer path
    _shapeLayer.path = path;
    CGPathRelease(path);
    
    // Update visual properties
    [self updateVisualProperties];
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

// Simple coordinate setting - always use CAShapeLayer
- (void)setCoordinates:(NSArray<AIRMapCoordinate *> *)coordinates {
    _coordinates = coordinates;
    [self updatePath];
}

- (void)setHoles:(NSArray<NSArray<AIRMapCoordinate *> *> *)holes {
    _holes = holes;
    [self updatePath];
}

#pragma mark MKOverlay implementation

- (CLLocationCoordinate2D) coordinate
{
    if (_coordinates.count > 0) {
        return _coordinates[0].coordinate;
    }
    return kCLLocationCoordinate2DInvalid;
}

- (MKMapRect) boundingMapRect
{
    if (_coordinates.count == 0) {
        return MKMapRectNull;
    }
    
    MKMapPoint *points = malloc(sizeof(MKMapPoint) * _coordinates.count);
    for (NSUInteger i = 0; i < _coordinates.count; i++) {
        points[i] = MKMapPointForCoordinate(_coordinates[i].coordinate);
    }
    
    MKMapRect rect = MKMapRectNull;
    for (NSUInteger i = 0; i < _coordinates.count; i++) {
        MKMapRect pointRect = MKMapRectMake(points[i].x, points[i].y, 0, 0);
        rect = MKMapRectUnion(rect, pointRect);
    }
    
    free(points);
    return rect;
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
    // For snapshots, we need to draw the polygon manually since CAShapeLayer won't be captured
    if (!_coordinates || _coordinates.count < 3) return;
    
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
    
    CGContextBeginPath(context);
    
    // Draw main polygon
    BOOL first = YES;
    for (AIRMapCoordinate *coord in _coordinates) {
        CGPoint point = [snapshot pointForCoordinate:coord.coordinate];
        if (first) {
            CGContextMoveToPoint(context, point.x, point.y);
            first = NO;
        } else {
            CGContextAddLineToPoint(context, point.x, point.y);
        }
    }
    CGContextClosePath(context);
    
    // Draw holes
    if (_holes && _holes.count > 0) {
        for (NSArray<AIRMapCoordinate *> *hole in _holes) {
            if (hole.count < 3) continue;
            
            BOOL firstHole = YES;
            for (AIRMapCoordinate *coord in hole) {
                CGPoint point = [snapshot pointForCoordinate:coord.coordinate];
                if (firstHole) {
                    CGContextMoveToPoint(context, point.x, point.y);
                    firstHole = NO;
                } else {
                    CGContextAddLineToPoint(context, point.x, point.y);
                }
            }
            CGContextClosePath(context);
        }
    }
    
    // Fill and stroke
    if (_fillColor && ![_fillColor isEqual:[UIColor clearColor]]) {
        if (_holes && _holes.count > 0) {
            CGContextEOFillPath(context); // Even-odd fill for holes
        } else {
            CGContextFillPath(context);
        }
        
        // Redraw path for stroke if needed
        if (_strokeColor && _strokeWidth > 0) {
            CGContextBeginPath(context);
            first = YES;
            for (AIRMapCoordinate *coord in _coordinates) {
                CGPoint point = [snapshot pointForCoordinate:coord.coordinate];
                if (first) {
                    CGContextMoveToPoint(context, point.x, point.y);
                    first = NO;
                } else {
                    CGContextAddLineToPoint(context, point.x, point.y);
                }
            }
            CGContextClosePath(context);
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
