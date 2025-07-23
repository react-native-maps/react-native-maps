/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


#import <Foundation/Foundation.h>

#import "RCTThirdPartyComponentsProvider.h"
#import <React/RCTComponentViewProtocol.h>

@implementation RCTThirdPartyComponentsProvider

+ (NSDictionary<NSString *, Class<RCTComponentViewProtocol>> *)thirdPartyFabricComponents
{
  return @{
		@"RNMapsGoogleMapView": NSClassFromString(@"RNMapsGoogleMapView"), // react-native-maps
		@"RNMapsGooglePolygon": NSClassFromString(@"RNMapsGooglePolygonView"), // react-native-maps
		@"RNMapsMapView": NSClassFromString(@"RNMapsMapView"), // react-native-maps
		@"RNMapsMarker": NSClassFromString(@"RNMapsMarkerView"), // react-native-maps
  };
}

@end
