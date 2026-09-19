//
//  RNMapsPolygonView.mm
//  AirMaps
//
//
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#ifdef RCT_NEW_ARCH_ENABLED

#import "RNMapsPolygonView.h"
#import "AIRMapPolygon.h"
#import "AIRMapCoordinate.h"
#if __has_include(<ReactNativeMaps/generated/RNMapsAirModuleDelegate.h>)
#import <ReactNativeMaps/generated/RNMapsHostViewDelegate.h>
#import <ReactNativeMaps/generated/ComponentDescriptors.h>
#import <ReactNativeMaps/generated/EventEmitters.h>
#import <ReactNativeMaps/generated/Props.h>
#import <ReactNativeMaps/generated/RCTComponentViewHelpers.h>
#else
#import "../generated/RNMapsHostViewDelegate.h"
#import "../generated/RNMapsSpecs/ComponentDescriptors.h"
#import "../generated/RNMapsSpecs/EventEmitters.h"
#import "../generated/RNMapsSpecs/Props.h"
#import "../generated/RNMapsSpecs/RCTComponentViewHelpers.h"
#endif
#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import "UIView+AirMap.h"

using namespace facebook::react;

static BOOL coordinatesEqual(const std::vector<RNMapsPolygonCoordinatesStruct>& a,
                             const std::vector<RNMapsPolygonCoordinatesStruct>& b)
{
    if (a.size() != b.size()) {
        return NO;
    }
    for (size_t i = 0; i < a.size(); ++i) {
        if (a.at(i).latitude != b.at(i).latitude ||
            a.at(i).longitude != b.at(i).longitude) {
            return NO;
        }
    }
    return YES;
}

static BOOL holesEqual(const std::vector<std::vector<RNMapsPolygonHolesStruct>>& a,
                       const std::vector<std::vector<RNMapsPolygonHolesStruct>>& b)
{
    if (a.size() != b.size()) {
        return NO;
    }
    for (size_t h = 0; h < a.size(); ++h) {
        if (a.at(h).size() != b.at(h).size()) {
            return NO;
        }
        for (size_t i = 0; i < a.at(h).size(); ++i) {
            if (a.at(h).at(i).latitude != b.at(h).at(i).latitude ||
                a.at(h).at(i).longitude != b.at(h).at(i).longitude) {
                return NO;
            }
        }
    }
    return YES;
}

@interface RNMapsPolygonView () <RCTRNMapsPolygonViewProtocol>
@end

@implementation RNMapsPolygonView {
    AIRMapPolygon *_view;
}

- (AIRMapPolygon *)polygon {
    return _view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RNMapsPolygonComponentDescriptor>();
}

- (void)prepareContentView
{
    _view = [AIRMapPolygon new];
    _view.strokeWidth = 1.0;
    _view.lineCap = kCGLineCapRound;
    _view.lineJoin = kCGLineJoinRound;
    _view.miterLimit = 10.0;
    _view.onPress = [self](NSDictionary *dictionary) {
        if (!_eventEmitter) return;
        NSDictionary *coordinateDict = dictionary[@"coordinate"];
        CLLocationCoordinate2D coord = CLLocationCoordinate2DMake(
            [coordinateDict[@"latitude"] doubleValue],
            [coordinateDict[@"longitude"] doubleValue]);
        facebook::react::RNMapsPolygonEventEmitter::OnPressCoordinate coordinate = {
            .latitude = coord.latitude,
            .longitude = coord.longitude,
        };

        CGPoint screenPoint =
            _view.map ? [_view.map convertCoordinate:coord toPointToView:_view.map] : CGPointZero;
        facebook::react::RNMapsPolygonEventEmitter::OnPressPosition position = {
            .x = screenPoint.x,
            .y = screenPoint.y,
        };
        auto eventEmitter = std::static_pointer_cast<RNMapsPolygonEventEmitter const>(_eventEmitter);
        facebook::react::RNMapsPolygonEventEmitter::OnPress data = {
            .action = std::string([dictionary[@"action"] UTF8String]),
            .coordinate = coordinate,
            .position = position,
        };
        eventEmitter->onPress(data);
    };
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const RNMapsPolygonProps>();
        _props = defaultProps;
        [self prepareContentView];
    }
    return self;
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    static const auto defaultProps = std::make_shared<const RNMapsPolygonProps>();
    _props = defaultProps;
    _view = nil;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<RNMapsPolygonProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<RNMapsPolygonProps const>(props);

    if (!_view) {
        [self prepareContentView];
    }

    // Order matters: `AIRMapPolygon setCoordinates:` builds the `MKPolygon` from the
    // current `interiorPolygons` (holes), while `setHoles:` only updates that array
    // without rebuilding. So apply holes first, then (re)build coordinates whenever
    // either holes or coordinates changed.
    const BOOL holesChanged = !holesEqual(newViewProps.holes, oldViewProps.holes);
    const BOOL coordinatesChanged =
        !coordinatesEqual(newViewProps.coordinates, oldViewProps.coordinates);

    if (holesChanged) {
        if (newViewProps.holes.empty()) {
            // `setHoles:` ignores an empty array (its `if (holes.count)` guard), so
            // clear the interior polygons directly to support removing holes.
            _view.interiorPolygons = nil;
        } else {
            NSMutableArray<NSArray<AIRMapCoordinate *> *> *holes =
                [NSMutableArray arrayWithCapacity:newViewProps.holes.size()];
            for (const auto &hole : newViewProps.holes) {
                NSMutableArray<AIRMapCoordinate *> *holeCoordinates =
                    [NSMutableArray arrayWithCapacity:hole.size()];
                for (const auto &c : hole) {
                    AIRMapCoordinate *coordinate = [AIRMapCoordinate new];
                    coordinate.coordinate = CLLocationCoordinate2DMake(c.latitude, c.longitude);
                    [holeCoordinates addObject:coordinate];
                }
                [holes addObject:holeCoordinates];
            }
            _view.holes = holes;
        }
    }

    if (coordinatesChanged || holesChanged) {
        NSMutableArray<AIRMapCoordinate *> *coordinates =
            [NSMutableArray arrayWithCapacity:newViewProps.coordinates.size()];
        for (const auto &c : newViewProps.coordinates) {
            AIRMapCoordinate *coordinate = [AIRMapCoordinate new];
            coordinate.coordinate = CLLocationCoordinate2DMake(c.latitude, c.longitude);
            [coordinates addObject:coordinate];
        }
        _view.coordinates = coordinates;
    }

    if (newViewProps.fillColor != oldViewProps.fillColor) {
        _view.fillColor = newViewProps.fillColor
            ? RCTUIColorFromSharedColor(newViewProps.fillColor)
            : nil;
    }
    if (newViewProps.strokeColor != oldViewProps.strokeColor) {
        _view.strokeColor = newViewProps.strokeColor
            ? RCTUIColorFromSharedColor(newViewProps.strokeColor)
            : nil;
    }
    if (newViewProps.strokeWidth != oldViewProps.strokeWidth) {
        _view.strokeWidth = newViewProps.strokeWidth;
    }
    if (newViewProps.miterLimit != oldViewProps.miterLimit) {
        _view.miterLimit = newViewProps.miterLimit;
    }
    if (newViewProps.lineDashPhase != oldViewProps.lineDashPhase) {
        _view.lineDashPhase = newViewProps.lineDashPhase;
    }

    if (newViewProps.lineCap != oldViewProps.lineCap) {
        switch (newViewProps.lineCap) {
            case RNMapsPolygonLineCap::Butt: _view.lineCap = kCGLineCapButt; break;
            case RNMapsPolygonLineCap::Round: _view.lineCap = kCGLineCapRound; break;
            case RNMapsPolygonLineCap::Square: _view.lineCap = kCGLineCapSquare; break;
        }
    }

    if (newViewProps.lineJoin != oldViewProps.lineJoin) {
        switch (newViewProps.lineJoin) {
            case RNMapsPolygonLineJoin::Miter: _view.lineJoin = kCGLineJoinMiter; break;
            case RNMapsPolygonLineJoin::Round: _view.lineJoin = kCGLineJoinRound; break;
            case RNMapsPolygonLineJoin::Bevel: _view.lineJoin = kCGLineJoinBevel; break;
        }
    }

    if (newViewProps.lineDashPattern != oldViewProps.lineDashPattern) {
        NSMutableArray<NSNumber *> *pattern =
            [NSMutableArray arrayWithCapacity:newViewProps.lineDashPattern.size()];
        for (const auto &value : newViewProps.lineDashPattern) {
            [pattern addObject:@(value)];
        }
        _view.lineDashPattern = pattern;
    }

    [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> RNMapsPolygonCls(void)
{
    return RNMapsPolygonView.class;
}

#endif
