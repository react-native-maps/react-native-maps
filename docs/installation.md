# Installation

First, download the library from npm:

```
npm install react-native-maps --save
```

Second, install the native dependencies: You can use `rnpm` (now part of `react-native` core via `link`) to
add native dependencies automatically then continue the directions below depending on your target OS.

```
react-native link react-native-maps
```

   >This installation should work in physical devices. For Genymotion, be sure to check Android installation about Google Play Services

## iOS

> These options may not be necessary if you ran "react-native link"

### Option 1: CocoaPods - Same as the included AirMapsExplorer example

1. Setup your `Podfile` like the included [example/ios/Podfile](../example/ios/Podfile), replace all references to `AirMapsExplorer` with your project name, and then run `pod install`.
   (If you do not need `GoogleMaps` support for iOS, then you can probably completely skip this step.)
1. Open your project in Xcode workspace
1. If you need `GoogleMaps` support also
    - Drag this folder `node_modules/react-native-maps/lib/ios/AirGoogleMaps/` into your project, and choose `Create groups` in the popup window.
    - In `AppDelegate.m`, add `@import GoogleMaps;` before `@implementation AppDelegate`. In `- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions`, add `[GMSServices provideAPIKey:@"YOUR_GOOGLE_MAP_API_KEY"];`
    - In your project's `Build Settings` > `Header Search Paths`, double click the value field. In the popup, add `$(SRCROOT)/../node_modules/react-native-maps/lib/ios/AirMaps` and change `non-recursive` to `recursive`. (Dragging the folder `node_modules/react-native-maps/lib/ios/AirMaps/` into your project introduces duplicate symbols. We should not do it.)
    
Note:  We recommend using a version of React Native >= .40.  Newer versions (>= .40) require `package.json` to be set to `"react-native-maps": "^0.13.0"`, while older versions require `"react-native-maps": "^0.12.4"`.

### Option 2: CocoaPods
This is now considered the **old way** because it will only work if you **don't** have
`use_frameworks!` in your `Podfile`.

To install using Cocoapods, simply insert the following line into your `Podfile`:

    pod 'react-native-maps', :path => '../node_modules/react-native-maps'

If you need `GoogleMaps` support in iOS also add this line:

    pod 'react-native-google-maps', :path => '../node_modules/react-native-maps'

Now if you need `GoogleMaps` support you will also have to add a bunch of other stuff to your
`Podfile`. See the **comments* in the included [example/ios/Podfile](../example/ios/Podfile) which explain the rest.

After your `Podfile` is setup properly, run `pod install`.

### Option 3: Manually
  >This was already done for you if you ran "react-native link"

1. Open your project in Xcode, right click on `Libraries` and click `Add
   Files to "Your Project Name"` Look under `node_modules/react-native-maps/lib/ios` and add `AIRMaps.xcodeproj`.
1. Add `libAIRMaps.a` to `Build Phases -> Link Binary With Libraries.
1. Click on `AIRMaps.xcodeproj` in `Libraries` and go the `Build
   Settings` tab. Double click the text to the right of `Header Search
   Paths` and verify that it has `$(SRCROOT)/../../react-native/React` as well as `$(SRCROOT)/../../react-native/Libraries/Image` - if they
   aren't, then add them. This is so Xcode is able to find the headers that
   the `AIRMaps` source files are referring to by pointing to the
   header files installed within the `react-native` `node_modules`
   directory.
1. Whenever you want to use it within React code now you can: `var MapView =
   require('react-native-maps');`

## Android

1. In your `android/app/build.gradle` add:
   >This step is not necessary if you ran "react-native link react-native-maps"

   ```groovy
   ...
   dependencies {
     ...
     compile project(':react-native-maps')
   }
   ```

   If you have a different play services than the one included in this library, use the following instead (switch 10.0.1 for the desired version):

   ```groovy
   ...
   dependencies {
       ...
       compile(project(':react-native-maps')){
           exclude group: 'com.google.android.gms', module: 'play-services-base'
           exclude group: 'com.google.android.gms', module: 'play-services-maps'
       }
       compile 'com.google.android.gms:play-services-base:10.0.1'
       compile 'com.google.android.gms:play-services-maps:10.0.1'
   }
   ```

1. In your `android/settings.gradle` add:
   >This step is not necessary if you ran "react-native link"

   ```groovy
   ...
   include ':react-native-maps'
   project(':react-native-maps').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-maps/lib/android')
   ```

1. Specify your Google Maps API Key:
    > For development, you need to get a ***API Key***. Go to https://console.developers.google.com/apis/credentials to check your credentials.

   Add your API key to your manifest file (`android\app\src\main\AndroidManifest.xml`):

   ```xml
   <application>
       <!-- You will only need to add this meta-data tag, but make sure it's a child of application -->
       <meta-data
         android:name="com.google.android.geo.API_KEY"
         android:value="Your Google maps API Key Here"/>
   </application>
   ```
   > Note: As shown above, com.google.android.geo.API_KEY is the recommended metadata name for the API key. A key with this name can be used to authenticate to multiple Google Maps-based APIs on the Android platform, including the Google Maps Android API. For backwards compatibility, the API also supports the name com.google.android.maps.v2.API_KEY. This legacy name allows authentication to the Android Maps API v2 only. An application can specify only one of the API key metadata names. If both are specified, the API throws an exception.
Source: https://developers.google.com/maps/documentation/android-api/signup

1. Ensure that you have Google Play Services installed:
  * For Genymotion you can follow [these instructions](https://www.genymotion.com/help/desktop/faq/#google-play-services).
  * For a physical device you need to search on Google for 'Google Play Services'. There will be a link that takes you to the Play Store and from there you will see a button to update it (do not search within the Play Store).

## Troubleshooting

If you get the error `duplicate symbols for architecture x86_64` when building for iOS, you may need to reconfigure your linking and Podfile as [described in detail in this comment on issue #718](https://github.com/airbnb/react-native-maps/issues/718#issuecomment-295585410)

If you have a blank map issue, ([#118](https://github.com/airbnb/react-native-maps/issues/118), [#176](https://github.com/airbnb/react-native-maps/issues/176), [#684](https://github.com/airbnb/react-native-maps/issues/684)), try the following lines :

### On iOS:

You have to link dependencies with rnpm and re-run the build:

1. `react-native link react-native-maps`
1. `react-native run-ios`

### On Android:

1. Be sure to have `new MapsPackage()` in your `MainApplication.java` :
   >This step is not necessary if you ran "react-native link react-native-maps"

   ```
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

1. Set this Stylesheet in your map component
   ```
   import MapView from 'react-native-maps';
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

   module.exports = class MyApp extends React.Component {
     render() {
       const { region } = this.props;
       console.log(region);

       return (
         <View style ={styles.container}>
           <MapView
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
     }
   }
   ```
1. Run "android" and make sure all packages are up-to-date.
1.  If not installed yet, you have to install the following packages :
    - Extras / Google Play services
    - Extras / Google Repository
    - Android 6.0 (API 23) / Google APIs Intel x86 Atom System Image Rev. 19
    - Android SDK Build-tools 23.0.3 
1. Check manual installation steps if you didn't run "react-native link react-native-maps"
1. Go to [Google API Console](https://console.developers.google.com/flows/enableapi?apiid=maps_android_backend) and select your project, or create one.
Then, once enabled, select `Go to credentials`.
Select `Google Maps Android API` and create a new key.
Enter the name of the API key and create it.

1. Clean the cache :
  ```
   watchman watch-del-all
   npm cache clean
  ```

1. When starting emulator, make sure you have enabled `Wipe user data`.

1. Run `react-native run-android`

1. If you encounter `com.android.dex.DexException: Multiple dex files define Landroid/support/v7/appcompat/R$anim`, then clear build folder.
  ```
   cd android
   ./gradlew clean
   cd ..
  ```

1. If you are using Android Virtual Devices (AVD), ensure that `Use Host GPU` is checked in the settings for your virtual device.

1. If using an emulator and the only thing that shows up on the screen is the message: `[APPNAME] won't run without Google Play services which are not supported by your device.`, you need to change the emulator CPU/ABI setting to a system image that includes Google APIs.  These may need to be downloaded from the Android SDK Manager first.
