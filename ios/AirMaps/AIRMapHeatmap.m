//
//  AIRMapHeatmap.m
//  AirMaps
//
//  Created by Jean-Richard Lai on 5/10/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "AIRMapHeatmap.h"

@implementation AIRMapHeatmap


- (void) setPoints:(NSArray<AIRMapWeightedPoint *> *)points {
    _points = points;

    self.heatmap = [DTMHeatmap new];
    [self refreshHeatmapData];
    self.renderer = [[DTMHeatmapRenderer alloc] initWithOverlay:self.heatmap];
    [self update];
}

- (void) refreshHeatmapData {
    NSMutableDictionary *data = [NSMutableDictionary new];
    for(int i = 0; i < _points.count; i++)
    {
        MKMapPoint point = MKMapPointForCoordinate(_points[i].coordinate);
        NSValue *pointValue = [NSValue value:&point
                                withObjCType:@encode(MKMapPoint)];
        data[pointValue] = @(_points[i].weight);
    }

    [self.heatmap setData:data];
}

- (void) update
{
    if (!_renderer) return;
//    _renderer.fillColor = _fillColor;
//    _renderer.strokeColor = _strokeColor;
//    _renderer.lineWidth = _strokeWidth;
//    _renderer.lineCap = _lineCap;
//    _renderer.lineJoin = _lineJoin;
//    _renderer.miterLimit = _miterLimit;
//    _renderer.lineDashPhase = _lineDashPhase;
//    _renderer.lineDashPattern = _lineDashPattern;

    if (_map == nil) return;
    [_map removeOverlay:self];
    [_map addOverlay:self];
}

//#pragma mark MKOverlay implementation
//
//- (CLLocationCoordinate2D) coordinate
//{
//    return self.polygon.coordinate;
//}
//
//- (MKMapRect) boundingMapRect
//{
//    return self.polygon.boundingMapRect;
//}
//
//- (BOOL)intersectsMapRect:(MKMapRect)mapRect
//{
//    BOOL answer = [self.polygon intersectsMapRect:mapRect];
//    return answer;
//}
//
//- (BOOL)canReplaceMapContent
//{
//    return NO;
//}

@end
