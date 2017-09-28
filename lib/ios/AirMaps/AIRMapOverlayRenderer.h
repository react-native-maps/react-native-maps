#import <MapKit/MapKit.h>
#import <React/RCTResizeMode.h>

@class RCTBridge;

@interface AIRMapOverlayRenderer : MKOverlayRenderer

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, assign) CGFloat bearing;
@property (nonatomic, assign) RCTResizeMode resizeMode;

- (instancetype)initWithOverlay:(id<MKOverlay>)overlay withImageURL:(NSString *)imageURL withBridge:(RCTBridge*)bridge;

@end
