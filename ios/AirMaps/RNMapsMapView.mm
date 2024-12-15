//
//  RNMapsMarker.m
//  AirMaps
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//

#import "RNMapsMapView.h"
#import "AirMap.h"
#import "AIRMapMarker.h"
#import "AIRMapManager.h"
#import <react/renderer/components/RNMapsSpecs/ComponentDescriptors.h>
#import <react/renderer/components/RNMapsSpecs/EventEmitters.h>
#import <react/renderer/components/RNMapsSpecs/Props.h>
#import <react/renderer/components/RNMapsSpecs/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>

using namespace facebook::react;

@interface RNMapsMapView () <RCTRNMapsMapViewViewProtocol>
@end

@implementation RNMapsMapView {
    AIRMap *_view;
    AIRMapManager* _legacyMapManager;
}


- (AIRMap *) mapView {
    return _view;
}

#pragma mark - JS Commands
- (void)animateToRegion:(NSString *)regionJSON duration:(NSInteger)duration{
    NSDictionary* regionDic = [RCTConvert dictonaryFromString:regionJSON];
    [AIRMap animateWithDuration:duration/1000 animations:^{
        [self->_view setRegion:[RCTConvert MKCoordinateRegion:regionDic] animated:YES];
    }];
}
- (void)setCamera:(NSString *)cameraJSON{
    NSDictionary* cameraDic = [RCTConvert dictonaryFromString:cameraJSON];
    MKMapCamera *camera = [RCTConvert MKMapCameraWithDefaults:cameraDic existingCamera:[_view camera]];
    [_view setCamera:camera];
}

- (void)animateCamera:(NSString *)cameraJSON duration:(NSInteger)duration{
    NSDictionary* cameraDic = [RCTConvert dictonaryFromString:cameraJSON];
    MKMapCamera *camera = [RCTConvert MKMapCameraWithDefaults:cameraDic existingCamera:[_view camera]];

    // don't emit region change events when we are setting the camera
    BOOL originalIgnore = _view.ignoreRegionChanges;
    _view.ignoreRegionChanges = YES;
    [AIRMap animateWithDuration:duration/1000 animations:^{
        [self->_view setCamera:camera animated:YES];
    } completion:^(BOOL finished){
        self->_view.ignoreRegionChanges = originalIgnore;
    }];

}

- (void)fitToElements:(NSString *)edgePaddingJSON animated:(BOOL)animated {
    [_view showAnnotations:_view.annotations animated:animated];
}

- (void)fitToSuppliedMarkers:(NSString *)markersJSON edgePaddingJSON:(NSString *)edgePaddingJSON animated:(BOOL)animated {
    NSArray* markers = [RCTConvert arrayFromString:markersJSON];
    NSPredicate *filterMarkers = [NSPredicate predicateWithBlock:^BOOL(id evaluatedObject, NSDictionary *bindings) {
        AIRMapMarker *marker = (AIRMapMarker *)evaluatedObject;
        return [marker isKindOfClass:[AIRMapMarker class]] && [markers containsObject:marker.identifier];
    }];
    NSArray *filteredMarkers = [_view.annotations filteredArrayUsingPredicate:filterMarkers];
    [_view showAnnotations:filteredMarkers animated:animated];

}
- (void)fitToCoordinates:(NSString *)coordinatesJSON edgePaddingJSON:(NSString *)edgePaddingJSON animated:(BOOL)animated {

}

#pragma mark - Native commands

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
    RCTRNMapsMapViewHandleCommand(self, commandName, args);
}


+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNMapsMapViewComponentDescriptor>();
}


- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNMapsMapViewProps>();
    _props = defaultProps;
      _legacyMapManager = [[AIRMapManager alloc] init];
    _view = (AIRMap *)[_legacyMapManager view];

    self.contentView = _view;

      _view.onPress = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {
              // Extract values from the NSDictionary
                NSDictionary* coordinateDict = dictionary[@"coordinate"];
                NSDictionary* positionDict = dictionary[@"position"];

                // Populate the OnMapPressCoordinate struct
                facebook::react::RNMapsMapViewEventEmitter::OnMapPressCoordinate coordinate = {
                    .latitude = [coordinateDict[@"latitude"] doubleValue],
                    .longitude = [coordinateDict[@"longitude"] doubleValue],
                };

                // Populate the OnMapPressPosition struct
                facebook::react::RNMapsMapViewEventEmitter::OnMapPressPosition position = {
                    .x = [positionDict[@"x"] doubleValue],
                    .y = [positionDict[@"y"] doubleValue],
                };

              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsMapViewEventEmitter::OnMapPress data = {
                  .action = std::string([@"press" UTF8String]),
                  .position = position,
                  .coordinate = coordinate
              };
              mapViewEventEmitter->onMapPress(data);
          }
      };


      _view.onMapReady = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {

              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsMapViewEventEmitter::OnMapReady data = {};
              mapViewEventEmitter->onMapReady(data);
          }
      };
      _view.onChange = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {

              NSDictionary* regionDict = dictionary[@"region"];
              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsMapViewEventEmitter::OnRegionChange data = {
                  .region.latitude = [regionDict[@"latitude"] doubleValue],
                  .region.longitude = [regionDict[@"longitude"] doubleValue],
                  .region.latitudeDelta = [regionDict[@"latitudeDelta"] doubleValue],
                  .region.longitudeDelta = [regionDict[@"longitudeDelta"] doubleValue],
                  .continuous = [dictionary[@"continuous"] boolValue],
                 };
              mapViewEventEmitter->onRegionChange(data);
          }
      };
      _view.onDoublePress = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {

              NSDictionary* coordinateDict = dictionary[@"coordinate"];
              NSDictionary* positionDict = dictionary[@"position"];

              // Populate the OnMapPressCoordinate struct
              facebook::react::RNMapsMapViewEventEmitter::OnDoublePressCoordinate coordinate = {
                  .latitude = [coordinateDict[@"latitude"] doubleValue],
                  .longitude = [coordinateDict[@"longitude"] doubleValue],
              };

              // Populate the OnMapDouplePressPosition struct
              facebook::react::RNMapsMapViewEventEmitter::OnDoublePressPosition position = {
                  .x = [positionDict[@"x"] doubleValue],
                  .y = [positionDict[@"y"] doubleValue],
              };

              
              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsMapViewEventEmitter::OnDoublePress data = {
                  .position = position,
                  .coordinate = coordinate
                 };
              mapViewEventEmitter->onDoublePress(data);
          }
      };
      
      _view.onPanDrag =  [self](NSDictionary* dictionary) {
          if (_eventEmitter) {

              NSDictionary* coordinateDict = dictionary[@"coordinate"];
              NSDictionary* positionDict = dictionary[@"position"];

              // Populate the OnMapPressCoordinate struct
              facebook::react::RNMapsMapViewEventEmitter::OnPanDragCoordinate coordinate = {
                  .latitude = [coordinateDict[@"latitude"] doubleValue],
                  .longitude = [coordinateDict[@"longitude"] doubleValue],
              };

              // Populate the OnMapDouplePressPosition struct
              facebook::react::RNMapsMapViewEventEmitter::OnPanDragPosition position = {
                  .x = [positionDict[@"x"] doubleValue],
                  .y = [positionDict[@"y"] doubleValue],
              };
              
              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsMapViewEventEmitter::OnPanDrag data = {
                        .position = position,
                        .coordinate = coordinate,
                 };
              mapViewEventEmitter->onPanDrag(data);
          }
      };
      
      _view.onUserLocationChange =  [self](NSDictionary* dictionary) {
          if (_eventEmitter) {

              NSDictionary* coordinateDict = dictionary[@"coordinate"];
              NSDictionary* errorDict = dictionary[@"error"];

              
              // Populate the OnMapPressCoordinate struct
              facebook::react::RNMapsMapViewEventEmitter::OnUserLocationChangeCoordinate coordinate = {
                  .latitude = [coordinateDict[@"latitude"] doubleValue],
                  .longitude = [coordinateDict[@"longitude"] doubleValue],
              };
              facebook::react::RNMapsMapViewEventEmitter::OnUserLocationChangeError error = {
                  .message = std::string([errorDict[@"message"] UTF8String]),
              };
              
              
              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsMapViewEventEmitter::OnUserLocationChange data = {
                  .coordinate = coordinate,
                  .error = error,
                 };
              mapViewEventEmitter->onUserLocationChange(data);
          }
      };
      
      _view.onCalloutPress = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {

              NSDictionary* coordinateDict = dictionary[@"coordinate"];
              NSDictionary* positionDict = dictionary[@"position"];

              // Populate the OnCalloutPressPoint struct
              facebook::react::RNMapsMapViewEventEmitter::OnCalloutPressPoint point = {
                  .x = [coordinateDict[@"x"] doubleValue],
                  .y = [coordinateDict[@"y"] doubleValue],
              };

          
              facebook::react::RNMapsMapViewEventEmitter::OnCalloutPressFrame frame = {
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
              
              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsMapViewEventEmitter::OnCalloutPress data = {
                  .action = std::string([dictionary[@"action"] UTF8String]),
                  .id = std::string([dictionary[@"id"] UTF8String]),
                  .point = point,
                  .frame = frame,
                 };
              mapViewEventEmitter->onCalloutPress(data);
          }
      };
      
      
      _view.onRegionChangeStart = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {

              NSDictionary* regionDict = dictionary[@"region"];
              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsMapViewEventEmitter::OnRegionChangeStart data = {
                  .region.latitude = [regionDict[@"latitude"] doubleValue],
                  .region.longitude = [regionDict[@"longitude"] doubleValue],
                  .region.latitudeDelta = [regionDict[@"latitudeDelta"] doubleValue],
                  .region.longitudeDelta = [regionDict[@"longitudeDelta"] doubleValue],
                  .continuous = [dictionary[@"continuous"] boolValue],
                 };
              mapViewEventEmitter->onRegionChangeStart(data);
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
      
      _view.onMarkerDrag = [self](NSDictionary* dictionary) {
          HANDLE_MARKER_DRAG_EVENT(OnMarkerDrag, onMarkerDrag);
      };

      _view.onMarkerDragStart = [self](NSDictionary* dictionary) {
          HANDLE_MARKER_DRAG_EVENT(OnMarkerDragStart, onMarkerDragStart);
      };

      _view.onMarkerDragEnd = [self](NSDictionary* dictionary) {
          HANDLE_MARKER_DRAG_EVENT(OnMarkerDragEnd, onMarkerDragEnd);
      };
      
      _view.onMarkerSelect = [self](NSDictionary* dictionary) {
          HANDLE_MARKER_EVENT(OnMarkerSelect, onMarkerSelect, "marker-select");
      };

      _view.onMarkerDeselect = [self](NSDictionary* dictionary) {
          HANDLE_MARKER_EVENT(OnMarkerDeselect, onMarkerDeselect, "marker-deselect");
      };

      _view.onMarkerPress = [self](NSDictionary* dictionary) {
          HANDLE_MARKER_EVENT(OnMarkerPress, onMarkerPress, "marker-press");
      };



  }

  return self;
}

- (id)getPaperViewFromChildComponentView:(UIView *)childComponentView {
    // Check if the childComponentView responds to the "adapter" selector
    if ([childComponentView respondsToSelector:@selector(paperView)]) {
        // Safely return the paperView
        return [childComponentView valueForKey:@"paperView"];
    }
    // Return nil if paperView is not accessible
    return nil;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index{
    id<RCTComponent> paperView = [self getPaperViewFromChildComponentView:childComponentView];
    if (paperView){
        [_view insertReactSubview:paperView atIndex:index];
    }
}
- (void) unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    id<RCTComponent> paperView = [self getPaperViewFromChildComponentView:childComponentView];
    if (paperView){
        [_view removeReactSubview:paperView];
    }
}

MKMapType mapRNTypeToMKMapType(RNMapsMapViewMapType rnMapType) {
    switch (rnMapType) {
        case RNMapsMapViewMapType::Standard: return MKMapTypeStandard;
        case RNMapsMapViewMapType::Satellite: return MKMapTypeSatellite;
        case RNMapsMapViewMapType::Hybrid: return MKMapTypeHybrid;
        case RNMapsMapViewMapType::MutedStandard: return MKMapTypeMutedStandard;
        case RNMapsMapViewMapType::SatelliteFlyover: return MKMapTypeSatelliteFlyover;
        case RNMapsMapViewMapType::HybridFlyover: return MKMapTypeHybridFlyover;
        default: return MKMapTypeStandard; // Default case
    }
}


- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<RNMapsMapViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<RNMapsMapViewProps const>(props);

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

#define REMAP_MAPVIEW_REGION_PROP(name)                                      \
    if (newViewProps.name.latitude != oldViewProps.name.latitude ||          \
        newViewProps.name.longitude != oldViewProps.name.longitude ||        \
        newViewProps.name.latitudeDelta != oldViewProps.name.latitudeDelta ||\
        newViewProps.name.longitudeDelta != oldViewProps.name.longitudeDelta) { \
        MKCoordinateSpan span = MKCoordinateSpanMake(newViewProps.name.latitudeDelta, \
                                                     newViewProps.name.longitudeDelta); \
        MKCoordinateRegion region = MKCoordinateRegionMake(CLLocationCoordinate2DMake( \
            newViewProps.name.latitude, newViewProps.name.longitude), span); \
        _view.name = region;                                                 \
    }

#define REMAP_MAPVIEW_CAMERA_PROP(name)                                    \
    if (newViewProps.name.center.latitude != oldViewProps.name.center.latitude || \
        newViewProps.name.center.longitude != oldViewProps.name.center.longitude || \
        newViewProps.name.heading != oldViewProps.name.heading ||         \
        newViewProps.name.pitch != oldViewProps.name.pitch) {             \
        CLLocationCoordinate2D center = CLLocationCoordinate2DMake(       \
            newViewProps.name.center.latitude,                            \
            newViewProps.name.center.longitude);                          \
        MKMapCamera* camera = [[MKMapCamera alloc] init];                 \
        camera.centerCoordinate = center;                                 \
        camera.heading = newViewProps.name.heading;                       \
        camera.pitch = newViewProps.name.pitch;                           \
        _view.name = camera;                                              \
    }

#define REMAP_MAPVIEW_EDGEINSETS_PROP(name)                               \
    if (newViewProps.name.top != oldViewProps.name.top ||                 \
        newViewProps.name.right != oldViewProps.name.right ||             \
        newViewProps.name.bottom != oldViewProps.name.bottom ||           \
        newViewProps.name.left != oldViewProps.name.left) {               \
        _view.name = UIEdgeInsetsMake(newViewProps.name.top,              \
                                      newViewProps.name.left,             \
                                      newViewProps.name.bottom,           \
                                      newViewProps.name.right);           \
    }

#define REMAP_MAPVIEW_MAPTYPE(rnMapType) MKMapType##rnMapType


    REMAP_MAPVIEW_PROP(cacheEnabled)

    REMAP_MAPVIEW_PROP(followsUserLocation)
    REMAP_MAPVIEW_PROP(loadingEnabled)
    REMAP_MAPVIEW_PROP(scrollEnabled)

    REMAP_MAPVIEW_PROP(maxDelta)
    REMAP_MAPVIEW_PROP(maxZoomLevel)
    REMAP_MAPVIEW_PROP(minDelta)
    REMAP_MAPVIEW_PROP(minZoomLevel)

    REMAP_MAPVIEW_PROP(showsCompass)
    REMAP_MAPVIEW_PROP(showsScale)
    REMAP_MAPVIEW_PROP(showsTraffic)
    REMAP_MAPVIEW_PROP(showsUserLocation)
    REMAP_MAPVIEW_PROP(userLocationCalloutEnabled)
    REMAP_MAPVIEW_PROP(zoomEnabled)

    REMAP_MAPVIEW_POINT_PROP(compassOffset)

    REMAP_MAPVIEW_REGION_PROP(region)
    REMAP_MAPVIEW_REGION_PROP(initialRegion)

    REMAP_MAPVIEW_CAMERA_PROP(initialCamera)
    REMAP_MAPVIEW_CAMERA_PROP(camera)

    REMAP_MAPVIEW_EDGEINSETS_PROP(legalLabelInsets)
    REMAP_MAPVIEW_EDGEINSETS_PROP(mapPadding)

    REMAP_MAPVIEW_COLOR_PROP(loadingIndicatorColor)
    REMAP_MAPVIEW_COLOR_PROP(loadingIndicatorColor)
    REMAP_MAPVIEW_COLOR_PROP(tintColor)

    // userLocationAnnotationTitle
    REMAP_MAPVIEW_STRING_PROP(userLocationAnnotationTitle)

    if (oldViewProps.mapType != newViewProps.mapType){
        _view.mapType = mapRNTypeToMKMapType(newViewProps.mapType);
    }
    if (oldViewProps.userInterfaceStyle != newViewProps.userInterfaceStyle){
        switch (newViewProps.userInterfaceStyle) {
            case RNMapsMapViewUserInterfaceStyle::Light:
                _view.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
                break;
            case RNMapsMapViewUserInterfaceStyle::Dark:
                _view.overrideUserInterfaceStyle = UIUserInterfaceStyleDark;
                break;
            case RNMapsMapViewUserInterfaceStyle::System:
                _view.overrideUserInterfaceStyle = UIUserInterfaceStyleUnspecified;
                break;
        }
    }

    if (oldViewProps.cameraZoomRange.minCenterCoordinateDistance != newViewProps.cameraZoomRange.minCenterCoordinateDistance ||
        oldViewProps.cameraZoomRange.maxCenterCoordinateDistance != newViewProps.cameraZoomRange.maxCenterCoordinateDistance ||
        oldViewProps.cameraZoomRange.animated != newViewProps.cameraZoomRange.animated) {

        MKMapCameraZoomRange* zoomRange = [[MKMapCameraZoomRange alloc] initWithMinCenterCoordinateDistance:newViewProps.cameraZoomRange.minCenterCoordinateDistance maxCenterCoordinateDistance:newViewProps.cameraZoomRange.maxCenterCoordinateDistance];
        [_view setCameraZoomRange:zoomRange animated:newViewProps.cameraZoomRange.animated];
    }


  [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> RNMapsMapViewCls(void)
{
  return RNMapsMapView.class;
}
