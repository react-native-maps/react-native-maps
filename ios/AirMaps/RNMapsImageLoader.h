#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTImageLoaderProtocol.h>

NS_ASSUME_NONNULL_BEGIN

RCT_EXTERN void RNMapsSetModuleRegistry(RCTModuleRegistry *_Nullable moduleRegistry);

// +[RCTBridge currentBridge] is nil since React Native 0.87, so this uses the module registry.
RCT_EXTERN id<RCTImageLoaderProtocol> _Nullable RNMapsImageLoader(RCTBridge *_Nullable bridge);

NS_ASSUME_NONNULL_END

#if defined(__cplusplus) && __has_include(<react/renderer/imagemanager/primitives.h>)
#import <react/renderer/imagemanager/primitives.h>

inline CGFloat RNMapsImageSourceScale(const facebook::react::ImageSource &source)
{
  return source.type == facebook::react::ImageSource::Type::Local ? source.scale : 0;
}
#endif
