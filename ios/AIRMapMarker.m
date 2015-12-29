/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AIRMapMarker.h"

#import "RCTEventDispatcher.h"
#import "UIView+React.h"

@implementation EmptyCalloutBackgroundView
@end

@implementation AIRMapMarker

- (void)insertReactSubview:(id<RCTComponent>)subview atIndex:(NSInteger)atIndex {
    if ([subview isKindOfClass:[AIRMapCallout class]]) {
        self.calloutView = (AIRMapCallout *)subview;
    } else {
        [super insertReactSubview:subview atIndex:atIndex];
    }
}

- (void)removeReactSubview:(id<RCTComponent>)subview {
    if ([subview isKindOfClass:[AIRMapCallout class]] && self.calloutView == subview) {
        self.calloutView = nil;
    } else {
        [super removeReactSubview:subview];
    }
}

- (MKAnnotationView *)getAnnotationView
{
    if (self.subviews.count > 0 || self.image) {
        // If it has subviews, it means we are wanting to render a custom marker with arbitrary react views.
        // if it has a non-null image, it means we want to render a custom marker with the image.
        // In either case, we want to return the AIRMapMarker since it is both an MKAnnotation and an
        // MKAnnotationView all at the same time.
        return self;
    } else {
        // In this case, we want to render a platform "default" marker.
        MKPinAnnotationView *view = [MKPinAnnotationView new];

        // TODO(lmr): Looks like this API was introduces in iOS 8. We may want to handle differently for earlier
        // versions. Right now it's just leaving it with the default color. People needing the colors are free to
        // use their own custom markers.
        if ([view respondsToSelector:@selector(setPinTintColor:)]) {
            view.pinTintColor = self.pinColor;
        }

        return view;
    }
}

- (void)fillCalloutView:(SMCalloutView *)calloutView {
    // Set everything necessary on the calloutView before it becomes visible.

    // Apply the MKAnnotationView's desired calloutOffset (from the top-middle of the view)
    calloutView.calloutOffset = self.calloutOffset;

    if (self.calloutView) {
        calloutView.title = nil;
        calloutView.subtitle = nil;
        if (self.calloutView.tooltip) {
            // if tooltip is true, then the user wants their react view to be the "tooltip" as wwell, so we set
            // the background view to something empty/transparent
            calloutView.backgroundView = [EmptyCalloutBackgroundView new];
        } else {
            // the default tooltip look is wanted, and the user is just filling the content with their react subviews.
            // as a result, we use the default "masked" background view.
            calloutView.backgroundView = [SMCalloutMaskedBackgroundView new];
        }

        // when this is set, the callout's content will be whatever react views the user has put as the callout's
        // children.
        calloutView.contentView = self.calloutView;

    } else {
        // if there is no calloutView, it means the user wants to use the default callout behavior with title/subtitle
        // pairs.
        calloutView.title = self.title;
        calloutView.subtitle = self.subtitle;
        calloutView.contentView = nil;
        calloutView.backgroundView = [SMCalloutMaskedBackgroundView new];
    }
}

- (BOOL)shouldShowCalloutView {
    return self.calloutView != nil || self.title != nil || self.subtitle != nil;
}


@end
