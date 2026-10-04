#import <Foundation/Foundation.h>

// Lets consuming apps call GMSServices.provideAPIKey without linking the
// GoogleMaps SPM package to their own target.
@interface AIRGMSServicesProvider : NSObject

+ (void)provideAPIKey:(NSString *)apiKey;

@end

// Plain C entry point for Swift AppDelegates, where `import ReactNativeMaps`
// can fail to build (see docs/installation.md).
#ifdef __cplusplus
extern "C" {
#endif
void RNMapsProvideGoogleMapsAPIKey(const char *_Nonnull apiKey);
#ifdef __cplusplus
}
#endif
