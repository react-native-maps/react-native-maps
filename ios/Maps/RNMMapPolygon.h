//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <MapKit/MapKit.h>
#import <UIKit/UIKit.h>

#import <React/RCTComponent.h>
#import <React/RCTView.h>
#import "RNMMapCoordinate.h"
#import "RNMMap.h"
#import "RCTConvert+RNMMap.h"



@interface RNMMapPolygon: MKAnnotationView <MKOverlay>

@property (nonatomic, weak) RNMMap *map;

@property (nonatomic, strong) MKPolygon *polygon;
@property (nonatomic, strong) MKPolygonRenderer *renderer;
@property (nonatomic, strong) NSArray<MKPolygon *> *interiorPolygons;

@property (nonatomic, strong) NSArray<RNMMapCoordinate *> *coordinates;
@property (nonatomic, strong) NSArray<NSArray<RNMMapCoordinate *> *> *holes;
@property (nonatomic, strong) UIColor *fillColor;
@property (nonatomic, strong) UIColor *strokeColor;
@property (nonatomic, assign) CGFloat strokeWidth;
@property (nonatomic, assign) CGFloat miterLimit;
@property (nonatomic, assign) CGLineCap lineCap;
@property (nonatomic, assign) CGLineJoin lineJoin;
@property (nonatomic, assign) CGFloat lineDashPhase;
@property (nonatomic, strong) NSArray <NSNumber *> *lineDashPattern;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

#pragma mark MKOverlay protocol

@property(nonatomic, readonly) CLLocationCoordinate2D coordinate;
@property(nonatomic, readonly) MKMapRect boundingMapRect;
- (BOOL)intersectsMapRect:(MKMapRect)mapRect;
- (BOOL)canReplaceMapContent;

@end
