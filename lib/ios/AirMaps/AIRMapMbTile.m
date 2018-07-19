//
//  AIRMapMbTile.m
//  AirMaps
//
//  Created by Christoph Lambio on 28/03/2018.
//  Based on AIRMapLocalTile.m
//  Copyright (c) 2017 Christopher. All rights reserved.
//

#import "AIRMapMbTile.h"
#import <React/UIView+React.h>
#import "AIRMapMbTileOverlay.h"

@implementation AIRMapMbTile {
    BOOL _pathTemplateSet;
    BOOL _tileSizeSet;
}

- (void)setPathTemplate:(NSString *)pathTemplate{
    _pathTemplate = pathTemplate;
    _pathTemplateSet = YES;
    [self createTileOverlayAndRendererIfPossible];
    [self update];
}

- (void)setTileSize:(CGFloat)tileSize{
    _tileSize = tileSize;
    _tileSizeSet = YES;
    [self createTileOverlayAndRendererIfPossible];
    [self update];
}

- (void) createTileOverlayAndRendererIfPossible
{
    if (!_pathTemplateSet || !_tileSizeSet) return;
    self.tileOverlay = [[AIRMapMbTileOverlay alloc] initWithURLTemplate:self.pathTemplate];
    self.tileOverlay.canReplaceMapContent = YES;
    self.tileOverlay.tileSize = CGSizeMake(_tileSize, _tileSize);
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
