//
//  AIRGMSMarker.m
//  AirMaps
//
//  Created by Gil Birman on 9/5/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import "AIRGMSMarker.h"

@implementation AIRGMSMarker

- (id)makeEventData:(NSString *)action {
    CLLocationCoordinate2D coordinate = self.position;
    CGPoint position = [self.map.projection pointForCoordinate:coordinate];

    return @{
            @"id": self.identifier ?: @"unknown",
            @"position": @{
                @"x": @(position.x),
                @"y": @(position.y),
                },
            @"coordinate": @{
                @"latitude": @(coordinate.latitude),
                @"longitude": @(coordinate.longitude),
                },
            @"action": action,
            };
}

- (id)makeEventData {
    return [self makeEventData:@"unknown"];
}

@end

#endif
