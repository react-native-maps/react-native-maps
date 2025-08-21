/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AIRMap.h"

#import <React/RCTEventDispatcher.h>
#import <React/UIView+React.h>
#import "AIRMapMarker.h"
#import "AIRMapPolyline.h"
#import "AIRMapPolygon.h"
#import "AIRMapCircle.h"
#import <QuartzCore/QuartzCore.h>
#import "AIRMapUrlTile.h"
#import "AIRMapWMSTile.h"
#import "AIRMapLocalTile.h"
#import "AIRMapOverlay.h"
#import "AIRMapSnapshot.h"

const NSTimeInterval AIRMapRegionChangeObserveInterval = 0.1;
const CGFloat AIRMapZoomBoundBuffer = 0.01;
const NSInteger AIRMapMaxZoomLevel = 20;

#if __has_include(<ReactNativeMaps/generated/RNMapsAirModuleDelegate.h>)
#import <ReactNativeMaps/generated/RNMapsAirModuleDelegate.h>
#else
#import "RNMapsAirModuleDelegate.h"
#endif
@interface MKMapView (UIGestureRecognizer)<RNMapsAirModuleDelegate>

// this tells the compiler that MKMapView actually implements this method
- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch;

@end

@interface AIRMap ()

@property (nonatomic, strong) UIActivityIndicatorView *activityIndicatorView;
@property (nonatomic, assign) NSNumber *shouldZoomEnabled;
@property (nonatomic, assign) NSNumber *shouldScrollEnabled;

- (void)updateScrollEnabled;
- (void)updateZoomEnabled;

@end

@implementation AIRMap
{
    UIView *_legalLabel;
    BOOL _initialRegionSet;
    BOOL _initialRegionProvided;
    BOOL _initialCameraProvided;
    BOOL _initialCameraSet;
    BOOL _initialized;
    BOOL _loadingStarted;
    BOOL _showsPointsOfInterests;
    NSArray<NSString *> *_pointsOfInterestFilter;

    // Array to manually track RN subviews
    //
    // AIRMap implicitly creates subviews that aren't regular RN children
    // (SMCalloutView injects an overlay subview), which otherwise confuses RN
    // during component re-renders:
    // https://github.com/facebook/react-native/blob/v0.16.0/React/Modules/RCTUIManager.m#L657
    //
    // Implementation based on RCTTextField, another component with indirect children
    // https://github.com/facebook/react-native/blob/v0.16.0/Libraries/Text/RCTTextField.m#L20
    NSMutableArray<UIView *> *_reactSubviews;
}

- (instancetype)init
{
    if ((self = [super init])) {
        _hasStartedRendering = NO;
        _reactSubviews = [NSMutableArray new];

        // Find Apple link label
        for (UIView *subview in self.subviews) {
            if ([NSStringFromClass(subview.class) isEqualToString:@"MKAttributionLabel"]) {
                // This check is super hacky, but the whole premise of moving around
                // Apple's internal subviews is super hacky
                _legalLabel = subview;
                break;
            }
        }

        // 3rd-party callout view for MapKit that has more options than the built-in. It's painstakingly built to
        // be identical to the built-in callout view (which has a private API)
        self.calloutView = [SMCalloutView platformCalloutView];
        self.calloutView.delegate = self;

        self.minZoom = 0;
        self.maxZoom = AIRMapMaxZoomLevel;
        self.compassOffset = CGPointMake(0, 0);
        self.legacyZoomConstraintsEnabled = YES;
        _initialized = YES;
        _showsPointsOfInterests = YES;
        _pointsOfInterestFilter = @[];
        [self listenToMemoryWarnings];
    }
    return self;
}

-(void)addSubview:(UIView *)view {
    if([view isKindOfClass:[AIRMapMarker class]]) {
        [self addAnnotation:(id <MKAnnotation>)view];
    } else {
        [super addSubview:view];
    }
}

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (void)insertReactSubview:(id<RCTComponent>)subview atIndex:(NSInteger)atIndex {
    // Our desired API is to pass up markers/overlays as children to the mapview component.
    // This is where we intercept them and do the appropriate underlying mapview action.
    if ([subview isKindOfClass:[AIRMapMarker class]]) {
        [self addAnnotation:(id <MKAnnotation>) subview];
    } else if ([subview isKindOfClass:[AIRMapPolyline class]]) {
        ((AIRMapPolyline *)subview).map = self;
        [self addOverlay:(id<MKOverlay>)subview];
    } else if ([subview isKindOfClass:[AIRMapPolygon class]]) {
        ((AIRMapPolygon *)subview).map = self;
        [self addOverlay:(id<MKOverlay>)subview];
    } else if ([subview isKindOfClass:[AIRMapCircle class]]) {
        ((AIRMapCircle *)subview).map = self;
        [self addOverlay:(id<MKOverlay>)subview];
    } else if ([subview isKindOfClass:[AIRMapUrlTile class]]) {
        ((AIRMapUrlTile *)subview).map = self;
        [self addOverlay:(id<MKOverlay>)subview];
    }else if ([subview isKindOfClass:[AIRMapWMSTile class]]) {
        ((AIRMapWMSTile *)subview).map = self;
        [self addOverlay:(id<MKOverlay>)subview];
    } else if ([subview isKindOfClass:[AIRMapLocalTile class]]) {
        ((AIRMapLocalTile *)subview).map = self;
        [self addOverlay:(id<MKOverlay>)subview];
    } else if ([subview isKindOfClass:[AIRMapOverlay class]]) {
        ((AIRMapOverlay *)subview).map = self;
        [self addOverlay:(id<MKOverlay>)subview];
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
    if ([subview isKindOfClass:[AIRMapMarker class]]) {
        [self removeAnnotation:(id<MKAnnotation>)subview];
    } else if ([subview isKindOfClass:[AIRMapPolyline class]]) {
        [self removeOverlay:(id <MKOverlay>) subview];
    } else if ([subview isKindOfClass:[AIRMapPolygon class]]) {
        [self removeOverlay:(id <MKOverlay>) subview];
    } else if ([subview isKindOfClass:[AIRMapCircle class]]) {
        [self removeOverlay:(id <MKOverlay>) subview];
    } else if ([subview isKindOfClass:[AIRMapUrlTile class]]) {
        [self removeOverlay:(id <MKOverlay>) subview];
    } else if ([subview isKindOfClass:[AIRMapWMSTile class]]) {
        [self removeOverlay:(id <MKOverlay>) subview];
    } else if ([subview isKindOfClass:[AIRMapLocalTile class]]) {
        [self removeOverlay:(id <MKOverlay>) subview];
    } else if ([subview isKindOfClass:[AIRMapOverlay class]]) {
        [self removeOverlay:(id <MKOverlay>) subview];
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

#pragma mark Utils

- (NSArray*) markers {
    NSPredicate *filterMarkers = [NSPredicate predicateWithBlock:^BOOL(id evaluatedObject, NSDictionary *bindings) {
        AIRMapMarker *marker = (AIRMapMarker *)evaluatedObject;
        return [marker isKindOfClass:[AIRMapMarker class]];
    }];
    NSArray *filteredMarkers = [self.annotations filteredArrayUsingPredicate:filterMarkers];
    return filteredMarkers;
}

- (AIRMapMarker*) markerForCallout:(AIRMapCallout*)callout {
    AIRMapMarker* marker = nil;
    NSArray* markers = [self markers];
    for (AIRMapMarker* mrk in markers) {
        if (mrk.calloutView == callout) {
            marker = mrk;
            break;
        }
    }
    return marker;
}
// Create Polyline with coordinates
-(void) fitToCoordinates:(NSArray<AIRMapCoordinate*>*) coordinates edgePadding:(UIEdgeInsets) edgeInsets animated:(Boolean) animated {
    CLLocationCoordinate2D coords[coordinates.count];
    for(int i = 0; i < coordinates.count; i++)
    {
        coords[i] = coordinates[i].coordinate;
    }
    MKPolyline *polyline = [MKPolyline polylineWithCoordinates:coords count:coordinates.count];

    // Set Map viewport

    [self setVisibleMapRect:[polyline boundingMapRect] edgePadding:edgeInsets animated:animated];
}


- (CGRect) frameForMarker:(AIRMapMarker*) mrkAnn {
    MKAnnotationView* mrkView = [self viewForAnnotation: mrkAnn];
    CGRect mrkFrame = mrkView.frame;
    return mrkFrame;
}


- (AIRMapMarker*) markerAtPoint:(CGPoint)point {
    AIRMapMarker* mrk = nil;
    for (AIRMapMarker* mrkAnn in self.markers) {
        CGRect frame = [self frameForMarker:mrkAnn];
        if (CGRectContainsPoint(frame, point)) {
            mrk = mrkAnn;
            break;
        }
    }
    return mrk;
}

#pragma mark Overrides for Callout behavior

// override UIGestureRecognizer's delegate method so we can prevent MKMapView's recognizer from firing
// when we interact with UIControl subclasses inside our callout view.
- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch {
    if ([touch.view isDescendantOfView:self.calloutView])
        return NO;
    else
        return [super gestureRecognizer:gestureRecognizer shouldReceiveTouch:touch];
}


// Allow touches to be sent to our calloutview.
// See this for some discussion of why we need to override this: https://github.com/nfarina/calloutview/pull/9
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {

    CGPoint touchPoint = [self.calloutView convertPoint:point fromView:self];
    UIView *touchedView = [self.calloutView hitTest:touchPoint withEvent:event];

    if (touchedView) {
        UIWindow* win = [[[UIApplication sharedApplication] windows] firstObject];
        AIRMapCalloutSubview* calloutSubview = nil;
        AIRMapCallout* callout = nil;
        AIRMapMarker* marker = nil;

        UIView* tmp = touchedView;
        while (tmp && tmp != win && tmp != self.calloutView) {
            if ([tmp respondsToSelector:@selector(onPress)]) {
                calloutSubview = (AIRMapCalloutSubview*) tmp;
            }
            if ([tmp isKindOfClass:[AIRMapCallout class]]) {
                callout = (AIRMapCallout*) tmp;
                break;
            }
            tmp = tmp.superview;
        }

        if (callout) {
            marker = [self markerForCallout:callout];
            if (marker) {
                CGPoint touchPointReal = [marker.calloutView convertPoint:point fromView:self];
                if (![callout isPointInside:touchPointReal]) {
                    return [super hitTest:point withEvent:event];
                }
            }
        }

        return calloutSubview ? calloutSubview : touchedView;
    }

    return [super hitTest:point withEvent:event];
}

#pragma mark SMCalloutViewDelegate

- (NSTimeInterval)calloutView:(SMCalloutView *)calloutView delayForRepositionWithSize:(CGSize)offset {

    // When the callout is being asked to present in a way where it or its target will be partially offscreen, it asks us
    // if we'd like to reposition our surface first so the callout is completely visible. Here we scroll the map into view,
    // but it takes some math because we have to deal in lon/lat instead of the given offset in pixels.

    CLLocationCoordinate2D coordinate = self.region.center;

    // where's the center coordinate in terms of our view?
    CGPoint center = [self convertCoordinate:coordinate toPointToView:self];

    // move it by the requested offset
    center.x -= offset.width;
    center.y -= offset.height;

    // and translate it back into map coordinates
    coordinate = [self convertPoint:center toCoordinateFromView:self];

    // move the map!
    [self setCenterCoordinate:coordinate animated:YES];

    // tell the callout to wait for a while while we scroll (we assume the scroll delay for MKMapView matches UIScrollView)
    return kSMCalloutViewRepositionDelayForUIScrollView;
}

#pragma mark RNMapsAirModuleDelegate.h

- (NSDictionary *)getMapBoundaries
{
    MKMapRect mapRect = self.visibleMapRect;

    CLLocationCoordinate2D northEast = MKCoordinateForMapPoint(MKMapPointMake(MKMapRectGetMaxX(mapRect), mapRect.origin.y));
    CLLocationCoordinate2D southWest = MKCoordinateForMapPoint(MKMapPointMake(mapRect.origin.x, MKMapRectGetMaxY(mapRect)));

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
- (NSDictionary *) getPointForCoordinates:(CLLocationCoordinate2D) location
{
    CGPoint touchPoint = [self convertCoordinate:location toPointToView:self];

    return @{
        @"x": @(touchPoint.x),
        @"y": @(touchPoint.y),
    };
}
- (NSDictionary *) getCoordinatesForPoint:(CGPoint)point
{
    CLLocationCoordinate2D coordinate = [self convertPoint:point toCoordinateFromView:self];
    return @{
        @"latitude": @(coordinate.latitude),
        @"longitude": @(coordinate.longitude),
    };

}

- (NSDictionary*) getMarkersFramesWithOnlyVisible:(BOOL)onlyVisible {
    NSMutableDictionary* markersFrames = [NSMutableDictionary new];
    for (AIRMapMarker* mrkAnn in self.markers) {
        CGRect frame = [self frameForMarker:mrkAnn];
        CGPoint point = [self convertCoordinate:mrkAnn.coordinate toPointToView:self];
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
        NSString* k = mrkAnn.identifier;
        BOOL isVisible = CGRectIntersectsRect(self.bounds, frame);
        if (k != nil && (!onlyVisible || isVisible)) {
            [markersFrames setObject:@{ @"frame": frameDict, @"point": pointDict } forKey:k];
        }
    }
    return markersFrames;
}

- (NSDictionary *) getCameraDic {
    MKMapCamera *camera = [self camera];
    return @{
        @"center": @{
            @"latitude": @(camera.centerCoordinate.latitude),
            @"longitude": @(camera.centerCoordinate.longitude),
        },
        @"pitch": @(camera.pitch),
        @"heading": @(camera.heading),
        @"altitude": @(camera.altitude),
    };
}
- (void)takeSnapshotWithConfig:(NSDictionary *)config
                       success:(RCTPromiseResolveBlock)success error:(RCTPromiseRejectBlock)error
{

    MKMapSnapshotOptions *options = [[MKMapSnapshotOptions alloc] init];

    options.mapType = self.mapType;
    NSNumber *width = config[@"width"];
    NSNumber *height = config[@"height"];
    NSNumber *quality = config[@"quality"];
    NSString*format =config[@"format"];
    NSString*result =config[@"result"];
    if (config[@"region"]){
        MKCoordinateRegion region = [RCTConvert MKCoordinateRegion:config[@"region"]];
        options.region =  region;
    } else
    {
        options.region =  self.region;
    }
    options.size = CGSizeMake(
                              ([width floatValue] == 0) ? self.bounds.size.width : [width floatValue],
                              ([height floatValue] == 0) ? self.bounds.size.height : [height floatValue]
                              );

    options.scale = [[UIScreen mainScreen] scale];


    MKMapSnapshotter *snapshotter = [[MKMapSnapshotter alloc] initWithOptions:options];

    [self takeMapSnapshot:snapshotter
                   format:format
                  quality:[quality floatValue]
                   result:result
                  success:success error:error];
}

#pragma mark Take Snapshot
- (void)takeMapSnapshot:(MKMapSnapshotter *) snapshotter
                 format:(NSString *)format
                quality:(CGFloat) quality
                 result:(NSString *)result
               success:(RCTPromiseResolveBlock) success
                  error:(RCTPromiseRejectBlock) errorCallback {
    NSTimeInterval timeStamp = [[NSDate date] timeIntervalSince1970];
    NSString *pathComponent = [NSString stringWithFormat:@"Documents/snapshot-%.20lf.%@", timeStamp, format];
    NSString *filePath = [NSHomeDirectory() stringByAppendingPathComponent: pathComponent];

    [snapshotter startWithQueue:dispatch_get_main_queue()
              completionHandler:^(MKMapSnapshot *snapshot, NSError *error) {
        if (error) {
            errorCallback(@"snapshotterError", @"failed", error);
            return;
        }
        MKAnnotationView *pin = [[MKPinAnnotationView alloc] initWithAnnotation:nil reuseIdentifier:nil];

        UIImage *image = snapshot.image;
        UIGraphicsBeginImageContextWithOptions(image.size, YES, image.scale);
        {
            [image drawAtPoint:CGPointMake(0.0f, 0.0f)];

            CGRect rect = CGRectMake(0.0f, 0.0f, image.size.width, image.size.height);

            for (id <AIRMapSnapshot> overlay in self.overlays) {
                if ([overlay respondsToSelector:@selector(drawToSnapshot:context:)]) {
                    [overlay drawToSnapshot:snapshot context:UIGraphicsGetCurrentContext()];
                }
            }


            for (id <MKAnnotation> annotation in self.annotations) {
                CGPoint point = [snapshot pointForCoordinate:annotation.coordinate];

                MKAnnotationView* anView = [self viewForAnnotation: annotation];

                if (anView){
                    pin = anView;
                }

                if (CGRectContainsPoint(rect, point)) {
                    point.x = point.x + pin.centerOffset.x - (pin.bounds.size.width / 2.0f);
                    point.y = point.y + pin.centerOffset.y - (pin.bounds.size.height / 2.0f);
                    if (pin.image) {
                        [pin.image drawAtPoint:point];
                    } else {
                        CGRect pinRect = CGRectMake(point.x, point.y, pin.bounds.size.width, pin.bounds.size.height);
                        [pin drawViewHierarchyInRect:pinRect afterScreenUpdates:NO];
                    }
                }
            }

            UIImage *compositeImage = UIGraphicsGetImageFromCurrentImageContext();

            NSData *data;
            if ([format isEqualToString:@"png"]) {
                data = UIImagePNGRepresentation(compositeImage);
            }
            else if([format isEqualToString:@"jpg"]) {
                data = UIImageJPEGRepresentation(compositeImage, quality);
            }

            if ([result isEqualToString:@"file"]) {
                [data writeToFile:filePath atomically:YES];
                success(filePath);
            }
            else if ([result isEqualToString:@"base64"]) {
                success([data base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithCarriageReturn]);
            }
        }
        UIGraphicsEndImageContext();
    }];
}



- (void)setShowsUserLocation:(BOOL)showsUserLocation
{
    if (self.showsUserLocation != showsUserLocation) {
        super.showsUserLocation = showsUserLocation;
    }
}

- (void)setUserInterfaceStyle:(NSString*)userInterfaceStyle
{
        if([userInterfaceStyle isEqualToString:@"light"]) {
            self.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
        } else if([userInterfaceStyle isEqualToString:@"dark"]) {
            self.overrideUserInterfaceStyle = UIUserInterfaceStyleDark;
        } else {
            self.overrideUserInterfaceStyle = UIUserInterfaceStyleUnspecified;
        }
}

- (void)setTintColor:(UIColor *)tintColor
{
    super.tintColor = tintColor;
}

- (void)setFollowsUserLocation:(BOOL)followsUserLocation
{
    _followsUserLocation = followsUserLocation;
}

- (void)setUserLocationCalloutEnabled:(BOOL)calloutEnabled
{
    _userLocationCalloutEnabled = calloutEnabled;
}

- (void)setHandlePanDrag:(BOOL)handlePanDrag {
    for (UIGestureRecognizer *recognizer in [self gestureRecognizers]) {
        if ([recognizer isKindOfClass:[UIPanGestureRecognizer class]]) {
            recognizer.enabled = handlePanDrag;
            break;
        }
    }
    _handlePanDrag = handlePanDrag;
}

- (void)setRegion:(MKCoordinateRegion)region animated:(BOOL)animated
{
    // If location is invalid, abort
    if (!CLLocationCoordinate2DIsValid(region.center)) {
        return;
    }

    // If new span values are nil, use old values instead
    if (!region.span.latitudeDelta) {
        region.span.latitudeDelta = self.region.span.latitudeDelta;
    }
    if (!region.span.longitudeDelta) {
        region.span.longitudeDelta = self.region.span.longitudeDelta;
    }

    // Animate/move to new position
    [super setRegion:region animated:animated];
}
- (void) setRegion:(MKCoordinateRegion)region
{
    if (!CLLocationCoordinate2DIsValid(region.center)) {
        return;
    }
    if (!CLLocationCoordinate2DIsValid(_initialRegion.center)) {
        [self setInitialRegion:region];
    }
    [self setRegion:region animated:NO];
}

- (void)setInitialRegion:(MKCoordinateRegion)initialRegion {
    if (!CLLocationCoordinate2DIsValid(initialRegion.center)) {
        return;
    }
    _initialRegion = initialRegion;
    _initialRegionProvided = YES;
    if (!_initialRegionSet && _loadingStarted) {
        _initialRegionSet = YES;
        [self setRegion:initialRegion animated:NO];
    }
}

- (void)setCamera:(MKMapCamera*)camera animated:(BOOL)animated
{
    [super setCamera:camera animated:animated];
}


- (void)setInitialCamera:(MKMapCamera*)initialCamera {
    _initialCamera = initialCamera;
    _initialCameraProvided = YES;
    if (initialCamera){
        if (!_initialCameraSet && _loadingStarted) {
            _initialCameraSet = YES;
            [self setCamera:initialCamera animated:NO];
        }
    }
}

- (void)setCacheEnabled:(BOOL)cacheEnabled {
    _cacheEnabled = cacheEnabled;
    if (self.cacheEnabled && self.cacheImageView.image == nil) {
        self.loadingView.hidden = NO;
        [self.activityIndicatorView startAnimating];
    }
    else {
        if (_loadingView != nil) {
            self.loadingView.hidden = YES;
        }
    }
}

- (void)setLoadingEnabled:(BOOL)loadingEnabled {
    _loadingEnabled = loadingEnabled;
    if (!self.hasShownInitialLoading) {
        self.loadingView.hidden = !self.loadingEnabled;
    }
    else {
        if (_loadingView != nil) {
            self.loadingView.hidden = YES;
        }
    }
}

- (void)setShowsPointsOfInterests:(BOOL)showsPointsOfInterests {
    _showsPointsOfInterests = showsPointsOfInterests;

    if (!_initialized) {
        return;
    }

    if (_pointsOfInterestFilter && _pointsOfInterestFilter.count > 0) {
        return; // specific filter takes precedence
    }

    if (@available(iOS 16.0, *)) {
        MKMapConfiguration *newConfig = [self.preferredConfiguration copy] ?: [[MKStandardMapConfiguration alloc] init];
        MKPointOfInterestFilter *filter = showsPointsOfInterests
            ? [MKPointOfInterestFilter filterIncludingAllCategories]
            : [MKPointOfInterestFilter filterExcludingAllCategories];

        if ([newConfig isKindOfClass:[MKStandardMapConfiguration class]]) {
            ((MKStandardMapConfiguration *)newConfig).pointOfInterestFilter = filter;
        } else if ([newConfig isKindOfClass:[MKHybridMapConfiguration class]]) {
            ((MKHybridMapConfiguration *)newConfig).pointOfInterestFilter = filter;
        }

        self.preferredConfiguration = newConfig;
    } else {
        self.showsPointsOfInterest = showsPointsOfInterests;
    }
}

- (void)setPointsOfInterestFilter:(NSArray<NSString *> *)pointsOfInterestFilter {
    _pointsOfInterestFilter = pointsOfInterestFilter;

    if (!_initialized) {
        return;
    }

    // If the filter is nil or empty, fall back to the boolean prop's behavior.
    if (!pointsOfInterestFilter || pointsOfInterestFilter.count == 0) {
        [self setShowsPointsOfInterests:_showsPointsOfInterests];
        return;
    }

    // --- Convert input strings into valid MKPointOfInterestCategory constants ---
    NSArray<MKPointOfInterestCategory> *validCategories = [self getCategoriesFromStrings:pointsOfInterestFilter];

    // If no valid categories were found from the input strings, do nothing.
    if (validCategories.count == 0) {
        return;
    }

    MKPointOfInterestFilter *filter =
        [[MKPointOfInterestFilter alloc] initIncludingCategories:validCategories];

    if (@available(iOS 16.0, *)) {
        MKMapConfiguration *newConfig =
            [self.preferredConfiguration copy] ?: [[MKStandardMapConfiguration alloc] init];

        if ([newConfig isKindOfClass:[MKStandardMapConfiguration class]]) {
            ((MKStandardMapConfiguration *)newConfig).pointOfInterestFilter = filter;
        } else if ([newConfig isKindOfClass:[MKHybridMapConfiguration class]]) {
            ((MKHybridMapConfiguration *)newConfig).pointOfInterestFilter = filter;
        }

        self.preferredConfiguration = newConfig;
    } else {
        self.pointOfInterestFilter = filter;
    }
}

- (UIColor *)loadingBackgroundColor {
    return self.loadingView.backgroundColor;
}

- (void)setLoadingBackgroundColor:(UIColor *)loadingBackgroundColor {
    self.loadingView.backgroundColor = loadingBackgroundColor;
}

- (UIColor *)loadingIndicatorColor {
    return self.activityIndicatorView.color;
}

- (void)setLoadingIndicatorColor:(UIColor *)loadingIndicatorColor {
    self.activityIndicatorView.color = loadingIndicatorColor;
}

- (void)setCameraZoomRange:(NSDictionary *)cameraZoomRange {
        if (cameraZoomRange == nil) {
            cameraZoomRange = @{};
        }

        NSNumber *minValue = cameraZoomRange[@"minCenterCoordinateDistance"];
        NSNumber *maxValue = cameraZoomRange[@"maxCenterCoordinateDistance"];

        if (minValue == nil && maxValue == nil) {
            self.legacyZoomConstraintsEnabled = YES;

            MKMapCameraZoomRange *defaultZoomRange = [[MKMapCameraZoomRange alloc] initWithMinCenterCoordinateDistance:MKMapCameraZoomDefault maxCenterCoordinateDistance:MKMapCameraZoomDefault];
            [super setCameraZoomRange:defaultZoomRange animated:NO];

            return;
        }

        MKMapCameraZoomRange *zoomRange = nil;

        if (minValue != nil && maxValue != nil) {
            zoomRange = [[MKMapCameraZoomRange alloc] initWithMinCenterCoordinateDistance:[minValue doubleValue] maxCenterCoordinateDistance:[maxValue doubleValue]];
        } else if (minValue != nil) {
            zoomRange = [[MKMapCameraZoomRange alloc] initWithMinCenterCoordinateDistance:[minValue doubleValue]];
        } else if (maxValue != nil) {
            zoomRange = [[MKMapCameraZoomRange alloc] initWithMaxCenterCoordinateDistance:[maxValue doubleValue]];
        }

        BOOL animated = [cameraZoomRange[@"animated"] boolValue];

        self.legacyZoomConstraintsEnabled = NO;
        [super setCameraZoomRange:zoomRange animated:animated];
}


- (void)setScrollEnabled:(BOOL)scrollEnabled {
    self.shouldScrollEnabled = [NSNumber numberWithBool:scrollEnabled];
    [self updateScrollEnabled];
}

- (void)updateScrollEnabled {
    if (self.cacheEnabled) {
        [super setScrollEnabled:NO];
    }
    else if (self.shouldScrollEnabled != nil) {
        [super setScrollEnabled:[self.shouldScrollEnabled boolValue]];
    }
}

- (void)setZoomEnabled:(BOOL)zoomEnabled {
    self.shouldZoomEnabled = [NSNumber numberWithBool:zoomEnabled];
    [self updateZoomEnabled];
}

- (void)updateZoomEnabled {
    if (self.cacheEnabled) {
        [super setZoomEnabled: NO];
    }
    else if (self.shouldZoomEnabled != nil) {
        [super setZoomEnabled:[self.shouldZoomEnabled boolValue]];
    }
}

- (void)cacheViewIfNeeded {
    // https://github.com/react-native-maps/react-native-maps/issues/3100
    // Do nothing if app is not active
    if ([[UIApplication sharedApplication] applicationState] != UIApplicationStateActive) {
        return;
    }
    if (self.hasShownInitialLoading) {
        if (!self.cacheEnabled) {
            if (_cacheImageView != nil) {
                self.cacheImageView.hidden = YES;
                self.cacheImageView.image = nil;
            }
        }
        else {
            self.cacheImageView.image = nil;
            self.cacheImageView.hidden = YES;

            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                self.cacheImageView.image = nil;
                self.cacheImageView.hidden = YES;
                UIGraphicsBeginImageContextWithOptions(self.bounds.size, self.opaque, 0.0);
                [self.layer renderInContext:UIGraphicsGetCurrentContext()];
                UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
                UIGraphicsEndImageContext();

                self.cacheImageView.image = image;
                self.cacheImageView.hidden = NO;
            });
        }

        [self updateScrollEnabled];
        [self updateZoomEnabled];
        [self updateLegalLabelInsets];
    }
}

- (void) listenToMemoryWarnings
{
    __weak __typeof(self) weakSelf = self;
    static dispatch_once_t onceToken;
    static dispatch_source_t source;
    dispatch_once(&onceToken, ^{
            source = dispatch_source_create(DISPATCH_SOURCE_TYPE_MEMORYPRESSURE, 0, DISPATCH_MEMORYPRESSURE_WARN|DISPATCH_MEMORYPRESSURE_CRITICAL, dispatch_get_main_queue());
            dispatch_source_set_event_handler(source, ^{
                [weakSelf handleMemoryWarning];
            });
            dispatch_resume(source);
    });
}
/*
 hacky way to release all cache
 this is our last chance to release cache before app crash
 */
- (void) handleMemoryWarning
{
    NSLog(@"handleMemoryWarning warning");
    MKMapType type = self.mapType;
    if (type == MKMapTypeSatellite){
        self.mapType = MKMapTypeStandard;
    } else {
        self.mapType = MKMapTypeSatellite;
    }
    self.mapType = type;
}

- (void)updateLegalLabelInsets {
    if (_legalLabel) {
        dispatch_async(dispatch_get_main_queue(), ^{
            CGRect frame = self->_legalLabel.frame;
            if (self->_legalLabelInsets.left) {
                frame.origin.x = self->_legalLabelInsets.left;
            } else if (self->_legalLabelInsets.right) {
                frame.origin.x = self.frame.size.width - self->_legalLabelInsets.right - frame.size.width;
            }
            if (self->_legalLabelInsets.top) {
                frame.origin.y = self->_legalLabelInsets.top;
            } else if (self->_legalLabelInsets.bottom) {
                frame.origin.y = self.frame.size.height - self->_legalLabelInsets.bottom - frame.size.height;
            }
            self->_legalLabel.frame = frame;
        });
    }
}


- (void)setLegalLabelInsets:(UIEdgeInsets)legalLabelInsets {
    _legalLabelInsets = legalLabelInsets;
    [self updateLegalLabelInsets];
}

- (void)setMapPadding:(UIEdgeInsets)mapPadding {
    self.layoutMargins = mapPadding;
}

- (UIEdgeInsets)mapPadding {
    return self.layoutMargins;
}

- (void)beginLoading {
    if ((!self.hasShownInitialLoading && self.loadingEnabled) || (self.cacheEnabled && self.cacheImageView.image == nil)) {
        self.loadingView.hidden = NO;
        [self.activityIndicatorView startAnimating];
    }
    else {
        if (_loadingView != nil) {
            self.loadingView.hidden = YES;
        }
    }
    _loadingStarted = YES;
    // display initialRegion/Camera
    if (_initialRegionProvided){
        [self setInitialRegion:_initialRegion];
    }
    if (_initialCameraProvided){
        [self setInitialCamera:_initialCamera];
    }
}

- (void)finishLoading {
    self.hasShownInitialLoading = YES;
    if (_loadingView != nil) {
        self.loadingView.hidden = YES;
    }
    [self cacheViewIfNeeded];
}

- (UIActivityIndicatorView *)activityIndicatorView {
    if (_activityIndicatorView == nil) {
        _activityIndicatorView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
        _activityIndicatorView.center = self.loadingView.center;
        _activityIndicatorView.autoresizingMask = UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleBottomMargin | UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin;
        _activityIndicatorView.color = [UIColor colorWithRed:96.f/255.f green:96.f/255.f blue:96.f/255.f alpha:1.f]; // defaults to #606060
    }
    [self.loadingView addSubview:_activityIndicatorView];
    return _activityIndicatorView;
}

- (UIView *)loadingView {
    if (_loadingView == nil) {
        _loadingView = [[UIView alloc] initWithFrame:self.bounds];
        _loadingView.autoresizingMask = UIViewAutoresizingFlexibleWidth|UIViewAutoresizingFlexibleHeight;
        _loadingView.backgroundColor = [UIColor whiteColor]; // defaults to #FFFFFF
        [self addSubview:_loadingView];
        _loadingView.hidden = NO;
    }
    return _loadingView;
}

- (UIImageView *)cacheImageView {
    if (_cacheImageView == nil) {
        _cacheImageView = [[UIImageView alloc] initWithFrame:self.bounds];
        _cacheImageView.contentMode = UIViewContentModeCenter;
        _cacheImageView.autoresizingMask = UIViewAutoresizingFlexibleWidth|UIViewAutoresizingFlexibleHeight;
        [self addSubview:self.cacheImageView];
        _cacheImageView.hidden = YES;
    }
    return _cacheImageView;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    [self cacheViewIfNeeded];
}

// based on https://medium.com/@dmytrobabych/getting-actual-rotation-and-zoom-level-for-mapkit-mkmapview-e7f03f430aa9
- (CGFloat)getZoomLevel {
    CGFloat cameraAngle = self.camera.heading;

    if (cameraAngle > 270) {
        cameraAngle = 360 - cameraAngle;
    } else if (cameraAngle > 90) {
        cameraAngle = fabs(cameraAngle - 180);
    }

    CGFloat angleRad = M_PI * cameraAngle / 180; // map rotation in radians
    CGFloat width = self.frame.size.width;
    CGFloat height = self.frame.size.height;
    CGFloat heightOffset = 20; // the offset (status bar height) which is taken by MapKit into consideration to calculate visible area height

    // calculating Longitude span corresponding to normal (non-rotated) width
    CGFloat spanStraight = width * self.region.span.longitudeDelta / (width * cos(angleRad) + (height - heightOffset) * sin(angleRad));
    int normalizingFactor = 512;

    return log2(360 * ((width / normalizingFactor) / spanStraight));
}

// Helpers

- (NSArray<MKPointOfInterestCategory> *)getCategoriesFromStrings:(NSArray<NSString *> *)stringArray {
    // Use a static dictionary so it's only created once for efficiency.
    static NSDictionary<NSString *, MKPointOfInterestCategory> *categoryMap = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        NSMutableDictionary<NSString *, MKPointOfInterestCategory> *map = [NSMutableDictionary dictionary];

        // --- Categories available since iOS 13.0 ---
        map[@"airport"] = MKPointOfInterestCategoryAirport;
        map[@"amusementPark"] = MKPointOfInterestCategoryAmusementPark;
        map[@"aquarium"] = MKPointOfInterestCategoryAquarium;
        map[@"atm"] = MKPointOfInterestCategoryATM;
        map[@"bakery"] = MKPointOfInterestCategoryBakery;
        map[@"bank"] = MKPointOfInterestCategoryBank;
        map[@"beach"] = MKPointOfInterestCategoryBeach;
        map[@"brewery"] = MKPointOfInterestCategoryBrewery;
        map[@"cafe"] = MKPointOfInterestCategoryCafe;
        map[@"campground"] = MKPointOfInterestCategoryCampground;
        map[@"carRental"] = MKPointOfInterestCategoryCarRental;
        map[@"evCharger"] = MKPointOfInterestCategoryEVCharger;
        map[@"fireStation"] = MKPointOfInterestCategoryFireStation;
        map[@"fitnessCenter"] = MKPointOfInterestCategoryFitnessCenter;
        map[@"foodMarket"] = MKPointOfInterestCategoryFoodMarket;
        map[@"gasStation"] = MKPointOfInterestCategoryGasStation;
        map[@"hospital"] = MKPointOfInterestCategoryHospital;
        map[@"hotel"] = MKPointOfInterestCategoryHotel;
        map[@"laundry"] = MKPointOfInterestCategoryLaundry;
        map[@"library"] = MKPointOfInterestCategoryLibrary;
        map[@"marina"] = MKPointOfInterestCategoryMarina;
        map[@"movieTheater"] = MKPointOfInterestCategoryMovieTheater;
        map[@"museum"] = MKPointOfInterestCategoryMuseum;
        map[@"nationalPark"] = MKPointOfInterestCategoryNationalPark;
        map[@"nightlife"] = MKPointOfInterestCategoryNightlife;
        map[@"park"] = MKPointOfInterestCategoryPark;
        map[@"parking"] = MKPointOfInterestCategoryParking;
        map[@"pharmacy"] = MKPointOfInterestCategoryPharmacy;
        map[@"police"] = MKPointOfInterestCategoryPolice;
        map[@"postOffice"] = MKPointOfInterestCategoryPostOffice;
        map[@"publicTransport"] = MKPointOfInterestCategoryPublicTransport;
        map[@"restaurant"] = MKPointOfInterestCategoryRestaurant;
        map[@"restroom"] = MKPointOfInterestCategoryRestroom;
        map[@"school"] = MKPointOfInterestCategorySchool;
        map[@"stadium"] = MKPointOfInterestCategoryStadium;
        map[@"store"] = MKPointOfInterestCategoryStore;
        map[@"theater"] = MKPointOfInterestCategoryTheater;
        map[@"university"] = MKPointOfInterestCategoryUniversity;
        map[@"winery"] = MKPointOfInterestCategoryWinery;
        map[@"zoo"] = MKPointOfInterestCategoryZoo;

// Only include if building with iOS 18.0+ SDK (Xcode 16+)
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 180000
        // --- Categories available since iOS 18.0 ---
        if (@available(iOS 18.0, *)) {
            map[@"animalService"] = MKPointOfInterestCategoryAnimalService;
            map[@"automotiveRepair"] = MKPointOfInterestCategoryAutomotiveRepair;
            map[@"baseball"] = MKPointOfInterestCategoryBaseball;
            map[@"basketball"] = MKPointOfInterestCategoryBasketball;
            map[@"beauty"] = MKPointOfInterestCategoryBeauty;
            map[@"bowling"] = MKPointOfInterestCategoryBowling;
            map[@"castle"] = MKPointOfInterestCategoryCastle;
            map[@"conventionCenter"] = MKPointOfInterestCategoryConventionCenter;
            map[@"distillery"] = MKPointOfInterestCategoryDistillery;
            map[@"fairground"] = MKPointOfInterestCategoryFairground;
            map[@"fishing"] = MKPointOfInterestCategoryFishing;

            map[@"fortress"] = MKPointOfInterestCategoryFortress;
            map[@"golf"] = MKPointOfInterestCategoryGolf;
            map[@"goKart"] = MKPointOfInterestCategoryGoKart;
            map[@"hiking"] = MKPointOfInterestCategoryHiking;
            map[@"kayaking"] = MKPointOfInterestCategoryKayaking;
            map[@"landmark"] = MKPointOfInterestCategoryLandmark;
            map[@"mailbox"] = MKPointOfInterestCategoryMailbox;
            map[@"miniGolf"] = MKPointOfInterestCategoryMiniGolf;
            map[@"musicVenue"] = MKPointOfInterestCategoryMusicVenue;
            map[@"nationalMonument"] = MKPointOfInterestCategoryNationalMonument;
            map[@"planetarium"] = MKPointOfInterestCategoryPlanetarium;
            map[@"rockClimbing"] = MKPointOfInterestCategoryRockClimbing;
            map[@"rvPark"] = MKPointOfInterestCategoryRVPark;
            map[@"skatePark"] = MKPointOfInterestCategorySkatePark;
            map[@"skating"] = MKPointOfInterestCategorySkating;
            map[@"skiing"] = MKPointOfInterestCategorySkiing;
            map[@"soccer"] = MKPointOfInterestCategorySoccer;
            map[@"spa"] = MKPointOfInterestCategorySpa;
            map[@"surfing"] = MKPointOfInterestCategorySurfing;
            map[@"swimming"] = MKPointOfInterestCategorySwimming;
            map[@"tennis"] = MKPointOfInterestCategoryTennis;
            map[@"volleyball"] = MKPointOfInterestCategoryVolleyball;
        }
#endif
        
        categoryMap = [map copy];
    });

    NSMutableArray<MKPointOfInterestCategory> *validCategories = [NSMutableArray array];
    for (NSString *str in stringArray) {
        // Direct, case-sensitive lookup for camelCase keys
        MKPointOfInterestCategory category = categoryMap[str];
        if (category) {
            [validCategories addObject:category];
        } else {
            NSLog(@"[MapView] Warning: Unknown or unavailable point of interest category string '%@'", str);
        }
    }
    return validCategories;
}

@end
