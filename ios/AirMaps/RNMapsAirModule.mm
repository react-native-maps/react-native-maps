//
//  RNMapsMarkerManager.m
//  AirMaps
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//
#ifdef RCT_NEW_ARCH_ENABLED


#import "RNMapsAirModule.h"
#import <React/RCTUIManager.h>
#import <React/RCTViewManager.h>
#import "RNMapsMapView.h"
#import "AIRMap.h"
#import "AIRMapSnapshot.h"
#import <MapKit/MapKit.h>
#import "RCTConvert+AirMap.h"

#if __has_include(<ReactNativeMaps/generated/RNMapsAirModuleDelegate.h>)
#import <ReactNativeMaps/generated/RNMapsSpecs.h>
#import <ReactNativeMaps/generated/RNMapsHostViewDelegate.h>
#else
#import "RNMapsSpecs.h"
#import "RNMapsHostViewDelegate.h"
#endif
@interface RNMapsAirModule()<NativeAirMapsModuleSpec>
@end

@implementation RNMapsAirModule

@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;

- (void)executeWithMapView:(double)tag
                   success:(void (^)(id<RNMapsAirModuleDelegate> mapView))success
                   reject:(RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        id view = [_viewRegistry_DEPRECATED viewForReactTag:[NSNumber numberWithDouble:tag]];
        if ([view conformsToProtocol:@protocol(RNMapsHostViewDelegate)]) {
            id<RNMapsAirModuleDelegate> mapViewDelegate = [view mapView];
            success(mapViewDelegate);
        } else {
            reject(@"Invalid argument", [NSString stringWithFormat:@"Invalid view returned from registry, expecting RNMapsMapView, got: %@", view], NULL);
        }
    });
}

- (void)getCamera:(double)tag
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
    [self executeWithMapView:tag success:^(id<RNMapsAirModuleDelegate> mapView) {
        resolve([mapView getCameraDic]);
    } reject:reject];

}

- (void)getMarkersFrames:(double)tag
             onlyVisible:(BOOL)onlyVisible
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
{
    [self executeWithMapView:tag success:^(id<RNMapsAirModuleDelegate> mapView) {
        resolve([mapView getMarkersFramesWithOnlyVisible:onlyVisible]);
    } reject:reject];
}
- (void)getMapBoundaries:(double)tag
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
{
    [self executeWithMapView:tag success:^(id<RNMapsAirModuleDelegate> mapView) {
        resolve([mapView getMapBoundaries]);
    } reject:reject];
}
- (void)takeSnapshot:(double)tag
              config:(NSString *)configStr
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject
{
    NSDictionary* config = [RCTConvert dictonaryFromString:configStr];
    [self executeWithMapView:tag success:^(id<RNMapsAirModuleDelegate> mapView) {
        [mapView takeSnapshotWithConfig:config success:resolve error:reject];
    } reject:reject];
}

- (void)getAddressFromCoordinates:(double)tag
                       coordinate:(JS::NativeAirMapsModule::LatLng &)coordinate
                          resolve:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject
{
    double latitude = coordinate.latitude();
    double longitude = coordinate.longitude();
    
  
    CLLocation *location = [[CLLocation alloc] initWithLatitude:latitude
                                                          longitude:longitude];
    CLGeocoder *geoCoder = [[CLGeocoder alloc] init];
    [geoCoder reverseGeocodeLocation:location
                       completionHandler:^(NSArray *placemarks, NSError *error) {
        if (error == nil && [placemarks count] > 0){
            CLPlacemark *placemark = placemarks[0];
            resolve(@{
                @"name" : [NSString stringWithFormat:@"%@", placemark.name],
                @"thoroughfare" : [NSString stringWithFormat:@"%@", placemark.thoroughfare],
                @"subThoroughfare" : [NSString stringWithFormat:@"%@", placemark.subThoroughfare],
                @"locality" : [NSString stringWithFormat:@"%@", placemark.locality],
                @"subLocality" : [NSString stringWithFormat:@"%@", placemark.subLocality],
                @"administrativeArea" : [NSString stringWithFormat:@"%@", placemark.administrativeArea],
                @"subAdministrativeArea" : [NSString stringWithFormat:@"%@", placemark.subAdministrativeArea],
                @"postalCode" : [NSString stringWithFormat:@"%@", placemark.postalCode],
                @"countryCode" : [NSString stringWithFormat:@"%@", placemark.ISOcountryCode],
                @"country" : [NSString stringWithFormat:@"%@", placemark.country],
            });
        } else {
            reject(@"Invalid argument", [NSString stringWithFormat:@"Can not get address location"], NULL);
        }
    }];
}

- (void)getPointForCoordinate:(double)tag
                   coordinate:(JS::NativeAirMapsModule::LatLng &)coordinate
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
    double latitude = coordinate.latitude();
    double longitude = coordinate.longitude();
    
    CLLocationCoordinate2D location = CLLocationCoordinate2DMake(latitude,longitude);
    
    [self executeWithMapView:tag success:^(id<RNMapsAirModuleDelegate> mapView) {
        resolve([mapView getPointForCoordinates:location]);
        
    } reject:reject];
    
}
- (void)getCoordinateForPoint:(double)tag
                        point:(JS::NativeAirMapsModule::Point &)point
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
    double x = point.x();
    double y = point.y();
    CGPoint pt = CGPointMake(x,y);
    [self executeWithMapView:tag success:^(id<RNMapsAirModuleDelegate> mapView) {
        resolve([mapView getCoordinatesForPoint:pt]);
    } reject:reject];
   
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeAirMapsModuleSpecJSI>(params);
}

+ (NSString *)moduleName { 
    return nil;
}



@end


#endif
