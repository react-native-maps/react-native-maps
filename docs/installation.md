
# Installation

First, download the library from npm:

```
npm install react-native-maps --save
```

Then you must install the native dependencies. You can use [`rnpm`](https://github.com/rnpm/rnpm) to
add native dependencies automatically:

`$ rnpm link`

or do it manually as described below:

## iOS

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

1. in `android/settings.gradle`
   ```
     include ':app', ':react-native-maps'
     project(':react-native-maps').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-maps/android')
   ```

2. in `android/app/build.gradle` add:
   ```
   dependencies {
       ...
       compile project(':react-native-maps')
   }
   ```

3. and finally, in `android/src/main/java/com/{YOUR_APP_NAME}/MainActivity.java` add:

    **Newer versions of React Native**
      ```
    ...
    import com.AirMaps.AirPackage; // <--- This!
    ...
    public class MainActivity extends ReactActivity {

     @Override
     protected String getMainComponentName() {
         return "sample";
     }

     @Override
     protected boolean getUseDeveloperSupport() {
         return BuildConfig.DEBUG;
     }

     @Override
     protected List<ReactPackage> getPackages() {
       return Arrays.<ReactPackage>asList(
         new MainReactPackage()
         new AirPackage() // <---- and This!
       );
     }
   }
   ```

    **Older versions of React Native**
   ```
   ...
   import com.AirMaps.AirPackage; // <--- This!
   ...
   @Override
   protected void onCreate(Bundle savedInstanceState) {
       super.onCreate(savedInstanceState);
       mReactRootView = new ReactRootView(this);

       mReactInstanceManager = ReactInstanceManager.builder()
               .setApplication(getApplication())
               .setBundleAssetName("index.android.bundle")
               .setJSMainModuleName("index.android")
               .addPackage(new MainReactPackage())
               .addPackage(new AirPackage()) // <---- and This!
               .setUseDeveloperSupport(BuildConfig.DEBUG)
               .setInitialLifecycleState(LifecycleState.RESUMED)
               .build();

       mReactRootView.startReactApplication(mReactInstanceManager, "MyApp", null);

       setContentView(mReactRootView);
   }
   ```
4. specify your Google Maps API Key in your `AndroidManifest.xml`:

  ```xml
  <application
    android:allowBackup="true"
    android:label="@string/app_name"
    android:icon="@mipmap/ic_launcher"
    android:theme="@style/AppTheme">
      <!-- You will only need to add this meta-data tag, but make sure it's a child of application -->
      <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="{{Your Google maps API Key Here}}"/>
  </application>
  ```

5. Ensure that you have [Google Play Services installed](http://stackoverflow.com/a/20137324/1424349)
