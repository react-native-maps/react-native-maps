# Installation

Install the library from npm:

```sh
npm install react-native-maps --save-exact
```

or 

```sh
yarn add react-native-maps -E
```

The library ships with platform native code that needs to be compiled
together with React Native. This requires you to configure your build
tools.

Since React Native 0.60 and higher, [autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) makes the installation process simpler.

The actual map implementation depends on the platform. On Android, one
has to use [Google
Maps](https://developers.google.com/maps/documentation/), which in turn
requires you to obtain an [API key for the Android
SDK](https://developers.google.com/maps/documentation/android-sdk/signup).

On iOS, one can choose between Google Maps or the native [Apple
Maps](https://developer.apple.com/documentation/mapkit/) implementation. 

When using Google Maps on iOS, you need also to obtain an [API key for the iOS
SDK](https://developers.google.com/maps/documentation/ios-sdk/get-api-key)
and include the Google Maps library in your build. The native Apple Maps
based implementation works out-of-the-box and is therefore simpler to
use at the price of missing some of the features supported by the Google
Maps backend.

> **WARNING**: Before you can start using the Google Maps Platform APIs and SDKs, you must sign up and create a [billing account](https://developers.google.com/maps/gmp-get-started#create-billing-account)!

---

## Build configuration on iOS

### Using React Native Link (React Native 0.59 and lower)

Run `react-native link react-native-maps` after which you should be able
to use this library on iOS. Note that by default this will use Apple
Maps and you will miss some of the features provided by Google (see the
instruction on manually enabling Google Maps below).

### Using CocoaPods (React Native 0.59 and lower)

> If the CocoaPods package manager is new to you, please first review
> its [installation guide](https://guides.cocoapods.org/using/getting-started.html)

Setup your `Podfile` (found at `ios/Podfile` as below, replacing all
references to `_YOUR_PROJECT_TARGET_` with your project target (it's the
same as project name by default).

```ruby
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target '_YOUR_PROJECT_TARGET_' do
  rn_path = '../node_modules/react-native'
  rn_maps_path = '../node_modules/react-native-maps'

  # See http://facebook.github.io/react-native/docs/integration-with-existing-apps.html#configuring-cocoapods-dependencies
  pod 'yoga', path: "#{rn_path}/ReactCommon/yoga/yoga.podspec"
  pod 'React', path: rn_path, subspecs: [
    'Core',
    'CxxBridge',
    'DevSupport',
    'RCTActionSheet',
    'RCTAnimation',
    'RCTGeolocation',
    'RCTImage',
    'RCTLinkingIOS',
    'RCTNetwork',
    'RCTSettings',
    'RCTText',
    'RCTVibration',
    'RCTWebSocket',
  ]

  # React Native third party dependencies podspecs
  pod 'DoubleConversion', :podspec => "#{rn_path}/third-party-podspecs/DoubleConversion.podspec"
  pod 'glog', :podspec => "#{rn_path}/third-party-podspecs/glog.podspec"
  # If you are using React Native <0.54, you will get the following error:
  # "The name of the given podspec `GLog` doesn't match the expected one `glog`"
  # Use the following line instead:
  #pod 'GLog', :podspec => "#{rn_path}/third-party-podspecs/GLog.podspec"
  pod 'Folly', :podspec => "#{rn_path}/third-party-podspecs/Folly.podspec"

  # react-native-maps dependencies
  pod 'react-native-maps', path: rn_maps_path
  # pod 'react-native-google-maps', path: rn_maps_path  # Uncomment this line if you want to support GoogleMaps on iOS
  # pod 'GoogleMaps'  # Uncomment this line if you want to support GoogleMaps on iOS
  # pod 'Google-Maps-iOS-Utils' # Uncomment this line if you want to support GoogleMaps on iOS
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    if target.name == 'react-native-google-maps'
      target.build_configurations.each do |config|
        config.build_settings['CLANG_ENABLE_MODULES'] = 'No'
      end
    end
  end
end
```

Then run in the `ios` folder

```sh
pod install 
```

and open the produced workspace file (`.xcworkspace`) in XCode to build your project.

### Using CocoaPods (React Native 0.60 and higher)

```sh
cd ios
pod install
```
### App store submission

The app's `Info.plist` file must contain a `NSLocationWhenInUseUsageDescription` with a user-facing purpose string explaining clearly and completely why your app needs the location, otherwise Apple will reject your app submission.

### Enabling Google Maps on iOS (React Native all versions)

If you want to enable Google Maps on iOS, obtain the Google API key and
edit your `AppDelegate.m` as follows:

```objc
+ #import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate
...

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
+  [GMSServices provideAPIKey:@"_YOUR_API_KEY_"]; // add this line using the api key obtained from Google Console
...
```

The `[GMSServices provideAPIKey]` should be the **first call** of the method.

Then, do either of the following:

a) (React Native 0.59 and lower) If you are using CocoaPods to manage your dependecies, uncomment the
lines related to Google Maps from the `Podfile` and run `pod install`.

b) (React Native 0.59 and lower) If you used React Native link, you may include Google Maps manually as a
XCode framework following the instructions from [SDK docs -> Install
manually](https://developers.google.com/maps/documentation/ios-sdk/start). Then, to link this library to the framework, add the following to your
`package.json` and replace the
`REPLACE_ME_RELATIVE_PATH_TO_GOOGLE_MAPS_INSTALL` with the relative path
from your project root to the directory in which you installed the
Google Maps frameworks. You might need to specify a recursive search path 
by adding a `/**` at the end of the provided path (e.g. "./node_modules/react-native-maps/enable-google-maps 'ios/my-frameworks/GoogleMaps/**'"

```json
{
  "name": "your-app",
  "scripts": {
    "postinstall": "./node_modules/react-native-maps/enable-google-maps REPLACE_ME_RELATIVE_PATH_TO_GOOGLE_MAPS_INSTALL"
  }
}
```

Re-run `npm install` or `yarn` to ensure the `postinstall` script is run.

c) (React Native 0.60 and higher) Add the following to your Podfile above the `use_native_modules!` function and run `pod install` in the ios folder:
  ```ruby
    # React Native Maps dependencies
    rn_maps_path = '../node_modules/react-native-maps'
    pod 'react-native-google-maps', :path => rn_maps_path
    pod 'GoogleMaps'
    pod 'Google-Maps-iOS-Utils'
  ```

That's it, you made it! 👍
    
---


## Build configuration on Android

Ensure your build files match the following requirements:

1. (React Native 0.59 and lower) Define the `react-native-maps` project in `android/settings.gradle`:

```groovy
...
include ':react-native-maps'
project(':react-native-maps').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-maps/lib/android')
```

2. (React Native 0.59 and lower) Add the `react-native-maps` as an dependency of your app in `android/app/build.gradle`:

```groovy
...
dependencies {
  ...
  implementation project(':react-native-maps')
}
```

3.1 (React Native all versions) If you've defined *[project-wide
properties](https://developer.android.com/studio/build/gradle-tips.html)*
(**recommended**) in your root `build.gradle`, this library will detect
the presence of the following properties:

```groovy
buildscript {...}
allprojects {...}

/**
 + Project-wide Gradle configuration properties
 */
ext {
    compileSdkVersion   = xxx
    targetSdkVersion    = xxx
    buildToolsVersion   = "xxx"
    minSdkVersion       = xxx
    supportLibVersion   = "xxx"
    playServicesVersion = "17.0.0" // or find latest version
    androidMapsUtilsVersion = "xxx"
}
```
or do
```
buildscript {
    ext {
        buildToolsVersion = "xxx"
        minSdkVersion = xxx
        compileSdkVersion = xxx
        targetSdkVersion = xxx
        supportLibVersion = "xxx"
        playServicesVersion = "17.0.0" // or find latest version
        androidMapsUtilsVersion = "xxx"
    }
}
...
```
You can find the latest `playServicesVersion` by checking [https://developers.google.com/android/guides/releases](https://developers.google.com/android/guides/releases) and searching for `gms:play-services-maps:`

3.2 (React Native all versions) If you do **not** have *project-wide properties* defined and have a
different play-services version than the one included in this library,
use the following instead (switch 10.0.1 for the desired version):

```groovy
...
dependencies {
   ...
   implementation(project(':react-native-maps')){
       exclude group: 'com.google.android.gms', module: 'play-services-base'
       exclude group: 'com.google.android.gms', module: 'play-services-maps'
   }
   implementation 'com.google.android.gms:play-services-base:10.0.1'
   implementation 'com.google.android.gms:play-services-maps:10.0.1'
}
```

4. (React Native all versions) Specify your Google Maps API Key:

   Add your API key to your manifest file (`android/app/src/main/AndroidManifest.xml`):

```xml
<application>
   <!-- You will only need to add this meta-data tag, but make sure it's a child of application -->
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="Your Google maps API Key Here"/>
  
   <!-- You will also only need to add this uses-libray tag -->
   <uses-library android:name="org.apache.http.legacy" android:required="false"/>
</application>
```
> Note: As shown above, `com.google.android.geo.API_KEY` is the
> recommended metadata name for the API key. A key with this name can be
> used to authenticate to multiple Google Maps-based APIs on the Android
> platform, including the Google Maps Android API. For backwards
> compatibility, the API also supports the name
> `com.google.android.maps.v2.API_KEY`. This legacy name allows
> authentication to the Android Maps API v2 only. An application can
> specify only one of the API key metadata names. If both are specified,
> the API throws an exception.

Source: https://developers.google.com/maps/documentation/android-api/signup

5. (React Native 0.59 and lower) Add `import com.airbnb.android.react.maps.MapsPackage;` and `new MapsPackage()` in your `MainApplication.java` :

```java
import com.airbnb.android.react.maps.MapsPackage;
...
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new MapsPackage()
        );
    }
```

6. (React Native all versions) Ensure that you have Google Play Services installed:

  * For the Genymotion emulator, you can follow [these instructions](https://www.genymotion.com/help/desktop/faq/#google-play-services).
  * For a physical device you need to search on Google for 'Google Play
    Services'. There will be a link that takes you to the Play Store and
    from there you will see a button to update it (do not search within the
    Play Store).

That's it, you made it! :+1:

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

For reference, you may read the relevant issue reports: ([#118](https://github.com/react-native-community/react-native-maps/issues/118), [#176](https://github.com/react-native-community/react-native-maps/issues/176), [#684](https://github.com/react-native-community/react-native-maps/issues/684)).

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
[here](https://github.com/googlemaps/google-maps-ios-utils/blob/master/Swift.md).

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
# NPM
watchman watch-del-all
npm cache clean

# Android, if you encounter `com.android.dex.DexException: Multiple dex files define Landroid/support/v7/appcompat/R$anim`, then clear build folder.
cd android
./gradlew clean
cd ..
```

### When using XCode &lt;9

If you use Xcode with version less than 9 you may get `use of undeclared
identifier 'MKMapTypeMutedStandard'` or `Entry, ":CFBundleIdentifier",
Does Not Exist` errors. In this case you have to update your Xcode.

### When using Android studio

Make sure your Android studio is up to date and set up following the
[React Native
docs](https://facebook.github.io/react-native/docs/getting-started.html).

In particular, the following packages have to be installed:

  - Extras / Google Play services
  - Extras / Google Repository
  - Android 6.0 (API 23) / Google APIs Intel x86 Atom System Image Rev. 19
  - Android SDK Build-tools 23.0.3

### No native module found exception on Android

Be sure to have `new MapsPackage()` in your `MainApplication.java` :

```java
import com.airbnb.android.react.maps.MapsPackage;
...
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new MapsPackage()
        );
    }
```

### Android emulator issues

- When starting Android emulator, make sure you have enabled `Wipe user data`.
- If you are using Android Virtual Devices (AVD), ensure that `Use Host GPU` is checked in the settings for your virtual device.
- If using an emulator and the only thing that shows up on the screen is
  the message: `[APPNAME] won't run without Google Play services which
  are not supported by your device.`, you need to change the emulator
  CPU/ABI setting to a system image that includes Google APIs.  These may
  need to be downloaded from the Android SDK Manager first.
  
  
  ### Google Play Services conflicting issues with other modules
  
  In case you have multiple modules using Google Play Services such as `react-native-onesignal`, Make sure to exclude all the Google Play Services dependencies from the modules and import all the Google Play Services dependencies for all the modules in the project-wide `build.gradle` file like the following example:
  ```
   implementation(project(':react-native-onesignal')){
        exclude group: 'com.google.android.gms'
    }
    
   implementation(project(':react-native-maps')){
        exclude group: 'com.google.android.gms'
    }
    implementation 'com.google.android.gms:play-services-base:12.0.1'
    implementation 'com.google.android.gms:play-services-basement:12.0.1'
    implementation 'com.google.android.gms:play-services-location:12.0.1'
    implementation 'com.google.android.gms:play-services-tasks:12.0.1'
    implementation 'com.google.android.gms:play-services-maps:12.0.1'
    
    
  ```

### Trouble with Google Play services

- Make sure that your emulator has Google Play (Go to Android studio -> Virtual Devices -> Check that you have icon in "Play Store" column)
- Click to bottom dots icon in the emulator
- Go to Google Play Tab and click Update


### Android build error: "Program type already present"

If you **don't** use project-wide properties as per instructions above (not making changes to global android/build.gradle) and encounter at build time "Program type already present" error - add those lines to your android/app/build.gradle in the dependencies section:

    dependencies {
    ...
    implementation "com.android.support:appcompat-v7:${rootProject.ext.supportLibVersion}"
    implementation "com.android.support:design:${rootProject.ext.supportLibVersion}"
    implementation "com.android.support:support-v4:${rootProject.ext.supportLibVersion}"
    }     

