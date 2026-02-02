//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <MapKit/MapKit.h>
#import <UIKit/UIKit.h>

#import <React/RCTComponent.h>
#import <React/RCTView.h>

#import "AIRMapCoordinate.h"
#import "AIRMapOverlayBase.h"
#import "RCTConvert+AirMap.h"

@interface AIRMapCircle : AIRMapOverlayBase <MKOverlay>

@property (nonatomic, assign) CLLocationCoordinate2D centerCoordinate;
@property (nonatomic, assign) CLLocationDistance radius;
@property (nonatomic, strong) UIColor *fillColor;
@property (nonatomic, strong) UIColor *strokeColor;
@property (nonatomic, assign) CGFloat strokeWidth;
@property (nonatomic, assign) CGLineJoin lineJoin;
@property (nonatomic, assign) CGLineCap lineCap;
@property (nonatomic, assign) CGFloat miterLimit;
@property (nonatomic, assign) CGFloat lineDashPhase;
@property (nonatomic, strong) NSArray <NSNumber *> *lineDashPattern;

@property (nonatomic, strong) MKCircle *circle;
@property (nonatomic, strong) MKCircleRenderer *renderer;

@property (nonatomic, copy) RCTBubblingEventBlock onPress;

// CAShapeLayer region change notification
- (void)mapViewRegionDidChange;

#pragma mark MKOverlay protocol

@property(nonatomic, readonly) CLLocationCoordinate2D coordinate;
@property(nonatomic, readonly) MKMapRect boundingMapRect;
- (BOOL)intersectsMapRect:(MKMapRect)mapRect;
- (BOOL)canReplaceMapContent;

@end
