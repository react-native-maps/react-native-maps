//
//  RNMapsGoogleMapView.mm
//
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#include "RNMapsDefines.h"

#if HAVE_GOOGLE_MAPS == 0

#if __has_include(<ReactNativeMapsGenerated/RNMapsAirModuleDelegate.h>)
#import <ReactNativeMapsGenerated/RNMapsHostVewDelegate.h>
#import <ReactNativeMapsGenerated/ComponentDescriptors.h>
#import <ReactNativeMapsGenerated/EventEmitters.h>
#import <ReactNativeMapsGenerated/Props.h>
#import <ReactNativeMapsGenerated/RCTComponentViewHelpers.h>
#else
#import <react-native-maps-generated/ComponentDescriptors.h>
#import <react-native-maps-generated/EventEmitters.h>
#import <react-native-maps-generated/Props.h>
#import <react-native-maps-generated/RCTComponentViewHelpers.h>
#endif

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import "PlaceHolderPolygonView.h"

using namespace facebook::react;


@interface RNMapsGooglePolygonView () <RCTRNMapsGooglePolygonViewProtocol>
@end

@implementation RNMapsGooglePolygonView



+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNMapsGooglePolygonComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> RNMapsGooglePolygonCls(void)
{
    return RNMapsGooglePolygonView.class;
}

#endif
