// Only used when USE_GOOGLE_SPM=1. `#import <ReactNativeMaps/...>` would
// make Swift build a full Clang module and fail on its C++ headers, so this
// forward-declares the plain C entry point instead.
extern void RNMapsProvideGoogleMapsAPIKey(const char *_Nonnull apiKey);
