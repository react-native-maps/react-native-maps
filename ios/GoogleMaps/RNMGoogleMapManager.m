//
//  RNMGoogleMapManager.m
//  RNMaps
//
//  Created by Gil Birman on 9/1/16.
//

#ifdef HAVE_GOOGLE_MAPS


#import "RNMGoogleMapManager.h"
#import <React/RCTViewManager.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTConvert+CoreLocation.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTViewManager.h>
#import <React/RCTConvert.h>
#import <React/UIView+React.h>
#import "RCTConvert+GMSMapViewType.h"
#import "RNMGoogleMap.h"
#import "RNMMapMarker.h"
#import "RNMMapPolyline.h"
#import "RNMMapPolygon.h"
#import "RNMMapCircle.h"
#import "SMCalloutView.h"
#import "RNMGoogleMapMarker.h"
#import "RCTConvert+RNMMap.h"

#import <MapKit/MapKit.h>
#import <QuartzCore/QuartzCore.h>

static NSString *const RCTMapViewKey = @"MapView";


@interface RNMGoogleMapManager() <GMSMapViewDelegate>
{
  BOOL didCallOnMapReady;
}
@end

@implementation RNMGoogleMapManager

RCT_EXPORT_MODULE(RNMGoogleMap)

- (UIView *)view
{
  [GMSServices setMetalRendererEnabled:YES];
  
  RNMGoogleMap *map = [RNMGoogleMap new];
  map.bridge = self.bridge;
  map.delegate = self;
  map.isAccessibilityElement = NO;
  map.accessibilityElementsHidden = NO;
  map.settings.consumesGesturesInView = NO;

  UIPanGestureRecognizer *drag = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(handleMapDrag:)];
  [drag setMinimumNumberOfTouches:1];
  [drag setMaximumNumberOfTouches:1];
  [map addGestureRecognizer:drag];

  UIPinchGestureRecognizer *pinch = [[UIPinchGestureRecognizer alloc] initWithTarget:self action:@selector(handleMapDrag:)];
  [map addGestureRecognizer:pinch];

  return map;
}

RCT_EXPORT_VIEW_PROPERTY(isAccessibilityElement, BOOL)
RCT_REMAP_VIEW_PROPERTY(testID, accessibilityIdentifier, NSString)
RCT_EXPORT_VIEW_PROPERTY(initialCamera, GMSCameraPosition)
RCT_REMAP_VIEW_PROPERTY(camera, cameraProp, GMSCameraPosition)
RCT_EXPORT_VIEW_PROPERTY(initialRegion, MKCoordinateRegion)
RCT_EXPORT_VIEW_PROPERTY(region, MKCoordinateRegion)
RCT_EXPORT_VIEW_PROPERTY(showsBuildings, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsCompass, BOOL)
//RCT_EXPORT_VIEW_PROPERTY(showsScale, BOOL)  // Not supported by GoogleMaps
RCT_EXPORT_VIEW_PROPERTY(showsTraffic, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(rotateEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(scrollEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(scrollDuringRotateOrZoomEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(pitchEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zoomTapEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsUserLocation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsMyLocationButton, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsIndoors, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsIndoorLevelPicker, BOOL)
RCT_EXPORT_VIEW_PROPERTY(customMapStyleString, NSString)
RCT_EXPORT_VIEW_PROPERTY(mapPadding, UIEdgeInsets)
RCT_REMAP_VIEW_PROPERTY(paddingAdjustmentBehavior, paddingAdjustmentBehaviorString, NSString)
RCT_EXPORT_VIEW_PROPERTY(onMapReady, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMapLoaded, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKmlReady, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLongPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPanDrag, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onUserLocationChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMarkerPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRegionChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRegionChangeComplete, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPoiClick, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onIndoorLevelActivated, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onIndoorBuildingFocused, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(mapType, GMSMapViewType)
RCT_EXPORT_VIEW_PROPERTY(minZoomLevel, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(maxZoomLevel, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(kmlSrc, NSString)

RCT_EXPORT_METHOD(setCamera:(nonnull NSNumber *)reactTag
                  camera:(id)json)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMGoogleMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMGoogleMap, got: %@", view);
        } else {
            RNMGoogleMap *mapView = (RNMGoogleMap *)view;
            GMSCameraPosition *camera = [RCTConvert GMSCameraPositionWithDefaults:json existingCamera:[mapView camera]];
            [mapView setCamera:camera];
        }
    }];
}


RCT_EXPORT_METHOD(animateCamera:(nonnull NSNumber *)reactTag
                  withCamera:(id)json
                  withDuration:(CGFloat)duration)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMGoogleMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMGoogleMap, got: %@", view);
        } else {
            [CATransaction begin];
            [CATransaction setAnimationDuration:duration/1000];
            RNMGoogleMap *mapView = (RNMGoogleMap *)view;
            GMSCameraPosition *camera = [RCTConvert GMSCameraPositionWithDefaults:json existingCamera:[mapView camera]];
            [mapView animateToCameraPosition:camera];
            [CATransaction commit];
        }
    }];
}

RCT_EXPORT_METHOD(fitToElements:(nonnull NSNumber *)reactTag
                  edgePadding:(nonnull NSDictionary *)edgePadding
                  animated:(BOOL)animated)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RNMGoogleMap class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNMGoogleMap, got: %@", view);
    } else {
      RNMGoogleMap *mapView = (RNMGoogleMap *)view;

      CLLocationCoordinate2D myLocation = ((RNMGoogleMapMarker *)(mapView.markers.firstObject)).realMarker.position;
      GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithCoordinate:myLocation coordinate:myLocation];

      for (RNMGoogleMapMarker *marker in mapView.markers)
        bounds = [bounds includingCoordinate:marker.realMarker.position];
        
        GMSCameraUpdate* cameraUpdate;
        
        if ([edgePadding count] != 0) {
            // Set Map viewport
            CGFloat top = [RCTConvert CGFloat:edgePadding[@"top"]];
            CGFloat right = [RCTConvert CGFloat:edgePadding[@"right"]];
            CGFloat bottom = [RCTConvert CGFloat:edgePadding[@"bottom"]];
            CGFloat left = [RCTConvert CGFloat:edgePadding[@"left"]];
            
            cameraUpdate = [GMSCameraUpdate fitBounds:bounds withEdgeInsets:UIEdgeInsetsMake(top, left, bottom, right)];
        } else {
            cameraUpdate = [GMSCameraUpdate fitBounds:bounds withPadding:55.0f];
        }
      if (animated) {
        [mapView animateWithCameraUpdate: cameraUpdate];
      } else {
        [mapView moveCamera: cameraUpdate];
      }
    }
  }];
}

RCT_EXPORT_METHOD(fitToSuppliedMarkers:(nonnull NSNumber *)reactTag
                  markers:(nonnull NSArray *)markers
                  edgePadding:(nonnull NSDictionary *)edgePadding
                  animated:(BOOL)animated)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RNMGoogleMap class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNMGoogleMap, got: %@", view);
    } else {
      RNMGoogleMap *mapView = (RNMGoogleMap *)view;

      NSPredicate *filterMarkers = [NSPredicate predicateWithBlock:^BOOL(id evaluatedObject, NSDictionary *bindings) {
        RNMGoogleMapMarker *marker = (RNMGoogleMapMarker *)evaluatedObject;
        return [marker isKindOfClass:[RNMGoogleMapMarker class]] && [markers containsObject:marker.identifier];
      }];

      NSArray *filteredMarkers = [mapView.markers filteredArrayUsingPredicate:filterMarkers];

      CLLocationCoordinate2D myLocation = ((RNMGoogleMapMarker *)(filteredMarkers.firstObject)).realMarker.position;
      GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithCoordinate:myLocation coordinate:myLocation];

      for (RNMGoogleMapMarker *marker in filteredMarkers)
        bounds = [bounds includingCoordinate:marker.realMarker.position];

      // Set Map viewport
      CGFloat top = [RCTConvert CGFloat:edgePadding[@"top"]];
      CGFloat right = [RCTConvert CGFloat:edgePadding[@"right"]];
      CGFloat bottom = [RCTConvert CGFloat:edgePadding[@"bottom"]];
      CGFloat left = [RCTConvert CGFloat:edgePadding[@"left"]];

      GMSCameraUpdate* cameraUpdate = [GMSCameraUpdate fitBounds:bounds withEdgeInsets:UIEdgeInsetsMake(top, left, bottom, right)];
      if (animated) {
        [mapView animateWithCameraUpdate:cameraUpdate
         ];
      } else {
        [mapView moveCamera: cameraUpdate];
      }
    }
  }];
}

RCT_EXPORT_METHOD(fitToCoordinates:(nonnull NSNumber *)reactTag
                  coordinates:(nonnull NSArray<RNMMapCoordinate *> *)coordinates
                  edgePadding:(nonnull NSDictionary *)edgePadding
                  animated:(BOOL)animated)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RNMGoogleMap class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNMGoogleMap, got: %@", view);
    } else {
      RNMGoogleMap *mapView = (RNMGoogleMap *)view;

      CLLocationCoordinate2D myLocation = coordinates.firstObject.coordinate;
      GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithCoordinate:myLocation coordinate:myLocation];

      for (RNMMapCoordinate *coordinate in coordinates)
        bounds = [bounds includingCoordinate:coordinate.coordinate];

      // Set Map viewport
      CGFloat top = [RCTConvert CGFloat:edgePadding[@"top"]];
      CGFloat right = [RCTConvert CGFloat:edgePadding[@"right"]];
      CGFloat bottom = [RCTConvert CGFloat:edgePadding[@"bottom"]];
      CGFloat left = [RCTConvert CGFloat:edgePadding[@"left"]];

      GMSCameraUpdate *cameraUpdate = [GMSCameraUpdate fitBounds:bounds withEdgeInsets:UIEdgeInsetsMake(top, left, bottom, right)];

      if (animated) {
        [mapView animateWithCameraUpdate: cameraUpdate];
      } else {
        [mapView moveCamera: cameraUpdate];
      }
    }
  }];
}

RCT_EXPORT_METHOD(setMapBoundaries:(nonnull NSNumber *)reactTag
                  northEast:(CLLocationCoordinate2D)northEast
                  southWest:(CLLocationCoordinate2D)southWest)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RNMGoogleMap class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNMGoogleMap, got: %@", view);
    } else {
      RNMGoogleMap *mapView = (RNMGoogleMap *)view;

      GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithCoordinate:northEast coordinate:southWest];

      mapView.cameraTargetBounds = bounds;
    }
  }];
}

RCT_EXPORT_METHOD(setIndoorActiveLevelIndex:(nonnull NSNumber *)reactTag
                  levelIndex:(NSInteger) levelIndex)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RNMGoogleMap class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNMGoogleMap, got: %@", view);
    } else {
      RNMGoogleMap *mapView = (RNMGoogleMap *)view;
      if (!mapView.indoorDisplay) {
        return;
      }
      if ( levelIndex < [mapView.indoorDisplay.activeBuilding.levels count]) {
        mapView.indoorDisplay.activeLevel = mapView.indoorDisplay.activeBuilding.levels[levelIndex];
      }
    }
  }];
 }

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (NSDictionary *)constantsToExport {
  return @{ @"legalNotice": [GMSServices openSourceLicenseInfo] };
}

- (void)mapView:(GMSMapView *)mapView willMove:(BOOL)gesture{
    self.isGesture = gesture;
}

- (void)mapViewDidStartTileRendering:(GMSMapView *)mapView {
  RNMGoogleMap *googleMapView = (RNMGoogleMap *)mapView;
  [googleMapView didPrepareMap];
}

- (void)mapViewDidFinishTileRendering:(GMSMapView *)mapView {
  RNMGoogleMap *googleMapView = (RNMGoogleMap *)mapView;
  [googleMapView mapViewDidFinishTileRendering];
}

- (BOOL)mapView:(GMSMapView *)mapView didTapMarker:(GMSMarker *)marker {
  RNMGoogleMap *googleMapView = (RNMGoogleMap *)mapView;
  return [googleMapView didTapMarker:marker];
}

- (void)mapView:(GMSMapView *)mapView didTapOverlay:(GMSPolygon *)polygon {
  RNMGoogleMap *googleMapView = (RNMGoogleMap *)mapView;
  [googleMapView didTapPolygon:polygon];
}

- (void)mapView:(GMSMapView *)mapView didTapAtCoordinate:(CLLocationCoordinate2D)coordinate {
  RNMGoogleMap *googleMapView = (RNMGoogleMap *)mapView;
  [googleMapView didTapAtCoordinate:coordinate];
}

- (void)mapView:(GMSMapView *)mapView didLongPressAtCoordinate:(CLLocationCoordinate2D)coordinate {
  RNMGoogleMap *googleMapView = (RNMGoogleMap *)mapView;
  [googleMapView didLongPressAtCoordinate:coordinate];
}

- (void)mapView:(GMSMapView *)mapView didChangeCameraPosition:(GMSCameraPosition *)position {
  RNMGoogleMap *googleMapView = (RNMGoogleMap *)mapView;
  [googleMapView didChangeCameraPosition:position isGesture:self.isGesture];
}

- (void)mapView:(GMSMapView *)mapView idleAtCameraPosition:(GMSCameraPosition *)position {
  RNMGoogleMap *googleMapView = (RNMGoogleMap *)mapView;
  [googleMapView idleAtCameraPosition:position isGesture:self.isGesture];
}

- (UIView *)mapView:(GMSMapView *)mapView markerInfoWindow:(GMSMarker *)marker {
  RNMGMSMarker *aMarker = (RNMGMSMarker *)marker;
  return [aMarker.fakeMarker markerInfoWindow];}

- (UIView *)mapView:(GMSMapView *)mapView markerInfoContents:(GMSMarker *)marker {
  RNMGMSMarker *aMarker = (RNMGMSMarker *)marker;
  return [aMarker.fakeMarker markerInfoContents];
}

- (void)mapView:(GMSMapView *)mapView didTapInfoWindowOfMarker:(GMSMarker *)marker {
  RNMGMSMarker *aMarker = (RNMGMSMarker *)marker;
  [aMarker.fakeMarker didTapInfoWindowOfMarker:aMarker];
}

- (void)mapView:(GMSMapView *)mapView didBeginDraggingMarker:(GMSMarker *)marker {
  RNMGMSMarker *aMarker = (RNMGMSMarker *)marker;
  [aMarker.fakeMarker didBeginDraggingMarker:aMarker];
}

- (void)mapView:(GMSMapView *)mapView didEndDraggingMarker:(GMSMarker *)marker {
  RNMGMSMarker *aMarker = (RNMGMSMarker *)marker;
  [aMarker.fakeMarker didEndDraggingMarker:aMarker];
}

- (void)mapView:(GMSMapView *)mapView didDragMarker:(GMSMarker *)marker {
  RNMGMSMarker *aMarker = (RNMGMSMarker *)marker;
  [aMarker.fakeMarker didDragMarker:aMarker];
}

- (void)mapView:(GMSMapView *)mapView
    didTapPOIWithPlaceID:(NSString *)placeID
                    name:(NSString *)name
                location:(CLLocationCoordinate2D)location {
    RNMGoogleMap *googleMapView = (RNMGoogleMap *)mapView;
    [googleMapView didTapPOIWithPlaceID:placeID name:name location:location];
}

#pragma mark Gesture Recognizer Handlers

- (void)handleMapDrag:(UIPanGestureRecognizer*)recognizer {
  RNMGoogleMap *map = (RNMGoogleMap *)recognizer.view;
  if (!map.onPanDrag) return;

  CGPoint touchPoint = [recognizer locationInView:map];
  CLLocationCoordinate2D coord = [map.projection coordinateForPoint:touchPoint];
  map.onPanDrag(@{
                  @"coordinate": @{
                      @"latitude": @(coord.latitude),
                      @"longitude": @(coord.longitude),
                      },
                  @"position": @{
                      @"x": @(touchPoint.x),
                      @"y": @(touchPoint.y),
                      },
                  });

}

@end

#endif
