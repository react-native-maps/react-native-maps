#import "AIRGMSServicesProvider.h"
#import <GoogleMaps/GoogleMaps.h>

@implementation AIRGMSServicesProvider

+ (void)provideAPIKey:(NSString *)apiKey
{
  [GMSServices provideAPIKey:apiKey];
}

@end

void RNMapsProvideGoogleMapsAPIKey(const char *apiKey)
{
  [AIRGMSServicesProvider provideAPIKey:[NSString stringWithUTF8String:apiKey]];
}
