//
//  RNMapsGoogleMarkerView.h
//  AirGoogleMaps
//
//  Fabric component view for the Google Maps marker on iOS.
//  Wraps the legacy `AIRGoogleMapMarker` the same way `RNMapsMarkerView`
//  wraps the Apple `AIRMapMarker`.
//
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#ifdef RCT_NEW_ARCH_ENABLED
#ifdef HAVE_GOOGLE_MAPS

#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class AIRGoogleMapMarker;

@interface RNMapsGoogleMarkerView : RCTViewComponentView
- (AIRGoogleMapMarker *)marker;
@end

NS_ASSUME_NONNULL_END

#endif
#endif
