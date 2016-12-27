//
//  AIRGoogleMap.m
//  AirMaps
//
//  Created by Gil Birman on 9/1/16.
//

#import "AIRGoogleMap.h"
#import "AIRGoogleMapMarker.h"
#import "AIRGoogleMapPolygon.h"
#import "AIRGoogleMapPolyline.h"
#import "AIRGoogleMapCircle.h"
#import "AIRGoogleMapUrlTile.h"
#import <GoogleMaps/GoogleMaps.h>
#import <MapKit/MapKit.h>
#import "RCTConvert+MapKit.h"
#import "UIView+React.h"

#define MERCATOR_OFFSET 268435456 /* (total pixels at zoom level 20) / 2 */
#define MERCATOR_RADIUS 85445659.44705395 /* MERCATOR_OFFSET / pi */
#define MAX_GOOGLE_LEVELS 20

id regionAsJSON(MKCoordinateRegion region) {
  return @{
           @"latitude": [NSNumber numberWithDouble:region.center.latitude],
           @"longitude": [NSNumber numberWithDouble:region.center.longitude],
           @"latitudeDelta": [NSNumber numberWithDouble:region.span.latitudeDelta],
           @"longitudeDelta": [NSNumber numberWithDouble:region.span.longitudeDelta],
           };
}

@interface AIRGoogleMap ()

- (id)eventFromCoordinate:(CLLocationCoordinate2D)coordinate;

@end

@implementation AIRGoogleMap
{
  NSMutableArray<UIView *> *_reactSubviews;
  BOOL _initialRegionSet;
}

- (instancetype)init
{
  if ((self = [super init])) {
    _reactSubviews = [NSMutableArray new];
    _markers = [NSMutableArray array];
    _polygons = [NSMutableArray array];
    _polylines = [NSMutableArray array];
    _circles = [NSMutableArray array];
    _tiles = [NSMutableArray array];
    _initialRegionSet = false;
    self.maxDelta = 0.0;
    self.minDelta = 0.0;
  }
  return self;
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

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (void)insertReactSubview:(id<RCTComponent>)subview atIndex:(NSInteger)atIndex {
  // Our desired API is to pass up markers/overlays as children to the mapview component.
  // This is where we intercept them and do the appropriate underlying mapview action.
  if ([subview isKindOfClass:[AIRGoogleMapMarker class]]) {
    AIRGoogleMapMarker *marker = (AIRGoogleMapMarker*)subview;
    marker.realMarker.map = self;
    [self.markers addObject:marker];
  } else if ([subview isKindOfClass:[AIRGoogleMapPolygon class]]) {
    AIRGoogleMapPolygon *polygon = (AIRGoogleMapPolygon*)subview;
    polygon.polygon.map = self;
    [self.polygons addObject:polygon];
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


- (void)setInitialRegion:(MKCoordinateRegion)initialRegion {
  if (_initialRegionSet) return;
  _initialRegionSet = true;
  self.camera = [AIRGoogleMap makeGMSCameraPositionFromMap:self andMKCoordinateRegion:initialRegion];
}

- (void)setRegion:(MKCoordinateRegion)region {
  // TODO: The JS component is repeatedly setting region unnecessarily. We might want to deal with that in here.
  self.camera = [AIRGoogleMap makeGMSCameraPositionFromMap:self andMKCoordinateRegion:region];
}

- (void)animateToRegion:(MKCoordinateRegion)region
           withDuration:(CGFloat)duration {
  [CATransaction begin];
  [CATransaction setValue:[NSNumber numberWithFloat: duration / 1000] forKey:kCATransactionAnimationDuration];
  [self animateToCameraPosition: [AIRGoogleMap makeGMSCameraPositionFromMap:self andMKCoordinateRegion:region]];
  [CATransaction commit];
}

- (BOOL)didTapMarker:(GMSMarker *)marker {
  AIRGMSMarker *airMarker = (AIRGMSMarker *)marker;

  id event = @{@"action": @"marker-press",
               @"id": airMarker.identifier ?: @"unknown",
              };

  if (airMarker.onPress) airMarker.onPress(event);
  if (self.onMarkerPress) self.onMarkerPress(event);

  // TODO: not sure why this is necessary
  [self setSelectedMarker:marker];
  return NO;
}

- (void)didTapAtCoordinate:(CLLocationCoordinate2D)coordinate {
  if (!self.onPress) return;
  self.onPress([self eventFromCoordinate:coordinate]);
}

- (void)didLongPressAtCoordinate:(CLLocationCoordinate2D)coordinate {
  if (!self.onLongPress) return;
  self.onLongPress([self eventFromCoordinate:coordinate]);
}

- (void)didChangeCameraPosition:(GMSCameraPosition *)position {
  id event = @{@"continuous": @YES,
               @"region": regionAsJSON([AIRGoogleMap makeGMSCameraPositionFromMap:self andGMSCameraPosition:position]),
               };

  if (self.onChange) self.onChange(event);
}

- (void)idleAtCameraPosition:(GMSCameraPosition *)position {
  id event = @{@"continuous": @NO,
               @"region": regionAsJSON([AIRGoogleMap makeGMSCameraPositionFromMap:self andGMSCameraPosition:position]),
               };
  if (self.onChange) self.onChange(event);  // complete
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

  self.mapStyle = style;
}

- (BOOL)showsCompass {
  return self.settings.compassButton;
}

- (void)setShowsUserLocation:(BOOL)showsUserLocation {
  self.myLocationEnabled = showsUserLocation;
}

- (void)applyMaxDelta {
  int minZoom = [AIRGoogleMap zoomForMap:self withDelta:self.maxDelta];
  int maxZoom = self.maxZoom < minZoom ? minZoom : self.maxZoom;
  [self setMinZoom:minZoom maxZoom:maxZoom];
}

- (void)applyMinDelta {
  int maxZoom = [AIRGoogleMap zoomForMap:self withDelta:self.minDelta];
  int minZoom = self.minZoom > maxZoom ? maxZoom : self.minZoom;
  [self setMinZoom:minZoom maxZoom:maxZoom];
}

// layout subviewviews might not be the best place to run this code,
// but we need a view width and it's not there at the time setMaxDelta et. al are fired
-(void)layoutSubviews {
  if (self.minDelta > 0) [self applyMaxDelta];
  if (self.maxDelta > 0) [self applyMinDelta];
  [super layoutSubviews];
}

- (void)setCustomMapStyle:(NSString *)customMapStyle {

  NSError *error;

  GMSMapStyle *style = [GMSMapStyle styleWithJSONString:customMapStyle error:&error];

  if (!style) {
    NSLog(@"The style definition could not be loaded: %@", error);
  }

  self.mapStyle = style;
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

// calculates the zoom level from a delta
+ (int) zoomForMap:(GMSMapView *)map withDelta:(CGFloat)longitudeDelta {
  CGFloat width = map.bounds.size.width <= 0 ? 320.0 : map.bounds.size.width;
  CGFloat mapWidthInPixels = width * 2; // 2 is for retina display
  double zoomScale = longitudeDelta * MERCATOR_RADIUS * M_PI / (180.0 * mapWidthInPixels);
  double zoomer = MAX_GOOGLE_LEVELS - log2(zoomScale);
  // NSLog(@"Zoomer: %f ZoomScale: %f delta: %f width: %f", zoomer, zoomScale, longitudeDelta, mapWidthInPixels);
  if (zoomer < 0) zoomer = 0;
  zoomer = round(zoomer);
  return (int) zoomer;
}

@end
