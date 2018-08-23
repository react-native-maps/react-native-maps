#import "AIRMapOverlay.h"

#if __has_include(<React/RCTBridge.h>)
    #import <React/RCTBridge.h>
#else
    #import "RCTBridge.h"
#endif
#if __has_include(<React/RCTEventDispatcher.h>)
    #import <React/RCTEventDispatcher.h>
#else
    #import "RCTEventDispatcher.h"
#endif
#if __has_include(<React/RCTImageLoader.h>)
    #import <React/RCTImageLoader.h>
#else
    #import "RCTImageLoader.h"
#endif
#if __has_include(<React/RCTUtils.h>)
    #import <React/RCTUtils.h>
#else
    #import "RCTUtils.h"
#endif
#if __has_include(<React/UIView+React.h>)
    #import <React/UIView+React.h>
#else
    #import "UIView+React.h"
#endif

@interface AIRMapOverlay()
@property (nonatomic, strong, readwrite) UIImage *overlayImage;
@end

@implementation AIRMapOverlay {
    RCTImageLoaderCancellationBlock _reloadImageCancellationBlock;
    CLLocationCoordinate2D _southWest;
    CLLocationCoordinate2D _northEast;
    MKMapRect _mapRect;
}

- (void)setImageSrc:(NSString *)imageSrc
{
    NSLog(@">>> SET IMAGESRC: %@", imageSrc);
    _imageSrc = imageSrc;

    if (_reloadImageCancellationBlock) {
        _reloadImageCancellationBlock();
        _reloadImageCancellationBlock = nil;
    }
    __weak typeof(self) weakSelf = self;
    _reloadImageCancellationBlock = [_bridge.imageLoader loadImageWithURLRequest:[RCTConvert NSURLRequest:_imageSrc]
                                                                            size:weakSelf.bounds.size
                                                                           scale:RCTScreenScale()
                                                                         clipped:YES
                                                                      resizeMode:RCTResizeModeCenter
                                                                   progressBlock:nil
                                                                partialLoadBlock:nil
                                                                 completionBlock:^(NSError *error, UIImage *image) {
                                                                     if (error) {
                                                                         NSLog(@"%@", error);
                                                                     }
                                                                     dispatch_async(dispatch_get_main_queue(), ^{
                                                                         NSLog(@">>> IMAGE: %@", image);
                                                                         weakSelf.overlayImage = image;
                                                                         [weakSelf createOverlayRendererIfPossible];
                                                                         [weakSelf update];
                                                                     });
                                                                 }];
}

- (void)setBoundsRect:(NSArray *)boundsRect {
    _boundsRect = boundsRect;

    _southWest = CLLocationCoordinate2DMake([boundsRect[1][0] doubleValue], [boundsRect[0][1] doubleValue]);
    _northEast = CLLocationCoordinate2DMake([boundsRect[0][0] doubleValue], [boundsRect[1][1] doubleValue]);

    MKMapPoint southWest = MKMapPointForCoordinate(_southWest);
    MKMapPoint northEast = MKMapPointForCoordinate(_northEast);

    _mapRect = MKMapRectMake(southWest.x, northEast.y, northEast.x - southWest.x, northEast.y - southWest.y);

    [self update];
}

- (void)createOverlayRendererIfPossible
{
    if (MKMapRectIsEmpty(_mapRect) || !self.overlayImage) return;
    __weak typeof(self) weakSelf = self;
    self.renderer = [[AIRMapOverlayRenderer alloc] initWithOverlay:weakSelf];
}

- (void)update
{
    if (!_renderer) return;

    if (_map == nil) return;
    [_map removeOverlay:self];
    [_map addOverlay:self];
}


#pragma mark MKOverlay implementation

- (CLLocationCoordinate2D)coordinate
{
    return MKCoordinateForMapPoint(MKMapPointMake(MKMapRectGetMidX(_mapRect), MKMapRectGetMidY(_mapRect)));
}

- (MKMapRect)boundingMapRect
{
    return _mapRect;
}

- (BOOL)intersectsMapRect:(MKMapRect)mapRect
{
    return MKMapRectIntersectsRect(_mapRect, mapRect);
}

- (BOOL)canReplaceMapContent
{
    return NO;
}

@end
