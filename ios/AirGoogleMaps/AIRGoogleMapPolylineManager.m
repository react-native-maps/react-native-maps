//
//  AIRGoogleMapPolylineManager.m
//
//  Created by Nick Italiano on 10/22/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import "AIRGoogleMapPolylineManager.h"

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTConvert+CoreLocation.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTViewManager.h>
#import <React/UIView+React.h>
#import "RCTConvert+AirMap.h"
#import "AIRGoogleMapPolyline.h"
#import <React/RCTUIManager.h>

@interface AIRGoogleMapPolylineManager()

@end

@implementation AIRGoogleMapPolylineManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  AIRGoogleMapPolyline *polyline = [AIRGoogleMapPolyline new];
  polyline.bridge = self.bridge;
  return polyline;
}

RCT_EXPORT_VIEW_PROPERTY(coordinates, AIRMapCoordinateArray)
RCT_EXPORT_VIEW_PROPERTY(fillColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(strokeColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(strokeColors, UIColorArray)
RCT_EXPORT_VIEW_PROPERTY(strokeWidth, double)
RCT_EXPORT_VIEW_PROPERTY(lineDashPattern, NSArray)
RCT_EXPORT_VIEW_PROPERTY(geodesic, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zIndex, int)
RCT_EXPORT_VIEW_PROPERTY(tappable, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(animateColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(drawDone, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(isAnimating, BOOL)

RCT_EXPORT_METHOD(startPolylineAnimation:(nonnull NSNumber *)reactTag animateColor:(NSString *)animateColor animationDuration:(CGFloat)duration delay:(CGFloat)delay)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[AIRGoogleMapPolyline class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting AIRGoogleMapPolyline, got: %@", view);
        } else {
            AIRGoogleMapPolyline *polyline = (AIRGoogleMapPolyline *)view;
            UIColor *newColor = UIColorWithHexString(animateColor);
            [polyline startPolylineAnimation:newColor animationDuration:duration delay:delay];
        }
    }];
}

RCT_EXPORT_METHOD(stopPolylineAnimation:(nonnull NSNumber *)reactTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[AIRGoogleMapPolyline class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting AIRGoogleMapPolyline, got: %@", view);
        } else {
            AIRGoogleMapPolyline *polyline = (AIRGoogleMapPolyline *)view;
            
            [polyline stopPolylineAnimation];
        }
    }];
}

static UIColor * UIColorWithHexString(NSString *hex) {
    unsigned int rgb = 0;
    [[NSScanner scannerWithString:
      [[hex uppercaseString] stringByTrimmingCharactersInSet:
       [[NSCharacterSet characterSetWithCharactersInString:@"0123456789ABCDEF"] invertedSet]]]
     scanHexInt:&rgb];
    return [UIColor colorWithRed:((CGFloat)((rgb & 0xFF0000) >> 16)) / 255.0
                           green:((CGFloat)((rgb & 0xFF00) >> 8)) / 255.0
                            blue:((CGFloat)(rgb & 0xFF)) / 255.0
                           alpha:1.0];
}

@end

#endif
