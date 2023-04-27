//
//  RNMMapSnapshot.h
//  RNMaps
//
//  Created by Hein Rutjes on 26/09/16.
//  Copyright © 2016 Christopher. All rights reserved.
//

#ifndef RNMMapSnapshot_h
#define RNMMapSnapshot_h

@protocol RNMMapSnapshot <NSObject>
@optional
- (void) drawToSnapshot:(MKMapSnapshot *) snapshot context:(CGContextRef) context;
@end

#endif /* RNMMapSnapshot_h */
