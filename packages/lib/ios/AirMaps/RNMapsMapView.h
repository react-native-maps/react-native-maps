//
//  RNMapsMarker.h
//  AirMaps
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#ifdef RCT_NEW_ARCH_ENABLED

#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>
#if __has_include(<ReactNativeMaps/generated/RNMapsHostVewDelegate.h>)
#import <ReactNativeMaps/generated/RNMapsHostVewDelegate.h>
#else
#import "RNMapsHostVewDelegate.h"
#endif
@class AIRMap;

NS_ASSUME_NONNULL_BEGIN

@interface RNMapsMapView : RCTViewComponentView<RNMapsHostVewDelegate>

@end

NS_ASSUME_NONNULL_END

#endif
