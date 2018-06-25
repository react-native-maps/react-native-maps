//
//  AIRMapLocalTileOverlay.m
//  Pods-AirMapsExplorer
//
//  Created by Peter Zavadsky on 04/12/2017.
//

#import "AIRMapUrlTileOverlay.h"

@implementation AIRMapUrlTileOverlay

-(void)loadTileAtPath:(MKTileOverlayPath)path result:(void (^)(NSData * _Nullable, NSError * _Nullable))result {
    NSInteger x = path.x;
    NSInteger y = path.y;
    NSInteger z = path.z;
    NSInteger overZoom = 1;
    
    if (self.overzoomEnabled && path.z > self.overzoomThreshold) {
        // overZoom progression: 1, 2, 4, 8, etc...
        overZoom = pow(2, (z - self.overzoomThreshold));
        x /= overZoom;
        y /= overZoom;
        z = self.overzoomThreshold;
    }
    
    MKTileOverlayPath newPath = {
        .x = x,
        .y = y,
        .z = z,
        .contentScaleFactor = path.contentScaleFactor
    };
    
    void (^completionHandler)(NSData * _Nullable, NSError * _Nullable) = ^(NSData *data, NSError *error)
    {
        if (self.overzoomEnabled && path.z > self.overzoomThreshold) {
            data = [self overzoomImageDataForPath: path imageData: data];
        }
        
        // Invoke the loadTileAtPath's completion handler
        //
        if ([NSThread isMainThread])
        {
            result(data, error);
        }
        else
        {
            dispatch_async(dispatch_get_main_queue(), ^(void){
                result(data, error);
            });
        }
    };
    
    [super loadTileAtPath:newPath result:completionHandler];
}

-(NSData *)overzoomImageDataForPath:(MKTileOverlayPath)path imageData:(NSData *)data
{
    NSInteger p = pow(2, (path.z - self.overzoomThreshold));
    NSInteger x = path.x % p;
    NSInteger y = path.y % p;
    UIImage *image = [UIImage imageWithData:data];
    CGRect originalRect = CGRectMake(0, 0, image.size.width, image.size.height);
    
    UIGraphicsBeginImageContext(originalRect.size);
    {
        CGRect drawRect = CGRectApplyAffineTransform(originalRect, CGAffineTransformMakeScale(p, p));
        drawRect = CGRectApplyAffineTransform(drawRect, CGAffineTransformMakeTranslation(-image.size.width * x, -image.size.height * y));
        [image drawInRect:drawRect];
        image = UIGraphicsGetImageFromCurrentImageContext();
    }
    UIGraphicsEndImageContext();
    
    return UIImagePNGRepresentation(image);
}

@end

