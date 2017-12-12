//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <MapKit/MapKit.h>
#import <UIKit/UIKit.h>

#import <React/RCTComponent.h>
#import <React/RCTView.h>
#import <React/RCTResizeMode.h>
#import "AIRMapCoordinate.h"
#import "AIRMap.h"
#import "AIRMapOverlayRenderer.h"
#import "RCTConvert+AirMap.h"

@class RCTBridge;

@interface AIRMapOverlay: MKAnnotationView <MKOverlay>

@property (nonatomic, weak) AIRMap *map;
@property (nonatomic, weak) RCTBridge *bridge;

@property (nonatomic, strong) AIRMapOverlayRenderer *renderer;
@property (nonatomic, strong) NSArray<AIRMapCoordinate *> *coordinates;
@property (nonatomic, copy) NSString *imageSrc;
@property (nonatomic, assign) CGFloat bearing;
@property (nonatomic, assign) RCTResizeMode resizeMode;


#pragma mark MKOverlay protocol
@property(nonatomic, readonly) CLLocationCoordinate2D coordinate;
@property(nonatomic, readonly) MKMapRect boundingMapRect;

- (BOOL)intersectsMapRect:(MKMapRect)mapRect;
- (BOOL)canReplaceMapContent;


@end
