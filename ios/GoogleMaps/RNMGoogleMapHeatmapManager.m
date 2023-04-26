//
//  RNMGoogleMapHeatmapManager.m
//
//  Created by David Cako on 29 April 2018.
//

#import "RNMGoogleMapHeatmapManager.h"
#import "RNMGoogleMapHeatmap.h"
#import "RNMGoogleMap.h"
#import <React/RCTBridge.h>
#import <React/UIView+React.h>

@interface RNMGoogleMapHeatmapManager()

@end

@implementation RNMGoogleMapHeatmapManager

RCT_EXPORT_MODULE(RNMGoogleMapHeatmap)

- (UIView *)view
{
  RNMGoogleMapHeatmap *heatmap = [RNMGoogleMapHeatmap new];
  return heatmap;
}

RCT_EXPORT_VIEW_PROPERTY(points, NSArray<NSDictionary *>)
RCT_EXPORT_VIEW_PROPERTY(radius, NSUInteger)
RCT_EXPORT_VIEW_PROPERTY(opacity, float)
RCT_EXPORT_VIEW_PROPERTY(gradient, NSDictionary *)

@end
