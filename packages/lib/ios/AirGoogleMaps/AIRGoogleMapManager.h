//
//  AIRGoogleMapManager.h
//  AirMaps
//
//  Created by Gil Birman on 9/1/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import <React/RCTViewManager.h>

@class GMSCameraPosition;

@interface AIRGoogleMapManager : RCTViewManager

@property (nonatomic, strong) NSString* googleMapId;
@property (nonatomic, strong) NSString* customMapStyle;
@property (nonatomic) BOOL zoomTapEnabled;
@property (nonatomic, strong) UIColor* backgroundColor;
@property (nonatomic, strong) GMSCameraPosition* camera;

@property (nonatomic, strong) NSDictionary *initialProps;

@property (nonatomic) BOOL isGesture;

@end

#endif
