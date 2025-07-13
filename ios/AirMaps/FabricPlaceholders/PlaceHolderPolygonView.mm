//
//  RNMapsGoogleMapView.mm
//
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#include "RNMapsDefines.h"

#if HAVE_GOOGLE_MAPS == 0

#if __has_include(<ReactNativeMaps/generated/RNMapsAirModuleDelegate.h>)
#import <ReactNativeMaps/generated/RNMapsHostViewDelegate.h>
#import <ReactNativeMaps/generated/ComponentDescriptors.h>
#import <ReactNativeMaps/generated/EventEmitters.h>
#import <ReactNativeMaps/generated/Props.h>
#import <ReactNativeMaps/generated/RCTComponentViewHelpers.h>
#else
#import "../../generated/RNMapsSpecs/ComponentDescriptors.h"
#import "../../generated/RNMapsSpecs/EventEmitters.h"
#import "../../generated/RNMapsSpecs/Props.h"
#import "../../generated/RNMapsSpecs/RCTComponentViewHelpers.h"
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
