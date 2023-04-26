//
//  RNMGMSMarker.h
//  RNMaps
//
//  Created by Gil Birman on 9/5/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import <GoogleMaps/GoogleMaps.h>
#import <React/UIView+React.h>

@class RNMGoogleMapMarker;

@interface RNMGMSMarker : GMSMarker
@property (nonatomic, strong) NSString *identifier;
@property (nonatomic, weak) RNMGoogleMapMarker *fakeMarker;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@end


@protocol RNMGMSMarkerDelegate <NSObject>
@required
-(void)didTapMarker;
@end

#endif
