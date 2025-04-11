//
//  RNMapsGoogleMapView.mm
//
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#ifdef HAVE_GOOGLE_MAPS

#import "RNMapsGooglePolygonView.h"
#import "AIRGMSPolygon.h"
#import "AIRGoogleMap.h"
#if __has_include(<ReactNativeMapsGenerated/RNMapsAirModuleDelegate.h>)
#import <ReactNativeMapsGenerated/RNMapsSpecs.h>
#import <ReactNativeMapsGenerated/RNMapsHostVewDelegate.h>
#import <ReactNativeMapsGenerated/ComponentDescriptors.h>
#import <ReactNativeMapsGenerated/EventEmitters.h>
#import <ReactNativeMapsGenerated/Props.h>
#import <ReactNativeMapsGenerated/RCTComponentViewHelpers.h>
#else
#import <react-native-maps-generated/RNMapsSpecs.h>
#import <react-native-maps-generated/ComponentDescriptors.h>
#import <react-native-maps-generated/EventEmitters.h>
#import <react-native-maps-generated/Props.h>
#import <react-native-maps-generated/RCTComponentViewHelpers.h>
#endif

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import "RCTConvert+GMSMapViewType.h"
#import "RCTConvert+AirMap.h"
#import "UIView+AirMap.h"

using namespace facebook::react;

bool areHolesEqual(const std::vector<std::vector<RNMapsGooglePolygonHolesStruct>>& newHoles, const std::vector<std::vector<RNMapsGooglePolygonHolesStruct>>& oldHoles) {
    // First-level check: compare the sizes of the top-level vectors
    if (newHoles.size() != oldHoles.size()) {
        return false;
    }

    // Second-level check: compare the contents of each child vector
    for (size_t i = 0; i < newHoles.size(); ++i) {
        const auto& newHole = newHoles.at(i);
        const auto& oldHole = oldHoles.at(i);

        // Compare sizes of the child vectors
        if (newHole.size() != oldHole.size()) {
            return false;
        }

    }

    return true;
}

@interface RNMapsGooglePolygonView () <RCTRNMapsGooglePolygonViewProtocol>
@end

@implementation RNMapsGooglePolygonView {
    AIRGMSPolygon *_view;
}


- (AIRGMSPolygon*) polygon {
    return _view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNMapsGooglePolygonComponentDescriptor>();
}

- (void) didInsertInMap:(AIRGoogleMap*) map
{
    _view.map = map;
}

-(void) didRemoveFromMap
{
    _view.map = nil;
    _view = nil;
}

- (void) prepareContentView {

    _view = [AIRGMSPolygon new];
    _view.onPress = [self](NSDictionary* dictionary) {
          if (_eventEmitter) {
              // Extract values from the NSDictionary
                NSDictionary* coordinateDict = dictionary[@"coordinate"];
                NSDictionary* positionDict = dictionary[@"position"];

                // Populate the OnMapPressCoordinate struct
              facebook::react::RNMapsGooglePolygonEventEmitter::OnPressCoordinate coordinate = {
                    .latitude = [coordinateDict[@"latitude"] doubleValue],
                    .longitude = [coordinateDict[@"longitude"] doubleValue],
                };

                // Populate the OnMapPressPosition struct
              facebook::react::RNMapsGooglePolygonEventEmitter::OnPressPosition position = {
                    .x = [positionDict[@"x"] doubleValue],
                    .y = [positionDict[@"y"] doubleValue],
                };

              auto mapViewEventEmitter = std::static_pointer_cast<RNMapsGooglePolygonEventEmitter const>(_eventEmitter);
              facebook::react::RNMapsGooglePolygonEventEmitter::OnPress data = {
                  .action = std::string([@"press" UTF8String]),
                  .position = position,
                  .coordinate = coordinate
              };
              mapViewEventEmitter->onPress(data);
          }
      };

}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNMapsGooglePolygonProps>();
    _props = defaultProps;
    [self prepareContentView];

  }

  return self;
}



- (void) prepareForRecycle
{
    [super prepareForRecycle];
    static const auto defaultProps = std::make_shared<const RNMapsGooglePolygonProps>();
    _props = defaultProps;
    _view = nil;
}


- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<RNMapsGooglePolygonProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<RNMapsGooglePolygonProps const>(props);


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


    if(newViewProps.zIndex.has_value()){
        _view.zIndex = newViewProps.zIndex.value();
    }
    if (newViewProps.coordinates.size() != oldViewProps.coordinates.size()){
        GMSMutablePath *path = [GMSMutablePath path];
        for(int i = 0; i < newViewProps.coordinates.size(); i++)
        {
            CLLocationCoordinate2D coordinates = CLLocationCoordinate2DMake(
                                                                            newViewProps.coordinates.at(i).latitude,newViewProps.coordinates.at(i).longitude);
          [path addCoordinate:coordinates];
        }
        _view.path = path;
    }

    if (!areHolesEqual(newViewProps.holes, oldViewProps.holes)){
        NSMutableArray<GMSMutablePath *> *interiorPolygons = [NSMutableArray array];
        for(int h = 0; h < newViewProps.holes.size(); h++)
        {
          GMSMutablePath *path = [GMSMutablePath path];
          for(int i = 0; i < newViewProps.holes[h].size(); i++)
          {
              CLLocationCoordinate2D coordinates = CLLocationCoordinate2DMake(
                                                                              newViewProps.holes.at(h).at(i).latitude,
                                                                              newViewProps.holes.at(h).at(i).longitude);
            [path addCoordinate:coordinates];
          }
          [interiorPolygons addObject:path];
        }
        _view.holes = interiorPolygons;
    }


    REMAP_MAPVIEW_PROP(tappable)

    if (newViewProps.fillColor){
        _view.fillColor = RCTUIColorFromSharedColor(newViewProps.fillColor);
    }

    if (newViewProps.strokeColor){
        _view.strokeColor = RCTUIColorFromSharedColor(newViewProps.strokeColor);
    }




  [super updateProps:props oldProps:oldProps];
}
- (void) didMoveToSuperview {
    [super didMoveToSuperview];
    NSLog(@"SuperView ? %@", self.superview);
}
@end

Class<RCTComponentViewProtocol> RNMapsGooglePolygonCls(void)
{
    return RNMapsGooglePolygonView.class;
}

#endif
