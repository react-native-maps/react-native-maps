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

NS_ASSUME_NONNULL_BEGIN

typedef void (^LoadCompletionHandler)(UIView *view);

@class AIRMapMarker;
@interface RNMapsMarkerView : RCTViewComponentView
- (AIRMapMarker*) marker;
@end

NS_ASSUME_NONNULL_END

#endif
