#import "RNMMapViewModule.h"
#import "RNMMap.h"
#import "RNMMapMarker.h"
#import "RNMMapSnapshot.h"
#import "RNMMapCoordinate.h"
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>

@implementation RNMMapViewModule

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue
{
    return RCTGetUIManagerQueue();
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getMapBoundaries:(nonnull NSNumber *)reactTag
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMMap, got: %@", view);
        } else {
            NSArray *boundingBox = [view getMapBoundaries];
            
            resolve(@{
                @"northEast" : @{
                    @"longitude" : boundingBox[0][0],
                    @"latitude" : boundingBox[0][1]
                },
                @"southWest" : @{
                    @"longitude" : boundingBox[1][0],
                    @"latitude" : boundingBox[1][1]
                }
            });
        }
    }];
}

RCT_EXPORT_METHOD(getCamera:(nonnull NSNumber *)reactTag
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        RNMMap *mapView = (RNMMap *)view;
        if (![view isKindOfClass:[RNMMap class]]) {
            reject(@"Invalid argument", [NSString stringWithFormat:@"Invalid view returned from registry, expecting RNMMap, got: %@", view], NULL);
        } else {
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
        }
    }];
}

RCT_EXPORT_METHOD(takeSnapshot:(nonnull NSNumber *)reactTag
                  config:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMMap, got: %@", view);
        } else {
            NSNumber *width = config[@"width"];
            NSNumber *height = config[@"height"];
            MKCoordinateRegion region = [RCTConvert MKCoordinateRegion:config[@"region"]];
            NSString *format = config[@"format"];
            NSNumber *quality = config[@"quality"];
            NSString *result = config[@"result"];
            
            RNMMap *mapView = (RNMMap *)view;
            MKMapSnapshotOptions *options = [[MKMapSnapshotOptions alloc] init];
            
            options.mapType = mapView.mapType;
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
                          quality:quality.floatValue
                           result:result
                         resolver:resolve
                         rejecter:reject];
        }
    }];
}

RCT_EXPORT_METHOD(pointForCoordinate:(nonnull NSNumber *)reactTag
                  coordinate: (NSDictionary *)coordinate
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        RNMMap *mapView = (RNMMap *)view;
        if (![view isKindOfClass:[RNMMap class]]) {
            reject(@"Invalid argument", [NSString stringWithFormat:@"Invalid view returned from registry, expecting RNMMap, got: %@", view], NULL);
        } else {
            CGPoint touchPoint = [mapView convertCoordinate:
                                  CLLocationCoordinate2DMake(
                                                             [coordinate[@"latitude"] doubleValue],
                                                             [coordinate[@"longitude"] doubleValue]
                                                             )
                                              toPointToView:mapView];
            
            resolve(@{
                @"x": @(touchPoint.x),
                @"y": @(touchPoint.y),
            });
        }
    }];
}

RCT_EXPORT_METHOD(getMarkersFrames:(nonnull NSNumber *)reactTag
                  onlyVisible:(BOOL)onlyVisible
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        RNMMap *mapView = (RNMMap *)view;
        if (![view isKindOfClass:[RNMMap class]]) {
            reject(@"Invalid argument", [NSString stringWithFormat:@"Invalid view returned from registry, expecting RNMMap, got: %@", view], NULL);
        } else {
            resolve([mapView getMarkersFramesWithOnlyVisible:onlyVisible]);
        }
    }];
}



RCT_EXPORT_METHOD(coordinateForPoint:(nonnull NSNumber *)reactTag
                  point:(NSDictionary *)point
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        RNMMap *mapView = (RNMMap *)view;
        if (![view isKindOfClass:[RNMMap class]]) {
            reject(@"Invalid argument", [NSString stringWithFormat:@"Invalid view returned from registry, expecting RNMMap, got: %@", view], NULL);
        } else {
            CLLocationCoordinate2D coordinate = [mapView convertPoint:
                                                 CGPointMake(
                                                             [point[@"x"] doubleValue],
                                                             [point[@"y"] doubleValue]
                                                             )
                                                 toCoordinateFromView:mapView];
            
            resolve(@{
                @"latitude": @(coordinate.latitude),
                @"longitude": @(coordinate.longitude),
            });
        }
    }];
}

RCT_EXPORT_METHOD(getAddressFromCoordinates:(nonnull NSNumber *)reactTag
                  coordinate: (NSDictionary *)coordinate
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMMap class]]) {
            reject(@"Invalid argument", [NSString stringWithFormat:@"Invalid view returned from registry, expecting RNMMap, got: %@", view], NULL);
        } else {
            if (coordinate == nil ||
                ![[coordinate allKeys] containsObject:@"latitude"] ||
                ![[coordinate allKeys] containsObject:@"longitude"]) {
                reject(@"Invalid argument", [NSString stringWithFormat:@"Invalid coordinate format"], NULL);
            }
            CLLocation *location = [[CLLocation alloc] initWithLatitude:[coordinate[@"latitude"] doubleValue]
                                                              longitude:[coordinate[@"longitude"] doubleValue]];
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
    }];
}

RCT_EXPORT_METHOD(animateToRegion:(nonnull NSNumber *)reactTag
        withRegion:(NSDictionary *)region
        withDuration:(CGFloat)duration
        resolver: (RCTPromiseResolveBlock)resolve
        rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMMap, got: %@", view);
        } else {
            MKCoordinateRegion mkRegion = [RCTConvert MKCoordinateRegion:region];
            [RNMMap animateWithDuration:duration/1000 animations:^{
                [(RNMMap *)view setRegion:mkRegion animated:YES];
            } completion:^(BOOL finished){
                resolve(nil);
            }];
        }
    }];
}

RCT_EXPORT_METHOD(animateCamera:(nonnull NSNumber *)reactTag
                  withCamera:(id)json
                  withDuration:(CGFloat)duration
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMMap, got: %@", view);
        } else {
            RNMMap *mapView = (RNMMap *)view;

            // Merge the changes given with the current camera
            MKMapCamera *camera = [RCTConvert MKMapCameraWithDefaults:json existingCamera:[mapView camera]];

            // don't emit region change events when we are setting the camera
            BOOL originalIgnore = mapView.ignoreRegionChanges;
            mapView.ignoreRegionChanges = YES;
            if(duration > 0.0f) {
                [RNMMap animateWithDuration:duration/1000 animations:^{
                    [mapView setCamera:camera animated:YES];
                } completion:^(BOOL finished){
                    mapView.ignoreRegionChanges = originalIgnore;
                    resolve(nil);
                }];
            } else {
                [mapView setCamera:camera animated:NO];
                mapView.ignoreRegionChanges = originalIgnore;
                resolve(nil);
            }
        }
    }];
}

RCT_EXPORT_METHOD(fitToElements:(nonnull NSNumber *)reactTag
        edgePadding:(nonnull NSDictionary *)edgePadding
        withDuration:(CGFloat)duration
        resolver: (RCTPromiseResolveBlock)resolve
        rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMMap, got: %@", view);
        } else {
            RNMMap *mapView = (RNMMap *)view;

            // TODO(lmr): we potentially want to include overlays here... and could concat the two arrays together.
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 0.1 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
                if(duration > 0.0f) {
                    [RNMMap animateWithDuration:duration/1000 animations:^{
                        [mapView showAnnotations:mapView.annotations animated:YES];
                    } completion:^(BOOL finished){
                        resolve(nil);
                    }];
                } else {
                    [mapView showAnnotations:mapView.annotations animated:NO];
                    resolve(nil);
                }
                
            });
        }
    }];
}

RCT_EXPORT_METHOD(fitToSuppliedMarkers:(nonnull NSNumber *)reactTag
                  markers:(nonnull NSArray *)markers
                  edgePadding:(nonnull NSDictionary *)edgePadding
                  withDuration:(CGFloat)duration
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMMap, got: %@", view);
        } else {
            RNMMap *mapView = (RNMMap *)view;
            // TODO(lmr): we potentially want to include overlays here... and could concat the two arrays together.
            // id annotations = mapView.annotations;

            NSPredicate *filterMarkers = [NSPredicate predicateWithBlock:^BOOL(id evaluatedObject, NSDictionary *bindings) {
                RNMMapMarker *marker = (RNMMapMarker *)evaluatedObject;
                return [marker isKindOfClass:[RNMMapMarker class]] && [markers containsObject:marker.identifier];
            }];

            NSArray *filteredMarkers = [mapView.annotations filteredArrayUsingPredicate:filterMarkers];

            if(duration > 0.0f) {
                [RNMMap animateWithDuration:duration/1000 animations:^{
                [mapView showAnnotations:filteredMarkers animated:YES];
                } completion:^(BOOL finished){
                    resolve(nil);
                }];
                } else {
                [mapView showAnnotations:filteredMarkers animated:NO];
                    resolve(nil);
                }
        }
    }];
}

RCT_EXPORT_METHOD(fitToCoordinates:(nonnull NSNumber *)reactTag
                  coordinates:(nonnull NSArray<RNMMapCoordinate *> *)coordinates
                  edgePadding:(nonnull NSDictionary *)edgePadding
                  withDuration:(CGFloat)duration
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMMap, got: %@", view);
        } else {
            RNMMap *mapView = (RNMMap *)view;

            // Create Polyline with coordinates
            CLLocationCoordinate2D coords[coordinates.count];
            for(int i = 0; i < coordinates.count; i++)
            {
                coords[i] = coordinates[i].coordinate;
            }
            MKPolyline *polyline = [MKPolyline polylineWithCoordinates:coords count:coordinates.count];

            // Set Map viewport
            CGFloat top = [RCTConvert CGFloat:edgePadding[@"top"]];
            CGFloat right = [RCTConvert CGFloat:edgePadding[@"right"]];
            CGFloat bottom = [RCTConvert CGFloat:edgePadding[@"bottom"]];
            CGFloat left = [RCTConvert CGFloat:edgePadding[@"left"]];

            if(duration > 0.0f) {
                [RNMMap animateWithDuration:duration/1000 animations:^{
                    [mapView setVisibleMapRect:[polyline boundingMapRect] edgePadding:UIEdgeInsetsMake(top, left, bottom, right) animated:YES];
                } completion:^(BOOL finished){
                    resolve(nil);
                }];
            } else {
                [mapView setVisibleMapRect:[polyline boundingMapRect] edgePadding:UIEdgeInsetsMake(top, left, bottom, right) animated:NO];
                resolve(nil);
            }
        }
    }];
}

- (void)takeMapSnapshot:(RNMMap *)mapView
            snapshotter:(MKMapSnapshotter *) snapshotter
                 format:(NSString *)format
                quality:(CGFloat) quality
                 result:(NSString *)result
               resolver:(RCTPromiseResolveBlock)resolve
               rejecter:(RCTPromiseRejectBlock)reject {
    NSTimeInterval timeStamp = [[NSDate date] timeIntervalSince1970];
    NSString *pathComponent = [NSString stringWithFormat:@"Documents/snapshot-%.20lf.%@", timeStamp, format];
    NSString *filePath = [NSHomeDirectory() stringByAppendingPathComponent: pathComponent];
    
    [snapshotter startWithQueue:dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0)
              completionHandler:^(MKMapSnapshot *snapshot, NSError *error) {
        if (error) {
            NSString *msg = [error localizedDescription];
            reject(@"takeMapSnapshot_error", msg, nil);
            return;
        }
        MKAnnotationView *pin = [[MKMarkerAnnotationView alloc] initWithAnnotation:nil reuseIdentifier:nil];
        
        UIImage *image = snapshot.image;
        UIGraphicsBeginImageContextWithOptions(image.size, YES, image.scale);
        {
            [image drawAtPoint:CGPointMake(0.0f, 0.0f)];
            
            CGRect rect = CGRectMake(0.0f, 0.0f, image.size.width, image.size.height);
            
            for (id <RNMMapSnapshot> overlay in mapView.overlays) {
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
                resolve(filePath);
            }
            else if ([result isEqualToString:@"base64"]) {
                NSString *base64 = [data base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithCarriageReturn];
                resolve(base64);
            }
        }
        UIGraphicsEndImageContext();
    }];
}

@end
