//
//  AIRMapUrlTileCachedOverlay.h
//  Airmaps
//
//  Created by Markus Suomi on 10/04/2021.
//

#import <MapKit/MapKit.h>

@interface AIRMapUrlTileCachedOverlay : MKTileOverlay

@property (nonatomic, copy) NSURL *tileCachePath;
@property NSInteger tileCacheMaxAge;

@end
