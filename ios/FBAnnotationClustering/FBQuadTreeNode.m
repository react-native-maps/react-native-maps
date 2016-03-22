//
//  FBQuadTreeNode.m
//  AnnotationClustering
//
//  Created by Filip Bec on 05/01/14.
//  Copyright (c) 2014 Infinum Ltd. All rights reserved.
//

#import "FBQuadTreeNode.h"

@implementation FBQuadTreeNode

- (id)init
{
    self = [super init];
    if (self) {
        self.count = 0;
        self.northEast = nil;
        self.northWest = nil;
        self.southEast = nil;
        self.southWest = nil;
        self.annotations = [[NSMutableArray alloc] initWithCapacity:kNodeCapacity];
    }
    return self;
}

- (id)initWithBoundingBox:(FBBoundingBox)box
{
    self = [self init];
    if (self) {
        self.boundingBox = box;
    }
    return self;
}

- (BOOL)isLeaf
{
    return self.northEast ? NO : YES;
}

- (void)subdivide
{
    self.northEast = [[FBQuadTreeNode alloc] init];
    self.northWest = [[FBQuadTreeNode alloc] init];
    self.southEast = [[FBQuadTreeNode alloc] init];
    self.southWest = [[FBQuadTreeNode alloc] init];
    
    FBBoundingBox box = self.boundingBox;
    CGFloat xMid = (box.xf + box.x0) / 2.0;
    CGFloat yMid = (box.yf + box.y0) / 2.0;
    
    self.northEast.boundingBox = FBBoundingBoxMake(xMid, box.y0, box.xf, yMid);
    self.northWest.boundingBox = FBBoundingBoxMake(box.x0, box.y0, xMid, yMid);
    self.southEast.boundingBox = FBBoundingBoxMake(xMid, yMid, box.xf, box.yf);
    self.southWest.boundingBox = FBBoundingBoxMake(box.x0, yMid, xMid, box.yf);
    
}

#pragma mark -
#pragma mark - Bounding box functions

FBBoundingBox FBBoundingBoxMake(CGFloat x0, CGFloat y0, CGFloat xf, CGFloat yf)
{
    FBBoundingBox box;
    box.x0 = x0;
    box.y0 = y0;
    box.xf = xf;
    box.yf = yf;
    return box;
}

FBBoundingBox FBBoundingBoxForMapRect(MKMapRect mapRect)
{
    CLLocationCoordinate2D topLeft = MKCoordinateForMapPoint(mapRect.origin);
    CLLocationCoordinate2D botRight = MKCoordinateForMapPoint(MKMapPointMake(MKMapRectGetMaxX(mapRect), MKMapRectGetMaxY(mapRect)));
    
    CLLocationDegrees minLat = botRight.latitude;
    CLLocationDegrees maxLat = topLeft.latitude;
    
    CLLocationDegrees minLon = topLeft.longitude;
    CLLocationDegrees maxLon = botRight.longitude;
    
    return FBBoundingBoxMake(minLat, minLon, maxLat, maxLon);
}

MKMapRect FBMapRectForBoundingBox(FBBoundingBox boundingBox)
{
    MKMapPoint topLeft = MKMapPointForCoordinate(CLLocationCoordinate2DMake(boundingBox.x0, boundingBox.y0));
    MKMapPoint botRight = MKMapPointForCoordinate(CLLocationCoordinate2DMake(boundingBox.xf, boundingBox.yf));
    
    return MKMapRectMake(topLeft.x, botRight.y, fabs(botRight.x - topLeft.x), fabs(botRight.y - topLeft.y));
}

BOOL FBBoundingBoxContainsCoordinate(FBBoundingBox box, CLLocationCoordinate2D coordinate)
{
    BOOL containsX = box.x0 <= coordinate.latitude && coordinate.latitude <= box.xf;
    BOOL containsY = box.y0 <= coordinate.longitude && coordinate.longitude <= box.yf;
    return containsX && containsY;
}

BOOL FBBoundingBoxIntersectsBoundingBox(FBBoundingBox box1, FBBoundingBox box2)
{
    return (box1.x0 <= box2.xf && box1.xf >= box2.x0 && box1.y0 <= box2.yf && box1.yf >= box2.y0);
}

@end
