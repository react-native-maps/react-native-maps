#ifdef HAVE_GOOGLE_MAPS
#import <GoogleMaps/GoogleMaps.h>
#import <CoreLocation/CoreLocation.h>

@interface RNMapsGoogleUserTracking : NSObject <CLLocationManagerDelegate>
@property (nonatomic, copy) void (^onModeChange)(NSString *mode, NSString *reason);
- (instancetype)initWithMap:(GMSMapView *)map;
- (void)setMode:(NSString *)mode legacyFollow:(BOOL)legacyFollow;
- (void)updateVisibility;
- (void)updateLocation:(CLLocation *)location;
- (void)cancelForGesture;
- (NSUInteger)beginCameraAnimation;
- (void)endCameraAnimation:(NSUInteger)generation;
- (void)cameraDidBecomeIdle;
@end
#endif
