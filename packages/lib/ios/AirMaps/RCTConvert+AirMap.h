//
// Created by Leland Richardson on 12/27/15.
// Copyright (c) 2015 Facebook. All rights reserved.
//

#import <CoreLocation/CoreLocation.h>
#import <MapKit/MapKit.h>
#import <React/RCTConvert.h>

@class AIRMapCoordinate;

@interface RCTConvert (AirMap)

+ (MKCoordinateSpan)MKCoordinateSpan:(id)json;
+ (MKCoordinateRegion)MKCoordinateRegion:(id)json;
+ (MKMapCamera*)MKMapCamera:(id)json;
+ (MKMapCamera*)MKMapCameraWithDefaults:(id)json existingCamera:(MKMapCamera*)camera;
+ (MKMapType)MKMapType:(id)json;
+ (NSDictionary*) dictonaryFromString:(NSString *) str;
+ (NSArray*) arrayFromString:(NSString *) str;
+ (NSArray<NSArray<AIRMapCoordinate *> *> *)AIRMapCoordinateArrayArray:(id)json;
+ (AIRMapCoordinate*) AIRMapCoordinate:(id)json;
@end
