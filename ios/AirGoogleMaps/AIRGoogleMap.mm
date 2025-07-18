//
//  AIRGoogleMap.m
//  AirMaps
//
//  Created by Gil Birman on 9/1/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import "AIRGoogleMap.h"
#import "AIRGoogleMapMarker.h"
#import "AIRGoogleMapMarkerManager.h"
#import "AIRGoogleMapPolygon.h"
#import "AIRGoogleMapPolyline.h"
#import "AIRGoogleMapCircle.h"
#import "AIRGoogleMapHeatmap.h"
#import "AIRGoogleMapUrlTile.h"
#import "AIRGoogleMapWMSTile.h"
#import "AIRGoogleMapOverlay.h"
#import "AIRGoogleMapCoordinate.h"
#import <GoogleMaps/GoogleMaps.h>
#import <MapKit/MapKit.h>
#import <React/UIView+React.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <objc/runtime.h>


#ifdef HAVE_GOOGLE_MAPS_UTILS
#import "GMUKMLParser.h"
#import "GMUPlacemark.h"
#import "GMUPoint.h"
#import "GMUGeometryRenderer.h"
#define REQUIRES_GOOGLE_MAPS_UTILS(feature) do {} while (0)
#else
#define GMUKMLParser void
#define GMUPlacemark void
#define REQUIRES_GOOGLE_MAPS_UTILS(feature) do { \
 [NSException raise:@"ReactNativeMapsDependencyMissing" \
             format:@"Use of " feature "requires Google-Maps-iOS-Utils, you  must install via CocoaPods to use this feature"]; \
} while (0)
#endif


id regionAsJSON(MKCoordinateRegion region) {
  return @{
           @"latitude": [NSNumber numberWithDouble:region.center.latitude],
           @"longitude": [NSNumber numberWithDouble:region.center.longitude],
           @"latitudeDelta": [NSNumber numberWithDouble:region.span.latitudeDelta],
           @"longitudeDelta": [NSNumber numberWithDouble:region.span.longitudeDelta],
           };
}
#if __has_include(<ReactNativeMaps/generated/RNMapsAirModuleDelegate.h>)
#import <ReactNativeMaps/generated/RNMapsAirModuleDelegate.h>
#else
#import "RNMapsAirModuleDelegate.h"
#endif
@interface AIRGoogleMap () <GMSIndoorDisplayDelegate, RNMapsAirModuleDelegate>

- (id)eventFromCoordinate:(CLLocationCoordinate2D)coordinate;

@property (nonatomic, strong) NSMutableDictionary<NSNumber *, NSDictionary*> *origGestureRecognizersMeta;

@end

@implementation AIRGoogleMap
{
  NSMutableArray<UIView *> *_reactSubviews;
  MKCoordinateRegion _initialRegion;
  MKCoordinateRegion _region;
  BOOL _initialRegionSet;
  BOOL _initialCameraSet;
  BOOL _didLayoutSubviews;
  BOOL _didPrepareMap;
  BOOL _didCallOnMapReady;
  BOOL _zoomTapEnabled;
  BOOL _isAnimating;
  NSString* _googleMapId;
}

- (instancetype)initWithMapId:(NSString *)mapId initialCamera:(GMSCameraPosition*) camera backgroundColor:(UIColor *) backgroundColor andZoomTapEnabled:(BOOL)zoomTapEnabled
{
    GMSMapViewOptions* options = [[GMSMapViewOptions alloc] init];

    if (mapId){
        GMSMapID *mapID = [GMSMapID mapIDWithIdentifier:mapId];
        [options setMapID:mapID];
    }
    if (backgroundColor){
        [options setBackgroundColor:backgroundColor];
    }
    if (camera){
        [options setCamera:camera];
    }
    self = [super initWithOptions:options];

    if (self) {
    _reactSubviews = [NSMutableArray new];
    _markers = [NSMutableArray array];
    _polygons = [NSMutableArray array];
    _polylines = [NSMutableArray array];
    _circles = [NSMutableArray array];
    _heatmaps = [NSMutableArray array];
    _tiles = [NSMutableArray array];
    _overlays = [NSMutableArray array];
    _initialCamera = nil;
    _initialRegion = MKCoordinateRegionMake(CLLocationCoordinate2DMake(0.0, 0.0), MKCoordinateSpanMake(0.0, 0.0));
    _region = MKCoordinateRegionMake(CLLocationCoordinate2DMake(0.0, 0.0), MKCoordinateSpanMake(0.0, 0.0));
    _initialRegionSet = false;
    _initialCameraSet = false;
    _didLayoutSubviews = false;
    _didPrepareMap = false;
    _didCallOnMapReady = false;
    _zoomTapEnabled = zoomTapEnabled;

    // Listen to the myLocation property of GMSMapView.
    [self addObserver:self
           forKeyPath:@"myLocation"
              options:NSKeyValueObservingOptionNew
              context:NULL];

    self.origGestureRecognizersMeta = [[NSMutableDictionary alloc] init];

    self.indoorDisplay.delegate = self;
  }
  return self;
}

- (instancetype) init {
  return [self initWithMapId:nil initialCamera:nil backgroundColor:nil andZoomTapEnabled:YES];
}

- (void)dealloc {
  [self removeObserver:self
            forKeyPath:@"myLocation"
               context:NULL];
}

- (id)eventFromCoordinate:(CLLocationCoordinate2D)coordinate {

  CGPoint touchPoint = [self.projection pointForCoordinate:coordinate];

  return @{
           @"coordinate": @{
               @"latitude": @(coordinate.latitude),
               @"longitude": @(coordinate.longitude),
               },
           @"position": @{
               @"x": @(touchPoint.x),
               @"y": @(touchPoint.y),
               },
           };
}

- (BOOL) isReady {
    return _didPrepareMap;
}

-(void) fitToCoordinates:(NSArray<AIRGoogleMapCoordinate *> *) coordinates withEdgePadding:(NSDictionary*) edgePadding animated:(BOOL)animated
{
    CLLocationCoordinate2D myLocation = coordinates.firstObject.coordinate;
         GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithCoordinate:myLocation coordinate:myLocation];

         for (AIRGoogleMapCoordinate *coordinate in coordinates)
           bounds = [bounds includingCoordinate:coordinate.coordinate];

         // Set Map viewport
         CGFloat top = [RCTConvert CGFloat:edgePadding[@"top"]];
         CGFloat right = [RCTConvert CGFloat:edgePadding[@"right"]];
         CGFloat bottom = [RCTConvert CGFloat:edgePadding[@"bottom"]];
         CGFloat left = [RCTConvert CGFloat:edgePadding[@"left"]];

         GMSCameraUpdate *cameraUpdate = [GMSCameraUpdate fitBounds:bounds withEdgeInsets:UIEdgeInsetsMake(top, left, bottom, right)];

         if (animated) {
           [self animateWithCameraUpdate: cameraUpdate];
         } else {
           [self moveCamera: cameraUpdate];
         }
}

-(void) fitToElementsWithEdgePadding:(nonnull NSDictionary *)edgePadding
             animated:(BOOL)animated
{
    CLLocationCoordinate2D myLocation = ((AIRGoogleMapMarker *)(self.markers.firstObject)).realMarker.position;
    GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithCoordinate:myLocation coordinate:myLocation];

    for (AIRGoogleMapMarker *marker in self.markers)
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
      [self animateWithCameraUpdate: cameraUpdate];
    } else {
      [self moveCamera: cameraUpdate];
    }
}

- (void) fitToSuppliedMarkers:(NSArray*) markers withEdgePadding:(NSDictionary*) edgePadding animated:(BOOL)animated
{
    NSPredicate *filterMarkers = [NSPredicate predicateWithBlock:^BOOL(id evaluatedObject, NSDictionary *bindings) {
      AIRGoogleMapMarker *marker = (AIRGoogleMapMarker *)evaluatedObject;
      return [marker isKindOfClass:[AIRGoogleMapMarker class]] && [markers containsObject:marker.identifier];
    }];

    NSArray *filteredMarkers = [self.markers filteredArrayUsingPredicate:filterMarkers];

    CLLocationCoordinate2D myLocation = ((AIRGoogleMapMarker *)(filteredMarkers.firstObject)).realMarker.position;
    GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithCoordinate:myLocation coordinate:myLocation];

    for (AIRGoogleMapMarker *marker in filteredMarkers)
      bounds = [bounds includingCoordinate:marker.realMarker.position];

    // Set Map viewport
    CGFloat top = [RCTConvert CGFloat:edgePadding[@"top"]];
    CGFloat right = [RCTConvert CGFloat:edgePadding[@"right"]];
    CGFloat bottom = [RCTConvert CGFloat:edgePadding[@"bottom"]];
    CGFloat left = [RCTConvert CGFloat:edgePadding[@"left"]];

    GMSCameraUpdate* cameraUpdate = [GMSCameraUpdate fitBounds:bounds withEdgeInsets:UIEdgeInsetsMake(top, left, bottom, right)];
    if (animated) {
      [self animateWithCameraUpdate:cameraUpdate
       ];
    } else {
      [self moveCamera: cameraUpdate];
    }
}

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (void)insertReactSubview:(id<RCTComponent>)subview atIndex:(NSInteger)atIndex {
  // Our desired API is to pass up markers/overlays as children to the mapview component.
  // This is where we intercept them and do the appropriate underlying mapview action.
  if ([subview isKindOfClass:[AIRGoogleMapMarker class]]) {
    AIRGoogleMapMarker *marker = (AIRGoogleMapMarker*)subview;
    [marker didInsertInMap:self];
    [self.markers addObject:marker];
  } else if ([subview isKindOfClass:[AIRGoogleMapPolygon class]]) {
    AIRGoogleMapPolygon *polygon = (AIRGoogleMapPolygon*)subview;
    [polygon didInsertInMap:self];
    [self.polygons addObject:polygon];

  } else if ([NSStringFromClass([subview class]) isEqualToString:@"RNMapsGooglePolygonView"]){
//      RNMapsGooglePolygonView *polygon = (RNMapsGooglePolygonView*)subview;
//      [polygon didInsertInMap:self];
      [self.polygons addObject:subview];
  } else if ([subview isKindOfClass:[AIRGoogleMapPolyline class]]) {
    AIRGoogleMapPolyline *polyline = (AIRGoogleMapPolyline*)subview;
    polyline.polyline.map = self;
    [self.polylines addObject:polyline];
  } else if ([subview isKindOfClass:[AIRGoogleMapCircle class]]) {
    AIRGoogleMapCircle *circle = (AIRGoogleMapCircle*)subview;
    circle.circle.map = self;
    [self.circles addObject:circle];
  } else if ([subview isKindOfClass:[AIRGoogleMapUrlTile class]]) {
    AIRGoogleMapUrlTile *tile = (AIRGoogleMapUrlTile*)subview;
    tile.tileLayer.map = self;
    [self.tiles addObject:tile];
  } else if ([subview isKindOfClass:[AIRGoogleMapWMSTile class]]) {
    AIRGoogleMapWMSTile *tile = (AIRGoogleMapWMSTile*)subview;
    tile.tileLayer.map = self;
    [self.tiles addObject:tile];
  } else if ([subview isKindOfClass:[AIRGoogleMapOverlay class]]) {
    AIRGoogleMapOverlay *overlay = (AIRGoogleMapOverlay*)subview;
    overlay.overlay.map = self;
    [self.overlays addObject:overlay];
  } else if ([subview isKindOfClass:[AIRGoogleMapHeatmap class]]){
    AIRGoogleMapHeatmap *heatmap = (AIRGoogleMapHeatmap*)subview;
    heatmap.heatmap.map = self;
    [self.heatmaps addObject:heatmap];
  } else {
    NSArray<id<RCTComponent>> *childSubviews = [subview reactSubviews];
    for (int i = 0; i < childSubviews.count; i++) {
      [self insertReactSubview:(UIView *)childSubviews[i] atIndex:atIndex];
    }
  }
  [_reactSubviews insertObject:(UIView *)subview atIndex:(NSUInteger) atIndex];
}
#pragma clang diagnostic pop


#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (void)removeReactSubview:(id<RCTComponent>)subview {
  // similarly, when the children are being removed we have to do the appropriate
  // underlying mapview action here.
  if ([subview isKindOfClass:[AIRGoogleMapMarker class]]) {
    AIRGoogleMapMarker *marker = (AIRGoogleMapMarker*)subview;
    marker.realMarker.map = nil;
    [self.markers removeObject:marker];
  } else if ([NSStringFromClass([subview class]) isEqualToString:@"RNMapsGooglePolygonView"]) {
      [self.polygons removeObject:subview];
   } else if ([subview isKindOfClass:[AIRGoogleMapPolygon class]]) {
    AIRGoogleMapPolygon *polygon = (AIRGoogleMapPolygon*)subview;
    polygon.polygon.map = nil;
    [self.polygons removeObject:polygon];
  } else if ([subview isKindOfClass:[AIRGoogleMapPolyline class]]) {
    AIRGoogleMapPolyline *polyline = (AIRGoogleMapPolyline*)subview;
    polyline.polyline.map = nil;
    [self.polylines removeObject:polyline];
  } else if ([subview isKindOfClass:[AIRGoogleMapCircle class]]) {
    AIRGoogleMapCircle *circle = (AIRGoogleMapCircle*)subview;
    circle.circle.map = nil;
    [self.circles removeObject:circle];
  } else if ([subview isKindOfClass:[AIRGoogleMapUrlTile class]]) {
    AIRGoogleMapUrlTile *tile = (AIRGoogleMapUrlTile*)subview;
    tile.tileLayer.map = nil;
    [self.tiles removeObject:tile];
  } else if ([subview isKindOfClass:[AIRGoogleMapWMSTile class]]) {
    AIRGoogleMapWMSTile *tile = (AIRGoogleMapWMSTile*)subview;
    tile.tileLayer.map = nil;
    [self.tiles removeObject:tile];
  } else if ([subview isKindOfClass:[AIRGoogleMapOverlay class]]) {
    AIRGoogleMapOverlay *overlay = (AIRGoogleMapOverlay*)subview;
    overlay.overlay.map = nil;
    [self.overlays removeObject:overlay];
  } else if ([subview isKindOfClass:[AIRGoogleMapHeatmap class]]){
    AIRGoogleMapHeatmap *heatmap = (AIRGoogleMapHeatmap*)subview;
    heatmap.heatmap.map = nil;
    [self.heatmaps removeObject:heatmap];
  } else {
    NSArray<id<RCTComponent>> *childSubviews = [subview reactSubviews];
    for (int i = 0; i < childSubviews.count; i++) {
      [self removeReactSubview:(UIView *)childSubviews[i]];
    }
  }
  [_reactSubviews removeObject:(UIView *)subview];
}
#pragma clang diagnostic pop

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (NSArray<id<RCTComponent>> *)reactSubviews {
  return _reactSubviews;
}
#pragma clang diagnostic pop

- (NSDictionary *)getMapBoundaries
{
    GMSVisibleRegion visibleRegion = self.projection.visibleRegion;
    GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithRegion:visibleRegion];

    CLLocationCoordinate2D northEast = bounds.northEast;
    CLLocationCoordinate2D southWest = bounds.southWest;

    return @{
        @"northEast": @{
            @"latitude": [NSNumber numberWithDouble:northEast.latitude],
            @"longitude": [NSNumber numberWithDouble:northEast.longitude],
                },
        @"southWest": @{
            @"latitude": [NSNumber numberWithDouble:southWest.latitude],
            @"longitude": [NSNumber numberWithDouble:southWest.longitude],
            },
    };
}

- (NSDictionary *) getCameraDic {
    GMSCameraPosition *camera = [self camera];
    return @{
        @"center": @{
                @"latitude": @(camera.target.latitude),
                @"longitude": @(camera.target.longitude),
                },
        @"pitch": @(camera.viewingAngle),
        @"heading": @(camera.bearing),
        @"zoom": @(camera.zoom),
    };
}

- (void)layoutSubviews {
  [super layoutSubviews];
  if(_didLayoutSubviews) return;
  _didLayoutSubviews = true;

  if (_initialCamera != nil) {
    self.camera = _initialCamera;
    _initialCameraSet = true;
  }
  else if (_initialRegion.span.latitudeDelta != 0.0 &&
      _initialRegion.span.longitudeDelta != 0.0) {
    self.camera = [AIRGoogleMap makeGMSCameraPositionFromMap:self andMKCoordinateRegion:_initialRegion];
    _initialRegionSet = true;
  } else if (_region.span.latitudeDelta != 0.0 &&
      _region.span.longitudeDelta != 0.0) {
    self.camera = [AIRGoogleMap makeGMSCameraPositionFromMap:self andMKCoordinateRegion:_region];
  }
}

- (void)setInitialRegion:(MKCoordinateRegion)initialRegion {
  _initialRegion = initialRegion;
  if(!_initialRegionSet && _didLayoutSubviews){
    self.camera = [AIRGoogleMap makeGMSCameraPositionFromMap:self andMKCoordinateRegion:initialRegion];
    _initialRegionSet = true;
  }
}

- (void)setInitialCamera:(GMSCameraPosition*)initialCamera {
    _initialCamera = initialCamera;
    if(!_initialCameraSet && _didLayoutSubviews){
      self.camera = initialCamera;
      _initialCameraSet = true;
    }
}

- (void)setRegion:(MKCoordinateRegion)region {
    if (_isAnimating || !CLLocationCoordinate2DIsValid(region.center)) return;
  _region = region;
  if(_didLayoutSubviews) {
    self.camera = [AIRGoogleMap makeGMSCameraPositionFromMap:self  andMKCoordinateRegion:region];
  }
}

- (void) setGoogleMapId:(NSString *) googleMapId {
    _googleMapId = googleMapId;
}

- (GMSCameraPosition *)cameraProp {
    if(_didLayoutSubviews) {
      return self.camera;
    } else {
      return _initialCamera;
    }
}

- (void)setCameraProp:(GMSCameraPosition*)camera {
    if (_isAnimating || !CLLocationCoordinate2DIsValid([camera target])) return;
    _initialCamera = camera;
    if(_didLayoutSubviews) {
      self.camera = camera;
    }
}

- (void)setOnMapReady:(RCTBubblingEventBlock)onMapReady {
    _onMapReady = onMapReady;
    if(!_didCallOnMapReady && _didPrepareMap) {
      self.onMapReady(@{});
      _didCallOnMapReady = true;
    }
}

- (void)didPrepareMap {
    if (!_didPrepareMap){
        [self overrideGestureRecognizersForView];
    }

  if (!_didCallOnMapReady && self.onMapReady) {
    self.onMapReady(@{});
    _didCallOnMapReady = true;
  }
  _didPrepareMap = true;
}

- (void)mapViewDidFinishTileRendering {
  if (self.onMapLoaded) self.onMapLoaded(@{});
}

- (BOOL)didTapMarker:(GMSMarker *)marker {
  AIRGMSMarker *airMarker = (AIRGMSMarker *)marker;

  id event = @{@"action": @"marker-press",
               @"id": airMarker.identifier ?: @"unknown",
               @"coordinate": @{
                   @"latitude": @(airMarker.position.latitude),
                   @"longitude": @(airMarker.position.longitude)
                   }
               };

  if (airMarker.onPress) airMarker.onPress(event);
  if (self.onMarkerPress) self.onMarkerPress(event);

  // TODO: not sure why this is necessary
  [self setSelectedMarker:marker];

  return NO;
}

- (void)didTapPolyline:(GMSOverlay *)polyline {
  AIRGMSPolyline *airPolyline = (AIRGMSPolyline *)polyline;

  id event = @{@"action": @"polyline-press",
               @"id": airPolyline.identifier ?: @"unknown",
               };

   if (airPolyline.onPress) airPolyline.onPress(event);
}

- (void)didTapPolygon:(GMSOverlay *)polygon {
    AIRGMSPolygon *airPolygon = (AIRGMSPolygon *)polygon;

    id event = @{@"action": @"polygon-press",
                 @"id": airPolygon.identifier ?: @"unknown",
                 };

    if (airPolygon.onPress) airPolygon.onPress(event);
}

- (void)didTapAtCoordinate:(CLLocationCoordinate2D)coordinate {
  if (!self.onPress) return;
  self.onPress([self eventFromCoordinate:coordinate]);
}

- (void)didLongPressAtCoordinate:(CLLocationCoordinate2D)coordinate {
  if (!self.onLongPress) return;
  self.onLongPress([self eventFromCoordinate:coordinate]);
}

- (void)willMove:(BOOL)gesture {
    _isAnimating = YES;
    GMSCameraPosition *position = self.camera;
    id event = @{@"region": regionAsJSON([AIRGoogleMap makeGMSCameraPositionFromMap:self andGMSCameraPosition:position]),
                 @"isGesture": [NSNumber numberWithBool:gesture],
    };
    if (self.onRegionChangeStart) self.onRegionChangeStart(event);
}

- (void)didChangeCameraPosition:(GMSCameraPosition *)position isGesture:(BOOL)isGesture{
    id event = @{@"region": regionAsJSON([AIRGoogleMap makeGMSCameraPositionFromMap:self andGMSCameraPosition:position]),
                 @"isGesture": [NSNumber numberWithBool:isGesture],
    };
    
    if (self.onRegionChange) self.onRegionChange(event);
}

- (void)didTapPOIWithPlaceID:(NSString *)placeID
                        name:(NSString *)name
                    location:(CLLocationCoordinate2D)location {
  id event = @{@"placeId": placeID,
               @"name": name,
               @"coordinate": @{
                   @"latitude": @(location.latitude),
                   @"longitude": @(location.longitude)
                   }
               };

  if (self.onPoiClick) self.onPoiClick(event);
}

- (void)idleAtCameraPosition:(GMSCameraPosition *)position  isGesture:(BOOL)isGesture{
  id event = @{@"region": regionAsJSON([AIRGoogleMap makeGMSCameraPositionFromMap:self andGMSCameraPosition:position]),
                              @"isGesture": [NSNumber numberWithBool:isGesture],
                              };
    if (self.onRegionChangeComplete) self.onRegionChangeComplete(event);  // complete
    _isAnimating = NO;
}

- (void)setMapPadding:(UIEdgeInsets)mapPadding {
  self.padding = mapPadding;
}

- (UIEdgeInsets)mapPadding {
  return self.padding;
}

- (void)setPaddingAdjustmentBehaviorString:(NSString *)str
{
  if ([str isEqualToString:@"never"])
  {
    self.paddingAdjustmentBehavior = kGMSMapViewPaddingAdjustmentBehaviorNever;
  }
  else if ([str isEqualToString:@"automatic"])
  {
    self.paddingAdjustmentBehavior = kGMSMapViewPaddingAdjustmentBehaviorAutomatic;
  }
  else //if ([str isEqualToString:@"always"]) <-- default
  {
    self.paddingAdjustmentBehavior = kGMSMapViewPaddingAdjustmentBehaviorAlways;
  }
}

- (NSString *)paddingAdjustmentBehaviorString
{
  switch (self.paddingAdjustmentBehavior)
  {
    case kGMSMapViewPaddingAdjustmentBehaviorNever:
      return @"never";
    case kGMSMapViewPaddingAdjustmentBehaviorAutomatic:
      return @"automatic";
    case kGMSMapViewPaddingAdjustmentBehaviorAlways:
      return @"always";

    default:
      return @"unknown";
  }
}

- (void)setScrollEnabled:(BOOL)scrollEnabled {
  self.settings.scrollGestures = scrollEnabled;
}

- (BOOL)scrollEnabled {
  return self.settings.scrollGestures;
}

- (void)setZoomEnabled:(BOOL)zoomEnabled {
  self.settings.zoomGestures = zoomEnabled;
}

- (BOOL)zoomEnabled {
  return self.settings.zoomGestures;
}

- (void)setScrollDuringRotateOrZoomEnabled:(BOOL)enableScrollGesturesDuringRotateOrZoom {
  self.settings.allowScrollGesturesDuringRotateOrZoom = enableScrollGesturesDuringRotateOrZoom;
}

- (BOOL)scrollDuringRotateOrZoomEnabled {
  return self.settings.allowScrollGesturesDuringRotateOrZoom;
}

- (void)setZoomTapEnabled:(BOOL)zoomTapEnabled {
    _zoomTapEnabled = zoomTapEnabled;
}

- (BOOL)zoomTapEnabled {
    return _zoomTapEnabled;
}

- (void)setRotateEnabled:(BOOL)rotateEnabled {
  self.settings.rotateGestures = rotateEnabled;
}

- (BOOL)rotateEnabled {
  return self.settings.rotateGestures;
}

- (void)setPitchEnabled:(BOOL)pitchEnabled {
  self.settings.tiltGestures = pitchEnabled;
}

- (BOOL)pitchEnabled {
  return self.settings.tiltGestures;
}

- (void)setShowsTraffic:(BOOL)showsTraffic {
  self.trafficEnabled = showsTraffic;
}

- (BOOL)showsTraffic {
  return self.trafficEnabled;
}

- (void)setShowsBuildings:(BOOL)showsBuildings {
  self.buildingsEnabled = showsBuildings;
}

- (BOOL)showsBuildings {
  return self.buildingsEnabled;
}

- (void)setShowsCompass:(BOOL)showsCompass {
  self.settings.compassButton = showsCompass;
}

- (void)setCustomMapStyleString:(NSString *)customMapStyleString {
  NSError *error;

  GMSMapStyle *style = [GMSMapStyle styleWithJSONString:customMapStyleString error:&error];

  if (!style) {
    NSLog(@"The style definition could not be loaded: %@", error);
  }
    [self setMapStyle:style];
}

- (BOOL)showsCompass {
  return self.settings.compassButton;
}

- (void)setShowsUserLocation:(BOOL)showsUserLocation {
  self.myLocationEnabled = showsUserLocation;
}

- (BOOL)showsUserLocation {
  return self.myLocationEnabled;
}

- (void)setShowsMyLocationButton:(BOOL)showsMyLocationButton {
  self.settings.myLocationButton = showsMyLocationButton;
}

- (BOOL)showsMyLocationButton {
  return self.settings.myLocationButton;
}

- (void)setMinZoom:(CGFloat)minZoomLevel {
  [self setMinZoom:minZoomLevel maxZoom:self.maxZoom ];
}

- (void)setMaxZoom:(CGFloat)maxZoomLevel {
  [self setMinZoom:self.minZoom maxZoom:maxZoomLevel ];
}

- (void)setShowsIndoors:(BOOL)showsIndoors {
  self.indoorEnabled = showsIndoors;
}

- (BOOL)showsIndoors {
  return self.indoorEnabled;
}

- (void)setShowsIndoorLevelPicker:(BOOL)showsIndoorLevelPicker {
  self.settings.indoorPicker = showsIndoorLevelPicker;
}

- (BOOL)showsIndoorLevelPicker {
  return self.settings.indoorPicker;
}

-(void)setSelectedMarker:(AIRGMSMarker *)selectedMarker {
  if (selectedMarker == self.selectedMarker) {
    return;
  }
    AIRGMSMarker *airMarker = (AIRGMSMarker *) self.selectedMarker;
    AIRGoogleMapMarker *fakeAirMarker = (AIRGoogleMapMarker *) airMarker.fakeMarker;
    AIRGoogleMapMarker *fakeSelectedMarker = (AIRGoogleMapMarker *) selectedMarker.fakeMarker;

    if (airMarker && airMarker.onDeselect) {
        airMarker.onDeselect([fakeAirMarker makeEventData:@"marker-deselect"]);
    }

    if (airMarker && self.onMarkerDeselect) {
        self.onMarkerDeselect([fakeAirMarker makeEventData:@"marker-deselect"]);
    }

    if (selectedMarker && selectedMarker.onSelect) {
        selectedMarker.onSelect([fakeSelectedMarker makeEventData:@"marker-select"]);
    }

    if (selectedMarker && self.onMarkerSelect) {
        self.onMarkerSelect([fakeSelectedMarker makeEventData:@"marker-select"]);
    }

  [super setSelectedMarker:selectedMarker];
}

+ (MKCoordinateRegion) makeGMSCameraPositionFromMap:(GMSMapView *)map andGMSCameraPosition:(GMSCameraPosition *)position {
  // solution from here: http://stackoverflow.com/a/16587735/1102215
  GMSVisibleRegion visibleRegion = map.projection.visibleRegion;
  GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithRegion: visibleRegion];
  CLLocationCoordinate2D center;
  CLLocationDegrees longitudeDelta;
  CLLocationDegrees latitudeDelta = bounds.northEast.latitude - bounds.southWest.latitude;

  if(bounds.northEast.longitude >= bounds.southWest.longitude) {
    //Standard case
    center = CLLocationCoordinate2DMake((bounds.southWest.latitude + bounds.northEast.latitude) / 2,
                                        (bounds.southWest.longitude + bounds.northEast.longitude) / 2);
    longitudeDelta = bounds.northEast.longitude - bounds.southWest.longitude;
  } else {
    //Region spans the international dateline
    center = CLLocationCoordinate2DMake((bounds.southWest.latitude + bounds.northEast.latitude) / 2,
                                        (bounds.southWest.longitude + bounds.northEast.longitude + 360) / 2);
    longitudeDelta = bounds.northEast.longitude + 360 - bounds.southWest.longitude;
  }
  MKCoordinateSpan span = MKCoordinateSpanMake(latitudeDelta, longitudeDelta);
  return MKCoordinateRegionMake(center, span);
}

+ (GMSCameraPosition*) makeGMSCameraPositionFromMap:(GMSMapView *)map andMKCoordinateRegion:(MKCoordinateRegion)region {
  float latitudeDelta = region.span.latitudeDelta * 0.5;
  float longitudeDelta = region.span.longitudeDelta * 0.5;

  CLLocationCoordinate2D a = CLLocationCoordinate2DMake(region.center.latitude + latitudeDelta,
                                                        region.center.longitude + longitudeDelta);
  CLLocationCoordinate2D b = CLLocationCoordinate2DMake(region.center.latitude - latitudeDelta,
                                                        region.center.longitude - longitudeDelta);
  GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithCoordinate:a coordinate:b];
  return [map cameraForBounds:bounds insets:UIEdgeInsetsZero];
}

#pragma mark - RNMapsAirModuleDelegate

- (NSDictionary *) getCoordinatesForPoint:(CGPoint)point
{
    CLLocationCoordinate2D coordinate = [self.projection coordinateForPoint:point];
    return @{
              @"latitude": @(coordinate.latitude),
              @"longitude": @(coordinate.longitude),
    };
}

- (NSDictionary *) getPointForCoordinates:(CLLocationCoordinate2D)location
{
    CGPoint touchPoint = [self.projection pointForCoordinate:location];
    return @{
        @"x": @(touchPoint.x),
        @"y": @(touchPoint.y),
    };
}

-(void) takeSnapshotWithConfig:(NSDictionary *)config success:(RCTPromiseResolveBlock)success error:(RCTPromiseRejectBlock)error {
    /* unused
    NSNumber *width = [config objectForKey:@"width"];
    NSNumber *height = [config objectForKey:@"height"];
    */
    NSNumber *quality = [config objectForKey:@"quality"];

    NSString *format = [config objectForKey:@"format"];
    NSString *result = [config objectForKey:@"result"];
    NSTimeInterval timeStamp = [[NSDate date] timeIntervalSince1970];
    NSString *pathComponent = [NSString stringWithFormat:@"Documents/snapshot-%.20lf.%@", timeStamp, format];
    NSString *filePath = [NSHomeDirectory() stringByAppendingPathComponent: pathComponent];

    // TODO: currently we are ignoring width, height, region

    UIGraphicsBeginImageContextWithOptions(self.frame.size, YES, 0.0f);
    [self.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();

    NSData *data;
    if ([format isEqualToString:@"png"]) {
        data = UIImagePNGRepresentation(image);

    } else if([format isEqualToString:@"jpg"]) {
          data = UIImageJPEGRepresentation(image, quality.floatValue);
    }

    if ([result isEqualToString:@"file"]) {
        [data writeToFile:filePath atomically:YES];
        success(filePath);
    } else if ([result isEqualToString:@"base64"]) {
        success([data base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithCarriageReturn]);
    }

  UIGraphicsEndImageContext();
}

#pragma mark - Utils

- (CGRect) frameForMarker:(AIRGoogleMapMarker*) mrkView {
    CGPoint mrkAnchor = mrkView.realMarker.groundAnchor;
    CGPoint mrkPoint = [self.projection pointForCoordinate:mrkView.coordinate];
    CGSize mrkSize = mrkView.realMarker.iconView ? mrkView.realMarker.iconView.bounds.size : CGSizeMake(20, 30);
    CGRect mrkFrame = CGRectMake(mrkPoint.x, mrkPoint.y, mrkSize.width, mrkSize.height);
    mrkFrame.origin.y -= mrkAnchor.y * mrkSize.height;
    mrkFrame.origin.x -= mrkAnchor.x * mrkSize.width;
    return mrkFrame;
}

- (NSDictionary*) getMarkersFramesWithOnlyVisible:(BOOL)onlyVisible {
    NSMutableDictionary* markersFrames = [NSMutableDictionary new];
    for (AIRGoogleMapMarker* mrkView in self.markers) {
        CGRect frame = [self frameForMarker:mrkView];
        CGPoint point = [self.projection pointForCoordinate:mrkView.coordinate];
        NSDictionary* frameDict = @{
                                    @"x": @(frame.origin.x),
                                    @"y": @(frame.origin.y),
                                    @"width": @(frame.size.width),
                                    @"height": @(frame.size.height)
                                    };
        NSDictionary* pointDict = @{
                                    @"x": @(point.x),
                                    @"y": @(point.y)
                                    };
        NSString* k = mrkView.identifier;
        BOOL isVisible = CGRectIntersectsRect(self.bounds, frame);
        if (k != nil && (!onlyVisible || isVisible)) {
            [markersFrames setObject:@{ @"frame": frameDict, @"point": pointDict } forKey:k];
        }
    }
    return markersFrames;
}

- (AIRGoogleMapMarker*) markerAtPoint:(CGPoint)point {
    AIRGoogleMapMarker* mrk = nil;
    for (AIRGoogleMapMarker* mrkView in self.markers) {
        CGRect frame = [self frameForMarker:mrkView];
        if (CGRectContainsPoint(frame, point)) {
            mrk = mrkView;
            break;
        }
    }
    return mrk;
}

-(SEL)getActionForTarget:(NSObject*)target {
    SEL action = nil;
    uint32_t ivarCount;
    Ivar *ivars = class_copyIvarList([target class], &ivarCount);
    if (ivars) {
        for (uint32_t i = 0 ; i < ivarCount ; i++) {
            Ivar ivar = ivars[i];
            const char* type = ivar_getTypeEncoding(ivar);
            const char* ivarName = ivar_getName(ivar);
            NSString* name = [NSString stringWithCString: ivarName encoding: NSASCIIStringEncoding];
            if (type[0] == ':' && [name isEqualToString:@"_action"]) {
                SEL sel = ((SEL (*)(id, Ivar))object_getIvar)(target, ivar);
                action = sel;
                break;
            }
        }
    }
    free(ivars);
    return action;
}

#pragma mark - Overrides for Callout behavior

-(void)overrideGestureRecognizersForView {
    NSArray* grs = self.gestureRecognizers;
    for (UIGestureRecognizer* gestureRecognizer in grs) {
        NSNumber* grHash = [NSNumber numberWithUnsignedInteger:gestureRecognizer.hash];
        if([self.origGestureRecognizersMeta objectForKey:grHash] != nil)
            continue; //already patched

        //get original handlers
        NSArray* origTargets = [gestureRecognizer valueForKey:@"targets"];
        NSMutableArray* origTargetsActions = [[NSMutableArray alloc] init];
        BOOL isZoomTapGesture = NO;
        for (NSObject* trg in origTargets) {
            NSObject* target = [trg valueForKey:@"target"];
            SEL action = [self getActionForTarget:trg];
            isZoomTapGesture = [NSStringFromSelector(action) isEqualToString:@"handleZoomTapGesture:"];
            [origTargetsActions addObject:@{
                                            @"target": [NSValue valueWithNonretainedObject:target],
                                            @"action": NSStringFromSelector(action)
                                            }];
        }
        if (isZoomTapGesture && self.zoomTapEnabled == NO) {
            [self removeGestureRecognizer:gestureRecognizer];
            continue;
        }

        //replace with extendedMapGestureHandler
        for (NSDictionary* origTargetAction in origTargetsActions) {
            NSValue* targetValue = [origTargetAction objectForKey:@"target"];
            NSObject* target = [targetValue nonretainedObjectValue];
            NSString* actionString = [origTargetAction objectForKey:@"action"];
            SEL action = NSSelectorFromString(actionString);
            [gestureRecognizer removeTarget:target action:action];
        }
        [gestureRecognizer addTarget:self action:@selector(extendedMapGestureHandler:)];

        [self.origGestureRecognizersMeta setObject:@{@"targets": origTargetsActions}
                                            forKey:grHash];
    }
}

- (id)extendedMapGestureHandler:(UIGestureRecognizer*)gestureRecognizer {
    NSNumber* grHash = [NSNumber numberWithUnsignedInteger:gestureRecognizer.hash];
    UIWindow* win = [[[UIApplication sharedApplication] windows] firstObject];
    NSObject* bubbleProvider = [self valueForKey:@"bubbleProvider"]; //GMSbubbleEntityProvider
    CGRect bubbleAbsoluteFrame = [bubbleProvider accessibilityFrame];
    CGRect bubbleFrame = [win convertRect:bubbleAbsoluteFrame toView:self];
    UIView* bubbleView = [bubbleProvider valueForKey:@"view"];

    BOOL performOriginalActions = YES;
    BOOL isTap = [gestureRecognizer isKindOfClass:[UITapGestureRecognizer class]] || [gestureRecognizer isMemberOfClass:[UITapGestureRecognizer class]];
    if (isTap) {
        BOOL isTapInsideBubble = NO;
        CGPoint tapPoint = CGPointZero;
        CGPoint tapPointInBubble = CGPointZero;

        NSArray* touches = [gestureRecognizer valueForKey:@"touches"];
        UITouch* oneTouch = [touches firstObject];
        NSArray* delayedTouches = [gestureRecognizer valueForKey:@"delayedTouches"];
        NSObject* delayedTouch = [delayedTouches firstObject]; //UIGestureDeleayedTouch
        UITouch* tapTouch = [delayedTouch valueForKey:@"stateWhenDelayed"];

        if (!tapTouch) {
            tapTouch = oneTouch;
        };

        tapPoint = [tapTouch locationInView:self];
        isTapInsideBubble = tapTouch != nil && CGRectContainsPoint(bubbleFrame, tapPoint);
        if (isTapInsideBubble) {
            tapPointInBubble = CGPointMake(tapPoint.x - bubbleFrame.origin.x, tapPoint.y - bubbleFrame.origin.y);
        }
        if (isTapInsideBubble) {
            //find bubble's marker
            AIRGoogleMapMarker* markerView = nil;
            AIRGMSMarker* marker = nil;
            for (AIRGoogleMapMarker* mrk in self.markers) {
                if ([mrk.calloutView isEqual:bubbleView]) {
                    markerView = mrk;
                    marker = markerView.realMarker;
                    break;
                }
            }

            //find real tap target subview
            UIView* realSubview = [(RCTView*)bubbleView hitTest:tapPointInBubble withEvent:nil];
            AIRGoogleMapCalloutSubview* realPressableSubview = nil;
            if (realSubview) {
                UIView* tmp = realSubview;
                while (tmp && tmp != win && tmp != bubbleView) {
                    if ([tmp respondsToSelector:@selector(onPress)]) {
                        realPressableSubview = (AIRGoogleMapCalloutSubview*) tmp;
                        break;
                    }
                    tmp = tmp.superview;
                }
            }

            if (markerView) {
                BOOL isInsideCallout = [markerView.calloutView isPointInside:tapPointInBubble];
                if (isInsideCallout) {
                    [markerView didTapInfoWindowOfMarker:marker subview:realPressableSubview point:tapPointInBubble frame:bubbleFrame];
                } else {
                    AIRGoogleMapMarker* markerAtTapPoint = [self markerAtPoint:tapPoint];
                    if (markerAtTapPoint != nil) {
                        [self didTapMarker:markerAtTapPoint.realMarker];
                    } else {
                        CLLocationCoordinate2D coord = [self.projection coordinateForPoint:tapPoint];
                        [markerView hideCalloutView];
                        [self didTapAtCoordinate:coord];
                    }
                }

                performOriginalActions = NO;
            }
        }
    }

    if (performOriginalActions) {
        NSDictionary* origMeta = [self.origGestureRecognizersMeta objectForKey:grHash];
        NSDictionary* origTargets = [origMeta objectForKey:@"targets"];
        for (NSDictionary* origTarget in origTargets) {
            NSValue* targetValue = [origTarget objectForKey:@"target"];
            NSObject* target = [targetValue nonretainedObjectValue];
            NSString* actionString = [origTarget objectForKey:@"action"];
            SEL action = NSSelectorFromString(actionString);
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
            [target performSelector:action withObject:gestureRecognizer];
#pragma clang diagnostic pop
        }
    }

    return nil;
}


#pragma mark - KVO updates

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context {
  if ([keyPath isEqualToString:@"myLocation"]){
    CLLocation *location = [object myLocation];

    id event = @{@"coordinate": @{
                    @"latitude": @(location.coordinate.latitude),
                    @"longitude": @(location.coordinate.longitude),
                    @"altitude": @(location.altitude),
                    @"timestamp": @(location.timestamp.timeIntervalSince1970 * 1000),
                    @"accuracy": @(location.horizontalAccuracy),
                    @"altitudeAccuracy": @(location.verticalAccuracy),
                    @"speed": @(location.speed),
                    @"heading": @(location.course),
                    }
                };

  if (self.onUserLocationChange) self.onUserLocationChange(event);
  } else {
    // This message is not for me; pass it on to super.
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

+ (NSString *)GetIconUrl:(GMUPlacemark *) marker parser:(GMUKMLParser *) parser {
#if HAVE_GOOGLE_MAPS_UTILS
  if (marker.style.styleID != nil) {
    for (GMUStyle *style in parser.styles) {
      if (style.styleID == marker.style.styleID) {
        return style.iconUrl;
      }
    }
  }

  return marker.style.iconUrl;
#else
    REQUIRES_GOOGLE_MAPS_UTILS("GetIconUrl:parser:"); return @"";
#endif
}

- (NSString *)KmlSrc {
  return _kmlSrc;
}

- (void) setKMLData:(NSData *) urlData {
    GMUKMLParser *parser = [[GMUKMLParser alloc] initWithData:urlData];
    [parser parse];

    NSUInteger index = 0;
    NSMutableArray *markers = [[NSMutableArray alloc]init];

    for (GMUPlacemark *place in parser.placemarks) {

      CLLocationCoordinate2D location =((GMUPoint *) place.geometry).coordinate;

      AIRGoogleMapMarker *marker = (AIRGoogleMapMarker *)[[AIRGoogleMapMarkerManager alloc] view];
      if (!marker.bridge) {
        marker.bridge = _bridge;
      }
      marker.identifier = place.title;
      marker.coordinate = location;
      marker.title = place.title;
      marker.subtitle = place.snippet;
      marker.pinColor = place.style.fillColor;
      marker.imageSrc = [AIRGoogleMap GetIconUrl:place parser:parser];
      marker.layer.backgroundColor = [UIColor clearColor].CGColor;
      marker.layer.position = CGPointZero;

      [self insertReactSubview:(UIView *) marker atIndex:index];

      [markers addObject:@{@"id": marker.identifier,
                           @"title": marker.title,
                           @"description": marker.subtitle,
                           @"coordinate": @{
                               @"latitude": @(location.latitude),
                               @"longitude": @(location.longitude)
                               }
                           }];

      index++;
    }

    id event = @{@"markers": markers};
    if (self.onKmlReady) self.onKmlReady(event);
  #else
      REQUIRES_GOOGLE_MAPS_UTILS();
  #endif
}

- (void)setKmlSrc:(NSString *)kmlUrl {
#if HAVE_GOOGLE_MAPS_UTILS

  _kmlSrc = kmlUrl;

  NSURL *url = [NSURL URLWithString:kmlUrl];
  NSData *urlData = nil;

  if ([url isFileURL]) {
      [self setKMLData:[NSData dataWithContentsOfURL:url]];
  } else {
      __weak AIRGoogleMap *weakSelf = self;

      NSURLSession *session = [NSURLSession sharedSession];
      NSURLSessionDataTask *dataTask = [session dataTaskWithURL:url
                                              completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
          if (error) {
              NSLog(@"Error fetching data: %@", error.localizedDescription);
              return;
          } else {
              dispatch_async(dispatch_get_main_queue(), ^{
                  AIRGoogleMap *strongSelf = weakSelf;
                  [strongSelf setKMLData:data];
              });

          }
      }];
      [dataTask resume];
  }


}


- (void) didChangeActiveBuilding: (nullable GMSIndoorBuilding *) building {
    if (!building) {
        if (!self.onIndoorBuildingFocused) {
            return;
        }
        self.onIndoorBuildingFocused(@{
            @"activeLevelIndex": @0,
            @"underground": @false,
            @"levels": [[NSMutableArray alloc]init]
        });
    }
    NSInteger i = 0;
    NSMutableArray *arrayLevels = [[NSMutableArray alloc]init];
    for (GMSIndoorLevel *level in building.levels) {
        [arrayLevels addObject: @{
            @"index": @(i),
            @"name" : level.name,
            @"shortName" : level.shortName,
        }];
        i++;
    }
    if (!self.onIndoorBuildingFocused) {
        return;
    }
    self.onIndoorBuildingFocused(@{
            @"activeLevelIndex": @(building.defaultLevelIndex),
            @"underground": @(building.underground),
            @"levels": arrayLevels
    });
}

- (void) didChangeActiveLevel: (nullable GMSIndoorLevel *)     level {
    if (!self.onIndoorLevelActivated || !self.indoorDisplay  || !level) {
        return;
    }
    NSInteger i = 0;
    for (GMSIndoorLevel *buildingLevel in self.indoorDisplay.activeBuilding.levels) {
        if (buildingLevel.name == level.name && buildingLevel.shortName == level.shortName) {
            break;
        }
        i++;
    }
    self.onIndoorLevelActivated(@{
            @"activeLevelIndex": @(i),
            @"name": level.name,
            @"shortName": level.shortName
    });
}
// do nothing, passed as options on initialization
- (void)setLoadingBackgroundColor:(UIColor *)loadingBackgroundColor {

}


@end

#endif
