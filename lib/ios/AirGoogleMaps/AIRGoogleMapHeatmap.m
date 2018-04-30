//
//  AIRGoogleMapsCircle.m
//
//  Created by Nick Italiano on 10/24/16.
//
#import <UIKit/UIKit.h>
#import "AIRGoogleMapHeatmap.h"
#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTConvert.h>
#import <React/RCTConvert+CoreLocation.h>

@implementation AIRGoogleMapHeatmap

- (instancetype)init
{
  if (self = [super init]) {
    _heatmap = [[GMUHeatmapTileLayer alloc] init];
  }
  return self;
}

- (void)setPoints:(NSArray<NSDictionary *> *)points
{
    NSMutableArray<GMUWeightedLatLng *> *w = [NSMutableArray arrayWithCapacity:points.count];
    for (int i = 0; i < points.count; i++) {
        CLLocationCoordinate2D coord = [RCTConvert CLLocationCoordinate2D:points[i]];
        [w addObject:[[GMUWeightedLatLng alloc] initWithCoordinate:coord intensity:1.0]];
    }
    [self.heatmap setWeightedData:w];
    [self.heatmap clearTileCache];
}

- (void)setRadius:(NSUInteger)radius
{
    [self.heatmap setRadius:radius];
}

- (void)setOpacity:(float)opacity
{
    [self.heatmap setOpacity:opacity];
}

@end
