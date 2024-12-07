//
//  RNMapsMarker.h
//  AirMaps
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//

#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>
@class AIRMap;

NS_ASSUME_NONNULL_BEGIN

@interface RNMapsMapView : RCTViewComponentView

- (AIRMap *) mapView;

@end

NS_ASSUME_NONNULL_END
