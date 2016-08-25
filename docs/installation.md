# Installation

First, download the library from npm:

```
npm install react-native-maps --save
```

Then you must install the native dependencies. You can use [`rnpm`](https://github.com/rnpm/rnpm) to
add native dependencies automatically:

`$ rnpm link`

Go to step 4 to configure Google Maps API KEY in Android.

>This installation should work in physical devices. For Genymotion, please check installation step 5

or do it manually as described below:

## iOS

### Cocoapods
To install using Cocoapods, simply insert the following line into your `Podfile` and run `pod install`

`pod 'react-native-maps', :path => '../node_modules/react-native-maps'`

### Manually
1. Open your project in XCode, right click on `Libraries` and click `Add
   Files to "Your Project Name"` Look under `node_modules/react-native-maps/ios` and add `AIRMaps.xcodeproj`.
2. Add `libAIRMaps.a` to `Build Phases -> Link Binary With Libraries.
3. Click on `AIRMaps.xcodeproj` in `Libraries` and go the `Build
   Settings` tab. Double click the text to the right of `Header Search
   Paths` and verify that it has `$(SRCROOT)/../../react-native/React` as well as `$(SRCROOT)/../../react-native/Libraries/Image` - if they
   aren't, then add them. This is so XCode is able to find the headers that
   the `AIRMaps` source files are referring to by pointing to the
   header files installed within the `react-native` `node_modules`
   directory.
4. Whenever you want to use it within React code now you can: `var MapView =
   require('react-native-maps');`

## Android

1. in your `android/app/build.gradle` add:
```groovy
...
dependencies {
  ...
  compile 'com.airbnb.android:react-native-maps:0.7.1'
}
```

For React Native v0.29.0 or above:

2. in your application object, add:

```java
public class MyApplication extends Application implements ReactApplication {
  private final ReactNativeHost reactNativeHost = new ReactNativeHost(this) {
    @Override protected List<ReactPackage> getPackages() {
      return Arrays.asList(
          new MainReactPackage(),
          new MapsPackage());
    }
  };

  @Override public ReactNativeHost getReactNativeHost() {
    return reactNativeHost;
  }
}
```

For older versions of React Native:

```java
@Override protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    mReactRootView = new ReactRootView(this);

    mReactInstanceManager = ReactInstanceManager.builder()
            .setApplication(getApplication())
            .setBundleAssetName("index.android.bundle")
            .setJSMainModuleName("index.android")
            .addPackage(new MainReactPackage())
            .addPackage(new MapsPackage()) // <---- and This!
            .setUseDeveloperSupport(BuildConfig.DEBUG)
            .setInitialLifecycleState(LifecycleState.RESUMED)
            .build();

    mReactRootView.startReactApplication(mReactInstanceManager, "MyApp", null);

    setContentView(mReactRootView);
}
```

4. Specify your Google Maps API Key:
    > To develop is recommended a ***Browser Key*** without refeer restriction. Go to https://console.developers.google.com/apis/credentials to check your credentials.

Add your **Browser** API key to your manifest file:

```xml
<application>
    <!-- You will only need to add this meta-data tag, but make sure it's a child of application -->
    <meta-data
      android:name="com.google.android.geo.API_KEY"
      android:value="{{Your Google maps API Key Here}}"/>
</application>
```
    > If that doesn't work try using an ***Android Key*** without refeer restriction. Go to https://console.developers.google.com/apis/credentials to check your credentials.

Add your **Android** API key to your manifest file:

```xml
<application>
    <!-- You will only need to add this meta-data tag, but make sure it's a child of application -->
    <meta-data
        android:name="com.google.android.maps.v2.API_KEY"
        android:value="{{@string/ANDROID_GOOGLE_MAPS_API_KEY}}"/>
</application>
```

5. ensure that you have Google Play Services installed:
  * For Genymotion you can follow [these instructions](http://stackoverflow.com/a/20137324/1424349).
  * For a physical device you need to search on Google 'Google Play Services'. There will be a link that takes you to the play store and from there you will see a button to update it (do not search within the Play Store).

**Troubleshooting**

If you have a blank map issue, ([#118](https://github.com/lelandrichardson/react-native-maps/issues/118), [#176](https://github.com/lelandrichardson/react-native-maps/issues/176)) try the following lines :

**On iOS :**  

 You have to link dependencies with rnpm and re-run the build :   
1. `rnpm link`  
2. `react-native run-ios`

**On Android :**  

1. Set this Stylesheet in your map component
```
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

module.exports = React.createClass({

    render: function () {
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
        )
    }
})
```
2. Run "android" and make sure every packages is updated.
3.  If not installed yet, you have to install the following packages :
    - Extras / Google Play services
    - Extras / Google Repository
    - Android 6.0 (API 23) / Google APIs Intel x86 Atom System Image Rev. 13
4. Check manual installation steps
5. Generate your SHA1 key :  
   `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`

6. Go to [Google API Console](https://console.developers.google.com/flows/enableapi?apiid=maps_android_backend) and select your project, or create one.  
In `Overview -> Google Maps API -> Google Maps Android API ` -> Check if it's enabled  
Create a new key by clicking on `Create credentials -> API Key -> Android Key`, enter the name of the API key and your SHA1 key, generated before, and create it.
Check installation step 4.

7. Clean the cache :   
   `watchman watch-del-all`  
   `npm cache clean`

8. When starting emulator, make sure you have enabled `Wipe user data`.

9. Run `react-native run-android`

10. At this step it should work, but if not, go to your [Google API Console](https://console.developers.google.com/flows/enableapi?apiid=maps_android_backend&keyType=CLIENT_SIDE_ANDROID&pli=1) and create a `Browser key` instead of a `Android key` and go to step 6.
