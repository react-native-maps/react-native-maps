#import "AIRMapOverlay.h"

#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTImageLoader.h>
#import <React/RCTUtils.h>
#import <React/UIView+React.h>

@interface AIRMapOverlay()
  @property (nonatomic, strong, readwrite) UIImage *overlayImage;
@end

@implementation AIRMapOverlay {
  RCTImageLoaderCancellationBlock _reloadImageCancellationBlock;
  CLLocationCoordinate2D _topLeftCoordinate;
  CLLocationCoordinate2D _bottomRightCoordinate;
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
  
  _topLeftCoordinate = CLLocationCoordinate2DMake([boundsRect[0][0] doubleValue], [boundsRect[0][1] doubleValue]);
  _bottomRightCoordinate = CLLocationCoordinate2DMake([boundsRect[1][0] doubleValue], [boundsRect[1][1] doubleValue]);
  
  MKMapPoint topLeft = MKMapPointForCoordinate(_topLeftCoordinate);
  MKMapPoint bottomRight = MKMapPointForCoordinate(_bottomRightCoordinate);
  
  _mapRect = MKMapRectMake(topLeft.x, topLeft.y, topLeft.x - bottomRight.x, topLeft.y - bottomRight.y);
  
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
