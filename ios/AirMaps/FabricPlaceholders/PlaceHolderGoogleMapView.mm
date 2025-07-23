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
#import "../../generated/RNMapsHostViewDelegate.h"
#endif
#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import "PlaceHolderGoogleMapView.h"

using namespace facebook::react;


@implementation RNMapsGoogleMapView


#pragma mark - JS Commands
- (void)animateToRegion:(NSString *)regionJSON duration:(NSInteger)duration{
}
- (void)setCamera:(NSString *)cameraJSON{
}

- (void)animateCamera:(NSString *)cameraJSON duration:(NSInteger)duration{
}

- (void)fitToElements:(NSString *)edgePaddingJSON animated:(BOOL)animated {
}

- (void)fitToSuppliedMarkers:(NSString *)markersJSON edgePaddingJSON:(NSString *)edgePaddingJSON animated:(BOOL)animated {
}
- (void)fitToCoordinates:(NSString *)coordinatesJSON edgePaddingJSON:(NSString *)edgePaddingJSON animated:(BOOL)animated {

}
- (void) setIndoorActiveLevelIndex:(NSInteger)activeLevelIndex
{

}

#pragma mark - Native commands

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
}


+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RNMapsGoogleMapViewComponentDescriptor>();
}


@end

Class<RCTComponentViewProtocol> RNMapsGoogleMapViewCls(void)
{
    return RNMapsGoogleMapView.class;
}

#endif
