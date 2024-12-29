//
//  AIRUrlTileOverlay.h
//  AirMaps
//
//  Created by cascadian on 3/19/16.
//  Copyright © 2016. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNMapsAirModuleDelegate.h"

@protocol RNMapsHostVewDelegate <NSObject>
@required

- (id<RNMapsAirModuleDelegate>) mapView;

@end
