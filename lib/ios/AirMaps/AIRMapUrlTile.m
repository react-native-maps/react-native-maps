//
//  AIRUrlTileOverlay.m
//  AirMaps
//
//  Created by cascadian on 3/19/16.
//  Copyright © 2016. All rights reserved.
//

#import "AIRMapUrlTile.h"
#import <React/UIView+React.h>
#import "AIRMapUrlTileCachedOverlay.h"

@implementation AIRMapUrlTile {
    BOOL _urlTemplateSet;
    BOOL _tileSizeSet;
    BOOL _tileCachePathSet;
    BOOL _tileCacheMaxAgeSet;
}

- (void)setShouldReplaceMapContent:(BOOL)shouldReplaceMapContent
{
  _shouldReplaceMapContent = shouldReplaceMapContent;
  if(self.tileOverlay) {
    self.tileOverlay.canReplaceMapContent = _shouldReplaceMapContent;
  }
  [self update];
}

- (void)setMaximumZ:(NSUInteger)maximumZ
{
  _maximumZ = maximumZ;
  if(self.tileOverlay) {
    self.tileOverlay.maximumZ = _maximumZ;
  }
  [self update];
}

- (void)setMinimumZ:(NSUInteger)minimumZ
{
  _minimumZ = minimumZ;
  if(self.tileOverlay) {
    self.tileOverlay.minimumZ = _minimumZ;
  }
  [self update];
}

- (void)setFlipY:(BOOL)flipY
{
  _flipY = flipY;
  if (self.tileOverlay) {
    self.tileOverlay.geometryFlipped = _flipY;
  }
}

- (void)setUrlTemplate:(NSString *)urlTemplate{
    _urlTemplate = urlTemplate;
    _urlTemplateSet = YES;
    [self createTileOverlayAndRendererIfPossible];
    [self update];
}

- (void)setTileSize:(CGFloat)tileSize{
    NSLog(@"Setting tile size at %d", (int)tileSize);
    _tileSize = tileSize;
    _tileSizeSet = YES;
    [self createTileOverlayAndRendererIfPossible];
    [self update];
}

- (void)setTileCachePath:(NSString *)tileCachePath{
    if (!tileCachePath) return;
    _tileCachePath = tileCachePath;
    _tileCachePathSet = YES;
    NSLog(@"tileCachePath %@", tileCachePath);
    [self createTileOverlayAndRendererIfPossible];
    [self update];
}

- (void)setTileCacheMaxAge:(NSUInteger)tileCacheMaxAge{
    NSLog(@"Setting tile cache max age at %d", tileCacheMaxAge);
    _tileCacheMaxAge = tileCacheMaxAge;
    _tileCacheMaxAgeSet = YES;
    [self createTileOverlayAndRendererIfPossible];
    [self update];
}

- (void) createTileOverlayAndRendererIfPossible
{
    if (!_urlTemplateSet) return;
    if (_tileCachePathSet) {
      self.tileOverlay = [[AIRMapUrlTileCachedOverlay alloc] initWithURLTemplate:self.urlTemplate];
      NSURL *urlPath = [NSURL URLWithString:self.tileCachePath];
      NSLog(@"NSURL: %@", urlPath);
      NSLog(@"Is NSURL File URL: %s", urlPath.fileURL ? "true" : "false");
      if (urlPath.fileURL) {
        self.tileOverlay.tileCachePath = urlPath;
      } else {
        NSURL *filePath = [NSURL fileURLWithPath:self.tileCachePath isDirectory:YES];
        NSLog(@"Is it NOW NSURL File URL: %s", filePath.fileURL ? "true" : "false");
        NSLog(@"URL object: %@", filePath);
        self.tileOverlay.tileCachePath = filePath;
      }

      if (_tileCacheMaxAgeSet) {
        NSLog(@"Setting again tile cache max age at %d", (int)self.tileCacheMaxAge);
        self.tileOverlay.tileCacheMaxAge = self.tileCacheMaxAge;
      }
    } else {
      self.tileOverlay = [[MKTileOverlay alloc] initWithURLTemplate:self.urlTemplate];
    }

    self.tileOverlay.canReplaceMapContent = self.shouldReplaceMapContent;

    if(self.minimumZ) {
        self.tileOverlay.minimumZ = self.minimumZ;
    }
    if (self.maximumZ) {
        self.tileOverlay.maximumZ = self.maximumZ;
    }
    if (self.flipY) {
        self.tileOverlay.geometryFlipped = self.flipY;
    }
    if (_tileSizeSet) {
        self.tileOverlay.tileSize = CGSizeMake(self.tileSize, self.tileSize);
    }

    self.renderer = [[MKTileOverlayRenderer alloc] initWithTileOverlay:self.tileOverlay];
}

- (void) update
{
    if (!_renderer) return;
    
    if (_map == nil) return;
    [_map removeOverlay:self];
    [_map addOverlay:self level:MKOverlayLevelAboveLabels];
    for (id<MKOverlay> overlay in _map.overlays) {
        if ([overlay isKindOfClass:[AIRMapUrlTile class]]) {
            continue;
        }
        [_map removeOverlay:overlay];
        [_map addOverlay:overlay];
    }
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
