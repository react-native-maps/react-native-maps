//
//  RNMapsGoogleMapView.mm
//
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#ifndef HAVE_GOOGLE_MAPS



#import <react/renderer/components/RNMapsSpecs/ComponentDescriptors.h>
#import <react/renderer/components/RNMapsSpecs/EventEmitters.h>
#import <react/renderer/components/RNMapsSpecs/Props.h>
#import <react/renderer/components/RNMapsSpecs/RCTComponentViewHelpers.h>

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
