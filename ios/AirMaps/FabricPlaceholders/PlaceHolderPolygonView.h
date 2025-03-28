//
//  RNMapsGoogleMapView.h
//
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#ifdef RCT_NEW_ARCH_ENABLED
#include "RNMapsDefines.h"

#if HAVE_GOOGLE_MAPS == 0

#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>


NS_ASSUME_NONNULL_BEGIN
@interface RNMapsGooglePolygonView : RCTViewComponentView

@end

NS_ASSUME_NONNULL_END

#endif
#endif
