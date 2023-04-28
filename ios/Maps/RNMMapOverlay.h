#import "RNMMapCallout.h"

#import <MapKit/MapKit.h>
#import <UIKit/UIKit.h>

#import "RCTConvert+RNMMap.h"
#import <React/RCTComponent.h>
#import "RNMMap.h"
#import "RNMMapOverlayRenderer.h"

@class RCTBridge;

@interface RNMMapOverlay : UIView <MKOverlay>

@property (nonatomic, strong) RNMMapOverlayRenderer *renderer;
@property (nonatomic, weak) RNMMap *map;
@property (nonatomic, weak) RCTBridge *bridge;

@property (nonatomic, strong) NSString *name;
@property (nonatomic, copy) NSString *imageSrc;
@property (nonatomic, strong, readonly) UIImage *overlayImage;
@property (nonatomic, copy) NSArray *boundsRect;
@property (nonatomic, assign) NSInteger rotation;
@property (nonatomic, assign) CGFloat transparency;
@property (nonatomic, assign) NSInteger zIndex;

@property (nonatomic, copy) RCTBubblingEventBlock onPress;

#pragma mark MKOverlay protocol

@property(nonatomic, readonly) CLLocationCoordinate2D coordinate;
@property(nonatomic, readonly) MKMapRect boundingMapRect;
- (BOOL)intersectsMapRect:(MKMapRect)mapRect;
- (BOOL)canReplaceMapContent;

@end
