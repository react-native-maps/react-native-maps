//
//  AIRMapUrlTileCachedOverlay.m
//  Airmaps
//
//  Created by Markus Suomi on 10/04/2021.
//

#import "AIRMapUrlTileCachedOverlay.h"

@interface AIRMapUrlTileCachedOverlay ()

@end

@implementation AIRMapUrlTileCachedOverlay

- (void)loadTileAtPath:(MKTileOverlayPath)path result:(void (^)(NSData *, NSError *))result
{
    NSError *error;

    if (!self.tileCachePath) {
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = [paths objectAtIndex:0];
        self.tileCachePath = [NSString stringWithFormat:@"%@/tileCache", documentsDirectory];
        
        if (![[NSFileManager defaultManager] fileExistsAtPath:self.tileCachePath])
            [[NSFileManager defaultManager] createDirectoryAtPath:self.tileCachePath withIntermediateDirectories:NO attributes:nil error:&error];
        
    }
    
    NSString* tileCacheFileDirectory = [NSString stringWithFormat:@"%@/%d/%d", self.tileCachePath, (int)path.z, (int)path.x];
    if (![[NSFileManager defaultManager] fileExistsAtPath:tileCacheFileDirectory])
        [[NSFileManager defaultManager] createDirectoryAtPath:tileCacheFileDirectory withIntermediateDirectories:YES attributes:nil error:&error];

    NSString* tileCacheFilePath = [NSString stringWithFormat:@"%@/%d", tileCacheFileDirectory, (int)path.y];
    
    if (![[NSFileManager defaultManager] fileExistsAtPath:tileCacheFilePath]) {
        NSLog(@"tile cache MISS for %d_%d_%d", (int)path.z, (int)path.x, (int)path.y);
        NSURLRequest *request = [NSURLRequest requestWithURL:[self URLForTilePath:path]];
        [NSURLConnection sendAsynchronousRequest:request queue:[NSOperationQueue mainQueue] completionHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
            if (result) result(data, connectionError);
            if (!connectionError) [[NSFileManager defaultManager] createFileAtPath:tileCacheFilePath contents:data attributes:nil];
        }];
    } else {
        NSLog(@"tile cache HIT for %d_%d_%d", (int)path.z, (int)path.x, (int)path.y);

        // If we use a tile, update its modified time so that our cache is purging only unused items.
        if (![[NSFileManager defaultManager] setAttributes:@{NSFileModificationDate:[NSDate date]}
                           ofItemAtPath:tileCacheFilePath
                                  error:&error]) {
            NSLog(@"Couldn't update modification date: %@", error);
        }

        NSData* tile = [NSData dataWithContentsOfFile:tileCacheFilePath];
        if (result) result(tile, nil);
    }
}

@end
