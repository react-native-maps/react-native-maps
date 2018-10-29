//
//  AIRMapGSUrlTile
//  AirMaps
//
//  Created by nizam on 10/28/18.
//  Copyright © 2018. All rights reserved.
//

#ifdef HAVE_GOOGLE_MAPS

#import <Foundation/Foundation.h>
#import <GoogleMaps/GoogleMaps.h>

@interface AIRGoogleMapGSUrlTile : UIView

@property (nonatomic, strong) GMSTileLayer *tileLayer;
@property (nonatomic, assign) NSString *urlTemplate;
@property (nonatomic, assign) int zIndex;
@property NSInteger *maximumZ;
@property NSInteger *minimumZ;
@property NSInteger tileSize;

@end

@interface GoogleTileOverlay : GMSSyncTileLayer
@property (nonatomic) double MapX,MapY,FULL;
@property (nonatomic, strong) NSString *template;
@property NSInteger maximumZ;
@property NSInteger minimumZ;
@end
#endif


