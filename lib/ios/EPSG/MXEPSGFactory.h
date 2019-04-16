#import <Foundation/Foundation.h>
@protocol MXEPSGBoundBoxBuilder <NSObject>

@required
- (NSArray<NSNumber*>*) boundBoxForX:(NSInteger) x Y:(NSInteger) y Zoom:(NSInteger) zoom;

@end

@interface MXEPSGFactory : NSObject

+(id<MXEPSGBoundBoxBuilder>) forSpec:(NSString*) spec;

@end
