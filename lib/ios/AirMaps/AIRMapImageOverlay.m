#import "AIRMapImageOverlay.h"


@implementation AIRMapImageOverlay

@synthesize boundingMapRect;
@synthesize coordinate;

- (instancetype)initWithBounds:(NSArray<AIRMapCoordinate *> *)bounds {
    self = [super init];
    if (self) {
      CLLocationCoordinate2D nw = CLLocationCoordinate2DMake(bounds[0].coordinate.latitude,
                                                             bounds[1].coordinate.longitude);
      MKMapPoint northWest = MKMapPointForCoordinate(nw);
      MKMapPoint northEast = MKMapPointForCoordinate(bounds[0].coordinate);
      MKMapPoint southWest = MKMapPointForCoordinate(bounds[1].coordinate);
      double width = fabs(northEast.x - southWest.x);
      double height = fabs(northEast.y - southWest.y);
      boundingMapRect = MKMapRectMake(northWest.x,
                                      northWest.y,
                                      width,
                                      height);

      CLLocationDegrees midLat = (bounds[0].coordinate.latitude + bounds[1].coordinate.latitude)/2;
      CLLocationDegrees midLong = (bounds[0].coordinate.longitude + bounds[1].coordinate.longitude)/2;
      coordinate = CLLocationCoordinate2DMake(midLat,
                                              midLong);
    }
    return self;
}

- (BOOL)intersectsMapRect:(MKMapRect)mapRect
{
  return MKMapRectIntersectsRect(mapRect, boundingMapRect);
}

- (BOOL)canReplaceMapContent
{
  return YES;
}


@end
