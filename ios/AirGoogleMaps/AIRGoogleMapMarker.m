//
//  AIRGoogleMapMarker.m
//  AirMaps
//
//  Created by Gil Birman on 9/2/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import "AIRGoogleMapMarker.h"
#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTImageLoaderProtocol.h>
#import <React/RCTUtils.h>
#import "AIRGMSMarker.h"
#import "AIRGoogleMapCallout.h"
#import "AIRDummyView.h"

// A shared cache for marker snapshots to reuse images and save memory
static NSCache *markerSnapshotCache;

CGRect unionRect(CGRect a, CGRect b) {
    return CGRectMake(
                      MIN(a.origin.x, b.origin.x),
                      MIN(a.origin.y, b.origin.y),
                      MAX(a.size.width, b.size.width),
                      MAX(a.size.height, b.size.height));
}

@interface AIRGoogleMapMarker ()
@end

@implementation AIRGoogleMapMarker {
    RCTImageLoaderCancellationBlock _reloadImageCancellationBlock;
    RCTBubblingEventBlock _onPress;
    RCTDirectEventBlock _onSelect;
    RCTDirectEventBlock _onDeselect;
    __weak UIImageView *_iconImageView;
    UIView *_iconView;
    UIColor *_pinColor;
    CLLocationCoordinate2D _coordinates;
    CLLocationDegrees _rotation;
    BOOL _tracksInfoWindowChanges;
    BOOL _tracksViewChanges;
    BOOL _draggable;
    BOOL _tappable;
    BOOL _flat;
    double _opacity;
    NSString* _identifier;
    NSString* _title;
    NSString* _subtitle;
    
    BOOL _useSnapshot;
    BOOL _isSnapshotDirty;
    NSString* _snapshotCacheKey;
}

// Singleton accessor for the shared cache
+ (NSCache *)sharedMarkerSnapshotCache {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        markerSnapshotCache = [[NSCache alloc] init];
        markerSnapshotCache.countLimit = 100;
    });
    return markerSnapshotCache;
}

- (instancetype)init
{
    if ((self = [super init])) {
        _tracksViewChanges = true;
        _tracksInfoWindowChanges = false;
        _tappable = true;
        _opacity = 1.0;
        
        _useSnapshot = false;
        _isSnapshotDirty = false;
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    float width = 0;
    float height = 0;

    for (UIView *v in [_iconView subviews]) {

        float fw = v.frame.origin.x + v.frame.size.width;
        float fh = v.frame.origin.y + v.frame.size.height;

        width = MAX(fw, width);
        height = MAX(fh, height);
    }

    CGRect newFrame = CGRectMake(0, 0, width, height);
    
    if (_iconView && !CGRectEqualToRect(_iconView.frame, newFrame)) {
        [_iconView setFrame:newFrame];
        _isSnapshotDirty = YES;
    }

    if (_useSnapshot && _isSnapshotDirty) {
        [self generateSnapshot];
    }
}

- (UIView *) iconView
{
    return _iconView;
}

- (void)generateSnapshot {
    if (!_useSnapshot || !_isSnapshotDirty || !_realMarker || !_iconView) return;
    if (CGSizeEqualToSize(_iconView.bounds.size, CGSizeZero)) return;
    
    BOOL hasCacheKey = _snapshotCacheKey && _snapshotCacheKey.length > 0;

    // Use the cache only if an explicit snapshotKey is provided.
    if (hasCacheKey) {
        UIImage *cachedImage = [[[self class] sharedMarkerSnapshotCache] objectForKey:_snapshotCacheKey];
        if (cachedImage) {
            _realMarker.icon = cachedImage; // Use cached image
            _realMarker.iconView = nil;
            _realMarker.tracksViewChanges = NO;
            _isSnapshotDirty = NO;
            return;
        }
    }

    UIGraphicsBeginImageContextWithOptions(_iconView.bounds.size, NO, 0.0);
    [_iconView.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *snapshotImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    if (snapshotImage) {
        if (hasCacheKey) {
            [[[self class] sharedMarkerSnapshotCache] setObject:snapshotImage forKey:_snapshotCacheKey];
        }

        _realMarker.icon = snapshotImage;
        _realMarker.iconView = nil;
        _realMarker.tracksViewChanges = NO;
    }

    _isSnapshotDirty = NO;
}

- (void) didUpdateReactSubviews
{
    [super didUpdateReactSubviews];
    
    if (_iconView){
        [_iconView setFrame:self.frame];
    }
    
    if (_useSnapshot) {
        _isSnapshotDirty = YES;
        [self setNeedsLayout];
    }
}

- (void) didInsertInMap:(AIRGoogleMap *) map
{
    _realMarker = [AIRGMSMarker new];
    _realMarker.fakeMarker = self;
    _realMarker.tracksViewChanges = _useSnapshot ? NO : _tracksViewChanges;
    _realMarker.tracksInfoWindowChanges = _tracksInfoWindowChanges;

    [_realMarker setPosition:_coordinates];
    if (_iconView && !_useSnapshot){
        [_realMarker setIconView:_iconView];
    }
    if (_rotation != 0){
        [_realMarker setRotation:_rotation];
    }
    if (_identifier){
        [_realMarker setIdentifier:_identifier];
    }
    if (_title){
        [_realMarker setTitle:_title];
    }
    if (_subtitle){
        [_realMarker setSnippet:_subtitle];
    }
    if (!CGPointEqualToPoint(_anchor, CGPointZero)){
        [_realMarker setGroundAnchor:_anchor];
    }
    if (!CGPointEqualToPoint(_calloutAnchor, CGPointZero)){
        [_realMarker setInfoWindowAnchor:_calloutAnchor];
    }
    if (_flat){
        [_realMarker setFlat:_flat];
    }
    if (_draggable){
        [_realMarker setDraggable:_draggable];
    }
    [_realMarker setTappable:_tappable];
    if (_pinColor && !_useSnapshot){
        _realMarker.icon = [GMSMarker markerImageWithColor:_pinColor];
    }
    if (_opacity != 1.0){
        [_realMarker setOpacity:_opacity];
    }
    if (_onSelect){
        [_realMarker setOnSelect:_onSelect];
    }
    if (_onDeselect){
        [_realMarker setOnDeselect:_onDeselect];
    }
    if (_onPress){
        [_realMarker setOnPress:_onPress];
    }
    if (_zIndex){
        [_realMarker setZIndex:_zIndex];
    }
    if (_useSnapshot) {
        _isSnapshotDirty = YES;
        [self generateSnapshot];
    }
    [_realMarker setMap:map];
}

- (void)iconViewInsertSubview:(UIView*)subview atIndex:(NSInteger)atIndex {
    if (!_iconView){
        _iconView = [[UIView alloc] init];
    }
    if (!_realMarker.iconView && !_useSnapshot) {
        _realMarker.iconView = _iconView;
    }
    if (_useSnapshot) {
        // prevent glitch with marker (cf. https://github.com/react-native-maps/react-native-maps/issues/3657)
        UIImage *emptyImage = [[UIImage alloc] init];
        _realMarker.icon = emptyImage;
    }
    [_iconView insertSubview:subview atIndex:atIndex];
    _isSnapshotDirty = YES;
}

- (void)insertReactSubview:(id<RCTComponent>)subview atIndex:(NSInteger)atIndex {
    if ([subview isKindOfClass:[AIRGoogleMapCallout class]]) {
        self.calloutView = (AIRGoogleMapCallout *)subview;
    } else { // a child view of the marker
        [self iconViewInsertSubview:(UIView*)subview atIndex:atIndex+1];
    }
    AIRDummyView *dummySubview = [[AIRDummyView alloc] initWithView:(UIView *)subview];
    [super insertReactSubview:(UIView*)dummySubview atIndex:atIndex];
}

- (void)removeReactSubview:(id<RCTComponent>)dummySubview {
    UIView *subview = [dummySubview isKindOfClass:[AIRDummyView class]] ? ((AIRDummyView *)dummySubview).view : (UIView *)dummySubview;

    if ([subview isKindOfClass:[AIRGoogleMapCallout class]]) {
        self.calloutView = nil;
    } else {
        [subview removeFromSuperview];
        _isSnapshotDirty = YES;
    }
    [super removeReactSubview:(UIView*)dummySubview];
}

- (void)showCalloutView {
    [_realMarker.map setSelectedMarker:_realMarker];
}

- (void)hideCalloutView {
    [_realMarker.map setSelectedMarker:Nil];
}

- (void)redraw {
    if (_useSnapshot) {
        _isSnapshotDirty = YES;
        [self generateSnapshot];
        
        return;
    }
    
    if (!_realMarker.iconView) return;

    BOOL oldValue = _realMarker.tracksViewChanges;

    if (oldValue == YES)
    {
        // Immediate refresh, like right now. Not waiting for next frame.
        UIView *view = _realMarker.iconView;
        _realMarker.iconView = nil;
        _realMarker.iconView = view;
    }
    else
    {
        // Refresh according to docs
        _realMarker.tracksViewChanges = YES;
        _realMarker.tracksViewChanges = NO;
    }
}

- (UIView *)markerInfoContents {
    if (self.calloutView && !self.calloutView.tooltip) {
        return self.calloutView;
    }
    return nil;
}

- (UIView *)markerInfoWindow {
    if (self.calloutView && self.calloutView.tooltip) {
        return self.calloutView;
    }
    return nil;
}

- (void)didTapInfoWindowOfMarker:(AIRGMSMarker *)marker point:(CGPoint)point frame:(CGRect)frame {
    if (self.calloutView && self.calloutView.onPress) {
        //todo: why not 'callout-press' ?
        id event = @{
            @"action": @"marker-overlay-press",
            @"id": self.identifier ?: @"unknown",
            @"point": @{
                @"x": @(point.x),
                @"y": @(point.y),
            },
            @"frame": @{
                @"x": @(frame.origin.x),
                @"y": @(frame.origin.y),
                @"width": @(frame.size.width),
                @"height": @(frame.size.height),
            }
        };
        self.calloutView.onPress(event);
    }
}

- (void)didTapInfoWindowOfMarker:(AIRGMSMarker *)marker {
    [self didTapInfoWindowOfMarker:marker point:CGPointMake(-1, -1) frame:CGRectZero];
}

- (void)didTapInfoWindowOfMarker:(AIRGMSMarker *)marker subview:(AIRGoogleMapCalloutSubview*)subview point:(CGPoint)point frame:(CGRect)frame {
    if (subview && subview.onPress) {
        //todo: why not 'callout-inside-press' ?
        id event = @{
            @"action": @"marker-inside-overlay-press",
            @"id": self.identifier ?: @"unknown",
            @"point": @{
                @"x": @(point.x),
                @"y": @(point.y),
            },
            @"frame": @{
                @"x": @(frame.origin.x),
                @"y": @(frame.origin.y),
                @"width": @(frame.size.width),
                @"height": @(frame.size.height),
            }
        };
        subview.onPress(event);
    } else {
        [self didTapInfoWindowOfMarker:marker point:point frame:frame];
    }
}

- (void)didBeginDraggingMarker:(AIRGMSMarker *)marker {
    if (!self.onDragStart) return;
    self.onDragStart([self makeEventData]);
}

- (void)didEndDraggingMarker:(AIRGMSMarker *)marker {
    if (!self.onDragEnd) return;
    self.onDragEnd([self makeEventData]);
}

- (void)didDragMarker:(AIRGMSMarker *)marker {
    if (!self.onDrag) return;
    self.onDrag([self makeEventData]);
}

- (void)setCoordinate:(CLLocationCoordinate2D)coordinate {
    _realMarker.position = coordinate;
    _coordinates = coordinate;
}

- (CLLocationCoordinate2D)coordinate {
    return _realMarker.position;
}

- (void)setRotation:(CLLocationDegrees)rotation {
    _realMarker.rotation = rotation;
    _rotation = rotation;
}

- (CLLocationDegrees)rotation {
    return _realMarker.rotation;
}

- (void)setIdentifier:(NSString *)identifier {
    _realMarker.identifier = identifier;
    _identifier = identifier;
}

- (NSString *)identifier {
    return _realMarker.identifier;
}

- (void)setOnPress:(RCTBubblingEventBlock)onPress {
    _realMarker.onPress = onPress;
    _onPress = onPress;
}

- (RCTBubblingEventBlock)onPress {
    return _realMarker.onPress;
}

- (void)setOnSelect:(RCTDirectEventBlock)onSelect {
    _realMarker.onSelect = onSelect;
    _onSelect = onSelect;
}

- (RCTDirectEventBlock)onSelect {
    return _realMarker.onSelect;
}

- (void)setOnDeselect:(RCTDirectEventBlock)onDeselect {
    _realMarker.onDeselect = onDeselect;
    _onDeselect = onDeselect;
}

- (RCTDirectEventBlock)onDeselect {
    return _realMarker.onDeselect;
}

- (void)setOpacity:(double)opacity
{
    _realMarker.opacity = opacity;
    _opacity = opacity;
}

- (void)setImageSrc:(NSString *)imageSrc
{
    _imageSrc = imageSrc;

    if (_reloadImageCancellationBlock) {
        _reloadImageCancellationBlock();
        _reloadImageCancellationBlock = nil;
    }

    if (!_imageSrc) {
        if (_iconImageView) [_iconImageView removeFromSuperview];
        return;
    }

    if (!_iconImageView) {
        // prevent glitch with marker (cf. https://github.com/react-native-maps/react-native-maps/issues/738)
        UIImageView *empyImageView = [[UIImageView alloc] init];
        _iconImageView = empyImageView;
        [self iconViewInsertSubview:_iconImageView atIndex:0];
    }
    __weak AIRGoogleMapMarker* weakSelf = self;

    _reloadImageCancellationBlock = [[_bridge moduleForName:@"ImageLoader"] loadImageWithURLRequest:[RCTConvert NSURLRequest:_imageSrc]
                                                                                               size:self.bounds.size
                                                                                              scale:RCTScreenScale()
                                                                                            clipped:YES
                                                                                         resizeMode:RCTResizeModeCenter
                                                                                      progressBlock:nil
                                                                                   partialLoadBlock:nil
                                                                                    completionBlock:^(NSError *error, UIImage *image) {
        if (error) {
            // TODO(lmr): do something with the error?
            NSLog(@"%@", error);
        }

        dispatch_async(dispatch_get_main_queue(), ^{
            __strong AIRGoogleMapMarker* strongSelf  = weakSelf;

            // TODO(gil): This way allows different image sizes
            if (strongSelf->_iconImageView) [strongSelf->_iconImageView removeFromSuperview];

            // ... but this way is more efficient?
            //                                                                   if (_iconImageView) {
            //                                                                     [_iconImageView setImage:image];
            //                                                                     return;
            //                                                                   }

            UIImageView *imageView = [[UIImageView alloc] initWithImage:image];

            // TODO: w,h or pixel density could be a prop.
            float density = 1;
            float w = image.size.width/density;
            float h = image.size.height/density;
            CGRect bounds = CGRectMake(0, 0, w, h);

            imageView.contentMode = UIViewContentModeScaleAspectFit;
            [imageView setFrame:bounds];

            // NOTE: sizeToFit doesn't work instead. Not sure why.
            // TODO: Doing it this way is not ideal because it causes things to reshuffle
            //       when the image loads IF the image is larger than the UIView.
            //       Shouldn't required images have size info automatically via RN?
            CGRect selfBounds = unionRect(bounds, self.bounds);
            [strongSelf setFrame:selfBounds];

            strongSelf->_iconImageView = imageView;
            [strongSelf iconViewInsertSubview:imageView atIndex:0];
            [strongSelf layoutSubviews];
            [strongSelf.realMarker setIconView:strongSelf.iconView];
        });
    }];
}

- (void)setIconSrc:(NSString *)iconSrc
{
    _iconSrc = iconSrc;

    if (_reloadImageCancellationBlock) {
        _reloadImageCancellationBlock();
        _reloadImageCancellationBlock = nil;
    }

    if (!_realMarker.icon) {
        // prevent glitch with marker (cf. https://github.com/react-native-maps/react-native-maps/issues/3657)
        UIImage *emptyImage = [[UIImage alloc] init];
        _realMarker.icon = emptyImage;
    }

    _reloadImageCancellationBlock =
    [[_bridge moduleForName:@"ImageLoader"] loadImageWithURLRequest:[RCTConvert NSURLRequest:_iconSrc]
                                                               size:self.bounds.size
                                                              scale:RCTScreenScale()
                                                            clipped:YES
                                                         resizeMode:RCTResizeModeCenter
                                                      progressBlock:nil
                                                   partialLoadBlock:nil
                                                    completionBlock:^(NSError *error, UIImage *image) {
        if (error) {
            // TODO(lmr): do something with the error?
            NSLog(@"%@", error);
        }
        dispatch_async(dispatch_get_main_queue(), ^{
            self->_realMarker.icon = image;
        });
    }];
}

- (void)setTitle:(NSString *)title {
    _realMarker.title = [title copy];
    _title = title;
}

- (NSString *)title {
    return _realMarker.title;
}

- (void)setSubtitle:(NSString *)subtitle {
    _realMarker.snippet = subtitle;
    _subtitle = subtitle;
}

- (NSString *)subtitle {
    return _realMarker.snippet;
}

- (void)setPinColor:(UIColor *)pinColor {
    _pinColor = pinColor;
    if (!_iconView && !_useSnapshot) {
        _realMarker.icon = [GMSMarker markerImageWithColor:pinColor];
    }
}

- (void)setAnchor:(CGPoint)anchor {
    _anchor = anchor;
    _realMarker.groundAnchor = anchor;
}

- (void)setCalloutAnchor:(CGPoint)calloutAnchor {
    _calloutAnchor = calloutAnchor;
    _realMarker.infoWindowAnchor = calloutAnchor;
}


- (void)setZIndex:(NSInteger)zIndex
{
    _zIndex = zIndex;
    _realMarker.zIndex = (int)zIndex;
}

- (void)setDraggable:(BOOL)draggable {
    _realMarker.draggable = draggable;
    _draggable = draggable;
}

- (BOOL)draggable {
    return _realMarker.draggable;
}

- (void)setTappable:(BOOL)tappable {
    _realMarker.tappable = tappable;
    _tappable = tappable;
}

- (BOOL)tappable {
    return _realMarker.tappable;
}

- (void)setFlat:(BOOL)flat {
    _realMarker.flat = flat;
    _flat = flat;
}

- (BOOL)flat {
    return _realMarker.flat;
}

- (void)setTracksViewChanges:(BOOL)tracksViewChanges {
    _tracksViewChanges = tracksViewChanges;
    _realMarker.tracksViewChanges = _useSnapshot ? NO : tracksViewChanges;
}

- (BOOL)tracksViewChanges {
    return _realMarker.tracksViewChanges;
}

- (void)setTracksInfoWindowChanges:(BOOL)tracksInfoWindowChanges {
    _realMarker.tracksInfoWindowChanges = tracksInfoWindowChanges;
}

- (BOOL)tracksInfoWindowChanges {
    return _realMarker.tracksInfoWindowChanges;
}

- (void)setUseSnapshot:(BOOL)useSnapshot {
    if (_useSnapshot == useSnapshot) {
        return;
    }
    
    _useSnapshot = useSnapshot;
    _isSnapshotDirty = YES;

    if (_useSnapshot) {
        [self generateSnapshot];
    } else {
        // Revert to non-snapshot mode
        if (_iconView) {
            _realMarker.icon = nil;
            _realMarker.iconView = _iconView;
            _realMarker.tracksViewChanges = _tracksViewChanges;
        } else if (_pinColor) {
            _realMarker.icon = [GMSMarker markerImageWithColor:_pinColor];
            _realMarker.iconView = nil;
        } else {
            _realMarker.icon = nil;
            _realMarker.iconView = nil;
        }
        
        _realMarker.tracksViewChanges = _tracksViewChanges;
    }
}

- (void)setSnapshotCacheKey:(NSString *)snapshotCacheKey {
    _snapshotCacheKey = [snapshotCacheKey copy];
}

- (id)makeEventData:(NSString *)action {
    CLLocationCoordinate2D coordinate = self.realMarker.position;
    CGPoint position = [self.realMarker.map.projection pointForCoordinate:coordinate];

    return @{
        @"id": self.identifier ?: @"unknown",
        @"position": @{
            @"x": @(position.x),
            @"y": @(position.y),
        },
        @"coordinate": @{
            @"latitude": @(coordinate.latitude),
            @"longitude": @(coordinate.longitude),
        },
        @"action": action,
    };
}

- (id)makeEventData {
    return [self makeEventData:@"unknown"];
}

@end

#endif
