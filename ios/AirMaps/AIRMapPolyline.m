//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import "AIRMapPolyline.h"
#import "AIRMapPolylineRenderer.h"
#import "AIRMap.h"
#import <React/UIView+React.h>

@implementation AIRMapPolyline {
    // CAShapeLayer for high-performance rendering
    CAShapeLayer *_mainLayer;
    // Array of CALayer instances for gradient support (can be CAShapeLayer or CAGradientLayer)
    NSMutableArray<CALayer *> *_segmentLayers;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        // Don't setup rendering here - wait until setMap is called
        // Initialize default values
        _strokeWidth = 1.0;
        _strokeColor = [UIColor blackColor];
        _lineCap = kCGLineCapRound;
        _lineJoin = kCGLineJoinRound;
        _segmentLayers = [NSMutableArray array];
    }
    return self;
}

- (void)setupRenderer {
    if (!_mainLayer) {
        _mainLayer = [CAShapeLayer layer];
        _mainLayer.fillColor = [UIColor clearColor].CGColor;
        _mainLayer.lineWidth = _strokeWidth;
        _mainLayer.strokeColor = _strokeColor.CGColor;
        _mainLayer.lineCap = kCALineCapRound;
        _mainLayer.lineJoin = kCALineJoinRound;
    }
    
    // Always try to add to map view layer if we have a map
    AIRMap *mapView = (AIRMap *)self.map;
    if (mapView && _mainLayer.superlayer != mapView.layer) {
        [mapView.layer addSublayer:_mainLayer];
    }
    
    // Update path immediately if we have coordinates
    [self updatePath];
}

- (void)teardownRenderer {
    if (_mainLayer) {
        [_mainLayer removeFromSuperlayer];
        _mainLayer = nil;
    }
    
    // Clean up segment layers (can be CAShapeLayer or CAGradientLayer)
    for (CALayer *layer in _segmentLayers) {
        [layer removeFromSuperlayer];
    }
    [_segmentLayers removeAllObjects];
}

// Update rendering path
- (void)updatePath {
    if (!_coordinates || _coordinates.count < 2) return;
    
    AIRMap *mapView = (AIRMap *)self.map;
    if (!mapView) return;
    
    // Check if we have gradient colors
    if (_strokeColors && _strokeColors.count > 1) {
        [self updateGradientPath:mapView];
    } else {
        [self updateSingleColorPath:mapView];
    }
}

- (void)updateSingleColorPath:(AIRMap *)mapView {
    // Clean up any existing segment layers
    for (CALayer *layer in _segmentLayers) {
        [layer removeFromSuperlayer];
    }
    [_segmentLayers removeAllObjects];
    
    // Use single main layer
    if (!_mainLayer) return;
    
    // Ensure the layer is properly positioned relative to the map view
    _mainLayer.frame = mapView.bounds;
    
    // Create path in screen coordinates
    CGMutablePathRef path = CGPathCreateMutable();
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
    
    // Update layer path
    _mainLayer.path = path;
    CGPathRelease(path);
    
    // Update visual properties
    [self updateVisualProperties];
}

- (void)updateGradientPath:(AIRMap *)mapView {
    // Hide the main layer for gradient rendering
    if (_mainLayer) {
        _mainLayer.path = NULL;
    }
    
    // Clean up existing segment layers
    for (CALayer *layer in _segmentLayers) {
        [layer removeFromSuperlayer];
    }
    [_segmentLayers removeAllObjects];
    
    // Create segments based on color changes
    NSArray *segments = [self createColorSegments:mapView];
    
    // Create layers for each segment (solid or gradient)
    for (NSDictionary *segment in segments) {
        BOOL isGradient = [segment[@"isGradient"] boolValue];
        
        if (isGradient) {
            // Create gradient layer for color transitions
            CAGradientLayer *gradientLayer = [self createGradientLayer:segment];
            [mapView.layer addSublayer:gradientLayer];
            [_segmentLayers addObject:gradientLayer];
        } else {
            // Create shape layer for solid color segments
            CAShapeLayer *segmentLayer = [self createSegmentLayer:segment];
            [mapView.layer addSublayer:segmentLayer];
            [_segmentLayers addObject:segmentLayer];
        }
    }
}

- (CAShapeLayer *)createSegmentLayer:(NSDictionary *)segment {
    CAShapeLayer *segmentLayer = [CAShapeLayer layer];
    segmentLayer.fillColor = [UIColor clearColor].CGColor;
    segmentLayer.lineWidth = _strokeWidth > 0 ? _strokeWidth : 1.0;
    segmentLayer.lineCap = (_lineCap == kCGLineCapRound) ? kCALineCapRound : 
                          (_lineCap == kCGLineCapSquare) ? kCALineCapSquare : kCALineCapButt;
    segmentLayer.lineJoin = (_lineJoin == kCGLineJoinRound) ? kCALineJoinRound :
                           (_lineJoin == kCGLineJoinBevel) ? kCALineJoinBevel : kCALineJoinMiter;
    
    // Ensure proper frame positioning
    AIRMap *mapView = (AIRMap *)self.map;
    if (mapView) {
        segmentLayer.frame = mapView.bounds;
    }
    
    // Set segment color
    UIColor *segmentColor = segment[@"color"];
    segmentLayer.strokeColor = segmentColor.CGColor;
    
    // Set segment path
    segmentLayer.path = (__bridge CGPathRef)segment[@"path"];
    
    // Handle dash pattern
    if (_lineDashPattern && _lineDashPattern.count > 0) {
        NSMutableArray *dashPattern = [NSMutableArray array];
        for (NSNumber *dash in _lineDashPattern) {
            [dashPattern addObject:dash];
        }
        segmentLayer.lineDashPattern = dashPattern;
        segmentLayer.lineDashPhase = _lineDashPhase;
    }
    
    return segmentLayer;
}

- (CAGradientLayer *)createGradientLayer:(NSDictionary *)segment {
    CAGradientLayer *gradientLayer = [CAGradientLayer layer];
    
    // Set gradient colors
    UIColor *startColor = segment[@"startColor"];
    UIColor *endColor = segment[@"endColor"];
    gradientLayer.colors = @[(__bridge id)startColor.CGColor, (__bridge id)endColor.CGColor];
    
    // Set gradient direction based on line segment
    CGPoint startPoint = [segment[@"startPoint"] CGPointValue];
    CGPoint endPoint = [segment[@"endPoint"] CGPointValue];
    
    // Calculate gradient frame and direction
    CGFloat minX = MIN(startPoint.x, endPoint.x);
    CGFloat minY = MIN(startPoint.y, endPoint.y);
    CGFloat maxX = MAX(startPoint.x, endPoint.x);
    CGFloat maxY = MAX(startPoint.y, endPoint.y);
    
    // Expand frame to account for line width
    CGFloat lineWidth = _strokeWidth > 0 ? _strokeWidth : 1.0;
    CGFloat padding = lineWidth / 2.0;
    
    gradientLayer.frame = CGRectMake(minX - padding, minY - padding, 
                                   (maxX - minX) + (2 * padding), 
                                   (maxY - minY) + (2 * padding));
    
    // Calculate normalized gradient direction
    CGFloat deltaX = endPoint.x - startPoint.x;
    CGFloat deltaY = endPoint.y - startPoint.y;
    CGFloat length = sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (length > 0) {
        gradientLayer.startPoint = CGPointMake(0.5 - (deltaX / length) * 0.5, 0.5 - (deltaY / length) * 0.5);
        gradientLayer.endPoint = CGPointMake(0.5 + (deltaX / length) * 0.5, 0.5 + (deltaY / length) * 0.5);
    } else {
        gradientLayer.startPoint = CGPointMake(0, 0.5);
        gradientLayer.endPoint = CGPointMake(1, 0.5);
    }
    
    // Create mask layer to clip gradient to line shape
    CAShapeLayer *maskLayer = [CAShapeLayer layer];
    maskLayer.fillColor = [UIColor clearColor].CGColor;
    maskLayer.strokeColor = [UIColor blackColor].CGColor;
    maskLayer.lineWidth = lineWidth;
    maskLayer.lineCap = (_lineCap == kCGLineCapRound) ? kCALineCapRound : 
                       (_lineCap == kCGLineCapSquare) ? kCALineCapSquare : kCALineCapButt;
    maskLayer.lineJoin = (_lineJoin == kCGLineJoinRound) ? kCALineJoinRound :
                        (_lineJoin == kCGLineJoinBevel) ? kCALineJoinBevel : kCALineJoinMiter;
    
    // Adjust path coordinates relative to gradient layer frame
    CGMutablePathRef adjustedPath = CGPathCreateMutable();
    CGPathRef originalPath = (__bridge CGPathRef)segment[@"path"];
    
    CGAffineTransform transform = CGAffineTransformMakeTranslation(-minX + padding, -minY + padding);
    CGPathRef transformedPath = CGPathCreateCopyByTransformingPath(originalPath, &transform);
    CGPathAddPath(adjustedPath, NULL, transformedPath);
    
    maskLayer.path = adjustedPath;
    maskLayer.frame = gradientLayer.bounds;
    gradientLayer.mask = maskLayer;
    
    CGPathRelease(adjustedPath);
    CGPathRelease(transformedPath);
    
    return gradientLayer;
}

- (NSArray *)createColorSegments:(AIRMap *)mapView {
    NSMutableArray *segments = [NSMutableArray array];
    
    if (_coordinates.count < 2) return segments;
    
    NSUInteger i = 0;
    while (i < _coordinates.count - 1) {
        // Find the start of a valid segment (non-transparent color)
        UIColor *startColor = [self colorForIndex:i];
        if (!startColor) {
            i++;
            continue;
        }
        
        // Find the end of this segment by looking for the next non-transparent color
        NSUInteger endIndex = i + 1;
        UIColor *endColor = nil;
        
        while (endIndex < _coordinates.count) {
            endColor = [self colorForIndex:endIndex];
            if (endColor) {
                break;
            }
            endIndex++;
        }
        
        // If we couldn't find a valid end color, skip this segment
        if (!endColor || endIndex >= _coordinates.count) {
            i++;
            continue;
        }
        
        // Create path from start to end (may span multiple coordinates)
        CGMutablePathRef segmentPath = CGPathCreateMutable();
        BOOL firstPoint = YES;
        
        for (NSUInteger pathIndex = i; pathIndex <= endIndex; pathIndex++) {
            AIRMapCoordinate *coord = _coordinates[pathIndex];
            CGPoint point = [mapView convertCoordinate:coord.coordinate toPointToView:mapView];
            
            if (firstPoint) {
                CGPathMoveToPoint(segmentPath, NULL, point.x, point.y);
                firstPoint = NO;
            } else {
                CGPathAddLineToPoint(segmentPath, NULL, point.x, point.y);
            }
        }
        
        // Determine if this is a gradient segment
        BOOL isGradient = ![startColor isEqual:endColor];
        
        // Get start and end points for gradient calculation
        AIRMapCoordinate *startCoord = _coordinates[i];
        AIRMapCoordinate *endCoord = _coordinates[endIndex];
        CGPoint startPoint = [mapView convertCoordinate:startCoord.coordinate toPointToView:mapView];
        CGPoint endPoint = [mapView convertCoordinate:endCoord.coordinate toPointToView:mapView];
        
        NSDictionary *segment;
        if (isGradient) {
            segment = @{
                @"path": (__bridge id)segmentPath,
                @"isGradient": @YES,
                @"startColor": startColor,
                @"endColor": endColor,
                @"startPoint": [NSValue valueWithCGPoint:startPoint],
                @"endPoint": [NSValue valueWithCGPoint:endPoint]
            };
        } else {
            segment = @{
                @"path": (__bridge id)segmentPath,
                @"isGradient": @NO,
                @"color": startColor
            };
        }
        
        [segments addObject:segment];
        CGPathRelease(segmentPath);
        
        // Move to the next segment starting from the end of this one
        i = endIndex;
    }
    
    return segments;
}

- (UIColor *)colorForIndex:(NSUInteger)index {
    if (!_strokeColors || _strokeColors.count == 0) {
        return _strokeColor ?: [UIColor blackColor];
    }
    
    index = MIN(index, _strokeColors.count - 1);
    UIColor *color = _strokeColors[index];
    
    // Check if color is transparent (used for gaps in gradients)
    CGFloat alpha;
    [color getRed:NULL green:NULL blue:NULL alpha:&alpha];
    
    return (alpha == 0) ? nil : color;
}

- (void)updateVisualProperties {
    if (!_mainLayer) return;
    
    _mainLayer.strokeColor = (_strokeColor ?: [UIColor blackColor]).CGColor;
    _mainLayer.lineWidth = _strokeWidth > 0 ? _strokeWidth : 1.0;
    _mainLayer.lineCap = (_lineCap == kCGLineCapRound) ? kCALineCapRound : 
                          (_lineCap == kCGLineCapSquare) ? kCALineCapSquare : kCALineCapButt;
    _mainLayer.lineJoin = (_lineJoin == kCGLineJoinRound) ? kCALineJoinRound :
                           (_lineJoin == kCGLineJoinBevel) ? kCALineJoinBevel : kCALineJoinMiter;
    
    // Handle dash pattern
    if (_lineDashPattern && _lineDashPattern.count > 0) {
        NSMutableArray *dashPattern = [NSMutableArray array];
        for (NSNumber *dash in _lineDashPattern) {
            [dashPattern addObject:dash];
        }
        _mainLayer.lineDashPattern = dashPattern;
        _mainLayer.lineDashPhase = _lineDashPhase;
    } else {
        _mainLayer.lineDashPattern = nil;
    }
}

// Handle map region changes for smooth movement during pan/zoom
- (void)mapViewRegionDidChange {
    [self updatePath];
}

// Override setMap to setup the shape layer when added to map
- (void)setMap:(AIRMap *)map {
    if (self.map && _mainLayer) {
        [self teardownRenderer];
    }
    
    [super setMap:map];
    
    if (map) {
        [self setupRenderer];
    }
}

- (void)setFillColor:(UIColor *)fillColor {
    _fillColor = fillColor;
    // Note: CAShapeLayer doesn't support fill for polylines, only stroke
}

- (void)setStrokeColor:(UIColor *)strokeColor {
    _strokeColor = strokeColor ?: [UIColor blackColor];
    [self updateVisualProperties];
}

- (void)setStrokeColors:(NSArray<UIColor *> *)strokeColors {
    _strokeColors = strokeColors;
    // Trigger path update to handle gradient rendering
    [self updatePath];
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
    if (_mainLayer) {
        _mainLayer.miterLimit = miterLimit;
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

-(void)setGeodesic:(BOOL)geodesic
{
    _geodesic = geodesic;
    // Note: CAShapeLayer doesn't support geodesic lines like MKPolyline
    // Lines will be drawn as straight lines in screen coordinates
    if(_coordinates){
        [self setCoordinates:_coordinates];
    }
}

// Simple coordinate setting - always use CAShapeLayer
- (void)setCoordinates:(NSArray<AIRMapCoordinate *> *)coordinates {
    _coordinates = coordinates;
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
    // For snapshots, we need to draw the polyline manually since CAShapeLayer won't be captured
    if (!_coordinates || _coordinates.count < 2) return;
    
    // Handle gradient colors
    if (_strokeColors && _strokeColors.count > 1) {
        [self drawGradientToSnapshot:snapshot context:context];
    } else {
        [self drawSingleColorToSnapshot:snapshot context:context];
    }
}

- (void)drawSingleColorToSnapshot:(MKMapSnapshot *)snapshot context:(CGContextRef)context {
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
    CGContextStrokePath(context);
}

- (void)drawGradientToSnapshot:(MKMapSnapshot *)snapshot context:(CGContextRef)context {
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
    
    // Draw segments with different colors
    UIColor *currentColor = nil;
    CGPoint lastPoint = CGPointZero;
    BOOL hasStartPoint = NO;
    
    for (NSUInteger i = 0; i < _coordinates.count; i++) {
        AIRMapCoordinate *coord = _coordinates[i];
        CGPoint point = [snapshot pointForCoordinate:coord.coordinate];
        UIColor *pointColor = [self colorForIndex:i];
        
        // Skip transparent colors
        if (!pointColor) {
            continue;
        }
        
        // Start new segment if color changed
        if (!currentColor || ![currentColor isEqual:pointColor]) {
            // Finish previous segment
            if (hasStartPoint && currentColor) {
                CGContextStrokePath(context);
            }
            
            // Start new segment
            currentColor = pointColor;
            CGContextSetStrokeColorWithColor(context, currentColor.CGColor);
            CGContextBeginPath(context);
            CGContextMoveToPoint(context, point.x, point.y);
            hasStartPoint = YES;
        } else {
            // Continue current segment
            CGContextAddLineToPoint(context, point.x, point.y);
        }
        
        lastPoint = point;
    }
    
    // Finish last segment
    if (hasStartPoint && currentColor) {
        CGContextStrokePath(context);
    }
}

- (void)dealloc {
    [self teardownRenderer];
}

@end

