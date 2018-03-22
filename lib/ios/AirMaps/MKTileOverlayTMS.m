//
//  MKTileOverlayTMS.m
//  AirMaps
//
//  Created by Huynh Huu Nhan on 3/19/18.
//  Copyright © 2018 Christopher. All rights reserved.
//
#import "MKTileOverlayTMS.h"


@implementation MKTileOverlayTMS
-(NSURL *)URLForTilePath:(MKTileOverlayPath)path
{
    path.y = (1 << path.z) - 1 - path.y;
    return [super URLForTilePath:path];
}
@end
