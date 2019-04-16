#import "MXEPSG4326.h"

@implementation MXEPSG4326


+(double) convertY:(int) y Zoom:(int) zoom  {
    double scale = pow(2.0, zoom);
    double n = M_PI - (2.0 * M_PI * y ) / scale;
    return  atan(sinh(n)) * 180 / M_PI;
}

- (NSArray<NSNumber*> *)boundBoxForX:(NSInteger)x Y:(NSInteger)y Zoom:(NSInteger)zoom {
    double scale = pow(2.0, zoom);
    
    double x1 = x/scale * 360 - 180;
    double x2 = (x+1)/scale * 360 - 180;
    
    double y1 = [MXEPSG4326 convertY:(double)(y+1) Zoom:(double)zoom];
    
    double y2 = [MXEPSG4326 convertY:(double)(y) Zoom:(double)zoom];
    
    NSArray *result  =[[NSArray alloc] initWithObjects:
                       [NSNumber numberWithDouble: x1 ],
                       [NSNumber numberWithDouble: y1 ],
                       [NSNumber numberWithDouble: x2 ],
                       [NSNumber numberWithDouble: y2 ],
                       nil];
    
    return result;
}

@end
