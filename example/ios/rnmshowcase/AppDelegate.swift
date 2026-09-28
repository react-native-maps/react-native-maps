import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

#if !USE_GOOGLE_SPM
import GoogleMaps
#endif
// RNMapsProvideGoogleMapsAPIKey is forward-declared in the bridging header.

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
      if let MAPS_API_KEY = Bundle.main.object(forInfoDictionaryKey: "MAPS_API_KEY") as? String {
#if USE_GOOGLE_SPM
          RNMapsProvideGoogleMapsAPIKey(MAPS_API_KEY)
#else
          GMSServices.provideAPIKey(MAPS_API_KEY)
#endif
      }
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "rnmshowcase",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}