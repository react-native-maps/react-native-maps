//
//  AIRGoogleMapCallout.h
//  AirMaps
//
//  Created by Gil Birman on 9/6/16.
//
//

#import <UIKit/UIKit.h>
#if __has_include(<React/RCTView.h>)
    #import <React/RCTView.h>
#else
    #import "RCTView.h"
#endif

@interface AIRGoogleMapCallout : UIView
@property (nonatomic, assign) BOOL tooltip;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@end
