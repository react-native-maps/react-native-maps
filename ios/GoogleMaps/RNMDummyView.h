//
//  RNMDummyView.h
//  RNMaps
//
//  Created by Gil Birman on 10/4/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import <UIKit/UIKit.h>


@interface RNMDummyView : UIView
@property (nonatomic, weak) UIView *view;
- (instancetype)initWithView:(UIView*)view;
@end

#endif
