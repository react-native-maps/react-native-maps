//
//  FBQuadTree.m
//  AnnotationClustering
//
//  Created by Filip Bec on 05/01/14.
//  Copyright (c) 2014 Infinum Ltd. All rights reserved.
//

#import "FBQuadTree.h"

@implementation FBQuadTree

- (id)init
{
    self = [super init];
    if (self) {
        self.rootNode = [[FBQuadTreeNode alloc] initWithBoundingBox:FBBoundingBoxForMapRect(MKMapRectWorld)];
    }
    return self;
}

- (BOOL)insertAnnotation:(id<MKAnnotation>)annotation
{
    return [self insertAnnotation:annotation toNode:self.rootNode];
}

- (BOOL)removeAnnotation:(id<MKAnnotation>)annotation
{
    return [self removeAnnotation:annotation fromNode:self.rootNode];
}

- (BOOL)removeAnnotation:(id<MKAnnotation>)annotation fromNode:(FBQuadTreeNode *)node
{
    if (!FBBoundingBoxContainsCoordinate(node.boundingBox, [annotation coordinate])) {
        return NO;
    }

    if ([node.annotations containsObject:annotation]) {
        [node.annotations removeObject:annotation];
        node.count--;
        return YES;
    }

    if ([self removeAnnotation:annotation fromNode:node.northEast]) return YES;
    if ([self removeAnnotation:annotation fromNode:node.northWest]) return YES;
    if ([self removeAnnotation:annotation fromNode:node.southEast]) return YES;
    if ([self removeAnnotation:annotation fromNode:node.southWest]) return YES;

    return NO;
}


- (BOOL)insertAnnotation:(id<MKAnnotation>)annotation toNode:(FBQuadTreeNode *)node
{
    if (!FBBoundingBoxContainsCoordinate(node.boundingBox, [annotation coordinate])) {
        return NO;
    }
    
    if (node.count < kNodeCapacity) {
        node.annotations[node.count++] = annotation;
        return YES;
    }
    
    if ([node isLeaf]) {
        [node subdivide];
    }
    
    if ([self insertAnnotation:annotation toNode:node.northEast]) return YES;
    if ([self insertAnnotation:annotation toNode:node.northWest]) return YES;
    if ([self insertAnnotation:annotation toNode:node.southEast]) return YES;
    if ([self insertAnnotation:annotation toNode:node.southWest]) return YES;
    
    return NO;
}

- (void)enumerateAnnotationsInBox:(FBBoundingBox)box usingBlock:(void (^)(id<MKAnnotation>))block
{
    [self enumerateAnnotationsInBox:box withNode:self.rootNode usingBlock:block];
}

- (void)enumerateAnnotationsUsingBlock:(void (^)(id<MKAnnotation>))block
{
    [self enumerateAnnotationsInBox:FBBoundingBoxForMapRect(MKMapRectWorld) withNode:self.rootNode usingBlock:block];
}

- (void)enumerateAnnotationsInBox:(FBBoundingBox)box withNode:(FBQuadTreeNode*)node usingBlock:(void (^)(id<MKAnnotation>))block
{
    if (!FBBoundingBoxIntersectsBoundingBox(node.boundingBox, box)) {
        return;
    }
    
    NSArray *tempArray = [node.annotations copy];
    
    for (id<MKAnnotation> annotation in tempArray) {
        if (FBBoundingBoxContainsCoordinate(box, [annotation coordinate])) {
            block(annotation);
        }
    }
    
    if ([node isLeaf]) {
        return;
    }
    
    [self enumerateAnnotationsInBox:box withNode:node.northEast usingBlock:block];
    [self enumerateAnnotationsInBox:box withNode:node.northWest usingBlock:block];
    [self enumerateAnnotationsInBox:box withNode:node.southEast usingBlock:block];
    [self enumerateAnnotationsInBox:box withNode:node.southWest usingBlock:block];
}

@end
