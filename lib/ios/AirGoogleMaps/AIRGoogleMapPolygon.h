//
//  AIRGoogleMapPolygon.h
//
//  Created by Nick Italiano on 10/22/16.
//

#import <GoogleMaps/GoogleMaps.h>
#if __has_include(<React/RCTBridge.h>)
    #import <React/RCTBridge.h>
#else
    #import "RCTBridge.h"
#endif
#import "AIRGMSPolygon.h"
#import "AIRMapCoordinate.h"

@interface AIRGoogleMapPolygon : UIView

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, strong) NSString *identifier;
@property (nonatomic, strong) AIRGMSPolygon *polygon;
@property (nonatomic, strong) NSArray<AIRMapCoordinate *> *coordinates;
@property (nonatomic, strong) NSArray<NSArray<AIRMapCoordinate *> *> *holes;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

@property (nonatomic, assign) UIColor *fillColor;
@property (nonatomic, assign) double strokeWidth;
@property (nonatomic, assign) UIColor *strokeColor;
@property (nonatomic, assign) BOOL geodesic;
@property (nonatomic, assign) int zIndex;
@property (nonatomic, assign) BOOL tappable;

@end
