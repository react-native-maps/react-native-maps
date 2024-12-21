//
//  RNMapsMarkerView.mm
//  AirMaps
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//

#import "RNMapsMarkerView.h"
#import "RNMapsMapView.h"
#import "AIRMapMarker.h"
#import "AIRMapMarker.h"
#import "AIRMapMarkerManager.h"
#import <react/renderer/components/RNMapsSpecs/ComponentDescriptors.h>
#import <react/renderer/components/RNMapsSpecs/EventEmitters.h>
#import <react/renderer/components/RNMapsSpecs/Props.h>
#import <react/renderer/components/RNMapsSpecs/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>

using namespace facebook::react;

@interface RNMapsMarkerView () <RCTRNMapsMarkerViewViewProtocol>
@end

@implementation RNMapsMarkerView {
    AIRMapMarker *_view;
    AIRMapMarkerManager* _legacyMapManager;
}



- (AIRMapMarker *) markerView
{
    return _view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RNMapsMarkerViewComponentDescriptor>();
}


- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNMapsMarkerViewProps>();
    _props = defaultProps;
      _legacyMapManager = [[AIRMapMarkerManager alloc] init];
      _view = (AIRMapMarker *)[_legacyMapManager view];

      self.contentView = _view;

      _view.onPress = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {
              // Extract values from the NSDictionary
                NSDictionary* coordinateDict = dictionary[@"coordinate"];
                NSDictionary* positionDict = dictionary[@"position"];

                // Populate the OnMapPressCoordinate struct
                facebook::react::RNMapsMarkerViewEventEmitter::OnPressCoordinate coordinate = {
                    .latitude = [coordinateDict[@"latitude"] doubleValue],
                    .longitude = [coordinateDict[@"longitude"] doubleValue],
                };

                // Populate the OnMapPressPosition struct
                facebook::react::RNMapsMarkerViewEventEmitter::OnPressPosition position = {
                    .x = [positionDict[@"x"] doubleValue],
                    .y = [positionDict[@"y"] doubleValue],
                };

              auto markerEventEmitter = std::static_pointer_cast<RNMapsMarkerViewEventEmitter const>(_eventEmitter);
              // RNMapsMarkerViewEventEmitter::onPress
              facebook::react::RNMapsMarkerViewEventEmitter::OnPress data = {
                  .action = std::string([@"press" UTF8String]),
                  .position = position,
                  .coordinate = coordinate
              };
              markerEventEmitter->onPress(data);
          }
      };


      _view.onCalloutPress = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {

              NSDictionary* coordinateDict = dictionary[@"coordinate"];
              NSDictionary* positionDict = dictionary[@"position"];

              // Populate the OnCalloutPressPoint struct
              facebook::react::RNMapsMarkerViewEventEmitter::OnCalloutPressPoint point = {
                  .x = [coordinateDict[@"x"] doubleValue],
                  .y = [coordinateDict[@"y"] doubleValue],
              };


              facebook::react::RNMapsMarkerViewEventEmitter::OnCalloutPressFrame frame = {
                  .x = [positionDict[@"x"] doubleValue],
                  .y = [positionDict[@"y"] doubleValue],
                  .width = [positionDict[@"width"] doubleValue],
                  .height = [positionDict[@"height"] doubleValue],
              };
/*
 std::string action;
OnCalloutPressFrame frame;
std::string id;
OnCalloutPressPoint point;
OnCalloutPressCoordinate coordinate;
OnCalloutPressPosition position;
 id event = @{
              @"action": calloutSubview ? @"callout-inside-press" : @"callout-press",
              @"id": marker.identifier ?: @"unknown",
              @"point": @{
                      @"x": @(touchPointReal.x),
                      @"y": @(touchPointReal.y),
                      },
              @"frame": @{
                  @"x": @(bubbleFrame.origin.x),
                  @"y": @(bubbleFrame.origin.y),
                  @"width": @(bubbleFrame.size.width),
                  @"height": @(bubbleFrame.size.height),
                  }
              };
 */

              auto markerEventEmitter = std::static_pointer_cast<RNMapsMarkerViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsMarkerViewEventEmitter::OnCalloutPress data = {
                  .action = std::string([dictionary[@"action"] UTF8String]),
                  .id = std::string([dictionary[@"id"] UTF8String]),
                  .point = point,
                  .frame = frame,
                 };
              markerEventEmitter->onCalloutPress(data);
          }
      };




#define HANDLE_MARKER_DRAG_EVENT(eventName, emitterFunction)                     \
    if (_eventEmitter) {                                                        \
        NSDictionary* coordinateDict = dictionary[@"coordinate"];               \
        auto mapViewEventEmitter =                                              \
            std::static_pointer_cast<RNMapsMapViewEventEmitter const>(_eventEmitter); \
        facebook::react::RNMapsMapViewEventEmitter::eventName data = {          \
            .coordinate.latitude = [coordinateDict[@"latitude"] doubleValue],   \
            .coordinate.longitude = [coordinateDict[@"longitude"] doubleValue], \
            .id = std::string([[dictionary valueForKey:@"id"] UTF8String]),     \
        };                                                                      \
        mapViewEventEmitter->emitterFunction(data);                             \
    }



#define HANDLE_MARKER_EVENT(eventName, emitterFunction, actionName)                \
    if (_eventEmitter) {                                                          \
        NSDictionary* coordinateDict = dictionary[@"coordinate"];                 \
        facebook::react::RNMapsMapViewEventEmitter::eventName##Coordinate coordinate = { \
            .latitude = [coordinateDict[@"latitude"] doubleValue],                 \
            .longitude = [coordinateDict[@"longitude"] doubleValue],               \
        };                                                                        \
                                                                                  \
        auto mapViewEventEmitter =                                                \
            std::static_pointer_cast<RNMapsMapViewEventEmitter const>(_eventEmitter); \
        facebook::react::RNMapsMapViewEventEmitter::eventName data = {            \
            .action = std::string([@actionName UTF8String]),                      \
            .id = std::string([[dictionary valueForKey:@"id"] UTF8String]),       \
            .coordinate = coordinate                                              \
        };                                                                        \
        mapViewEventEmitter->emitterFunction(data);                               \
    }
      /*
      _view.onDrag = [self](NSDictionary* dictionary) {
          HANDLE_MARKER_DRAG_EVENT(OnMarkerDrag, onMarkerDrag);
      };

      _view.onDragStart = [self](NSDictionary* dictionary) {
          HANDLE_MARKER_DRAG_EVENT(OnMarkerDragStart, onMarkerDragStart);
      };

      _view.onDragEnd = [self](NSDictionary* dictionary) {
          HANDLE_MARKER_DRAG_EVENT(OnMarkerDragEnd, onMarkerDragEnd);
      };

      _view.onSelect = [self](NSDictionary* dictionary) {
          HANDLE_MARKER_EVENT(OnMarkerSelect, onMarkerSelect, "marker-select");
      };

      _view.onDeselect = [self](NSDictionary* dictionary) {
          HANDLE_MARKER_EVENT(OnMarkerDeselect, onMarkerDeselect, "marker-deselect");
      };

      _view.onPress = [self](NSDictionary* dictionary) {
          HANDLE_MARKER_EVENT(OnMarkerPress, onMarkerPress, "marker-press");
      };

*/

  }

  return self;
}


- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index{

    [self.contentView insertReactSubview:childComponentView atIndex:index];
    [self.contentView insertSubview:childComponentView atIndex:index];
}

- (void) unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self.contentView unmountChildComponentView:childComponentView index:index];
}



- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<RNMapsMarkerViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<RNMapsMarkerViewProps const>(props);

#define REMAP_MARKERVIEW_PROP(name)                    \
    if (oldViewProps.name != newViewProps.name) {   \
        _view.name = newViewProps.name;             \
    }

#define REMAP_MARKERVIEW_COORDINATE_PROP(name)                                      \
    if (newViewProps.name.latitude != oldViewProps.name.latitude ||          \
newViewProps.name.longitude != oldViewProps.name.longitude ) {        \
CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(       \
    newViewProps.name.latitude,                            \
    newViewProps.name.longitude); \
        _view.name = coordinate;                                                 \
    }

#define REMAP_MARKERVIEW_STRING_PROP(name)                             \
    if (oldViewProps.name != newViewProps.name) {                   \
        _view.name = RCTNSStringFromString(newViewProps.name);      \
    }

#define REMAP_MARKERVIEW_COLOR_PROP(name)                                   \
    if (oldViewProps.name != newViewProps.name) {                        \
        _view.name = RCTUIColorFromSharedColor(newViewProps.name);       \
    }

#define REMAP_MARKERVIEW_POINT_PROP(name)                               \
    if (newViewProps.name.x != oldViewProps.name.x ||                \
        newViewProps.name.y != oldViewProps.name.y) {                \
        _view.name = CGPointMake(newViewProps.name.x, newViewProps.name.y); \
    }


    REMAP_MARKERVIEW_POINT_PROP(calloutOffset)
    REMAP_MARKERVIEW_POINT_PROP(centerOffset)

    REMAP_MARKERVIEW_COORDINATE_PROP(coordinate)


    REMAP_MARKERVIEW_PROP(draggable)
    REMAP_MARKERVIEW_PROP(isPreselected)
    REMAP_MARKERVIEW_PROP(opacity)
    REMAP_MARKERVIEW_PROP(useLegacyPinView)


    REMAP_MARKERVIEW_COLOR_PROP(pinColor)



    REMAP_MARKERVIEW_STRING_PROP(title)
    REMAP_MARKERVIEW_STRING_PROP(identifier)
    if (oldViewProps.description != newViewProps.description) {                   \
        _view.subtitle = RCTNSStringFromString(newViewProps.description);      \
    }



  [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> RNMapsMarkerViewCls(void)
{
  return RNMapsMarkerView.class;
}
