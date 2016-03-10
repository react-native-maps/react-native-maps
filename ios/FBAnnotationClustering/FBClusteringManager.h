//
//  FBClusterManager.h
//  AnnotationClustering
//
//  Created by Filip Bec on 05/01/14.
//  Copyright (c) 2014 Infinum Ltd. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FBQuadTreeNode.h"
#import "FBAnnotationCluster.h"

@class FBClusteringManager;

@protocol FBClusteringManagerDelegate <NSObject>
@optional
/**
 Method that allows you to define factor for default size of cluster cells.
 @param coordinator An instance of FBClusterManager.
 
 @discussion Cell size factor will scale size of default cell size. With value smaller than 1.0 cell size will be smaller than default and you will see more clusters on the map. With factor larger than 1.0 cell size will be bigger than default and you will see less clusters on the map.
 */
- (CGFloat)cellSizeFactorForCoordinator:(FBClusteringManager *)coordinator;

@end


/**
 Class that is responsible for clustering coordination.
 */
@interface FBClusteringManager : NSObject


@property (nonatomic, assign) id<FBClusteringManagerDelegate> delegate;


/**
 Creates a new instance of @c FBClusterManager with array of annotations.
 
 @param annotations Custom annotation objects.
 @returns An instance of FBClusterManager
 */
- (id)initWithAnnotations:(NSArray *)annotations;


/**
 Replace current annotations new array of annotations.
 
 @param annotations Custom annotation objects.
 */
- (void)setAnnotations:(NSArray *)annotations;


/**
 Add array of annotations to current annotation collection.
 
 @param annotations Custom annotation objects.
 */
- (void)addAnnotations:(NSArray *)annotations;


/**
 Remove array of annotations from current collection.
 
 @param annotations Custom annotation objects.
 */
- (void)removeAnnotations:(NSArray *)annotations;


/**
 Method that return array of your custom annotations or annotation clusters.
 
 @param rect An instance of MKMapRect.
 @param zoomScale An instance of MKMapRect.
 @returns Array of annotations objects of type @c FBAnnotationCluster or your custom class.
 */
- (NSArray *)clusteredAnnotationsWithinMapRect:(MKMapRect)rect
                                 withZoomScale:(double)zoomScale;

- (NSArray *)clusteredAnnotationsWithinMapRect:(MKMapRect)rect
                                 withZoomScale:(double)zoomScale
                                 withFilter:(BOOL (^)(id<MKAnnotation>)) filter;

/**
 All annotations in quad tree.
 @returns Array of annotations of your custom class.
 */
- (NSArray *)allAnnotations;


/**
 Method that will update map with new annotations.
 @param annotations Array of new annotation objects.
 @param mapView An instance of MKMapView
 
 @discussion This method will remove only annotations that are on the map, but are not in the new array of annotations. Only new annotations will be added on the map. Annotations that are already on the map will not be updated.
 */
- (void)displayAnnotations:(NSArray *)annotations
                 onMapView:(MKMapView *)mapView;

@end
