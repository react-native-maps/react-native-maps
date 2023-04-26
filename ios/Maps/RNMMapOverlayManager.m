#import "RNMMapOverlayManager.h"

#import <React/RCTConvert+CoreLocation.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>
#import "RNMMapOverlay.h"

@interface RNMMapOverlayManager () <MKMapViewDelegate>

@end

@implementation RNMMapOverlayManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    RNMMapOverlay *overlay = [RNMMapOverlay new];
    overlay.bridge = self.bridge;
    return overlay;
}

RCT_REMAP_VIEW_PROPERTY(bounds, boundsRect, NSArray)
RCT_REMAP_VIEW_PROPERTY(image, imageSrc, NSString)

@end

