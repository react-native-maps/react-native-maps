#import "RNMGoogleMapOverlayManager.h"
#import "RNMGoogleMapOverlay.h"

@interface RNMGoogleMapOverlayManager()

@end

@implementation RNMGoogleMapOverlayManager

RCT_EXPORT_MODULE(RNMGoogleMapOverlay)

- (UIView *)view
{
  RNMGoogleMapOverlay *overlay = [RNMGoogleMapOverlay new];
  overlay.bridge = self.bridge;
  return overlay;
}

RCT_REMAP_VIEW_PROPERTY(bounds, boundsRect, NSArray)
RCT_REMAP_VIEW_PROPERTY(bearing, bearing, double)
RCT_REMAP_VIEW_PROPERTY(image, imageSrc, NSString)
RCT_REMAP_VIEW_PROPERTY(opacity, opacity, CGFloat)

@end
