//
//  RNMapsMarker.m
//  AirMaps
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//

#import "RNMapsMarkerView.h"
#import "AIRMap.h"
#import "AIRMapMarker.h"
#import "AIRMapMarkerManager.h"
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

@interface RNMapsMarkerView () <RCTRNMapsMarkerViewProtocol>
@end

@implementation RNMapsMarkerView {
    AIRMapMarker *_view;
    AIRMapMarkerManager* _legacyMapManager;
}

- (AIRMapMarker *) marker {
    return _view;
}
- (void) prepareForRecycle
{
    [super prepareForRecycle];
    [_view removeFromSuperview];
    _view = nil;
    _legacyMapManager = nil;
}

#pragma mark - JS Commands


#pragma mark - Native commands

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
    RCTRNMapsMarkerHandleCommand(self, commandName, args);
}


+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RNMapsMarkerComponentDescriptor>();
}

- (void) animateToCoordinates:(double)latitude longitude:(double)longitude duration:(NSInteger)duration
{
    [_view animateToCoordinate:CLLocationCoordinate2DMake(latitude, longitude) duration:duration/1000];
}

- (void) showCallout
{
    [_view.map selectAnnotation:_view animated:YES];
}

- (void) hideCallout
{
    [_view.map deselectAnnotation:_view animated:YES];

}
- (void) redraw
{
   // do nothing
}
- (void) redrawCallout
{
    // do nothing
}

- (void) setCoordinates:(double)latitude longitude:(double)longitude
{
    [_view setCoordinate:CLLocationCoordinate2DMake(latitude, longitude)];
}



- (void) prepareMarkerView
{
    if (_legacyMapManager && _view) return;
    static const auto defaultProps = std::make_shared<const RNMapsMarkerProps>();
    _props = defaultProps;
    _legacyMapManager = [[AIRMapMarkerManager alloc] init];
    _view = (AIRMapMarker *)[_legacyMapManager view];


    _view.onPress = [self](NSDictionary* dictionary) {
        if (_eventEmitter) {
            // Extract values from the NSDictionary
            NSDictionary* coordinateDict = dictionary[@"coordinate"];
            NSDictionary* positionDict = dictionary[@"position"];

            // Populate the OnCalloutPressPoint struct
            facebook::react::RNMapsMarkerEventEmitter::OnPressPosition point = {
                .x = [coordinateDict[@"x"] doubleValue],
                .y = [coordinateDict[@"y"] doubleValue],
            };


            facebook::react::RNMapsMarkerEventEmitter::OnPressCoordinate coordinate = {
                .latitude = [coordinateDict[@"latitude"] doubleValue],
                .longitude = [coordinateDict[@"longitude"] doubleValue],
            };

            auto eventEmitter = std::static_pointer_cast<RNMapsMarkerEventEmitter const>(_eventEmitter);
            facebook::react::RNMapsMarkerEventEmitter::OnPress data = {
                .action = std::string([dictionary[@"action"] UTF8String]),
                .id = std::string([dictionary[@"id"] UTF8String]),
                .position = point,
                .coordinate = coordinate,
            };
            eventEmitter->onPress(data);
        }
    };

    _view.onDeselect = [self](NSDictionary* dictionary) {
        if (_eventEmitter) {
            // Extract values from the NSDictionary
            NSDictionary* coordinateDict = dictionary[@"coordinate"];
            NSDictionary* positionDict = dictionary[@"position"];

            // Populate the OnCalloutPressPoint struct
            facebook::react::RNMapsMarkerEventEmitter::OnDeselectPosition point = {
                .x = [coordinateDict[@"x"] doubleValue],
                .y = [coordinateDict[@"y"] doubleValue],
            };


            facebook::react::RNMapsMarkerEventEmitter::OnDeselectCoordinate coordinate = {
                .latitude = [coordinateDict[@"latitude"] doubleValue],
                .longitude = [coordinateDict[@"longitude"] doubleValue],
            };

            auto eventEmitter = std::static_pointer_cast<RNMapsMarkerEventEmitter const>(_eventEmitter);
            facebook::react::RNMapsMarkerEventEmitter::OnDeselect data = {
                .action = std::string([dictionary[@"action"] UTF8String]),
                .id = std::string([dictionary[@"id"] UTF8String]),
                .position = point,
                .coordinate = coordinate,
            };
            eventEmitter->onDeselect(data);
        }
    };

    _view.onDrag = [self](NSDictionary* dictionary) {
        if (_eventEmitter) {
            // Extract values from the NSDictionary
            NSDictionary* coordinateDict = dictionary[@"coordinate"];


            facebook::react::RNMapsMarkerEventEmitter::OnDragCoordinate coordinate = {
                .latitude = [coordinateDict[@"latitude"] doubleValue],
                .longitude = [coordinateDict[@"longitude"] doubleValue],
            };

            auto eventEmitter = std::static_pointer_cast<RNMapsMarkerEventEmitter const>(_eventEmitter);
            facebook::react::RNMapsMarkerEventEmitter::OnDrag data = {
                .id = std::string([dictionary[@"id"] UTF8String]),
                .coordinate = coordinate,
            };
            eventEmitter->onDrag(data);
        }
    };
    _view.onDragStart = [self](NSDictionary* dictionary) {
        if (_eventEmitter) {
            // Extract values from the NSDictionary
            NSDictionary* coordinateDict = dictionary[@"coordinate"];

            facebook::react::RNMapsMarkerEventEmitter::OnDragStartCoordinate coordinate = {
                .latitude = [coordinateDict[@"latitude"] doubleValue],
                .longitude = [coordinateDict[@"longitude"] doubleValue],
            };

            auto eventEmitter = std::static_pointer_cast<RNMapsMarkerEventEmitter const>(_eventEmitter);
            facebook::react::RNMapsMarkerEventEmitter::OnDragStart data = {
                .id = std::string([dictionary[@"id"] UTF8String]),
                .coordinate = coordinate,
            };
            eventEmitter->onDragStart(data);
        }
    };

    _view.onDragEnd = [self](NSDictionary* dictionary) {
        if (_eventEmitter) {
            // Extract values from the NSDictionary
            NSDictionary* coordinateDict = dictionary[@"coordinate"];


            facebook::react::RNMapsMarkerEventEmitter::OnDragEndCoordinate coordinate = {
                .latitude = [coordinateDict[@"latitude"] doubleValue],
                .longitude = [coordinateDict[@"longitude"] doubleValue],
            };

            auto eventEmitter = std::static_pointer_cast<RNMapsMarkerEventEmitter const>(_eventEmitter);
            facebook::react::RNMapsMarkerEventEmitter::OnDragEnd data = {
                .id = std::string([dictionary[@"id"] UTF8String]),
                .coordinate = coordinate,
            };
            eventEmitter->onDragEnd(data);
        }
    };

    _view.onSelect = [self](NSDictionary* dictionary) {
        if (_eventEmitter) {
            // Extract values from the NSDictionary
            NSDictionary* coordinateDict = dictionary[@"coordinate"];
            NSDictionary* positionDict = dictionary[@"position"];

            // Populate the OnCalloutPressPoint struct
            facebook::react::RNMapsMarkerEventEmitter::OnSelectPosition point = {
                .x = [coordinateDict[@"x"] doubleValue],
                .y = [coordinateDict[@"y"] doubleValue],
            };


            facebook::react::RNMapsMarkerEventEmitter::OnSelectCoordinate coordinate = {
                .latitude = [coordinateDict[@"latitude"] doubleValue],
                .longitude = [coordinateDict[@"longitude"] doubleValue],
            };

            auto eventEmitter = std::static_pointer_cast<RNMapsMarkerEventEmitter const>(_eventEmitter);
            facebook::react::RNMapsMarkerEventEmitter::OnSelect data = {
                .action = std::string([dictionary[@"action"] UTF8String]),
                .id = std::string([dictionary[@"id"] UTF8String]),
                .position = point,
                .coordinate = coordinate,
            };
            eventEmitter->onSelect(data);
        }
    };


    _view.onCalloutPress = [self](NSDictionary* dictionary) {
        if (_eventEmitter) {
            // Extract values from the NSDictionary
            NSDictionary* pointDict = dictionary[@"point"];
            NSDictionary* frameDict = dictionary[@"frame"];

            // Populate the OnCalloutPressPoint struct
            facebook::react::RNMapsMarkerEventEmitter::OnCalloutPressPoint point = {
                .x = [pointDict[@"x"] doubleValue],
                .y = [pointDict[@"y"] doubleValue],
            };


            facebook::react::RNMapsMarkerEventEmitter::OnCalloutPressFrame frame = {
                .x = [frameDict[@"x"] doubleValue],
                .y = [frameDict[@"x"] doubleValue],
                .width = [frameDict[@"width"] doubleValue],
                .height = [frameDict[@"height"] doubleValue],
            };

            auto eventEmitter = std::static_pointer_cast<RNMapsMarkerEventEmitter const>(_eventEmitter);
            facebook::react::RNMapsMarkerEventEmitter::OnCalloutPress data = {
                .action = std::string([dictionary[@"action"] UTF8String]),
                .id = std::string([dictionary[@"id"] UTF8String]),
                .frame = frame,
                .point = point,
            };
            eventEmitter->onCalloutPress(data);
        }
    };

}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index{
    if (!_view){
        [self prepareMarkerView];
    }
    id<RCTComponent> paperView = [childComponentView getPaperViewFromChildComponentView];
    if (paperView){
        [_view insertReactSubview:paperView atIndex:index];
    } else  {
        [_view insertReactSubview:childComponentView atIndex:index];
    }
}

- (void) unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    id<RCTComponent> paperView = [childComponentView getPaperViewFromChildComponentView];
    if (paperView){
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
    const auto &oldViewProps = *std::static_pointer_cast<RNMapsMarkerProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<RNMapsMarkerProps const>(props);
    BOOL completionHandlerCalled = false;

#define REMAP_MAPVIEW_PROP(name)                    \
if (oldViewProps.name != newViewProps.name) {   \
_view.name = newViewProps.name;             \
}

#define REMAP_MAPVIEW_STRING_PROP(name)                             \
if (oldViewProps.name != newViewProps.name) {                   \
_view.name = RCTNSStringFromString(newViewProps.name);      \
}

#define REMAP_MAPVIEW_COLOR_PROP(name)                                   \
if (oldViewProps.name != newViewProps.name) {                        \
_view.name = RCTUIColorFromSharedColor(newViewProps.name);       \
}

#define REMAP_MAPVIEW_POINT_PROP(name)                               \
if (newViewProps.name.x != oldViewProps.name.x ||                \
newViewProps.name.y != oldViewProps.name.y) {                \
_view.name = CGPointMake(newViewProps.name.x, newViewProps.name.y); \
}

    if (newViewProps.zIndex != oldViewProps.zIndex){
        if (newViewProps.zIndex.has_value()){
            _view.zIndex = newViewProps.zIndex.value();
        } else {
            // default
            _view.zIndex = 0;
        }
    }
    if (newViewProps.image != oldViewProps.image){
        if (newViewProps.image.uri.size()){
            [_view setImageSrc:RCTNSStringFromString(newViewProps.image.uri)];
            completionHandlerCalled = true;
        } else {
            [_view setImageSrc:nil];
        }
    }

    REMAP_MAPVIEW_PROP(useLegacyPinView)


    REMAP_MAPVIEW_PROP(opacity)
    REMAP_MAPVIEW_PROP(draggable)
    REMAP_MAPVIEW_PROP(isPreselected)

    REMAP_MAPVIEW_COLOR_PROP(pinColor)

    REMAP_MAPVIEW_POINT_PROP(calloutOffset)
    REMAP_MAPVIEW_POINT_PROP(centerOffset)

    if (newViewProps.coordinate.latitude != oldViewProps.coordinate.latitude ||
        newViewProps.coordinate.longitude != oldViewProps.coordinate.longitude) {
        CLLocationCoordinate2D coordinates = CLLocationCoordinate2DMake(
                                                                        newViewProps.coordinate.latitude,
                                                                        newViewProps.coordinate.longitude);
        _view.coordinate = coordinates;
    }


    if (newViewProps.description != oldViewProps.description){
        _view.subtitle = RCTNSStringFromString(newViewProps.description);
    }
    REMAP_MAPVIEW_STRING_PROP(title)
    REMAP_MAPVIEW_STRING_PROP(identifier)
    if (newViewProps.titleVisibility != oldViewProps.titleVisibility){
        switch (newViewProps.titleVisibility) {
            case RNMapsMarkerTitleVisibility::Visible:
                [_view setTitleVisibility:MKFeatureVisibilityVisible];
                break;
            case RNMapsMarkerTitleVisibility::Adaptive:
                [_view setTitleVisibility:MKFeatureVisibilityAdaptive];
                break;
            case RNMapsMarkerTitleVisibility::Hidden:
                [_view setTitleVisibility:MKFeatureVisibilityHidden];
                break;
        }
    }
    if (newViewProps.subtitleVisibility != oldViewProps.subtitleVisibility){
        switch (newViewProps.subtitleVisibility) {
            case RNMapsMarkerSubtitleVisibility::Visible:
                [_view setSubtitleVisibility:MKFeatureVisibilityVisible];
                break;
            case RNMapsMarkerSubtitleVisibility::Adaptive:
                [_view setSubtitleVisibility:MKFeatureVisibilityAdaptive];
                break;
            case RNMapsMarkerSubtitleVisibility::Hidden:
                [_view setSubtitleVisibility:MKFeatureVisibilityHidden];
                break;

        }
    }

    if (newViewProps.displayPriority != oldViewProps.displayPriority){
        switch (newViewProps.displayPriority) {
            case RNMapsMarkerDisplayPriority::Required:
                [_view setDisplayPriority:MKFeatureDisplayPriorityRequired];
                break;
            case RNMapsMarkerDisplayPriority::High:
                [_view setDisplayPriority:MKFeatureDisplayPriorityDefaultHigh];
                break;
            case RNMapsMarkerDisplayPriority::Low:
                [_view setDisplayPriority:MKFeatureDisplayPriorityDefaultLow];
                break;

        }
    }


    [super updateProps:props oldProps:oldProps];
}


@end

Class<RCTComponentViewProtocol> RNMapsMarkerCls(void)
{
    return RNMapsMarkerView.class;
}
