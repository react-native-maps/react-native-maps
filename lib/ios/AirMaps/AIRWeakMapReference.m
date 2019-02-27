//
//  AIRWeakMapReference.m
//  AirMaps
//
//  Created by Michael Kugler on 27.02.19.
//  Copyright © 2019 Christopher. All rights reserved.
//

#import "AIRWeakMapReference.h"

@implementation AIRWeakMapReference


- (instancetype)initWithMapView:(AIRMap *)mapView {
    self = [super init];
    if (self) {
        _mapView = mapView;
    }
    return self;
}

@end
