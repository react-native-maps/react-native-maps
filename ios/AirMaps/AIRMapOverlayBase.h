//
// AIRMapOverlayBase.h
// Created for performance optimization of map overlays
//

#import <Foundation/Foundation.h>
#import <MapKit/MapKit.h>
#import <React/RCTComponent.h>
#import <React/RCTView.h>

NS_ASSUME_NONNULL_BEGIN

@class AIRMap;

/**
 * Base class for map overlays that provides batch update functionality
 * to improve performance during rapid property changes.
 */
@interface AIRMapOverlayBase : MKAnnotationView <MKOverlay>

@property (nonatomic, weak) AIRMap *map;

/**
 * Schedule a batched update. Subclasses should call this instead of
 * calling update directly for properties that change frequently.
 */
- (void)scheduleBatchedUpdate;

/**
 * Override this method in subclasses to perform the actual update logic.
 * This will be called after the batch interval has elapsed.
 */
- (void)performBatchedUpdate;

/**
 * Standard update method that subclasses should implement for immediate updates
 * (e.g., style changes that don't need batching).
 */
- (void)update;

/**
 * Utility method for common overlay update pattern: remove and re-add to map
 */
- (void)refreshOverlayOnMap;

@end

NS_ASSUME_NONNULL_END 