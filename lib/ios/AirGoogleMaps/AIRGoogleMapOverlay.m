//
// Created by Srikanth Kyatham on 26/09/17.
//

#import "AIRGoogleMapOverlay.h"
#import <React/UIView+React.h>
#import <React/RCTBridge.h>
#import <React/RCTImageLoader.h>

@interface AIRGoogleMapOverlay ()
  @property (nonatomic, strong) UIImage *image;
@end

@implementation AIRGoogleMapOverlay {
  RCTImageLoaderCancellationBlock _reloadImageCancellationBlock;
}

- (void)setCoordinates:(NSArray<AIRMapCoordinate *> *)coordinates {
    _coordinates = coordinates;
    [self initialize];
}

- (void)setImageSrc:(NSString *)imageSrc {
  if (imageSrc != nil && _imageSrc != imageSrc) {
    //get icon
    _imageSrc = imageSrc;
    //[self fetchImage:imageSrc];
    NSURL *imageURL = [NSURL URLWithString:imageSrc];
    NSData *imageData = [NSData dataWithContentsOfURL:imageURL];
    _image = [UIImage imageWithData:imageData];
    [self initialize];
  }
}

- (void)setBearing:(CGFloat)bearing {
  if (_bearing != bearing) {
    _bearing = bearing;
    [self update];
  }
}

- (void)setResizeMode:(RCTResizeMode)resizeMode {
  if (_resizeMode != resizeMode) {
    _resizeMode = resizeMode;
    [self update];
  }
}

- (void)setZoomLevel:(CGFloat)zoomLevel {
  if (_zoomLevel != zoomLevel) {
    _zoomLevel = zoomLevel;
    [self update];
  }
}

- (void)initialize {
  if (_coordinates != nil && [_coordinates count] == 2 &&
      _image != nil) {
    CLLocationCoordinate2D northEast = _coordinates[0].coordinate;
    CLLocationCoordinate2D southWest = _coordinates[1].coordinate;
    CLLocationCoordinate2D middle = GMSGeometryInterpolate(southWest, northEast, 0.5);

    GMSCoordinateBounds *overlayBounds = [[GMSCoordinateBounds alloc]
                                          initWithCoordinate:southWest
                                                  coordinate:northEast];
    _overlayLayer = [GMSGroundOverlay groundOverlayWithBounds:overlayBounds icon:_image];
    _overlayLayer.position = middle;
    _overlayLayer.bearing = _bearing;
    _overlayLayer.tappable = YES;
    _overlayLayer.zIndex = 1000;
    [self update];
  }
}

- (void) update
{
    if (!_overlayLayer) return;
    if (!_map) return;
    _overlayLayer.map = nil;
    _overlayLayer.bearing = _bearing;
    //_overlayLayer.zoom = _zoomLevel;
    _overlayLayer.map = _map;
}

 - (void)fetchImage:(NSString *)imageSrc
{
    if (_reloadImageCancellationBlock) {
        _reloadImageCancellationBlock();
        _reloadImageCancellationBlock = nil;
    }
    _reloadImageCancellationBlock = [_bridge.imageLoader loadImageWithURLRequest:[RCTConvert NSURLRequest:imageSrc]
                                                                            size:self.bounds.size
                                                                           scale:RCTScreenScale()
                                                                         clipped:YES
                                                                      resizeMode:self.resizeMode //RCTResizeModeCenter
                                                                   progressBlock:nil
                                                                partialLoadBlock:nil
                                                                 completionBlock:^(NSError *error, UIImage *image) {
                                                                     if (error) {
                                                                         // TODO(lmr): do something with the error?
                                                                         NSLog(@"%@", error);
                                                                     }
                                                                     dispatch_async(dispatch_get_main_queue(), ^{
                                                                       self.image = image;
                                                                       [self initialize];
                                                                     });
                                                                 }];
}

@end
