#ifdef HAVE_GOOGLE_MAPS
#import "RNMapsGoogleUserTracking.h"
#import "RNMapsUserTrackingMath.h"
#import <QuartzCore/QuartzCore.h>

@class RNMapsGoogleUserTracking;
@interface RNMapsTrackingFrameTarget : NSObject
@property (nonatomic, weak) RNMapsGoogleUserTracking *controller;
- (void)tick:(CADisplayLink *)link;
@end

@interface RNMapsGoogleUserTracking ()
- (void)tick:(CADisplayLink *)link;
@end

@implementation RNMapsTrackingFrameTarget
- (void)tick:(CADisplayLink *)link { [self.controller tick:link]; }
@end

@implementation RNMapsGoogleUserTracking {
  __weak GMSMapView *_map;
  NSString *_mode;
  CLLocation *_location;
  CLLocationManager *_headingManager;
  CADisplayLink *_displayLink;
  RNMapsTrackingFrameTarget *_frameTarget;
  BOOL _active;
  BOOL _headingRunning;
  BOOL _firstFrame;
  BOOL _hasHeading;
  double _heading;
  CFTimeInterval _lastFrame;
  GMSCameraPosition *_previousCamera;
  NSUInteger _unchangedFrames;
  BOOL _cameraAnimation;
  NSUInteger _cameraAnimationGeneration;
}

- (instancetype)initWithMap:(GMSMapView *)map {
  if ((self = [super init])) {
    _map = map;
    _mode = @"none";
    _firstFrame = YES;
    _frameTarget = [RNMapsTrackingFrameTarget new];
    _frameTarget.controller = self;
    NSNotificationCenter *notifications = [NSNotificationCenter defaultCenter];
    [notifications addObserver:self selector:@selector(suspend) name:UIApplicationWillResignActiveNotification object:nil];
    [notifications addObserver:self selector:@selector(updateVisibility) name:UIApplicationDidBecomeActiveNotification object:nil];
    [notifications addObserver:self selector:@selector(sceneWillDeactivate:) name:UISceneWillDeactivateNotification object:nil];
    [notifications addObserver:self selector:@selector(updateVisibility) name:UISceneDidActivateNotification object:nil];
  }
  return self;
}

- (void)dealloc {
  [_displayLink invalidate];
  [_headingManager stopUpdatingHeading];
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)setMode:(NSString *)mode legacyFollow:(BOOL)legacyFollow {
  NSString *next = mode.length ? mode : (legacyFollow ? @"follow" : @"none");
  if (![next isEqualToString:@"follow"] && ![next isEqualToString:@"followWithHeading"]) next = @"none";
  [self changeMode:next reason:@"programmatic"];
}

- (void)changeMode:(NSString *)next reason:(NSString *)reason {
  if ([_mode isEqualToString:next]) return;
  _mode = [next copy];
  _firstFrame = YES;
  _lastFrame = 0;
  [self updateHeading];
  if ([_mode isEqualToString:@"none"]) [self stopFrames]; else [self requestFrame];
  if (self.onModeChange) self.onModeChange(_mode, reason);
}

- (void)cancelForGesture {
  if (![_mode isEqualToString:@"none"]) [self changeMode:@"none" reason:@"userInteraction"];
}

- (void)suspend {
  _active = NO;
  _cameraAnimation = NO;
  _cameraAnimationGeneration++;
  [self updateHeading];
  [self stopFrames];
}

- (void)sceneWillDeactivate:(NSNotification *)notification {
  if (notification.object == _map.window.windowScene) [self suspend];
}

- (void)updateVisibility {
  GMSMapView *map = _map;
  CLAuthorizationStatus permission = [CLLocationManager authorizationStatus];
  BOOL authorized = permission == kCLAuthorizationStatusAuthorizedAlways || permission == kCLAuthorizationStatusAuthorizedWhenInUse;
  BOOL sceneActive = !map.window.windowScene || map.window.windowScene.activationState == UISceneActivationStateForegroundActive;
  BOOL active = map.window != nil && !map.hidden && !map.window.hidden && sceneActive && map.myLocationEnabled && authorized &&
    [UIApplication sharedApplication].applicationState == UIApplicationStateActive;
  BOOL becameActive = !_active && active;
  if (_active != active) {
    _active = active;
    if (!active) { _cameraAnimation = NO; _cameraAnimationGeneration++; }
    _firstFrame = YES;
    _lastFrame = 0;
  }
  [self updateHeading];
  if (becameActive) [self requestFrame];
  else if (!_active) [self stopFrames];
}

- (void)updateHeading {
  BOOL needed = _active && [_mode isEqualToString:@"followWithHeading"] && [CLLocationManager headingAvailable];
  if (needed) {
    if (!_headingManager) {
      // Heading only: the existing GMSMapView location stream supplies position.
      _headingManager = [CLLocationManager new];
      _headingManager.delegate = self;
      _headingManager.headingFilter = 0.5;
    }
    UIInterfaceOrientation orientation = _map.window.windowScene.interfaceOrientation;
    if (orientation == UIInterfaceOrientationLandscapeLeft) _headingManager.headingOrientation = CLDeviceOrientationLandscapeRight;
    else if (orientation == UIInterfaceOrientationLandscapeRight) _headingManager.headingOrientation = CLDeviceOrientationLandscapeLeft;
    else if (orientation == UIInterfaceOrientationPortraitUpsideDown) _headingManager.headingOrientation = CLDeviceOrientationPortraitUpsideDown;
    else _headingManager.headingOrientation = CLDeviceOrientationPortrait;
    if (!_headingRunning) {
      _headingRunning = YES;
      _hasHeading = NO;
      [_headingManager startUpdatingHeading];
    }
  } else if (!needed && _headingRunning) {
    [_headingManager stopUpdatingHeading];
    _headingRunning = NO;
    _hasHeading = NO;
  }
}

- (void)locationManagerDidChangeAuthorization:(CLLocationManager *)manager {
  [self updateVisibility];
}

- (void)locationManager:(CLLocationManager *)manager didUpdateHeading:(CLHeading *)heading {
  if (!_active || !_headingRunning || heading.headingAccuracy < 0) return;
  double value = heading.trueHeading >= 0 ? heading.trueHeading : heading.magneticHeading;
  if (!std::isfinite(value)) return;
  _heading = RNMapsUserTrackingMath::normalize(value);
  _hasHeading = YES;
  [self requestFrame];
}

- (BOOL)locationManagerShouldDisplayHeadingCalibration:(CLLocationManager *)manager {
  return NO;
}

- (void)updateLocation:(CLLocation *)location {
  if (!location || !CLLocationCoordinate2DIsValid(location.coordinate) ||
      !std::isfinite(location.coordinate.latitude) || !std::isfinite(location.coordinate.longitude) ||
      location.horizontalAccuracy < 0 || (_location && [location.timestamp compare:_location.timestamp] == NSOrderedAscending)) return;
  BOOL changed = !_location || location.coordinate.latitude != _location.coordinate.latitude ||
    location.coordinate.longitude != _location.coordinate.longitude;
  _location = location;
  if (![CLLocationManager headingAvailable] && std::isfinite(location.speed) && location.speed > 0.5 && std::isfinite(location.course) && location.course >= 0) {
    double course = RNMapsUserTrackingMath::normalize(location.course);
    if (!_hasHeading || std::fabs(RNMapsUserTrackingMath::delta(_heading, course)) >= 0.5) changed = YES;
    _heading = course;
    _hasHeading = YES;
  }
  [self updateVisibility];
  if (changed) [self requestFrame];
}

- (NSUInteger)beginCameraAnimation {
  _cameraAnimation = YES;
  [self stopFrames];
  return ++_cameraAnimationGeneration;
}

- (void)endCameraAnimation:(NSUInteger)generation {
  if (generation != _cameraAnimationGeneration) return;
  _cameraAnimation = NO;
  _firstFrame = NO;
  [self requestFrame];
}

- (void)cameraDidBecomeIdle {
  if (!_cameraAnimation) return;
  [self endCameraAnimation:_cameraAnimationGeneration];
}

- (void)requestFrame {
  if (!_active || _cameraAnimation || [_mode isEqualToString:@"none"] || !_location || _displayLink) return;
  _displayLink = [CADisplayLink displayLinkWithTarget:_frameTarget selector:@selector(tick:)];
  [_displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
}

- (void)stopFrames {
  [_displayLink invalidate];
  _displayLink = nil;
  _lastFrame = 0;
  _previousCamera = nil;
  _unchangedFrames = 0;
}

- (void)tick:(CADisplayLink *)link {
  GMSMapView *map = _map;
  if (!_active || _cameraAnimation || !map || !_location || [_mode isEqualToString:@"none"]) { [self stopFrames]; return; }
  GMSCameraPosition *current = map.camera;
  BOOL unchanged = _previousCamera && current.target.latitude == _previousCamera.target.latitude &&
    current.target.longitude == _previousCamera.target.longitude && current.bearing == _previousCamera.bearing;
  _unchangedFrames = unchanged ? _unchangedFrames + 1 : 0;
  _previousCamera = current;
  // Camera target bounds can prevent progress. Wait for new input instead of spinning.
  if (_unchangedFrames >= 8) { [self stopFrames]; return; }
  double latitude = std::fmax(-85, std::fmin(85, _location.coordinate.latitude));
  double latitudeDelta = latitude - current.target.latitude;
  double longitudeDelta = RNMapsUserTrackingMath::delta(current.target.longitude, _location.coordinate.longitude);
  double bearingDelta = [_mode isEqualToString:@"followWithHeading"] && _hasHeading ?
    RNMapsUserTrackingMath::delta(current.bearing, _heading) : 0;
  double distance = std::hypot(latitudeDelta, longitudeDelta * std::cos(latitude * M_PI / 180.0)) * 111320;
  if (distance < 0.01 && std::fabs(bearingDelta) < 0.01) {
    _firstFrame = NO;
    [self stopFrames];
    return;
  }
  BOOL settled = distance < 0.15 && std::fabs(bearingDelta) < 0.1;
  double seconds = _lastFrame == 0 ? 1.0 / 60 : link.timestamp - _lastFrame;
  double alpha = _firstFrame || settled ? 1 : RNMapsUserTrackingMath::factor(seconds);
  _firstFrame = NO;
  _lastFrame = link.timestamp;
  CLLocationCoordinate2D center = CLLocationCoordinate2DMake(current.target.latitude + latitudeDelta * alpha,
    RNMapsUserTrackingMath::normalize(current.target.longitude + longitudeDelta * alpha + 180) - 180);
  // Keep user-selected zoom and tilt. Never run competing SDK camera animations.
  map.camera = [GMSCameraPosition cameraWithTarget:center zoom:current.zoom
    bearing:RNMapsUserTrackingMath::normalize(current.bearing + bearingDelta * alpha) viewingAngle:current.viewingAngle];
  if (settled) [self stopFrames];
}
@end
#endif
