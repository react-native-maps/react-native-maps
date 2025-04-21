//
//  RNMapsMapViewManager.mm
//  AirMaps
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#ifdef HAVE_GOOGLE_MAPS

#import <React/RCTLog.h>
#import <React/RCTUIManager.h>
#import <React/RCTViewManager.h>

@interface RNMapsGooglePolygonViewManager : RCTViewManager
@end

@implementation RNMapsGooglePolygonViewManager

RCT_EXPORT_MODULE(RNMapsGooglePolygonViewManager)

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)


@end

#endif
