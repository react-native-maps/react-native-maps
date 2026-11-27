//
//  AIRGoogleMapMarker.h
//  AirMaps
//
//  Created by Gil Birman on 9/2/16.
//

#ifdef HAVE_GOOGLE_MAPS

#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTBridge.h>
#import "AIRGMSMarker.h"
#import "AIRGoogleMap.h"
#import "AIRGoogleMapCallout.h"
#import "AIRGoogleMapCalloutSubview.h"

@interface AIRGoogleMapMarker : UIView

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, strong) AIRGoogleMapCallout *calloutView;
@property (nonatomic, strong) NSString *identifier;
@property (nonatomic, assign) CLLocationCoordinate2D coordinate;
@property (nonatomic, assign) CLLocationDegrees rotation;
@property (nonatomic, strong) AIRGMSMarker* realMarker;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@property (nonatomic, copy) RCTDirectEventBlock onDragStart;
@property (nonatomic, copy) RCTDirectEventBlock onDrag;
@property (nonatomic, copy) RCTDirectEventBlock onDragEnd;
@property (nonatomic, copy) RCTDirectEventBlock onSelect;
@property (nonatomic, copy) RCTDirectEventBlock onDeselect;
@property (nonatomic, assign) BOOL flat;
@property (nonatomic, copy) NSString *imageSrc;
@property (nonatomic, copy) NSString *iconSrc;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *subtitle;
@property (nonatomic, strong) UIColor *pinColor;
@property (nonatomic, assign) CGPoint anchor;
@property (nonatomic, assign) CGPoint calloutAnchor;
@property (nonatomic, assign) NSInteger zIndex;
@property (nonatomic, assign) double opacity;
@property (nonatomic, assign) BOOL draggable;
@property (nonatomic, assign) BOOL tappable;
@property (nonatomic, assign) BOOL tracksViewChanges;
@property (nonatomic, assign) BOOL tracksInfoWindowChanges;

- (void)showCalloutView;
- (void)hideCalloutView;
/**
 * Draws the icon again now. On Fabric, we draw our views into an image and
 * give Google that. On the old architecture, Google re-renders our views.
 */
- (void)redraw;
/**
 * Redraws the icon at the end of this Fabric mounting transaction, even with
 * tracksViewChanges={false}. Use it for changes React doesn't send through
 * our views, like Fabric resizing us.
 */
- (void)setNeedsRedrawAfterMountingTransaction;
/**
 * Call at the end of each Fabric mounting transaction. Redraws the icon if
 * the transaction changed any of its views, or added or removed any. Only
 * does anything with tracksViewChanges={true}, right after it turns off, or
 * after setNeedsRedrawAfterMountingTransaction.
 */
- (void)redrawIfNeededAfterMountingTransaction:(NSSet<NSNumber *> *)changedViewTags;
- (UIView *)markerInfoContents;
- (UIView *)markerInfoWindow;
- (void)didTapInfoWindowOfMarker:(AIRGMSMarker *)marker;
- (void)didTapInfoWindowOfMarker:(AIRGMSMarker *)marker point:(CGPoint)point frame:(CGRect)frame;
- (void)didTapInfoWindowOfMarker:(AIRGMSMarker *)marker subview:(AIRGoogleMapCalloutSubview*)subview point:(CGPoint)point frame:(CGRect)frame;
- (void)didBeginDraggingMarker:(AIRGMSMarker *)marker;
- (void)didEndDraggingMarker:(AIRGMSMarker *)marker;
- (void)didDragMarker:(AIRGMSMarker *)marker;
- (id)makeEventData;
- (id)makeEventData:(NSString *)action;
- (UIView *) iconView;
- (void) didInsertInMap:(AIRGoogleMap *) map;
@end

#endif
