export type ConfigPluginProps = {
  iosGoogleMapsApiKey?: string;
  androidGoogleMapsApiKey?: string;
  /**
   * The installation method for Google Maps iOS SDK.
   * - 'cocoapods' (default): Uses CocoaPods to install GoogleMaps and Google-Maps-iOS-Utils.
   * - 'spm': Expects GoogleMaps and Google-Maps-iOS-Utils to be added to your Xcode project
   *   via Swift Package Manager. Required for Google Maps SDK v11+ (Q2 2026+).
   *   SPM packages: https://github.com/googlemaps/ios-maps-sdk
   *                 https://github.com/googlemaps/google-maps-ios-utils
   */
  iosGoogleMapsInstallMethod?: 'cocoapods' | 'spm';
};
