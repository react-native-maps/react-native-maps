//
//  AIRGMSPolyline.h
//  AirMaps
//
//  Created by Guilherme Pontes 04/05/2017.
//

#import <GoogleMaps/GoogleMaps.h>
#import "UIView+React.h"

@class AIRGoogleMapPolyline;

@interface AIRGMSPolyline : GMSPolyline
@property (nonatomic, strong) NSString *identifier;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@end
