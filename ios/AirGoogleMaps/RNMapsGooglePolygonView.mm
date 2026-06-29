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
#if __has_include(<ReactNativeMaps/generated/RNMapsAirModuleDelegate.h>)
#import <ReactNativeMaps/generated/RNMapsSpecs.h>
#import <ReactNativeMaps/generated/RNMapsHostViewDelegate.h>
#import <ReactNativeMaps/generated/ComponentDescriptors.h>
#import <ReactNativeMaps/generated/EventEmitters.h>
#import <ReactNativeMaps/generated/Props.h>
#import <ReactNativeMaps/generated/RCTComponentViewHelpers.h>
#else
#import "../generated/RNMapsSpecs/RNMapsSpecs.h"
#import "../generated/RNMapsSpecs/ComponentDescriptors.h"
#import "../generated/RNMapsSpecs/EventEmitters.h"
#import "../generated/RNMapsSpecs/Props.h"
#import "../generated/RNMapsSpecs/RCTComponentViewHelpers.h"
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
- (void) attachIfReady;
@end

@implementation RNMapsGooglePolygonView {
    AIRGMSPolygon *_view;
    __weak AIRGoogleMap *_pendingMap;
    // YES while a GMS detach is queued for the next runloop tick (see didRemoveFromMap).
    BOOL _detachScheduled;
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
    // Defer the attach until the path is renderable. Under Fabric the coordinates
    // (props) can arrive AFTER mount, and attaching a GMSPolygon whose path has
    // fewer than 3 points crashes Google Maps (null-deref in gmssdk::CoordsToPoints
    // during setMap:). Remember the target map and attach from attachIfReady — here
    // if the path is already valid, otherwise from updateProps once coordinates land.
    // Cancel a detach queued by a just-fired didRemoveFromMap: an unmount immediately
    // followed by this re-mount (same view, same transaction) is a Fabric reorder,
    // not a removal, so the overlay must stay attached (no detach/reattach churn).
    _detachScheduled = NO;
    _pendingMap = map;
    [self attachIfReady];
}

// Attach to the map only when the polygon has a renderable path. Idempotent: safe
// to call from both didInsertInMap and updateProps.
- (void) attachIfReady
{
    if (_view != nil && _view.map == nil && _pendingMap != nil
        && _view.path != nil && _view.path.count >= 3) {
        _view.map = _pendingMap;
    }
}

-(void) didRemoveFromMap
{
    // Defer the detach by one runloop tick instead of detaching now. Fabric expresses
    // a zIndex reorder as unmount-then-remount of the SAME view within one synchronous
    // transaction; didInsertInMap clears _detachScheduled before this block runs, so a
    // reorder leaves the overlay attached with its props intact (no vanish, and no stale
    // fillColor when two overlays reorder at once). Only a genuine removal (no matching
    // re-mount) reaches the detach. Full teardown still happens in prepareForRecycle.
    _detachScheduled = YES;
    __weak RNMapsGooglePolygonView *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        RNMapsGooglePolygonView *strongSelf = weakSelf;
        if (strongSelf == nil || !strongSelf->_detachScheduled) return;
        strongSelf->_detachScheduled = NO;
        strongSelf->_pendingMap = nil;
        strongSelf->_view.map = nil;
    });
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
    _detachScheduled = NO;
    _pendingMap = nil;
    _view.map = nil;
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
    if (newViewProps.strokeWidth != oldViewProps.strokeWidth){
        _view.strokeWidth = newViewProps.strokeWidth;
    }

    // Coordinates may have just been applied above; attach now if the mount was
    // deferred while the path was still empty.
    [self attachIfReady];

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
