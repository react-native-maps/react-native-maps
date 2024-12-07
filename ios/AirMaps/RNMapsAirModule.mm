//
//  RNMapsMarkerManager.m
//  AirMaps
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//

#import "RNMapsAirModule.h"
#import <React/RCTUIManager.h>
#import <React/RCTViewManager.h>
#import "RNMapsMapView.h"
#import "AIRMap.h"
#import "AIRMapSnapshot.h"
#import <MapKit/MapKit.h>
#import "RCTConvert+AirMap.h"

@implementation RNMapsAirModule

@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;

- (void)executeWithMapView:(double)tag
                   success:(void (^)(AIRMap *mapView))success
                   reject:(RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        id view = [_viewRegistry_DEPRECATED viewForReactTag:[NSNumber numberWithDouble:tag]];
        if (![view isKindOfClass:[RNMapsMapView class]]) {
            reject(@"Invalid argument", [NSString stringWithFormat:@"Invalid view returned from registry, expecting RNMapsMapView, got: %@", view], NULL);
        } else {
            AIRMap *mapView = [view mapView];
            success(mapView);
        }
    });
}

- (void)getCamera:(double)tag
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
    [self executeWithMapView:tag success:^(AIRMap *mapView) {
            MKMapCamera *camera = [mapView camera];
            resolve(@{
                      @"center": @{
                              @"latitude": @(camera.centerCoordinate.latitude),
                              @"longitude": @(camera.centerCoordinate.longitude),
                      },
                      @"pitch": @(camera.pitch),
                      @"heading": @(camera.heading),
                      @"altitude": @(camera.altitude),
            });
    } reject:reject];

}

- (void)getMarkersFrames:(double)tag
             onlyVisible:(BOOL)onlyVisible
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
{
    
}
- (void)getMapBoundaries:(double)tag
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
{
    
}
- (void)takeSnapshot:(double)tag
              config:(NSDictionary *)config
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject
{

    [self executeWithMapView:tag success:^(AIRMap *mapView) {
          
        MKMapSnapshotOptions *options = [[MKMapSnapshotOptions alloc] init];
       
        options.mapType = mapView.mapType;
        NSNumber *width = config[@"width"];
        NSNumber *height = config[@"height"];
        NSNumber *quality = config[@"quality"];
        NSString*format =config[@"format"];
        NSString*result =config[@"result"];
        MKCoordinateRegion region = [RCTConvert MKCoordinateRegion:config[@"region"]];
       
     
        options.region = (region.center.latitude && region.center.longitude) ? region : mapView.region;
        options.size = CGSizeMake(
          ([width floatValue] == 0) ? mapView.bounds.size.width : [width floatValue],
          ([height floatValue] == 0) ? mapView.bounds.size.height : [height floatValue]
        );
        
        options.scale = [[UIScreen mainScreen] scale];


        MKMapSnapshotter *snapshotter = [[MKMapSnapshotter alloc] initWithOptions:options];

        [self takeMapSnapshot:mapView
            snapshotter:snapshotter
            format:format
            quality:[quality floatValue]
            result:result
            callback:resolve];
        
    } reject:reject];
    
   
}
- (void)getAddressFromCoordinates:(double)tag
                       coordinate:(JS::NativeAirMapsModule::LatLng &)coordinate
                          resolve:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject
{
    
}
- (void)getPointForCoordinate:(double)tag
                   coordinate:(JS::NativeAirMapsModule::LatLng &)coordinate
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
    
}
- (void)getCoordinateForPoint:(double)tag
                        point:(JS::NativeAirMapsModule::Point &)point
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
    
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeAirMapsModuleSpecJSI>(params);
}

+ (NSString *)moduleName { 
    return nil;
}

#pragma mark Take Snapshot
- (void)takeMapSnapshot:(AIRMap *)mapView
        snapshotter:(MKMapSnapshotter *) snapshotter
        format:(NSString *)format
        quality:(CGFloat) quality
        result:(NSString *)result
        callback:(RCTPromiseResolveBlock) callback {
    NSTimeInterval timeStamp = [[NSDate date] timeIntervalSince1970];
    NSString *pathComponent = [NSString stringWithFormat:@"Documents/snapshot-%.20lf.%@", timeStamp, format];
    NSString *filePath = [NSHomeDirectory() stringByAppendingPathComponent: pathComponent];

    [snapshotter startWithQueue:dispatch_get_main_queue()
              completionHandler:^(MKMapSnapshot *snapshot, NSError *error) {
                  if (error) {
                      callback(@[error]);
                      return;
                  }
                  MKAnnotationView *pin = [[MKPinAnnotationView alloc] initWithAnnotation:nil reuseIdentifier:nil];

                  UIImage *image = snapshot.image;
                  UIGraphicsBeginImageContextWithOptions(image.size, YES, image.scale);
                  {
                      [image drawAtPoint:CGPointMake(0.0f, 0.0f)];

                      CGRect rect = CGRectMake(0.0f, 0.0f, image.size.width, image.size.height);

                      for (id <AIRMapSnapshot> overlay in mapView.overlays) {
                          if ([overlay respondsToSelector:@selector(drawToSnapshot:context:)]) {
                                  [overlay drawToSnapshot:snapshot context:UIGraphicsGetCurrentContext()];
                          }
                      }
                      
                      for (id <MKAnnotation> annotation in mapView.annotations) {
                          CGPoint point = [snapshot pointForCoordinate:annotation.coordinate];
                          
                          MKAnnotationView* anView = [mapView viewForAnnotation: annotation];
                          
                          if (anView){
                              pin = anView;
                          }
                          
                          if (CGRectContainsPoint(rect, point)) {
                              point.x = point.x + pin.centerOffset.x - (pin.bounds.size.width / 2.0f);
                              point.y = point.y + pin.centerOffset.y - (pin.bounds.size.height / 2.0f);
                              if (pin.image) {
                                  [pin.image drawAtPoint:point];
                              } else {
                                  CGRect pinRect = CGRectMake(point.x, point.y, pin.bounds.size.width, pin.bounds.size.height);
                                  [pin drawViewHierarchyInRect:pinRect afterScreenUpdates:NO];
                              }
                          }
                      }

                      UIImage *compositeImage = UIGraphicsGetImageFromCurrentImageContext();

                      NSData *data;
                      if ([format isEqualToString:@"png"]) {
                          data = UIImagePNGRepresentation(compositeImage);
                      }
                      else if([format isEqualToString:@"jpg"]) {
                          data = UIImageJPEGRepresentation(compositeImage, quality);
                      }

                      if ([result isEqualToString:@"file"]) {
                          [data writeToFile:filePath atomically:YES];
                          callback(filePath);
                      }
                      else if ([result isEqualToString:@"base64"]) {
                          callback([data base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithCarriageReturn]);
                      }
                  }
                  UIGraphicsEndImageContext();
              }];
}

@end

