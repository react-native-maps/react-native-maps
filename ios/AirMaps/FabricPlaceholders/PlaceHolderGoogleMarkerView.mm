//
//  PlaceHolderGoogleMarkerView.mm
//  AirMaps
//
//
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#ifdef RCT_NEW_ARCH_ENABLED
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
#import "PlaceHolderGoogleMarkerView.h"

using namespace facebook::react;

@interface RNMapsGoogleMarkerView () <RCTRNMapsGoogleMarkerViewProtocol>
@end

@implementation RNMapsGoogleMarkerView

#pragma mark - Native commands (no-ops without Google Maps)

- (void)animateToCoordinates:(double)latitude longitude:(double)longitude duration:(NSInteger)duration {}
- (void)setCoordinates:(double)latitude longitude:(double)longitude {}
- (void)showCallout {}
- (void)hideCallout {}
- (void)redrawCallout {}
- (void)redraw {}

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
    RCTRNMapsGoogleMarkerHandleCommand(self, commandName, args);
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RNMapsGoogleMarkerComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> RNMapsGoogleMarkerCls(void)
{
    return RNMapsGoogleMarkerView.class;
}

#endif
#endif
