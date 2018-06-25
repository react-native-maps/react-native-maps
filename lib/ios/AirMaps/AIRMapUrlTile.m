//
//  AIRUrlTileOverlay.m
//  AirMaps
//
//  Created by cascadian on 3/19/16.
//  Copyright © 2016. All rights reserved.
//

#import "AIRMapUrlTile.h"
#import "AIRMapUrlTileOverlay.h"
#import <React/UIView+React.h>

@implementation AIRMapUrlTile {
    BOOL _urlTemplateSet;
}

- (void)setUrlTemplate:(NSString *)urlTemplate{
    _urlTemplate = urlTemplate;
    _urlTemplateSet = YES;
    [self createTileOverlayAndRendererIfPossible];
    [self update];
}

- (void)setMaximumZ:(NSInteger)maximumZ
{
    _maximumZ = maximumZ;
    if(self.tileOverlay) {
        self.tileOverlay.maximumZ = maximumZ;
    }
    [self update];
}

- (void)setOverzoomEnabled:(BOOL)overzoomEnabled
{
    _overzoomEnabled = overzoomEnabled;
    if(self.tileOverlay) {
        self.tileOverlay.overzoomEnabled = _overzoomEnabled;
    }
    [self update];
}

- (void)setOverzoomThreshold:(NSInteger)overzoomThreshold
{
    _overzoomThreshold = overzoomThreshold;
    if(self.tileOverlay) {
        self.tileOverlay.overzoomThreshold = overzoomThreshold;
    }
    [self update];
}


- (void) createTileOverlayAndRendererIfPossible
{
    if (!_urlTemplateSet) return;
    self.tileOverlay = [[AIRMapUrlTileOverlay alloc] initWithURLTemplate:self.urlTemplate];
    self.tileOverlay.canReplaceMapContent = YES;
    
    if (self.overzoomEnabled) {
        self.tileOverlay.overzoomEnabled = self.overzoomEnabled;
    }
    
    if (self.overzoomThreshold) {
        self.tileOverlay.overzoomThreshold = self.overzoomThreshold;
    }
    
    if (self.maximumZ) {
        self.tileOverlay.maximumZ = self.maximumZ;
    }
    self.renderer = [[MKTileOverlayRenderer alloc] initWithTileOverlay:self.tileOverlay];
}

- (void) update
{
    if (!_renderer) return;
    
    if (_map == nil) return;
    [_map removeOverlay:self];
    [_map addOverlay:self level:MKOverlayLevelAboveLabels];
}

#pragma mark MKOverlay implementation

- (CLLocationCoordinate2D) coordinate
{
    return self.tileOverlay.coordinate;
}

- (MKMapRect) boundingMapRect
{
    return self.tileOverlay.boundingMapRect;
}

- (BOOL)canReplaceMapContent
{
    return self.tileOverlay.canReplaceMapContent;
}

@end
