//
//  RNMapsMarker.h
//  AirMaps
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//

#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>
@class AIRMapMarker;
NS_ASSUME_NONNULL_BEGIN

@interface RNMapsMarkerView : RCTViewComponentView

- (AIRMapMarker *) markerView;

@end

NS_ASSUME_NONNULL_END
