#import "RNMGoogleMapViewModule.h"
#import "RNMGoogleMap.h"
#import "RCTConvert+GMSMapViewType.h"
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>

@implementation RNMGoogleMapViewModule

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue
{
    return RCTGetUIManagerQueue();
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getCamera:(nonnull NSNumber *)reactTag
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMGoogleMap class]]) {
            reject(@"Invalid argument", [NSString stringWithFormat:@"Invalid view returned from registry, expecting RNMGoogleMap, got: %@", view], NULL);
        } else {
            RNMGoogleMap *mapView = (RNMGoogleMap *)view;
            resolve(@{
                @"center": @{
                    @"latitude": @(mapView.camera.target.latitude),
                    @"longitude": @(mapView.camera.target.longitude),
                },
                @"pitch": @(mapView.camera.viewingAngle),
                @"heading": @(mapView.camera.bearing),
                @"zoom": @(mapView.camera.zoom),
            });
        }
    }];
}

RCT_EXPORT_METHOD(takeSnapshot:(nonnull NSNumber *)reactTag
                  config:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *format = config[@"format"];
    NSNumber *quality = config[@"quality"];
    NSString *result = config[@"result"];
    NSTimeInterval timeStamp = [[NSDate date] timeIntervalSince1970];
    NSString *pathComponent = [NSString stringWithFormat:@"Documents/snapshot-%.20lf.%@", timeStamp, format];
    NSString *filePath = [NSHomeDirectory() stringByAppendingPathComponent: pathComponent];
    
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMGoogleMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMMap, got: %@", view);
        } else {
            RNMGoogleMap *mapView = (RNMGoogleMap *)view;
            
            // TODO: currently we are ignoring width, height, region
            
            UIGraphicsBeginImageContextWithOptions(mapView.frame.size, YES, 0.0f);
            [mapView.layer renderInContext:UIGraphicsGetCurrentContext()];
            UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
            
            NSData *data;
            if ([format isEqualToString:@"png"]) {
                data = UIImagePNGRepresentation(image);
                
            }
            else if([format isEqualToString:@"jpg"]) {
                data = UIImageJPEGRepresentation(image, quality.floatValue);
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

RCT_EXPORT_METHOD(pointForCoordinate:(nonnull NSNumber *)reactTag
                  coordinate:(NSDictionary *)coordinate
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    CLLocationCoordinate2D coord =
    CLLocationCoordinate2DMake(
                               [coordinate[@"latitude"] doubleValue],
                               [coordinate[@"longitude"] doubleValue]
                               );
    
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMGoogleMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMMap, got: %@", view);
        } else {
            RNMGoogleMap *mapView = (RNMGoogleMap *)view;
            
            CGPoint touchPoint = [mapView.projection pointForCoordinate:coord];
            
            resolve(@{
                @"x": @(touchPoint.x),
                @"y": @(touchPoint.y),
            });
        }
    }];
}

RCT_EXPORT_METHOD(coordinateForPoint:(nonnull NSNumber *)reactTag
                  point:(NSDictionary *)point
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    CGPoint pt = CGPointMake(
                             [point[@"x"] doubleValue],
                             [point[@"y"] doubleValue]
                             );
    
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMGoogleMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMMap, got: %@", view);
        } else {
            RNMGoogleMap *mapView = (RNMGoogleMap *)view;
            
            CLLocationCoordinate2D coordinate = [mapView.projection coordinateForPoint:pt];
            
            resolve(@{
                @"latitude": @(coordinate.latitude),
                @"longitude": @(coordinate.longitude),
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
        if (![view isKindOfClass:[RNMGoogleMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMMap, got: %@", view);
        } else {
            RNMGoogleMap *mapView = (RNMGoogleMap *)view;
            resolve([mapView getMarkersFramesWithOnlyVisible:onlyVisible]);
        }
    }];
}

RCT_EXPORT_METHOD(getMapBoundaries:(nonnull NSNumber *)reactTag
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNMGoogleMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMGoogleMap, got: %@", view);
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

RCT_EXPORT_METHOD(animateToRegion:(nonnull NSNumber *)reactTag
                withRegion:(NSDictionary *)region
                withDuration:(CGFloat)duration
                resolver: (RCTPromiseResolveBlock)resolve
                rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RNMGoogleMap class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNMGoogleMap, got: %@", view);
    } else {
      RNMGoogleMap *mapView = (RNMGoogleMap *)view;
      MKCoordinateRegion mkRegion = [RCTConvert MKCoordinateRegion:region];
      GMSCameraPosition *camera = [RNMGoogleMap makeGMSCameraPositionFromMap:mapView andMKCoordinateRegion:mkRegion];
      // Core Animation must be used to control the animation's duration
      // See http://stackoverflow.com/a/15663039/171744
      [CATransaction begin];
      [CATransaction setCompletionBlock:^{
        resolve(nil);
      }];
      [CATransaction setAnimationDuration:duration/1000];
      [mapView animateToCameraPosition:camera];
      [CATransaction commit];
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
        if (![view isKindOfClass:[RNMGoogleMap class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNMGoogleMap, got: %@", view);
        } else {
            RNMGoogleMap *mapView = (RNMGoogleMap *)view;
            GMSCameraPosition *camera = [RCTConvert GMSCameraPositionWithDefaults:json existingCamera:[mapView camera]];

            [CATransaction begin];
            [CATransaction setCompletionBlock:^{
                resolve(nil);
            }];
            [CATransaction setAnimationDuration:duration/1000];
            [mapView animateToCameraPosition:camera];
            [CATransaction commit];
        }
    }];
}

@end
