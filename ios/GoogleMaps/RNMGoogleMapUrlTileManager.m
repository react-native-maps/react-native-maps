//
//  RNMGoogleMapURLTileManager.m
//  Created by Nick Italiano on 11/5/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import "RNMGoogleMapUrlTileManager.h"
#import "RNMGoogleMapUrlTile.h"

@interface RNMGoogleMapUrlTileManager()

@end

@implementation RNMGoogleMapUrlTileManager

RCT_EXPORT_MODULE(RNMGoogleMapUrlTile)

- (UIView *)view
{
  RNMGoogleMapUrlTile *tileLayer = [RNMGoogleMapUrlTile new];
  return tileLayer;
}

RCT_EXPORT_VIEW_PROPERTY(urlTemplate, NSString)
RCT_EXPORT_VIEW_PROPERTY(zIndex, int)
RCT_EXPORT_VIEW_PROPERTY(maximumZ, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(minimumZ, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(flipY, BOOL)

@end

#endif
