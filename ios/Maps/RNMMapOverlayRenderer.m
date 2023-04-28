#import "RNMMapOverlayRenderer.h"
#import "RNMMapOverlay.h"

@implementation RNMMapOverlayRenderer

- (void)drawMapRect:(MKMapRect)mapRect zoomScale:(MKZoomScale)zoomScale inContext:(CGContextRef)context {
    UIImage *image = [(RNMMapOverlay *)self.overlay overlayImage];
    
    CGContextSaveGState(context);
    
    CGImageRef imageReference = image.CGImage;
    
    MKMapRect theMapRect = [self.overlay boundingMapRect];
    CGRect theRect = [self rectForMapRect:theMapRect];
    
    CGContextRotateCTM(context, M_PI);
    CGContextScaleCTM(context, -1.0, 1.0);
    CGContextTranslateCTM(context, 0.0, -theRect.size.height);
    CGContextAddRect(context, theRect);
    CGContextDrawImage(context, theRect, imageReference);
    
    CGContextRestoreGState(context);
}

- (BOOL)canDrawMapRect:(MKMapRect)mapRect zoomScale:(MKZoomScale)zoomScale {
    return [(RNMMapOverlay *)self.overlay overlayImage] != nil;
}

@end

