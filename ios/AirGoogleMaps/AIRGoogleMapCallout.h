//
//  AIRGoogleMapCallout.h
//  AirMaps
//
//  Created by Gil Birman on 9/6/16.
//
//

#import <UIKit/UIKit.h>
#import "RCTView.h"

@interface AIRGoogleMapCallout : UIView
@property (nonatomic, assign) BOOL tooltip;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@end
