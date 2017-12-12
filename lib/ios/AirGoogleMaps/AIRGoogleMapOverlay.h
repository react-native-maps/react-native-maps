//
//  AIRGoogleMapOverlay.h
//
//  Created by Srikanth Kyatham on 26/09/17.
//
#import <Foundation/Foundation.h>

#import <MapKit/MapKit.h>
#import <UIKit/UIKit.h>

#import <React/RCTComponent.h>
#import <React/RCTView.h>
#import <React/RCTResizeMode.h>
#import "AIRMapCoordinate.h"
#import "AIRGoogleMap.h"
#import "RCTConvert+AirMap.h"

@class RCTBridge;

@interface AIRGoogleMapOverlay: UIView

@property (nonatomic, weak) AIRGoogleMap *map;
@property (nonatomic, weak) RCTBridge *bridge;

@property (nonatomic, strong) GMSGroundOverlay *overlayLayer;
@property (nonatomic, strong) NSArray<AIRMapCoordinate *> *coordinates;

@property (nonatomic, copy) NSString *imageSrc;
@property (nonatomic, assign) CGFloat bearing;
@property (nonatomic, assign) RCTResizeMode resizeMode;
@property (nonatomic, assign) CGFloat zoomLevel;

@end
