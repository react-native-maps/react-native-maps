//
//  AIRMapGSUrlTile
//  AirMaps
//
//  Created by nizam on 10/28/18.
//  Copyright © 2018. All rights reserved.
//

#ifdef HAVE_GOOGLE_MAPS

#import "AIRGoogleMapGSUrlTile.h"

@implementation AIRGoogleMapGSUrlTile

- (void)setZIndex:(int)zIndex
{
    _zIndex = zIndex;
    _tileLayer.zIndex = zIndex;
}
- (void)setTileSize:(NSInteger)tileSize
{
    _tileSize = tileSize;
    if(self.tileLayer) {
        self.tileLayer.tileSize = tileSize;
    }
}
- (void)setUrlTemplate:(NSString *)urlTemplate
{
    _urlTemplate = urlTemplate;
    GoogleTileOverlay *tile = [[GoogleTileOverlay alloc] init];
    [tile setTemplate:urlTemplate];
    _tileLayer = tile;
    _tileLayer.tileSize = 512;//  _tileSize;
    tile.zIndex = 1;
}
@end

@implementation GoogleTileOverlay
-(id) init {
    _MapX = -20037508.34789244;
    _MapY = 20037508.34789244;
    _FULL = 20037508.34789244 * 2;
    return self ;
}

-(NSArray *)getBoundBox:(NSInteger)x yAxis:(NSInteger)y zoom:(NSInteger)zoom{
    double tile = _FULL / pow(2.0, (double)zoom);
    NSArray *result  =[[NSArray alloc] initWithObjects:
                       [NSNumber numberWithDouble:_MapX + (double)x * tile ],
                       [NSNumber numberWithDouble:_MapY - (double)(y+1) * tile ],
                       [NSNumber numberWithDouble:_MapX + (double)(x+1) * tile ],
                       [NSNumber numberWithDouble:_MapY - (double)y * tile ],
                       nil];
    
    return result;
    
}

- (UIImage *)tileForX:(NSUInteger)x y:(NSUInteger)y zoom:(NSUInteger)zoom {
    
    NSArray *bb = [self getBoundBox:x yAxis:y zoom:zoom];
   NSMutableString *url = [self.template mutableCopy];
    [url replaceOccurrencesOfString: @"{minX}" withString:[NSString stringWithFormat:@"%@", bb[0]] options:0 range:NSMakeRange(0, url.length)];
    [url replaceOccurrencesOfString: @"{minY}" withString:[NSString stringWithFormat:@"%@", bb[1]] options:0 range:NSMakeRange(0, url.length)];
    [url replaceOccurrencesOfString: @"{maxX}" withString:[NSString stringWithFormat:@"%@", bb[2]] options:0 range:NSMakeRange(0, url.length)];
    [url replaceOccurrencesOfString: @"{maxY}" withString:[NSString stringWithFormat:@"%@", bb[3]] options:0 range:NSMakeRange(0, url.length)];
    [url replaceOccurrencesOfString: @"{width}" withString:[NSString stringWithFormat:@"%d", (int)self.tileSize] options:0 range:NSMakeRange(0, url.length)];
    [url replaceOccurrencesOfString: @"{height}" withString:[NSString stringWithFormat:@"%d", (int)self.tileSize] options:0 range:NSMakeRange(0, url.length)];
    NSURL *uri =  [NSURL URLWithString:url];
    NSData *data = [NSData dataWithContentsOfURL:uri];
    UIImage *img = [[UIImage alloc] initWithData:data];
    CGSize size = [img size];
    UIGraphicsBeginImageContext(size);
    CGRect rect = CGRectMake(0, 0, size.width, size.height);
    [img drawInRect:rect blendMode:kCGBlendModeNormal alpha:1.0];
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetRGBStrokeColor(context, 0.0, 0.0, 0.0, 0.0);
    CGContextSetLineWidth(context, 5.0);
    CGContextStrokeRect(context, rect);
    img =  UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return img;
}

@end

#endif
