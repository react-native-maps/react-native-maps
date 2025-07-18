//
//  RNMapsMarkerManager.m
//  AirMaps
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//

#import <React/RCTLog.h>
#import <React/RCTUIManager.h>
#import <React/RCTViewManager.h>

@interface RNMapsMapViewManager : RCTViewManager
@end

@implementation RNMapsMapViewManager

RCT_EXPORT_MODULE(RNMapsMapViewManager)

RCT_EXPORT_VIEW_PROPERTY(onMapReady, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLongPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onCalloutPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDoublePress, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onPanDrag, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onMarkerPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMarkerSelect, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMarkerDeselect, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMarkerDragStart, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMarkerDrag, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMarkerDragEnd, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onRegionChangeStart, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRegionChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRegionChangeComplete, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onUserLocationChange, RCTDirectEventBlock)



@end
