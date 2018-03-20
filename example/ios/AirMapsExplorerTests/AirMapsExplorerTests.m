//
//  AirMapsExplorerTests.m
//  AirMapsExplorerTests
//
//  Created by Harry Lachenmayer on 20/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <XCTest/XCTest.h>

#import <RCTTestRunner.h>

@interface AirMapsExplorerTests : XCTestCase

@end

@implementation AirMapsExplorerTests {
  RCTTestRunner* _runner;
}

- (void)setUp {
  _runner = RCTInitRunnerForApp(@"example/Tests", nil, nil);
//  _runner.recordMode = NO;
}

#define MAPS_TEST(name)                 \
- (void)test##name                      \
{                                       \
  [_runner runTest:_cmd module:@#name]; \
  [_runner runTest:_cmd module:@#name initialProps:@{@"useGoogleMaps": @YES} configurationBlock:nil]; \
}

MAPS_TEST(PointForCoordinate);

@end
