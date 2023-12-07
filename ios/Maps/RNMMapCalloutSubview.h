//
//  RNMMapCalloutSubview.h
//  RNMaps
//
//  Created by Denis Oblogin on 10/8/18.
//
//

#import <UIKit/UIKit.h>
#import <React/RCTView.h>

@interface RNMMapCalloutSubview : UIView
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@end

