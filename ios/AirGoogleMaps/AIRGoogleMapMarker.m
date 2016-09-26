//
//  AIRGoogleMapMarker.m
//  AirMaps
//
//  Created by Gil Birman on 9/2/16.
//

#import "AIRGoogleMapMarker.h"
#import <GoogleMaps/GoogleMaps.h>
#import "AIRGMSMarker.h"
#import "AIRGoogleMapCallout.h"
#import "RCTImageLoader.h"
#import "RCTUtils.h"

CGRect unionRect(CGRect a, CGRect b) {
  return CGRectMake(
                    MIN(a.origin.x, b.origin.x),
                    MIN(a.origin.y, b.origin.y),
                    MAX(a.size.width, b.size.width),
                    MAX(a.size.height, b.size.height));
}

@interface AIRGoogleMapMarker ()
- (id)eventFromMarker:(AIRGMSMarker*)marker;
@end

@implementation AIRGoogleMapMarker {
  RCTImageLoaderCancellationBlock _reloadImageCancellationBlock;
  __weak UIImageView *_iconImageView;
}

- (instancetype)init
{
  if ((self = [super init])) {
    _realMarker = [[AIRGMSMarker alloc] init];
    _realMarker.fakeMarker = self;
  }
  return self;
}

- (id)eventFromMarker:(AIRGMSMarker*)marker {

  CLLocationCoordinate2D coordinate = marker.position;
  CGPoint position = [self.realMarker.map.projection pointForCoordinate:coordinate];

return @{
         @"id": marker.identifier ?: @"unknown",
         @"position": @{
             @"x": @(position.x),
             @"y": @(position.y),
             },
         @"coordinate": @{
             @"latitude": @(coordinate.latitude),
             @"longitude": @(coordinate.longitude),
             }
         };
}

- (void)insertReactSubview:(id<RCTComponent>)subview atIndex:(NSInteger)atIndex {
  if ([subview isKindOfClass:[AIRGoogleMapCallout class]]) {
    self.calloutView = (AIRGoogleMapCallout *)subview;
  } else {
    // Custom UIView Marker
    // NOTE: Originally I tried creating a new UIView here to encapsulate subview,
    //       but it would not sizeToFit properly. Not sure why.
    [super insertReactSubview:(UIView*)subview atIndex:atIndex];
    [self sizeToFit];

    // TODO: how to handle this circular reference properly?
    _realMarker.iconView = self;
  }
}

- (void)removeReactSubview:(id<RCTComponent>)subview {
  if ([subview isKindOfClass:[AIRGoogleMapCallout class]]) {
    self.calloutView = nil;
  } else {
    [super removeReactSubview:(UIView*)subview];
  }
}

- (void)showCalloutView {
  [_realMarker.map setSelectedMarker:_realMarker];
}

- (void)hideCalloutView {
  [_realMarker.map setSelectedMarker:Nil];
}

- (UIView *)markerInfoContents {
  if (self.calloutView && !self.calloutView.tooltip) {
    return self.calloutView;
  }
  return nil;
}

- (UIView *)markerInfoWindow {
  if (self.calloutView && self.calloutView.tooltip) {
    return self.calloutView;
  }
  return nil;
}

- (void)didTapInfoWindowOfMarker:(AIRGMSMarker *)marker {
  if (self.calloutView && self.calloutView.onPress) {
    id event = @{@"action": @"marker-overlay-press",
                 @"id": self.identifier ?: @"unknown",
                 };
    self.calloutView.onPress(event);
  }
}

- (void)didBeginDraggingMarker:(AIRGMSMarker *)marker {
  if (!self.onDragStart) return;
  self.onDragStart([self eventFromMarker:marker]);
}

- (void)didEndDraggingMarker:(AIRGMSMarker *)marker {
  if (!self.onDragEnd) return;
  self.onDragEnd([self eventFromMarker:marker]);
}

- (void)didDragMarker:(AIRGMSMarker *)marker {
  if (!self.onDrag) return;
  self.onDrag([self eventFromMarker:marker]);
}

- (void)setCoordinate:(CLLocationCoordinate2D)coordinate {
  _realMarker.position = coordinate;
}

- (CLLocationCoordinate2D)coordinate {
  return _realMarker.position;
}

- (void)setIdentifier:(NSString *)identifier {
  _realMarker.identifier = identifier;
}

- (NSString *)identifier {
  return _realMarker.identifier;
}

- (void)setOnPress:(RCTBubblingEventBlock)onPress {
  _realMarker.onPress = onPress;
}

- (RCTBubblingEventBlock)onPress {
  return _realMarker.onPress;
}

- (void)setImageSrc:(NSString *)imageSrc
{

  _imageSrc = imageSrc;

  if (_reloadImageCancellationBlock) {
    _reloadImageCancellationBlock();
    _reloadImageCancellationBlock = nil;
  }

  _reloadImageCancellationBlock = [_bridge.imageLoader loadImageWithURLRequest:[RCTConvert NSURLRequest:_imageSrc]
                                                                          size:self.bounds.size
                                                                         scale:RCTScreenScale()
                                                                       clipped:YES
                                                                    resizeMode:RCTResizeModeCenter
                                                                 progressBlock:nil
                                                               completionBlock:^(NSError *error, UIImage *image) {
                                                                 if (error) {
                                                                   // TODO(lmr): do something with the error?
                                                                   NSLog(@"%@", error);
                                                                 }
                                                                 dispatch_async(dispatch_get_main_queue(), ^{

                                                                   if (_iconImageView) {
                                                                     // TODO: doesn't work because image is blank (WHY??)
                                                                     [_iconImageView setImage:image];
                                                                     return;
                                                                   }

                                                                   UIImageView *imageView = [[UIImageView alloc] initWithImage:image];

                                                                   // TODO: w,h or pixel density could be a prop.
                                                                   float density = 1;
                                                                   float w = image.size.width/density;
                                                                   float h = image.size.height/density;
                                                                   CGRect bounds = CGRectMake(0, 0, w, h);

                                                                   imageView.contentMode = UIViewContentModeScaleAspectFit;
                                                                   [imageView setFrame:bounds];

                                                                   // NOTE: sizeToFit doesn't work instead. Not sure why.
                                                                   // TODO: Doing it this way is not ideal because it causes things to reshuffle
                                                                   //       when the image loads IF the image is larger than the UIView.
                                                                   //       Shouldn't required images have size info automatically via RN?
                                                                   CGRect selfBounds = unionRect(bounds, self.bounds);
                                                                   [self setFrame:selfBounds];

                                                                   _iconImageView = imageView;

                                                                   [super insertSubview:imageView atIndex:0];
                                                                   _realMarker.iconView = self;

                                                                   // TODO: This could be a prop
                                                                   //_realMarker.groundAnchor = CGPointMake(0.75, 1);
                                                                 });
                                                               }];
}

- (void)setTitle:(NSString *)title {
  _realMarker.title = [title copy];
}

- (NSString *)title {
  return _realMarker.title;
}

- (void)setSubtitle:(NSString *)subtitle {
  _realMarker.snippet = subtitle;
}

- (NSString *)subtitle {
  return _realMarker.snippet;
}

- (void)setPinColor:(UIColor *)pinColor {
  _pinColor = pinColor;
  _realMarker.icon = [GMSMarker markerImageWithColor:pinColor];
}

- (void)setDraggable:(BOOL)draggable {
  _realMarker.draggable = draggable;
}

- (BOOL)draggable {
  return _realMarker.draggable;
}

@end
