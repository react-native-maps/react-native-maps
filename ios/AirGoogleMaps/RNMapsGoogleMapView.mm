//
//  RNMapsGoogleMapView.mm
//
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#ifdef HAVE_GOOGLE_MAPS

#import "RNMapsGoogleMapView.h"
#import "RNMapsGooglePolygonView.h"
#import "AIRGoogleMap.h"
#import "AIRGoogleMapManager.h"
#if __has_include(<ReactNativeMaps/generated/RNMapsAirModuleDelegate.h>)
#import <ReactNativeMaps/generated/RNMapsAirModuleDelegate.h>
#import <ReactNativeMaps/generated/RNMapsHostViewDelegate.h>
#import <ReactNativeMaps/generated/ComponentDescriptors.h>
#import <ReactNativeMaps/generated/EventEmitters.h>
#import <ReactNativeMaps/generated/Props.h>
#import <ReactNativeMaps/generated/RCTComponentViewHelpers.h>
#else
#import "../generated/RNMapsAirModuleDelegate.h"
#import "../generated/RNMapsSpecs/ComponentDescriptors.h"
#import "../generated/RNMapsSpecs/EventEmitters.h"
#import "../generated/RNMapsSpecs/Props.h"
#import "../generated/RNMapsSpecs/RCTComponentViewHelpers.h"
#endif
#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import <React/RCTUtils.h>
#import "RCTConvert+GMSMapViewType.h"
#if __has_include(<ReactNativeMaps/RCTConvert+AirMap.h>)
#import <ReactNativeMaps/RCTConvert+AirMap.h>
#import <ReactNativeMaps/UIView+AirMap.h>
#else
#import "RCTConvert+AirMap.h"
#import "UIView+AirMap.h"
#endif


using namespace facebook::react;

@interface RNMapsGoogleMapView () <RCTRNMapsGoogleMapViewViewProtocol>
@end

@implementation RNMapsGoogleMapView {
    AIRGoogleMap *_view;
    AIRGoogleMapManager* _legacyMapManager;
    NSMutableDictionary<NSNumber*, UIView*>* _pendingInsertsSubviews;
    NSMutableArray *_polygons;
}


- (id<RNMapsAirModuleDelegate>) mapView {
    return (id<RNMapsAirModuleDelegate>)_view;
}

#pragma mark - JS Commands
- (void)animateToRegion:(NSString *)regionJSON duration:(NSInteger)duration{
    NSDictionary* regionDic = [RCTConvert dictonaryFromString:regionJSON];
    MKCoordinateRegion region = [RCTConvert MKCoordinateRegion:regionDic];
    GMSCameraPosition *camera = [AIRGoogleMap makeGMSCameraPositionFromMap:_view andMKCoordinateRegion:region];
    if (duration == 0){
        [_view setRegion:region];
    } else {
        [_view animateToCameraPosition:camera];
    }
}
- (void)setCamera:(NSString *)cameraJSON{
    NSDictionary* cameraDic = [RCTConvert dictonaryFromString:cameraJSON];
    GMSCameraPosition* camera = [RCTConvert GMSCameraPositionWithDefaults:cameraDic existingCamera:[_view camera]];
    [_view setCamera:camera];
}

- (void)animateCamera:(NSString *)cameraJSON duration:(NSInteger)duration{
    NSDictionary* cameraDic = [RCTConvert dictonaryFromString:cameraJSON];
    GMSCameraPosition* camera = [RCTConvert GMSCameraPositionWithDefaults:cameraDic existingCamera:[_view camera]];
    [_view animateToCameraPosition:camera];
}

- (void)fitToElements:(NSString *)edgePaddingJSON animated:(BOOL)animated {
    NSDictionary* edgePadding = [RCTConvert dictonaryFromString:edgePaddingJSON];
    [_view fitToElementsWithEdgePadding:edgePadding animated:animated];
}

- (void)fitToSuppliedMarkers:(NSString *)markersJSON edgePaddingJSON:(NSString *)edgePaddingJSON animated:(BOOL)animated {
    NSArray* markers = [RCTConvert arrayFromString:markersJSON];
    NSDictionary* edgePadding = [RCTConvert dictonaryFromString:edgePaddingJSON];
    [_view fitToSuppliedMarkers:markers withEdgePadding:edgePadding animated:animated];

}
- (void)fitToCoordinates:(NSString *)coordinatesJSON edgePaddingJSON:(NSString *)edgePaddingJSON animated:(BOOL)animated {
    NSArray* coordinatesArr = [RCTConvert arrayFromString:coordinatesJSON];
    NSMutableArray<AIRGoogleMapCoordinate*>* coordinatesArray = [NSMutableArray new];
    for (id json : coordinatesArr){
        [coordinatesArray addObject:[RCTConvert AIRGoogleMapCoordinate:json]];
    }

    NSDictionary* edgePadding = [RCTConvert dictonaryFromString:edgePaddingJSON];

    [_view fitToCoordinates:coordinatesArray withEdgePadding:edgePadding animated:animated];
}
- (void) setIndoorActiveLevelIndex:(NSInteger)activeLevelIndex
{
    if (!_view.indoorDisplay) {
      return;
    }
    if ( activeLevelIndex < [_view.indoorDisplay.activeBuilding.levels count]) {
        _view.indoorDisplay.activeLevel = _view.indoorDisplay.activeBuilding.levels[activeLevelIndex];
    }

}

#pragma mark - Native commands

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
    RCTRNMapsGoogleMapViewHandleCommand(self, commandName, args);
}


+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNMapsGoogleMapViewComponentDescriptor>();
}
- (void) loadPendingInsertSubviews
{
    if ([_pendingInsertsSubviews count] > 0){
        NSArray<NSNumber *> *sortedKeys = [[_pendingInsertsSubviews allKeys] sortedArrayUsingSelector:@selector(compare:)];
        for (NSNumber *key in sortedKeys) {
            // Get the corresponding view
            UIView *view = [_pendingInsertsSubviews objectForKey:key];
            [_view insertReactSubview:view atIndex:[key integerValue]];
            // Remove the entry from the dictionary
            [_pendingInsertsSubviews removeObjectForKey:key];
        }
    }
}

- (void) prepareContentView {

    _view = (AIRGoogleMap *)[_legacyMapManager view];
    _polygons = [NSMutableArray new];

    self.contentView = _view;

      _view.onPress = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {
              // Extract values from the NSDictionary
                NSDictionary* coordinateDict = dictionary[@"coordinate"];
                NSDictionary* positionDict = dictionary[@"position"];

                // Populate the OnMapPressCoordinate struct
                facebook::react::RNMapsGoogleMapViewEventEmitter::OnPressCoordinate coordinate = {
                    .latitude = [coordinateDict[@"latitude"] doubleValue],
                    .longitude = [coordinateDict[@"longitude"] doubleValue],
                };

                // Populate the OnMapPressPosition struct
                facebook::react::RNMapsGoogleMapViewEventEmitter::OnPressPosition position = {
                    .x = [positionDict[@"x"] doubleValue],
                    .y = [positionDict[@"y"] doubleValue],
                };

              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsGoogleMapViewEventEmitter::OnPress data = {
                  .action = std::string([@"press" UTF8String]),
                  .position = position,
                  .coordinate = coordinate
              };
              mapViewEventEmitter->onPress(data);
          }
      };

    _view.onLongPress = [self](NSDictionary* dictionary) {
        if (_eventEmitter) {
            // Extract values from the NSDictionary
              NSDictionary* coordinateDict = dictionary[@"coordinate"];
              NSDictionary* positionDict = dictionary[@"position"];

              // Populate the OnMapPressCoordinate struct
              facebook::react::RNMapsGoogleMapViewEventEmitter::OnLongPressCoordinate coordinate = {
                  .latitude = [coordinateDict[@"latitude"] doubleValue],
                  .longitude = [coordinateDict[@"longitude"] doubleValue],
              };

              // Populate the OnMapPressPosition struct
              facebook::react::RNMapsGoogleMapViewEventEmitter::OnLongPressPosition position = {
                  .x = [positionDict[@"x"] doubleValue],
                  .y = [positionDict[@"y"] doubleValue],
              };

            auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter);
            facebook::react::RNMapsGoogleMapViewEventEmitter::OnLongPress data = {
                .action = std::string([@"press" UTF8String]),
                .position = position,
                .coordinate = coordinate
            };
            mapViewEventEmitter->onLongPress(data);
        }
    };

      _view.onMapReady = [self](NSDictionary* dictionary) {
          [self loadPendingInsertSubviews];
          if (_eventEmitter) {
              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsGoogleMapViewEventEmitter::OnMapReady data = {};
              mapViewEventEmitter->onMapReady(data);
          }
      };

    _view.onIndoorLevelActivated = [self](NSDictionary* dictionary) {
        if (_eventEmitter) {

            auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter);

            facebook::react::RNMapsGoogleMapViewEventEmitter::OnIndoorLevelActivated data = {
                .activeLevelIndex= (int) [dictionary[@"activeLevelIndex"] integerValue],
                .name = [dictionary[@"name"] UTF8String],
                .shortName = [dictionary[@"shortName"] UTF8String],
            };
            mapViewEventEmitter->onIndoorLevelActivated(data);
        }
    };

    _view.onIndoorBuildingFocused = [self](NSDictionary* dictionary) {
        if (_eventEmitter) {
            auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter);

            NSError *jsError = nil;
            NSString *levelsStr = RCTJSONStringify(dictionary[@"levels"], &jsError);

            facebook::react::RNMapsGoogleMapViewEventEmitter::OnIndoorBuildingFocused data = {
                .underground = [dictionary[@"underground"] boolValue],
                .activeLevelIndex = (int) [dictionary[@"activeLevelIndex"] integerValue],
                .levels = [levelsStr  UTF8String]
            };
            mapViewEventEmitter->onIndoorBuildingFocused(data);
        }
    };

    _view.onMapLoaded = [self](NSDictionary* dictionary) {
        if (_eventEmitter) {
            auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter);
            facebook::react::RNMapsGoogleMapViewEventEmitter::OnMapLoaded data = {};
            mapViewEventEmitter->onMapLoaded(data);
        }
    };

      _view.onKmlReady = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {

              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsGoogleMapViewEventEmitter::OnKmlReady data = {};
              mapViewEventEmitter->onKmlReady(data);
          }
      };
      _view.onRegionChange = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {

              NSDictionary* regionDict = dictionary[@"region"];
              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsGoogleMapViewEventEmitter::OnRegionChange data = {
                  .region.latitude = [regionDict[@"latitude"] doubleValue],
                  .region.longitude = [regionDict[@"longitude"] doubleValue],
                  .region.latitudeDelta = [regionDict[@"latitudeDelta"] doubleValue],
                  .region.longitudeDelta = [regionDict[@"longitudeDelta"] doubleValue],
                  .isGesture = [dictionary[@"isGesture"] boolValue],
                 };
              mapViewEventEmitter->onRegionChange(data);
          }
      };

      _view.onPanDrag =  [self](NSDictionary* dictionary) {
          if (_eventEmitter) {

              NSDictionary* coordinateDict = dictionary[@"coordinate"];
              NSDictionary* positionDict = dictionary[@"position"];

              // Populate the OnMapPressCoordinate struct
              facebook::react::RNMapsGoogleMapViewEventEmitter::OnPanDragCoordinate coordinate = {
                  .latitude = [coordinateDict[@"latitude"] doubleValue],
                  .longitude = [coordinateDict[@"longitude"] doubleValue],
              };

              // Populate the OnMapDouplePressPosition struct
              facebook::react::RNMapsGoogleMapViewEventEmitter::OnPanDragPosition position = {
                  .x = [positionDict[@"x"] doubleValue],
                  .y = [positionDict[@"y"] doubleValue],
              };

              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsGoogleMapViewEventEmitter::OnPanDrag data = {
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
              facebook::react::RNMapsGoogleMapViewEventEmitter::OnUserLocationChangeCoordinate coordinate = {
                  .latitude = [coordinateDict[@"latitude"] doubleValue],
                  .longitude = [coordinateDict[@"longitude"] doubleValue],
              };
              NSString* str = @"";
              if (errorDict){
                  str = errorDict[@"message"];
              }

              facebook::react::RNMapsGoogleMapViewEventEmitter::OnUserLocationChangeError error = {
                  .message = std::string([str UTF8String]),
              };


              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsGoogleMapViewEventEmitter::OnUserLocationChange data = {
                  .coordinate = coordinate,
                  .error = error,
                 };
              mapViewEventEmitter->onUserLocationChange(data);
          }
      };

    _view.onPoiClick =  [self](NSDictionary* dictionary) {
        if (_eventEmitter) {

            NSDictionary* coordinateDict = dictionary[@"coordinate"];
            NSDictionary* positionDict = dictionary[@"position"];

            // Populate the OnMapPressCoordinate struct
            facebook::react::RNMapsGoogleMapViewEventEmitter::OnPoiClickCoordinate coordinate = {
                .latitude = [coordinateDict[@"latitude"] doubleValue],
                .longitude = [coordinateDict[@"longitude"] doubleValue],
            };
            // Populate the OnMapDouplePressPosition struct
            facebook::react::RNMapsGoogleMapViewEventEmitter::OnPoiClickPosition position = {
                .x = [positionDict[@"x"] doubleValue],
                .y = [positionDict[@"y"] doubleValue],
            };


            auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter);
            facebook::react::RNMapsGoogleMapViewEventEmitter::OnPoiClick data = {
                .coordinate = coordinate,
                .position = position,
                .placeId = [dictionary[@"placeId"] UTF8String],
                .name = [dictionary[@"name"] UTF8String],
               };
            mapViewEventEmitter->onPoiClick(data);
        }
    };

      _view.onRegionChangeStart = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {

              NSDictionary* regionDict = dictionary[@"region"];
              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsGoogleMapViewEventEmitter::OnRegionChangeStart data = {
                  .region.latitude = [regionDict[@"latitude"] doubleValue],
                  .region.longitude = [regionDict[@"longitude"] doubleValue],
                  .region.latitudeDelta = [regionDict[@"latitudeDelta"] doubleValue],
                  .region.longitudeDelta = [regionDict[@"longitudeDelta"] doubleValue],
                  .isGesture = [dictionary[@"isGesture"] boolValue],
                 };
              mapViewEventEmitter->onRegionChangeStart(data);
          }
      };

      _view.onRegionChangeComplete = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {

              NSDictionary* regionDict = dictionary[@"region"];
              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsGoogleMapViewEventEmitter::OnRegionChangeComplete data = {
                  .region.latitude = [regionDict[@"latitude"] doubleValue],
                  .region.longitude = [regionDict[@"longitude"] doubleValue],
                  .region.latitudeDelta = [regionDict[@"latitudeDelta"] doubleValue],
                  .region.longitudeDelta = [regionDict[@"longitudeDelta"] doubleValue],
                  .isGesture = [dictionary[@"isGesture"] boolValue],
                 };
              mapViewEventEmitter->onRegionChangeComplete(data);
          }
      };


#define HANDLE_MARKER_DRAG_EVENT(eventName, emitterFunction)                     \
    if (_eventEmitter) {                                                        \
        NSDictionary* coordinateDict = dictionary[@"coordinate"];               \
        auto mapViewEventEmitter =                                              \
            std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter); \
        facebook::react::RNMapsGoogleMapViewEventEmitter::eventName data = {          \
            .coordinate.latitude = [coordinateDict[@"latitude"] doubleValue],   \
            .coordinate.longitude = [coordinateDict[@"longitude"] doubleValue], \
            .id = std::string([[dictionary valueForKey:@"id"] UTF8String]),     \
        };                                                                      \
        mapViewEventEmitter->emitterFunction(data);                             \
    }



#define HANDLE_MARKER_EVENT(eventName, emitterFunction, actionName)                \
    if (_eventEmitter) {                                                          \
        NSDictionary* coordinateDict = dictionary[@"coordinate"];                 \
        facebook::react::RNMapsGoogleMapViewEventEmitter::eventName##Coordinate coordinate = { \
            .latitude = [coordinateDict[@"latitude"] doubleValue],                 \
            .longitude = [coordinateDict[@"longitude"] doubleValue],               \
        };                                                                        \
                                                                                  \
        auto mapViewEventEmitter =                                                \
            std::static_pointer_cast<RNMapsGoogleMapViewEventEmitter const>(_eventEmitter); \
        facebook::react::RNMapsGoogleMapViewEventEmitter::eventName data = {            \
            .action = std::string([@actionName UTF8String]),                      \
            .id = std::string([[dictionary valueForKey:@"id"] UTF8String]),       \
            .coordinate = coordinate                                              \
        };                                                                        \
        mapViewEventEmitter->emitterFunction(data);                               \
    }

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

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNMapsGoogleMapViewProps>();
    _props = defaultProps;
    _legacyMapManager = [[AIRGoogleMapManager alloc] init];
      _pendingInsertsSubviews = [NSMutableDictionary new];
  }

  return self;
}


- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index{
    id<RCTComponent> paperView = [childComponentView getPaperViewFromChildComponentView];
    if (paperView){
        if(_view && [_view isReady]){
            [_view insertReactSubview:paperView atIndex:index];
        } else {
            [_pendingInsertsSubviews setObject:paperView forKey:[NSNumber numberWithInteger:index]];
        }
    } else {
        [_view insertReactSubview:childComponentView atIndex:index];
        if ([childComponentView isKindOfClass:[RNMapsGooglePolygonView class]]){
            RNMapsGooglePolygonView* polygon = (RNMapsGooglePolygonView *) childComponentView;
            [_polygons addObject:childComponentView];
            [polygon didInsertInMap:_view];
        }
    }
}

- (void) unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    id<RCTComponent> paperView = [childComponentView getPaperViewFromChildComponentView];
    if (paperView){
        if(_view && [_view isReady]){
            [_view removeReactSubview:paperView];
        } else {
            [_pendingInsertsSubviews removeObjectForKey:[NSNumber numberWithInteger:index]];
        }
    } else {
        [_view removeReactSubview:childComponentView];
        if ([childComponentView isKindOfClass:[RNMapsGooglePolygonView class]]){
            RNMapsGooglePolygonView* polygon = (RNMapsGooglePolygonView *) childComponentView;
            [_polygons removeObject:childComponentView];
            [polygon didRemoveFromMap];
        }
    }
}
- (void) prepareForRecycle
{
    [super prepareForRecycle];
    static const auto defaultProps = std::make_shared<const RNMapsGoogleMapViewProps>();
    _props = defaultProps;
    _legacyMapManager = [[AIRGoogleMapManager alloc] init];
      _pendingInsertsSubviews = [NSMutableDictionary new];
    [_view removeFromSuperview];
    _view = nil;
}


- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<RNMapsGoogleMapViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<RNMapsGoogleMapViewProps const>(props);


    if (oldViewProps.googleMapId != newViewProps.googleMapId) {
        NSString* mapID = RCTNSStringFromString(newViewProps.googleMapId);
        if (mapID && [mapID length]){
            _legacyMapManager.googleMapId = mapID;
        }
    }
    if (oldViewProps.customMapStyleString != newViewProps.customMapStyleString) {
        NSString* customStyle = RCTNSStringFromString(newViewProps.customMapStyleString);
        if (customStyle && [customStyle length]){
            _legacyMapManager.customMapStyle = customStyle;
        }
    }
    if (!newViewProps.zoomTapEnabled) {
        _legacyMapManager.zoomTapEnabled = newViewProps.zoomTapEnabled;
    } else {
        _legacyMapManager.zoomTapEnabled = true;
    }
    if (oldViewProps.loadingBackgroundColor != newViewProps.loadingBackgroundColor){
        _legacyMapManager.backgroundColor = RCTUIColorFromSharedColor(newViewProps.backgroundColor);
    }

    // bug with zoom / pitch / heading where value is not 0 even though
    // nothing is passed from JS so we depend on lat / lng comparison for now
    if (newViewProps.initialCamera.center.latitude != oldViewProps.initialCamera.center.latitude ||
        newViewProps.initialCamera.center.longitude != oldViewProps.initialCamera.center.longitude ||
        newViewProps.initialCamera.pitch != oldViewProps.initialCamera.pitch ||
        newViewProps.initialCamera.zoom != oldViewProps.initialCamera.zoom
        || newViewProps.initialCamera.heading != oldViewProps.initialCamera.heading) {
        GMSCameraPosition* camera = [GMSCameraPosition cameraWithLatitude:newViewProps.initialCamera.center.latitude
                                                                longitude:newViewProps.initialCamera.center.longitude
                                                                     zoom:newViewProps.initialCamera.zoom
                                                                  bearing:newViewProps.initialCamera.heading
                                                             viewingAngle:newViewProps.initialCamera.pitch];
        _legacyMapManager.camera = camera;
    }



    if (!_view){
        [self prepareContentView];
    }

#define REMAP_MAPVIEW_PROP(name)                    \
    if (oldViewProps.name != newViewProps.name) {   \
        _view.name = newViewProps.name;             \
    }

#define REMAP_MAPVIEW_STRING_PROP(name)                             \
    if (oldViewProps.name != newViewProps.name) {                   \
        _view.name = RCTNSStringFromString(newViewProps.name);      \
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


    REMAP_MAPVIEW_PROP(pitchEnabled)
    REMAP_MAPVIEW_PROP(zoomTapEnabled)
    REMAP_MAPVIEW_PROP(scrollEnabled)

    REMAP_MAPVIEW_STRING_PROP(kmlSrc)
    REMAP_MAPVIEW_STRING_PROP(customMapStyleString)
    REMAP_MAPVIEW_PROP(showsBuildings)
    REMAP_MAPVIEW_PROP(rotateEnabled)


    if (newViewProps.minZoom != oldViewProps.minZoom || newViewProps.maxZoom != oldViewProps.maxZoom){
        [_view setMinZoom:newViewProps.minZoom maxZoom:newViewProps.maxZoom];
    }

    [_view setShowsCompass:newViewProps.showsCompass];
    REMAP_MAPVIEW_PROP(showsTraffic)
    REMAP_MAPVIEW_PROP(showsUserLocation)
    REMAP_MAPVIEW_PROP(zoomEnabled)


    REMAP_MAPVIEW_REGION_PROP(region)
    REMAP_MAPVIEW_REGION_PROP(initialRegion)

    if (newViewProps.camera.center.latitude != oldViewProps.camera.center.latitude ||
          newViewProps.camera.center.longitude != oldViewProps.camera.center.longitude ||
          newViewProps.camera.heading != oldViewProps.camera.heading ||
          newViewProps.camera.pitch != oldViewProps.camera.pitch ||
          newViewProps.camera.zoom != oldViewProps.camera.zoom) {
          GMSCameraPosition* camera = [GMSCameraPosition cameraWithLatitude:newViewProps.camera.center.latitude
                                                                  longitude:newViewProps.camera.center.longitude
                                                                       zoom:newViewProps.camera.zoom
                                                                    bearing:newViewProps.camera.heading
                                                               viewingAngle:newViewProps.camera.pitch];
        _view.cameraProp = camera;
      }


    REMAP_MAPVIEW_EDGEINSETS_PROP(mapPadding)


    if (oldViewProps.mapType != newViewProps.mapType){
        switch (newViewProps.mapType) {
            case RNMapsGoogleMapViewMapType::Standard:
                _view.mapType = kGMSTypeNormal;
                break;
            case RNMapsGoogleMapViewMapType::Satellite:
                _view.mapType = kGMSTypeSatellite;
                break;
            case RNMapsGoogleMapViewMapType::Terrain:
                _view.mapType = kGMSTypeTerrain;
                break;
            case RNMapsGoogleMapViewMapType::Hybrid:
                _view.mapType = kGMSTypeHybrid;
                break;
            case RNMapsGoogleMapViewMapType::None:
                _view.mapType = kGMSTypeNone;
                break;
            default:
                _view.mapType = kGMSTypeNormal;
                break;
        }
    }

    if (oldViewProps.userInterfaceStyle != newViewProps.userInterfaceStyle){
        switch (newViewProps.userInterfaceStyle) {
            case RNMapsGoogleMapViewUserInterfaceStyle::Light:
                _view.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
                break;
            case RNMapsGoogleMapViewUserInterfaceStyle::Dark:
                _view.overrideUserInterfaceStyle = UIUserInterfaceStyleDark;
                break;
            case RNMapsGoogleMapViewUserInterfaceStyle::System:
                _view.overrideUserInterfaceStyle = UIUserInterfaceStyleUnspecified;
                break;
        }
    }


  [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> RNMapsGoogleMapViewCls(void)
{
  return RNMapsGoogleMapView.class;
}

#endif
