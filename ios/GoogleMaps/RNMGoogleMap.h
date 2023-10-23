//
//  RNMGoogleMap.h
//  RNMaps
//
//  Created by Gil Birman on 9/1/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>
#import <React/RCTBridge.h>
#import <GoogleMaps/GoogleMaps.h>
#import <MapKit/MapKit.h>
#import "RNMGMSMarker.h"
#import "RCTConvert+RNMMap.h"

@interface RNMGoogleMap : GMSMapView

// TODO: don't use MK region?
@property (nonatomic, assign) BOOL pitchEnabled;
@property (nonatomic, assign) BOOL rotateEnabled;
@property (nonatomic, assign) BOOL scrollDuringRotateOrZoomEnabled;
@property (nonatomic, assign) BOOL scrollEnabled;
@property (nonatomic, assign) BOOL showsBuildings;
@property (nonatomic, assign) BOOL showsCompass;
@property (nonatomic, assign) BOOL showsIndoorLevelPicker;
@property (nonatomic, assign) BOOL showsIndoors;
@property (nonatomic, assign) BOOL showsMyLocationButton;
@property (nonatomic, assign) BOOL showsTraffic;
@property (nonatomic, assign) BOOL showsUserLocation;
@property (nonatomic, assign) BOOL zoomEnabled;
@property (nonatomic, assign) BOOL zoomTapEnabled;
@property (nonatomic, assign) GMSCameraPosition *cameraProp;   // Because the base class already has a "camera" prop.
@property (nonatomic, assign) MKCoordinateRegion initialRegion;
@property (nonatomic, assign) MKCoordinateRegion region;
@property (nonatomic, assign) NSString *customMapStyleString;
@property (nonatomic, assign) NSString *kmlSrc;
@property (nonatomic, assign) NSString *paddingAdjustmentBehaviorString;
@property (nonatomic, assign) UIEdgeInsets mapPadding;
@property (nonatomic, copy) RCTBubblingEventBlock onChange;
@property (nonatomic, copy) RCTBubblingEventBlock onKmlReady;
@property (nonatomic, copy) RCTBubblingEventBlock onLongPress;
@property (nonatomic, copy) RCTBubblingEventBlock onMapReady;
@property (nonatomic, copy) RCTBubblingEventBlock onMarkerPress;
@property (nonatomic, copy) RCTBubblingEventBlock onPanDrag;
@property (nonatomic, copy) RCTBubblingEventBlock onPoiClick;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@property (nonatomic, copy) RCTBubblingEventBlock onTilesRendered;
@property (nonatomic, copy) RCTBubblingEventBlock onUserLocationChange;
@property (nonatomic, copy) RCTDirectEventBlock onIndoorBuildingFocused;
@property (nonatomic, copy) RCTDirectEventBlock onIndoorLevelActivated;
@property (nonatomic, copy) RCTDirectEventBlock onRegionChange;
@property (nonatomic, copy) RCTDirectEventBlock onRegionChangeComplete;
@property (nonatomic, strong) GMSCameraPosition *initialCamera;
@property (nonatomic, strong) NSMutableArray *circles;
@property (nonatomic, strong) NSMutableArray *heatmaps;
@property (nonatomic, strong) NSMutableArray *markers;
@property (nonatomic, strong) NSMutableArray *overlays;
@property (nonatomic, strong) NSMutableArray *polygons;
@property (nonatomic, strong) NSMutableArray *polylines;
@property (nonatomic, strong) NSMutableArray *tiles;
@property (nonatomic, weak) RCTBridge *bridge;

- (BOOL)didTapMarker:(GMSMarker *)marker;
- (NSArray *)getMapBoundaries;
- (void)didChangeCameraPosition:(GMSCameraPosition *)position isGesture:(BOOL)isGesture;
- (void)didLongPressAtCoordinate:(CLLocationCoordinate2D)coordinate;
- (void)didPrepareMap;
- (void)didTapAtCoordinate:(CLLocationCoordinate2D)coordinate;
- (void)didTapPOIWithPlaceID:(NSString *)placeID name:(NSString *) name location:(CLLocationCoordinate2D) location;
- (void)didTapPolygon:(GMSPolygon *)polygon;
- (void)didTapPolyline:(GMSPolyline *)polyline;
- (void)idleAtCameraPosition:(GMSCameraPosition *)position isGesture:(BOOL)isGesture;
- (void)mapViewDidFinishTileRendering;

+ (MKCoordinateRegion)makeGMSCameraPositionFromMap:(GMSMapView *)map andGMSCameraPosition:(GMSCameraPosition *)position;
+ (GMSCameraPosition*)makeGMSCameraPositionFromMap:(GMSMapView *)map andMKCoordinateRegion:(MKCoordinateRegion)region;

- (NSDictionary*) getMarkersFramesWithOnlyVisible:(BOOL)onlyVisible;

@end

#endif
