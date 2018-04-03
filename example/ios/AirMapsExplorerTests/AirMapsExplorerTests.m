//
//  AirMapsExplorerTests.m
//  AirMapsExplorerTests
//
//  Created by Harry Lachenmayer on 20/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <XCTest/XCTest.h>

#import <RCTTestRunner.h>

#import <GoogleMaps/GoogleMaps.h>

@interface AirMapsExplorerTests : XCTestCase

@end

@implementation AirMapsExplorerTests {
  RCTTestRunner* _runner;
}

- (void)setUp {
  [GMSServices provideAPIKey:@"AIzaSyAeHIC4IG7XKT2Ls5Ti_YZV-6DHQk6dVHE"];
  _runner = RCTInitRunnerForApp(@"example/Tests", nil, nil);
//  _runner.recordMode = NO;
}

// The test is run once for each supported Maps API.
// We pass in the desired provider by the prop `provider`.
#define MAPS_TEST(name)                 \
- (void)test##name                      \
{                                       \
  [_runner runTest:_cmd module:@#name]; \
  [_runner runTest:_cmd module:@#name initialProps:@{@"provider": @"google"} configurationBlock:nil]; \
}

// To add a new test, add a new MAPS_TEST line here.
// The names here need to correspond with the names exported in `example/tests/index.js`.
MAPS_TEST(PointForCoordinate);

@end
