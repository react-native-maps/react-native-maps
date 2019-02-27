//
//  AIRWeakMapReference.h
//  AirMaps
//
//  Created by Michael Kugler on 27.02.19.
//  Copyright © 2019 Christopher. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AIRMap.h"

NS_ASSUME_NONNULL_BEGIN

@interface AIRWeakMapReference : NSObject

@property (nonatomic, weak) AIRMap *mapView;

- (instancetype)initWithMapView:(AIRMap *)mapView;


@end

NS_ASSUME_NONNULL_END
