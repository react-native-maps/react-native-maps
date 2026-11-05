#import "RNMapsImageLoader.h"

#import <React/RCTBridge+Private.h>
#import <React/RCTLog.h>

// One per process: the most recently created RNMapsAirModule wins.
static __weak RCTModuleRegistry *RNMapsModuleRegistry;

void RNMapsSetModuleRegistry(RCTModuleRegistry *moduleRegistry)
{
  RNMapsModuleRegistry = moduleRegistry;
}

id<RCTImageLoaderProtocol> RNMapsImageLoader(RCTBridge *bridge)
{
  id<RCTImageLoaderProtocol> loader = [RNMapsModuleRegistry moduleForName:"RCTImageLoader"];
  if (!loader) {
    loader = [(bridge ?: [RCTBridge currentBridge]) moduleForName:@"ImageLoader"];
  }
  if (!loader) {
    RCTLogWarn(@"react-native-maps: RCTImageLoader is unavailable, marker images will not load.");
  }
  return loader;
}
