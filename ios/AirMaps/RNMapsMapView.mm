//
//  RNMapsMarker.m
//  AirMaps
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//

#import "RNMapsMapView.h"
#import "AirMap.h"

#import <react/renderer/components/RNMapsSpecs/ComponentDescriptors.h>
#import <react/renderer/components/RNMapsSpecs/EventEmitters.h>
#import <react/renderer/components/RNMapsSpecs/Props.h>
#import <react/renderer/components/RNMapsSpecs/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>

using namespace facebook::react;

@interface RNMapsMapView () <RCTComponentViewProtocol>
@end

@implementation RNMapsMapView {
    AIRMap *_view;
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

      AIRMap *map = [AIRMap new];
      


    _view = map;

    self.contentView = _view;
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
    NSLog(@"childView %@", childComponentView );
    id<RCTComponent> paperView = [self getPaperViewFromChildComponentView:childComponentView];
    if (paperView){
        [_view insertReactSubview:paperView atIndex:index];
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
