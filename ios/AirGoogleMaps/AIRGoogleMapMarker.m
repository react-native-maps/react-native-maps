//
//  AIRGoogleMapMarker.m
//  AirMaps
//
//  Created by Gil Birman on 9/2/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import "AIRGoogleMapMarker.h"
#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTBridge.h>
#import <React/RCTBridge+Private.h>
#import <React/RCTImageLoaderProtocol.h>
#import <React/RCTUtils.h>
#import "AIRGMSMarker.h"
#import "AIRGoogleMapCallout.h"
#import "AIRDummyView.h"

/**
 * Whether we draw our views into an image ourselves, instead of letting
 * Google render them. Only Fabric (the new architecture) tells us when React
 * changed our views, through RNMapsGoogleMapView's mountingTransactionDidMount.
 * On the old architecture, we keep Google's own tracksViewChanges.
 *
 * We only ship the new architecture, but this file still compiles for the
 * library's old-architecture builds. We keep that path working instead of
 * breaking it, which also keeps this patch closer to something we could
 * upstream.
 */
#ifdef RCT_NEW_ARCH_ENABLED
static const BOOL drawsIconIntoImage = YES;
#else
static const BOOL drawsIconIntoImage = NO;
#endif

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
    UIImage *_iconImage;
    UIView *_iconView;
    UIColor *_pinColor;
    CLLocationCoordinate2D _coordinates;
    CLLocationDegrees _rotation;
    BOOL _tracksInfoWindowChanges;
    /**
     * With tracksViewChanges={true} on Fabric, we draw our views into an
     * image at the end of each mounting transaction that changed one of
     * them, instead of letting Google re-render the icon every frame. See
     * redrawIfNeededAfterMountingTransaction:.
     *
     * That only catches changes React makes. Views that change on their own,
     * like GIFs, Lottie animations, or Animated values with useNativeDriver,
     * keep their last image until React changes the marker or someone calls
     * redraw.
     */
    BOOL _tracksViewChanges;
    /**
     * React tags of the views in our icon, so we can tell whether a mounting
     * transaction touched them. nil when views were added or removed since we
     * last collected them, and after each redraw, since the transaction that
     * caused it might have added or removed views deeper in our icon.
     */
    NSSet<NSNumber *> *_iconViewTags;
    /** Whether our children changed since our last redraw */
    BOOL _needsRedraw;
    /**
     * Whether we draw at the end of this mounting transaction, even with
     * tracksViewChanges off. That's when tracking just turned off, or when
     * Fabric resized us.
     */
    BOOL _isRedrawPending;
    BOOL _draggable;
    BOOL _tappable;
    BOOL _flat;
    double _opacity;
    NSString* _identifier;
    NSString* _title;
    NSString* _subtitle;

}

- (instancetype)init
{
    if ((self = [super init])) {
        _tracksViewChanges = true;
        _tracksInfoWindowChanges = false;
        _tappable = true;
        _opacity = 1.0;
    }
    return self;
}

- (void)layoutSubviews {
    float width = 0;
    float height = 0;

    for (UIView *v in [_iconView subviews]) {

        float fw = v.frame.origin.x + v.frame.size.width;
        float fh = v.frame.origin.y + v.frame.size.height;

        width = MAX(fw, width);
        height = MAX(fh, height);
    }

    [_iconView setFrame:CGRectMake(0, 0, width, height)];
}


- (UIView *) iconView
{
    return _iconView;
}

- (void) didUpdateReactSubviews
{
    [super didUpdateReactSubviews];
    if (_iconView){
        [_iconView setFrame:self.frame];
    }
}

- (void) didInsertInMap:(AIRGoogleMap *) map
{
    _realMarker = [AIRGMSMarker new];
    _realMarker.fakeMarker = self;
    // When we draw the icon into an image, we redraw on change ourselves, so
    // Google never needs to re-render every frame
    _realMarker.tracksViewChanges = drawsIconIntoImage ? NO : _tracksViewChanges;
    _realMarker.tracksInfoWindowChanges = _tracksInfoWindowChanges;

    [_realMarker setPosition:_coordinates];
    if (_iconView){
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
    if (_pinColor){
        _realMarker.icon = [GMSMarker markerImageWithColor:_pinColor];
    }
    if (_iconSrc){
        if (_iconImage){
            _realMarker.icon = _iconImage;
        } else {
            [self setIconSrc:_iconSrc];
        }
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
    [_realMarker setMap:map];
}

- (void)iconViewInsertSubview:(UIView*)subview atIndex:(NSInteger)atIndex {
    if (!_iconView){
        _iconView = [[UIView alloc] init];
    }
    if (!_realMarker.iconView) {
        _realMarker.iconView = _iconView;
    }
    [_iconView insertSubview:subview atIndex:atIndex];
}

- (void)insertReactSubview:(id<RCTComponent>)subview atIndex:(NSInteger)atIndex {
    if ([subview isKindOfClass:[AIRGoogleMapCallout class]]) {
        self.calloutView = (AIRGoogleMapCallout *)subview;
    } else { // a child view of the marker
        [self iconViewInsertSubview:(UIView*)subview atIndex:atIndex+1];
        _iconViewTags = nil;
        _needsRedraw = YES;
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
        _iconViewTags = nil;
        _needsRedraw = YES;
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
    if (!drawsIconIntoImage) {
        [self redrawWithGoogle];
        return;
    }
    if (!_iconView || !_realMarker) return;
    _needsRedraw = NO;

    // We draw our views into an image ourselves and give Google that, instead
    // of letting Google render them with its own tracksViewChanges:
    // 1. Google re-renders a tracking marker's views every frame, even when
    //    nothing changed. We only draw after React changes them.
    // 2. Google hides a marker for a frame while it re-renders its views, so
    //    the marker flickers. We swap in a new image without a frame gap.

    // The icon view may still have its old size until our next layout pass.
    // Fabric already set our frame for this transaction, so update the size
    // now to draw the new contents at the new size.
    if (!CGSizeEqualToSize(self.bounds.size, CGSizeZero)) {
        [_iconView setFrame:CGRectMake(0, 0, self.bounds.size.width, self.bounds.size.height)];
    }

    if (CGRectIsEmpty(_iconView.bounds)) return;
    [_iconView layoutIfNeeded];

    // Views like text draw their contents only when UIKit is about to show
    // them. Our icon view isn't on screen, so we ask them to draw now.
    [self displayLayerTreeIfNeeded:_iconView.layer];

    // renderInContext draws sublayers in array order and ignores zPosition.
    // Fabric puts each view's background and border in layers after its
    // children, with a negative zPosition to show them behind. To work with
    // that, we sort sublayers by zPosition to draw, then put them back.
    [CATransaction begin];
    [CATransaction setDisableActions:YES];
    // [layer, original sublayers] for each layer we sort
    NSMutableArray<NSArray *> *originalSublayers = [NSMutableArray new];
    NSMutableArray<CALayer *> *layersToSort = [NSMutableArray arrayWithObject:_iconView.layer];
    while (layersToSort.count > 0) {
        CALayer *layer = layersToSort.lastObject;
        [layersToSort removeLastObject];
        NSArray<CALayer *> *sublayers = layer.sublayers ?: @[];
        NSArray<CALayer *> *sorted = [sublayers sortedArrayWithOptions:NSSortStable usingComparator:^NSComparisonResult(CALayer *a, CALayer *b) {
            if (a.zPosition < b.zPosition) return NSOrderedAscending;
            if (a.zPosition > b.zPosition) return NSOrderedDescending;
            return NSOrderedSame;
        }];
        if (sublayers.count > 1 && ![sorted isEqualToArray:sublayers]) {
            [originalSublayers addObject:@[layer, sublayers]];
            layer.sublayers = sorted;
        }
        [layersToSort addObjectsFromArray:sorted];
    }
    UIGraphicsImageRenderer *renderer = [[UIGraphicsImageRenderer alloc] initWithBounds:_iconView.bounds];
    UIView *iconView = _iconView;
    UIImage *image = [renderer imageWithActions:^(UIGraphicsImageRendererContext *context) {
        [iconView.layer renderInContext:context.CGContext];
    }];

    // Restore the original sublayer order for each layer we sorted
    for (NSArray *layerAndSublayers in originalSublayers) {
        ((CALayer *)layerAndSublayers[0]).sublayers = layerAndSublayers[1];
    }
    [CATransaction commit];

    _realMarker.iconView = nil;
    _realMarker.icon = image;
}

- (void)setNeedsRedrawAfterMountingTransaction {
    _isRedrawPending = YES;
}

- (void)redrawIfNeededAfterMountingTransaction:(NSSet<NSNumber *> *)changedViewTags {
    if (!_iconView) return;
    if (_isRedrawPending) {
        _isRedrawPending = NO;
        _iconViewTags = nil;
        [self redraw];
        return;
    }
    if (!_tracksViewChanges) return;

    // Most transactions change views outside our icon, like other markers or
    // the rest of the screen. We only redraw when the views the transaction
    // changed include one of ours.
    if (!_iconViewTags) {
        NSMutableSet<NSNumber *> *tags = [NSMutableSet new];
        [self collectTagsOfView:_iconView into:tags];
        _iconViewTags = tags;
    }
    // A non-nil iconView means a child was just added, and Google would
    // render it live until we replace it with an image
    BOOL isShowingIconView = _realMarker.iconView != nil;
    if (!_needsRedraw && !isShowingIconView && ![_iconViewTags intersectsSet:changedViewTags]) return;

    _iconViewTags = nil;
    [self redraw];
}

/** Upstream react-native-maps' redraw, for the old architecture */
- (void)redrawWithGoogle {
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

- (void)displayLayerTreeIfNeeded:(CALayer *)layer {
    [layer displayIfNeeded];
    for (CALayer *sublayer in layer.sublayers) {
        [self displayLayerTreeIfNeeded:sublayer];
    }
}

/**
 * Collects the React tags of a view and everything inside it. We compare
 * them with the tags a mounting transaction changed, to tell whether it
 * changed our icon and we need to redraw.
 */
- (void)collectTagsOfView:(UIView *)view into:(NSMutableSet<NSNumber *> *)tags {
    // Fabric sets each view's tag to its React tag. Our own views have tag 0.
    if (view.tag != 0) {
        [tags addObject:@(view.tag)];
    }
    for (UIView *subview in view.subviews) {
        [self collectTagsOfView:subview into:tags];
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

// By default, Core Animation animates changes to layer properties over 0.25s.
// That includes the marker layer's opacity:
// https://developers.google.com/maps/documentation/ios-sdk/reference/objc/Classes/GMSMarkerLayer
//
// The 0.25s comes from the iOS SDK header CATransaction.h, which says
// animationDuration "Defaults to 1/4s".
//
// Animated sets a new opacity every frame, so the marker would lag behind. We
// instead set the opacity in a transaction with actions disabled, so it takes
// effect immediately:
// https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CoreAnimation_guide/ReactingtoLayerChanges/ReactingtoLayerChanges.html#//apple_ref/doc/uid/TP40004514-CH7-SW3
- (void)setOpacity:(double)opacity
{
    [CATransaction begin];
    [CATransaction setDisableActions:YES];
    _realMarker.opacity = opacity;
    _opacity = opacity;
    [CATransaction commit];
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

    _reloadImageCancellationBlock = [[[RCTBridge currentBridge] moduleForName:@"ImageLoader"] loadImageWithURLRequest:[RCTConvert NSURLRequest:_imageSrc]
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
    _iconImage = nil;

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
    [[[RCTBridge currentBridge] moduleForName:@"ImageLoader"] loadImageWithURLRequest:[RCTConvert NSURLRequest:_iconSrc]
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
            self->_iconImage = image;
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
    _realMarker.icon = [GMSMarker markerImageWithColor:pinColor];
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
    BOOL wasTracking = _tracksViewChanges;
    _tracksViewChanges = tracksViewChanges;
    if (!drawsIconIntoImage) {
        _realMarker.tracksViewChanges = tracksViewChanges;
        return;
    }
    // We leave Google's tracksViewChanges off when we draw the icon into an
    // image, since we track view changes ourselves. See redraw.

    // Draw one last time when tracking turns off, at the end of this
    // mounting transaction. A common pattern is
    // tracksViewChanges={!imageLoaded}: the same React update that turns
    // tracking off can also change our views.
    if (wasTracking && !tracksViewChanges) {
        _isRedrawPending = YES;
    }
}

- (BOOL)tracksViewChanges {
    return _tracksViewChanges;
}

- (void)setTracksInfoWindowChanges:(BOOL)tracksInfoWindowChanges {
    _tracksInfoWindowChanges = tracksInfoWindowChanges;
    _realMarker.tracksInfoWindowChanges = tracksInfoWindowChanges;
}

- (BOOL)tracksInfoWindowChanges {
    return _realMarker.tracksInfoWindowChanges;
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
