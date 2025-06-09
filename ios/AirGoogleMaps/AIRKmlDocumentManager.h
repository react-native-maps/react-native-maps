// AIRKmlDocumentManager.h


#ifdef HAVE_GOOGLE_MAPS

#import <Foundation/Foundation.h>
#import "GMUKMLParser.h"
#import "GMUGeometryRenderer.h"
#import <React/RCTComponent.h>
#import <React/RCTBridge.h>

@interface AIRKmlDocumentManager : NSObject

@property (nonatomic, strong) NSMutableDictionary<NSString *, GMUGeometryRenderer *> *kmlLayers;
@property (nonatomic, copy) RCTBubblingEventBlock onKmlReady;


- (instancetype)initWithMapView:(GMSMapView *)mapView;
- (void)setKmlSrc:(NSMutableArray<NSString *> *)kmlSrcList;

@end

#endif
