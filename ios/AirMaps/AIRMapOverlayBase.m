//
// AIRMapOverlayBase.m
// Created for performance optimization of map overlays
//

#import "AIRMapOverlayBase.h"
#import "AIRMap.h"

// Fixed batch update interval (60fps)
static const NSTimeInterval AIRMapOverlayBatchUpdateInterval = 0.016;

@implementation AIRMapOverlayBase {
    BOOL _hasScheduledUpdate;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _hasScheduledUpdate = NO;
    }
    return self;
}

- (void)scheduleBatchedUpdate {
    // Cancel any previously scheduled update
    if (_hasScheduledUpdate) {
        [NSObject cancelPreviousPerformRequestsWithTarget:self 
                                                 selector:@selector(processBatchedUpdateInternal) 
                                                   object:nil];
    }
    
    // Schedule a batched update
    _hasScheduledUpdate = YES;
    [self performSelector:@selector(processBatchedUpdateInternal) 
               withObject:nil 
               afterDelay:AIRMapOverlayBatchUpdateInterval];
}

- (void)processBatchedUpdateInternal {
    _hasScheduledUpdate = NO;
    [self performBatchedUpdate];
}

- (void)performBatchedUpdate {
    // Default implementation - subclasses should override
    [self update];
}

- (void)update {
    // Default implementation - subclasses should override
    // This is for immediate updates (style changes, etc.)
}

- (void)refreshOverlayOnMap {
    if (self.map == nil) return;
    [self.map removeOverlay:self];
    [self.map addOverlay:self];
}

- (void)dealloc {
    if (_hasScheduledUpdate) {
        [NSObject cancelPreviousPerformRequestsWithTarget:self 
                                                 selector:@selector(processBatchedUpdateInternal) 
                                                   object:nil];
    }
}

#pragma mark - MKOverlay protocol (default implementations)

- (CLLocationCoordinate2D)coordinate {
    // Subclasses should override
    return kCLLocationCoordinate2DInvalid;
}

- (MKMapRect)boundingMapRect {
    // Subclasses should override
    return MKMapRectNull;
}

- (BOOL)intersectsMapRect:(MKMapRect)mapRect {
    // Subclasses should override
    return NO;
}

- (BOOL)canReplaceMapContent {
    return NO;
}

@end 