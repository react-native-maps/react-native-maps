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

3. and finally, in `android/app/src/main/java/com/{YOUR_APP_NAME}/MainActivity.java` add:

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
         new MainReactPackage(),
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

1. Run "android" and make sure every packages is updated.
2.  If not installed yet, you have to install the following packages :
    - Extras / Google Play services
    - Extras / Google Repository
    - Android 6.0 (API 23) / Google APIs Intel x86 Atom System Image Rev. 12
3. Check that the following files contains this lines :
   - In `android/settings.gradle` :  
   ```
   include ':app', ':react-native-maps'
   project(':react-native-maps').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-maps/android')
   ```
   
   - In `android/app/build.gradle` :
   ```
   dependencies {
      ...
      compile project(':react-native-maps')
   }
   ```
   
   - In `android/src/main/java/com/{YOUR_APP_NAME}/MainActivity.java` :
   ```
   @Override
   protected List<ReactPackage> getPackages() {
     return Arrays.<ReactPackage>asList(
       new MainReactPackage(),
       new AirPackage() <-- THIS
     );
   }
   ```
4. Generate your SHA1 key :  
   `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`

5. Go to [Google API Console](https://console.developers.google.com/flows/enableapi?apiid=maps_android_backend&keyType=CLIENT_SIDE_ANDROID&pli=1) and select your project, or create one.  
In `Overview -> Google Maps API -> Google Maps Android API ` -> Check if it's enabled  
Create a new key by clicking on `Create credentials -> API Key -> Android Key`, enter the name of the API key and your SHA1 key, generated before, and create it.

6. Copy and paste your key generated before in `android/app/src/main/AndroidManifest.xml` between the `application` tag :
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

7. Clean the cache :   
   `watchman watch-del-all`  
   `npm cache clean`

8. When starting emulator, make sure you have enabled `Wipe user data`.

9. Run `react-native run-android`

10. At this step it should work, but if not, go to your [Google API Console](https://console.developers.google.com/flows/enableapi?apiid=maps_android_backend&keyType=CLIENT_SIDE_ANDROID&pli=1) and create a `Browser key` instead of a `Android key` and go to step 6.
