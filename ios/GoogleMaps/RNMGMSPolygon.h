//
//  RNMGMSPolygon.h
//  RNMaps
//
//  Created by Gerardo Pacheco 02/05/2017.
//

#ifdef HAVE_GOOGLE_MAPS

#import <GoogleMaps/GoogleMaps.h>
#import <React/UIView+React.h>

@class RNMGoogleMapPolygon;

@interface RNMGMSPolygon : GMSPolygon
@property (nonatomic, strong) NSString *identifier;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@end

#endif
