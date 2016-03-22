//
//  FBQuadTree.h
//  AnnotationClustering
//
//  Created by Filip Bec on 05/01/14.
//  Copyright (c) 2014 Infinum Ltd. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FBQuadTreeNode.h"

/**
 Quad Tree. You should never use this class.
 */
@interface FBQuadTree : NSObject

/// Root node.
@property (nonatomic, strong) FBQuadTreeNode *rootNode;


/**
 Insert new annotation in tree.
 */
- (BOOL)insertAnnotation:(id<MKAnnotation>)annotation;

/**
 Remove an annotation from the tree.
 */
- (BOOL)removeAnnotation:(id<MKAnnotation>)annotation;

/**
 Enumerate annotations in @c box.
 */
- (void)enumerateAnnotationsInBox:(FBBoundingBox)box usingBlock:(void (^)(id<MKAnnotation> obj))block;


/**
 Enumerate all annotations.
 */
- (void)enumerateAnnotationsUsingBlock:(void (^)(id<MKAnnotation> obj))block;

@end
