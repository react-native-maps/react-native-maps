#import <Foundation/Foundation.h>
#import <MapKit/MapKit.h>
#import "AIRMapCoordinate.h"


@interface AIRMapImageOverlay : NSObject <MKOverlay>

- (instancetype)initWithBounds:(NSArray<AIRMapCoordinate *> *)bounds;

@end
