//
//  RCTConvert+GMSMapViewType.h
//
//  Created by Nick Italiano on 10/23/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import <Foundation/Foundation.h>
#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTConvert.h>
#import "AIRGoogleMapCoordinate.h"

@interface RCTConvert (GMSMapViewType)
+ (GMSCameraPosition*)GMSCameraPositionWithDefaults:(id)json existingCamera:(GMSCameraPosition*)existingCamera;
+ (NSArray<NSArray<AIRGoogleMapCoordinate *> *> *)AIRGoogleMapCoordinateArrayArray:(id)json;
+ (AIRGoogleMapCoordinate *)AIRGoogleMapCoordinate:(id)json;
@end

#endif
