//
//  AIRMapLocalTileOverlay.h
//  Pods
//
//  Created by Peter Zavadsky on 04/12/2017.
//

#import <MapKit/MapKit.h>

@interface AIRMapUrlTileOverlay : MKTileOverlay

@property (nonatomic) BOOL overzoomEnabled;
@property (nonatomic) NSInteger overzoomThreshold;

@end

