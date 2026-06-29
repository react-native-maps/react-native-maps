//
//  RNMapsPolygonView.h
//  AirMaps
//
//  Fabric component view for the Apple Maps polygon on iOS.
//  Wraps the legacy `AIRMapPolygon` the same way `RNMapsGooglePolygonView`
//  wraps the Google `AIRGMSPolygon`.
//
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#ifdef RCT_NEW_ARCH_ENABLED

#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class AIRMapPolygon;

@interface RNMapsPolygonView : RCTViewComponentView
- (AIRMapPolygon *)polygon;
@end

NS_ASSUME_NONNULL_END

#endif
