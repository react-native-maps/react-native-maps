#import "AIRMapOverlayRenderer.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTImageLoader.h>
#import <React/RCTUtils.h>


@interface AIRMapOverlayRenderer ()

@property (nonatomic, strong) UIImage *overlayImage;
@property (nonatomic, copy) NSString* imageURL;
@property (nonatomic, assign) CGRect bounds;

@end

@implementation AIRMapOverlayRenderer {
  RCTImageLoaderCancellationBlock _reloadImageCancellationBlock;
}

- (instancetype)initWithOverlay:(id<MKOverlay>)overlay
                   withImageURL:(NSString *)imageURL
                     withBridge:(RCTBridge*)bridge {
    self = [super initWithOverlay:overlay];
    if (self) {
      _bridge = bridge;
      _imageURL = imageURL;
      MKMapRect theMapRect = self.overlay.boundingMapRect;
      CGRect theRect = [self rectForMapRect:theMapRect];
      _bounds = theRect;
      _bearing = 0;
      [self fetchImage:_imageURL];
      //_overlayImage = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:imageURL]]];
    }
    return self;
}

- (BOOL)canDrawMapRect:(MKMapRect)mapRect
             zoomScale:(MKZoomScale)zoomScale{
  return self.overlayImage ? YES : NO;
}

- (void)drawMapRect:(MKMapRect)mapRect zoomScale:(MKZoomScale)zoomScale inContext:(CGContextRef)context {
    CGImageRef imageReference = self.overlayImage.CGImage;

    //CGRect theRect = _bounds;
    MKMapRect theMapRect = self.overlay.boundingMapRect;
    CGRect theRect = [self rectForMapRect:theMapRect];
    if (_bearing != 0) {
      CGContextRotateCTM(context, [self degreesToRadians:_bearing]);
    }
    CGContextScaleCTM(context, 1.0, -1.0);
    CGContextTranslateCTM(context, 0.0, -theRect.size.height);
    CGContextDrawImage(context, theRect, imageReference);
}

- (CGFloat)degreesToRadians:(CGFloat)degrees {
  return (M_PI * degrees / 180.0);
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
                                                                      resizeMode:RCTResizeModeStretch //RCTResizeModeCenter
                                                                   progressBlock:nil
                                                                partialLoadBlock:nil
                                                                 completionBlock:^(NSError *error, UIImage *image) {
                                                                     if (error) {
                                                                         // TODO(lmr): do something with the error?
                                                                         NSLog(@"%@", error);
                                                                     }
                                                                     dispatch_async(dispatch_get_main_queue(), ^{
                                                                       self.overlayImage = image;
                                                                       MKMapRect rect = self.overlay.boundingMapRect;
                                                                       [self setNeedsDisplayInMapRect:rect];
                                                                     });
                                                                 }];
}


@end
