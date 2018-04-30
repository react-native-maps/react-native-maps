//
//  AIRGoogleMapsCircle.h
//
//  Created by Nick Italiano on 10/24/16.
//

#import <Google-Maps-iOS-Utils/GMUHeatmapTileLayer.h>

@interface AIRGoogleMapHeatmap : UIView

@property (nonatomic, strong) GMUHeatmapTileLayer *heatmap;
@property (nonatomic, assign) NSUInteger radius;
@property (nonatomic, assign) float opacity;

@end
