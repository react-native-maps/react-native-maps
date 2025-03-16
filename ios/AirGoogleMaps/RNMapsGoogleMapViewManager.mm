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

@interface RNMapsGoogleMapViewManager : RCTViewManager
@end

@implementation RNMapsGoogleMapViewManager

RCT_EXPORT_MODULE(RNMapsGoogleMapViewManager)

RCT_EXPORT_VIEW_PROPERTY(onMapReady, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPanDrag, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDoublePress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLongPress, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onMarkerPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMarkerSelect, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMarkerDeselect, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMarkerDragStart, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMarkerDrag, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMarkerDragEnd, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onCalloutPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRegionChangeStart, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRegionChangeComplete, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRegionChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onUserLocationChange, RCTDirectEventBlock)

@end

#endif
