//
//  RNMapsGoogleMarkerView.mm
//  AirGoogleMaps
//
//  Fabric component view for the Google Maps marker on iOS.
//  Mirrors `RNMapsMarkerView` (Apple) but wraps the legacy `AIRGoogleMapMarker`.
//
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#ifdef RCT_NEW_ARCH_ENABLED
#ifdef HAVE_GOOGLE_MAPS

#import "RNMapsGoogleMarkerView.h"
#import "AIRGoogleMapMarker.h"
#import "AIRGoogleMapMarkerManager.h"
#import "AIRGoogleMap.h"
#if __has_include(<ReactNativeMaps/generated/RNMapsAirModuleDelegate.h>)
#import <ReactNativeMaps/generated/RNMapsHostViewDelegate.h>
#import <ReactNativeMaps/generated/ComponentDescriptors.h>
#import <ReactNativeMaps/generated/EventEmitters.h>
#import <ReactNativeMaps/generated/Props.h>
#import <ReactNativeMaps/generated/RCTComponentViewHelpers.h>
#else
#import "../generated/RNMapsHostViewDelegate.h"
#import "../generated/RNMapsSpecs/ComponentDescriptors.h"
#import "../generated/RNMapsSpecs/EventEmitters.h"
#import "../generated/RNMapsSpecs/Props.h"
#import "../generated/RNMapsSpecs/RCTComponentViewHelpers.h"
#endif
#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import "UIView+AirMap.h"

using namespace facebook::react;

@interface RNMapsGoogleMarkerView () <RCTRNMapsGoogleMarkerViewProtocol>
@end

@implementation RNMapsGoogleMarkerView {
    AIRGoogleMapMarker *_view;
    AIRGoogleMapMarkerManager *_legacyMarkerManager;
}

- (AIRGoogleMapMarker *)marker {
    return _view;
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _view = nil;
    _legacyMarkerManager = nil;
}

#pragma mark - Native commands

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
    RCTRNMapsGoogleMarkerHandleCommand(self, commandName, args);
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RNMapsGoogleMarkerComponentDescriptor>();
}

- (void)animateToCoordinates:(double)latitude longitude:(double)longitude duration:(NSInteger)duration
{
    // The Google renderer has no native marker animation; update the coordinate directly.
    [_view setCoordinate:CLLocationCoordinate2DMake(latitude, longitude)];
}

- (void)setCoordinates:(double)latitude longitude:(double)longitude
{
    [_view setCoordinate:CLLocationCoordinate2DMake(latitude, longitude)];
}

- (void)showCallout
{
    [_view showCalloutView];
}

- (void)hideCallout
{
    [_view hideCalloutView];
}

- (void)redraw
{
    [_view redraw];
}

- (void)redrawCallout
{
    [_view hideCalloutView];
    [_view showCalloutView];
}

- (void)prepareMarkerView
{
    if (_view) return;
    static const auto defaultProps = std::make_shared<const RNMapsGoogleMarkerProps>();
    _props = defaultProps;
    _legacyMarkerManager = [[AIRGoogleMapMarkerManager alloc] init];
    _view = (AIRGoogleMapMarker *)[_legacyMarkerManager view];
    // Image/icon loading no longer depends on the instance `bridge`: AIRGoogleMapMarker
    // now loads via the global `[RCTBridge currentBridge]` (bridgeless-safe), matching
    // AIRMapMarker. So there is nothing bridge-related to wire up here.

    _view.onPress = [self](NSDictionary *dictionary) {
        if (!_eventEmitter) return;
        NSDictionary *coordinateDict = dictionary[@"coordinate"];
        NSDictionary *positionDict = dictionary[@"position"];

        facebook::react::RNMapsGoogleMarkerEventEmitter::OnPressCoordinate coordinate = {
            .latitude = [coordinateDict[@"latitude"] doubleValue],
            .longitude = [coordinateDict[@"longitude"] doubleValue],
        };
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnPressPosition position = {
            .x = [positionDict[@"x"] doubleValue],
            .y = [positionDict[@"y"] doubleValue],
        };

        auto eventEmitter = std::static_pointer_cast<RNMapsGoogleMarkerEventEmitter const>(_eventEmitter);
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnPress data = {
            .action = std::string([dictionary[@"action"] UTF8String]),
            .id = std::string([dictionary[@"id"] UTF8String]),
            .coordinate = coordinate,
            .position = position,
        };
        eventEmitter->onPress(data);
    };

    _view.onDragStart = [self](NSDictionary *dictionary) {
        if (!_eventEmitter) return;
        NSDictionary *coordinateDict = dictionary[@"coordinate"];
        NSDictionary *positionDict = dictionary[@"position"];
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnDragStartCoordinate coordinate = {
            .latitude = [coordinateDict[@"latitude"] doubleValue],
            .longitude = [coordinateDict[@"longitude"] doubleValue],
        };
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnDragStartPosition position = {
            .x = [positionDict[@"x"] doubleValue],
            .y = [positionDict[@"y"] doubleValue],
        };
        auto eventEmitter = std::static_pointer_cast<RNMapsGoogleMarkerEventEmitter const>(_eventEmitter);
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnDragStart data = {
            .id = std::string([dictionary[@"id"] UTF8String]),
            .coordinate = coordinate,
            .position = position,
        };
        eventEmitter->onDragStart(data);
    };

    _view.onDrag = [self](NSDictionary *dictionary) {
        if (!_eventEmitter) return;
        NSDictionary *coordinateDict = dictionary[@"coordinate"];
        NSDictionary *positionDict = dictionary[@"position"];
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnDragCoordinate coordinate = {
            .latitude = [coordinateDict[@"latitude"] doubleValue],
            .longitude = [coordinateDict[@"longitude"] doubleValue],
        };
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnDragPosition position = {
            .x = [positionDict[@"x"] doubleValue],
            .y = [positionDict[@"y"] doubleValue],
        };
        auto eventEmitter = std::static_pointer_cast<RNMapsGoogleMarkerEventEmitter const>(_eventEmitter);
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnDrag data = {
            .id = std::string([dictionary[@"id"] UTF8String]),
            .coordinate = coordinate,
            .position = position,
        };
        eventEmitter->onDrag(data);
    };

    _view.onDragEnd = [self](NSDictionary *dictionary) {
        if (!_eventEmitter) return;
        NSDictionary *coordinateDict = dictionary[@"coordinate"];
        NSDictionary *positionDict = dictionary[@"position"];
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnDragEndCoordinate coordinate = {
            .latitude = [coordinateDict[@"latitude"] doubleValue],
            .longitude = [coordinateDict[@"longitude"] doubleValue],
        };
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnDragEndPosition position = {
            .x = [positionDict[@"x"] doubleValue],
            .y = [positionDict[@"y"] doubleValue],
        };
        auto eventEmitter = std::static_pointer_cast<RNMapsGoogleMarkerEventEmitter const>(_eventEmitter);
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnDragEnd data = {
            .id = std::string([dictionary[@"id"] UTF8String]),
            .coordinate = coordinate,
            .position = position,
        };
        eventEmitter->onDragEnd(data);
    };

    _view.onSelect = [self](NSDictionary *dictionary) {
        if (!_eventEmitter) return;
        NSDictionary *coordinateDict = dictionary[@"coordinate"];
        NSDictionary *positionDict = dictionary[@"position"];
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnSelectCoordinate coordinate = {
            .latitude = [coordinateDict[@"latitude"] doubleValue],
            .longitude = [coordinateDict[@"longitude"] doubleValue],
        };
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnSelectPosition position = {
            .x = [positionDict[@"x"] doubleValue],
            .y = [positionDict[@"y"] doubleValue],
        };
        auto eventEmitter = std::static_pointer_cast<RNMapsGoogleMarkerEventEmitter const>(_eventEmitter);
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnSelect data = {
            .action = std::string([dictionary[@"action"] UTF8String]),
            .id = std::string([dictionary[@"id"] UTF8String]),
            .coordinate = coordinate,
            .position = position,
        };
        eventEmitter->onSelect(data);
    };

    _view.onDeselect = [self](NSDictionary *dictionary) {
        if (!_eventEmitter) return;
        NSDictionary *coordinateDict = dictionary[@"coordinate"];
        NSDictionary *positionDict = dictionary[@"position"];
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnDeselectCoordinate coordinate = {
            .latitude = [coordinateDict[@"latitude"] doubleValue],
            .longitude = [coordinateDict[@"longitude"] doubleValue],
        };
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnDeselectPosition position = {
            .x = [positionDict[@"x"] doubleValue],
            .y = [positionDict[@"y"] doubleValue],
        };
        auto eventEmitter = std::static_pointer_cast<RNMapsGoogleMarkerEventEmitter const>(_eventEmitter);
        facebook::react::RNMapsGoogleMarkerEventEmitter::OnDeselect data = {
            .action = std::string([dictionary[@"action"] UTF8String]),
            .id = std::string([dictionary[@"id"] UTF8String]),
            .coordinate = coordinate,
            .position = position,
        };
        eventEmitter->onDeselect(data);
    };
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    if (!_view) {
        [self prepareMarkerView];
    }
    id<RCTComponent> paperView = [childComponentView getPaperViewFromChildComponentView];
    if (paperView) {
        [_view insertReactSubview:paperView atIndex:index];
    } else {
        [_view insertReactSubview:childComponentView atIndex:index];
    }
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    id<RCTComponent> paperView = [childComponentView getPaperViewFromChildComponentView];
    if (paperView) {
        [_view removeReactSubview:paperView];
    } else {
        [_view removeReactSubview:childComponentView];
    }
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        [self prepareMarkerView];
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [self prepareMarkerView];
    const auto &oldViewProps = *std::static_pointer_cast<RNMapsGoogleMarkerProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<RNMapsGoogleMarkerProps const>(props);

#define REMAP_MARKER_PROP(name)                     \
if (oldViewProps.name != newViewProps.name) {       \
_view.name = newViewProps.name;                     \
}

#define REMAP_MARKER_STRING_PROP(name)                          \
if (oldViewProps.name != newViewProps.name) {                   \
_view.name = RCTNSStringFromString(newViewProps.name);          \
}

#define REMAP_MARKER_POINT_PROP(name)                                \
if (newViewProps.name.x != oldViewProps.name.x ||                    \
newViewProps.name.y != oldViewProps.name.y) {                        \
_view.name = CGPointMake(newViewProps.name.x, newViewProps.name.y);  \
}

    if (newViewProps.coordinate.latitude != oldViewProps.coordinate.latitude ||
        newViewProps.coordinate.longitude != oldViewProps.coordinate.longitude) {
        _view.coordinate = CLLocationCoordinate2DMake(newViewProps.coordinate.latitude,
                                                      newViewProps.coordinate.longitude);
    }

    if (newViewProps.zIndex != oldViewProps.zIndex) {
        _view.zIndex = newViewProps.zIndex.has_value() ? newViewProps.zIndex.value() : 0;
    }

    if (newViewProps.image.uri != oldViewProps.image.uri) {
        if (newViewProps.image.uri.size()) {
            [_view setImageSrc:RCTNSStringFromString(newViewProps.image.uri)];
        } else {
            [_view setImageSrc:nil];
        }
    }

    if (newViewProps.icon.uri != oldViewProps.icon.uri) {
        if (newViewProps.icon.uri.size()) {
            [_view setIconSrc:RCTNSStringFromString(newViewProps.icon.uri)];
        } else {
            [_view setIconSrc:nil];
        }
    }

    if (newViewProps.description != oldViewProps.description) {
        _view.subtitle = RCTNSStringFromString(newViewProps.description);
    }

    if (newViewProps.rotation != oldViewProps.rotation) {
        _view.rotation = newViewProps.rotation;
    }

    if (newViewProps.pinColor != oldViewProps.pinColor) {
        _view.pinColor = newViewProps.pinColor
            ? RCTUIColorFromSharedColor(newViewProps.pinColor)
            : nil;
    }

    REMAP_MARKER_STRING_PROP(title)
    REMAP_MARKER_STRING_PROP(identifier)
    REMAP_MARKER_POINT_PROP(anchor)
    REMAP_MARKER_POINT_PROP(calloutAnchor)
    REMAP_MARKER_PROP(draggable)
    REMAP_MARKER_PROP(tappable)
    REMAP_MARKER_PROP(flat)
    REMAP_MARKER_PROP(opacity)
    REMAP_MARKER_PROP(tracksViewChanges)
    REMAP_MARKER_STRING_PROP(snapshotCacheKey)
    REMAP_MARKER_PROP(useSnapshot)
    REMAP_MARKER_PROP(tracksInfoWindowChanges)

    [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> RNMapsGoogleMarkerCls(void)
{
    return RNMapsGoogleMarkerView.class;
}

#endif
#endif
