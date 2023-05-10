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

RCT_EXPORT_VIEW_PROPERTY(boundary, GMSCoordinateBounds*)
RCT_EXPORT_VIEW_PROPERTY(customMapStyleString, NSString)
RCT_EXPORT_VIEW_PROPERTY(indoorActiveLevelIndex, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(initialCamera, GMSCameraPosition)
RCT_EXPORT_VIEW_PROPERTY(initialRegion, MKCoordinateRegion)
RCT_EXPORT_VIEW_PROPERTY(isAccessibilityElement, BOOL)
RCT_EXPORT_VIEW_PROPERTY(kmlSrc, NSString)
RCT_EXPORT_VIEW_PROPERTY(mapPadding, UIEdgeInsets)
RCT_EXPORT_VIEW_PROPERTY(mapType, GMSMapViewType)
RCT_EXPORT_VIEW_PROPERTY(maxZoomLevel, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(minZoomLevel, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onIndoorBuildingFocused, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onIndoorLevelActivated, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKmlReady, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLongPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMapReady, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMarkerPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPanDrag, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPoiClick, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRegionChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRegionChangeComplete, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onTilesRendered, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onUserLocationChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(pitchEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(region, MKCoordinateRegion)
RCT_EXPORT_VIEW_PROPERTY(rotateEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(scrollDuringRotateOrZoomEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(scrollEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsBuildings, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsCompass, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsIndoorLevelPicker, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsIndoors, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsMyLocationButton, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsTraffic, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsUserLocation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zoomTapEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(camera, cameraProp, GMSCameraPosition)
RCT_REMAP_VIEW_PROPERTY(paddingAdjustmentBehavior, paddingAdjustmentBehaviorString, NSString)
RCT_REMAP_VIEW_PROPERTY(testID, accessibilityIdentifier, NSString)

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
