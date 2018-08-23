#import "AIRMapOverlayManager.h"

#if __has_include(<React/RCTConvert+CoreLocation.h>)
    #import <React/RCTConvert+CoreLocation.h>
#else
    #import "RCTConvert+CoreLocation.h"
#endif
#if __has_include(<React/RCTUIManager.h>)
    #import <React/RCTUIManager.h>
#else
    #import "RCTUIManager.h"
#endif
#if __has_include(<React/UIView+React.h>)
    #import <React/UIView+React.h>
#else
    #import "UIView+React.h"
#endif
#import "AIRMapOverlay.h"

@interface AIRMapOverlayManager () <MKMapViewDelegate>

@end

@implementation AIRMapOverlayManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    AIRMapOverlay *overlay = [AIRMapOverlay new];
    overlay.bridge = self.bridge;
    return overlay;
}

RCT_REMAP_VIEW_PROPERTY(bounds, boundsRect, NSArray)
RCT_REMAP_VIEW_PROPERTY(image, imageSrc, NSString)

@end

