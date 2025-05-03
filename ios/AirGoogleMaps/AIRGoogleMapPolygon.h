//
//  AIRGoogleMapPolygon.h
//
//  Created by Nick Italiano on 10/22/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTBridge.h>
#import "AIRGMSPolygon.h"
#import "AIRGoogleMapCoordinate.h"
#import "AIRGoogleMap.h"

@interface AIRGoogleMapPolygon : UIView

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, strong) NSString *identifier;
@property (nonatomic, strong) AIRGMSPolygon *polygon;
@property (nonatomic, strong) NSArray<AIRGoogleMapCoordinate *> *coordinates;
@property (nonatomic, strong) NSArray<NSArray<AIRGoogleMapCoordinate *> *> *holes;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

@property (nonatomic, strong) UIColor *fillColor;
@property (nonatomic, assign) double strokeWidth;
@property (nonatomic, strong) UIColor *strokeColor;
@property (nonatomic, assign) BOOL geodesic;
@property (nonatomic, assign) int zIndex;
@property (nonatomic, assign) BOOL tappable;
- (void) didInsertInMap:(AIRGoogleMap *) map;
@end

#endif
