//  RCTNativeLocalStorage.h
//  TurboModuleExample
#ifdef RCT_NEW_ARCH_ENABLED

#import <Foundation/Foundation.h>
#if __has_include(<ReactNativeMapsGenerated/RNMapsAirModuleDelegate.h>)
#import <ReactNativeMapsGenerated/RNMapsSpecs.h>
#else
#import <react-native-maps-generated/RNMapsSpecs.h>
#endif

NS_ASSUME_NONNULL_BEGIN

@interface RNMapsAirModule : NSObject <NativeAirMapsModuleSpec>

@end

NS_ASSUME_NONNULL_END

#endif
