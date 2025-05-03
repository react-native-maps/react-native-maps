//
//  RNMapsGoogleMapView.h
//
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#ifdef RCT_NEW_ARCH_ENABLED
#ifdef HAVE_GOOGLE_MAPS

#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>
#if __has_include(<ReactNativeMaps/generated/RNMapsAirModuleDelegate.h>)
#import <ReactNativeMaps/generated/RNMapsHostVewDelegate.h>
#else
#import "RNMapsHostVewDelegate.h"
#endif
@class AIRGoogleMap;

NS_ASSUME_NONNULL_BEGIN

@interface RNMapsGoogleMapView : RCTViewComponentView<RNMapsHostVewDelegate>

@end

NS_ASSUME_NONNULL_END

#endif
#endif
