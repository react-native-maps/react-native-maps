# Installation

Install the library from npm:

```sh
$ npm install react-native-maps
# --- or ---
$ yarn add react-native-maps
```

The actual map implementation depends on the platform. On Android, one has to use [Google Maps](https://developers.google.com/maps/documentation/), which in turn requires you to obtain an [API key for the Android SDK](https://developers.google.com/maps/documentation/android-sdk/signup).

On iOS, one can choose between Google Maps or the native [Apple Maps](https://developer.apple.com/documentation/mapkit/) implementation.

When using Google Maps on iOS, you need also to obtain an [API key for the iOS SDK](https://developers.google.com/maps/documentation/ios-sdk/get-api-key) and include the Google Maps library in your build. The native Apple Maps based implementation works out-of-the-box and is therefore simpler to use at the price of missing some of the features supported by the Google Maps backend.

> **WARNING**: Before you can start using the Google Maps Platform APIs and SDKs, you must sign up and create a [billing account](https://developers.google.com/maps/gmp-get-started#create-billing-account)!

---

## iOS

After installing the npm package, we need to install the pod.

```sh
$ (cd ios && pod install)
# --- or ---
$ npx pod-install
```

### Enabling Google Maps

If you want to enable Google Maps on iOS, obtain the Google API key and edit your `AppDelegate.m` as follows:

```diff
+ #import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate
...

(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
+  [GMSServices provideAPIKey:@"_YOUR_API_KEY_"]; // add this line using the api key obtained from Google Console
...
```

The `[GMSServices provideAPIKey]` should be the **first call** of the method.

Google Maps SDK for iOS requires iOS 12, so make sure that your deployment target is >= 12.0 in your iOS project settings.

Also make sure that your Podfile deployment target is set to >= 12.0 at the top of your Podfile, eg:

```ruby
platform :ios, '12.0'
```

Add the following to your Podfile above the `use_native_modules!` function and run `pod install` in the ios folder:

```ruby
# React Native Maps dependencies
rn_maps_path = '../node_modules/react-native-maps'
pod 'react-native-google-maps', :path => rn_maps_path
```

That's it, you made it! 👍

---

## Android

### Specify your Google Maps API key

Add your API key to your manifest file (`android/app/src/main/AndroidManifest.xml`):

```xml
<application>
   <!-- You will only need to add this meta-data tag, but make sure it's a child of application -->
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="Your Google maps API Key Here"/>
</application>
```

### Upgrading to >= v0.31.0

The installation documentation previously specified adding `supportLibVersion`, `playServicesVersion` and `androidMapsUtilsVersion` to `build.gradle`.

None of these keys are required anymore and can be removed, if not used by other modules in your project.
> **ATTENTION**: If you leave `playServicesVersion` in `build.gradle`, the version must be at least `18.0.0`

### Ensure that you have Google Play Services installed

- For the Genymotion emulator, you can follow [these instructions](https://www.genymotion.com/help/desktop/faq/#google-play-services).
- For a physical device you need to search on Google for 'Google Play
  Services'. There will be a link that takes you to the Play Store and
  from there you will see a button to update it (do not search within the
  Play Store).

### Using the new Google Maps Renderer

A new renderer for Google Maps on Android will become the default through a progressive rollout starting in June 2022 at the earliest. (Read more about it [here](https://developers.google.com/maps/documentation/android-sdk/renderer))

react-native-maps added support for the new renderer in v0.31.0.

To opt in to the new renderer add the following code in your entry file (e.g. App.js):

```javascript
import { enableLatestRenderer } from 'react-native-maps';

enableLatestRenderer();
```

`enableLatestRenderer` returns a promise (on android) specifying the map renderer being used, either `'LATEST' | 'LEGACY'`. It can be called at any point to get the renderer being used, but it won't change after the first map has been rendered.

Make sure to test your app thoroughly after enabling the new renderer, as it seems to cause some behavioural changes, e.g. [this](https://github.com/react-native-maps/react-native-maps/pull/4055#issuecomment-1063358886).

---

## Troubleshooting

### The map background is blank (Google Maps)

If google logo/markers/polylines etc are displayed but the map
background is otherwise blank, this is likely an API key issue. Verify
your API keys and their restrictions. Ensure the native `provideAPIKey`
call is the first line of `didFinishLaunchingWithOptions`.

Ensure also that the relevant Google APIs have been enabled for your
project from the URLs below:

- [Google Maps SDK Android](https://console.developers.google.com/apis/library/maps-android-backend.googleapis.com/)
- [Google Maps SDK iOS (if required)](https://console.developers.google.com/apis/library/maps-ios-backend.googleapis.com)

For reference, you may read the relevant issue reports: ([#118](https://github.com/react-native-maps/react-native-maps/issues/118), [#176](https://github.com/react-native-maps/react-native-maps/issues/176), [#684](https://github.com/react-native-maps/react-native-maps/issues/684)).

### The map background is gray (Google Maps)

If you get grey screen on android device create google_maps_api.xml in android/app/src/main/res/values.

```xml
<resources>
  <string name="google_maps_key" templateMergeStrategy="preserve" translatable="false">(api key here)</string>
</resources>
```

### No map whatsoever

Ensure the map component and its container have viewport dimensions. An
example is below:

```jsx
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
...
const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   height: 400,
   width: 400,
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
});

export default () => (
   <View style={styles.container}>
     <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map}
       region={{
         latitude: 37.78825,
         longitude: -122.4324,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}
     >
     </MapView>
   </View>
);
```

### Build issues with Google Maps iOS Utils (iOS)

If your XCode project uses dynamic frameworks (e.g. you also have Swift
code in your project), you cannot install `Google-Maps-iOS-Utils` with
CocoaPods. The issue and a workaround for it has been documented
[here](https://github.com/googlemaps/google-maps-ios-utils/blob/b721e95a500d0c9a4fd93738e83fc86c2a57ac89/Swift.md).

### Runtime errors on iOS (Apple Maps)

If you are trying to mount the map with the `GOOGLE_PROVIDER` during
runtime, but your build has been configured for the Apple Maps backend,
a runtime exception will be raised.

In addition, when using Apple Maps, some Google-only functionalities
have been disabled via runtime errors.

An exception will be raised if you try to use advanced features that
depend on the [Google Maps SDK for
iOS](https://github.com/googlemaps/google-maps-ios-utils). These include

- Making markers from KML files
- Heatmap rendering
- Marker clustering
- etc.

### Clearing caches

Run these commands to clean caches

```sh
watchman watch-del-all
npm cache clean

# Android, if you encounter `com.android.dex.DexException: Multiple dex files define Landroid/support/v7/appcompat/R$anim`, then clear build folder.
cd android
./gradlew clean
cd ..
```

### When using Android studio

Make sure your Android studio is up to date and set up following the [React Native docs](https://reactnative.dev/docs/environment-setup).

In particular, the following packages have to be installed:

- Extras / Google Play services
- Extras / Google Repository
- Android 6.0 (API 23) / Google APIs Intel x86 Atom System Image Rev. 19
- Android SDK Build-tools 23.0.3

### Android emulator issues

- When starting Android emulator, make sure you have enabled `Wipe user data`.
- If you are using Android Virtual Devices (AVD), ensure that `Use Host GPU` is checked in the settings for your virtual device.
- If using an emulator and the only thing that shows up on the screen is
  the message: `[APPNAME] won't run without Google Play services which are not supported by your device.`, you need to change the emulator
  CPU/ABI setting to a system image that includes Google APIs. These may
  need to be downloaded from the Android SDK Manager first.

### Google Play Services conflicting issues with other modules

In case you have multiple modules using the same Google Play Services dependencies (such as `react-native-onesignal`), you can exclude the conflicting dependencies from the modules and import the Google Play Services dependencies in the project-wide `build.gradle` file like the following example:

```groovy
  implementation(project(':react-native-onesignal')){
      exclude group: 'com.google.android.gms'
  }

  implementation(project(':react-native-maps')){
      exclude group: 'com.google.android.gms'
  }
  implementation 'com.google.android.gms:play-services-base:18.0.1'
  implementation 'com.google.android.gms:play-services-location:19.0.1'
  implementation 'com.google.android.gms:play-services-maps:18.0.2'
```

A list of the current dependencies can be found [here](https://developers.google.com/android/guides/setup#list-dependencies).

> **ATTENTION**: `react-native-maps` requires `play-services-maps >= 18.0.0`

### Trouble with Google Play services

- Make sure that your emulator has Google Play (Go to Android studio -> Virtual Devices -> Check that you have icon in "Play Store" column)
- Click to bottom dots icon in the emulator
- Go to Google Play Tab and click Update
