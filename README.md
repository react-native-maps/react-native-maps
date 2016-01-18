# react-native-maps

React Native Map components for iOS + Android

## Installation

First, download the library from npm:

```
npm install react-native-maps --save
```

Then you must install the native dependencies. You can use [`rnpm`](https://github.com/rnpm/rnpm) to 
add native dependencies automatically:

`$ rnpm link`

or do it manually as described below:

### iOS

1. Open your project in XCode, right click on `Libraries` and click `Add
   Files to "Your Project Name"` Look under `node_modules/react-native-maps` and add `AIRMaps.xcodeproj`. 
2. Add `libAIRMaps.a` to `Build Phases -> Link Binary With Libraries.
3. Click on `AIRMaps.xcodeproj` in `Libraries` and go the `Build
   Settings` tab. Double click the text to the right of `Header Search
   Paths` and verify that it has `$(SRCROOT)/../react-native/React` as well as `$(SRCROOT)/../react-native/Libraries/Image` - if they
   aren't, then add them. This is so XCode is able to find the headers that
   the `AIRMaps` source files are referring to by pointing to the
   header files installed within the `react-native` `node_modules`
   directory. 
4. Whenever you want to use it within React code now you can: `var MapView =
   require('react-native-maps');`

#### Android

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
4. specify your Google Maps API Key in your `AndroidManigest.xml`:

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

## General Usage

```js
import MapView from 'react-native-maps';
```
or

```js
var MapView = require('react-native-maps');
```

This MapView component is built so that features on the map (such as Markers, Polygons, etc.) are
specified as children of the MapView itself. This provides an intuitive and react-like API for
declaratively controlling features on the map.

### Rendering a Map with an initial region

```jsx
  <MapView 
    initialRegion={{
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  />
```

### Using a MapView while controlling the region as state

```jsx
getInitialState() {
  return {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
}

onRegionChange(region) {
  this.setState({ region });
}

render() {
  return (
    <MapView 
      region={this.state.region}
      onRegionChange={this.onRegionChange}
    />
  );
}
```

### Rendering a list of markers on a map

```jsx
<MapView 
  region={this.state.region}
  onRegionChange={this.onRegionChange}
>
  {this.state.markers.map(marker => (
    <MapView.Marker 
      coordinate={marker.latlng}
      title={marker.title}
      description={marker.description}
    />
  ))}
</MapView>
```

### Rendering a Marker with a custom view

```jsx
<MapView.Marker coordinate={marker.latlng}>
  <MyCustomMarkerView {...marker} />
</MapView.Marker>
```

### Rendering a Marker with a custom image

```jsx
<MapView.Marker 
  coordinate={marker.latlng}
  image={require('../assets/pin.png')}
/>
```

### Rendering a custom Marker with a custom Callout

```jsx
<MapView.Marker coordinate={marker.latlng}>
  <MyCustomMarkerView {...marker} />
  <MapView.Callout>
    <MyCustomCalloutView {...marker} />
  </MapView.Callout>
</MapView.Marker>
```


## Examples

### MapView Events

The `<MapView />` component and its child components have several events that you can subscribe to.
This example displays some of them in a log as a demonstration.

![](http://i.giphy.com/3o6UBpncYQASu2WTW8.gif) ![](http://i.giphy.com/xT77YdviLqtjaecRYA.gif)



### Tracking Region / Location

![](http://i.giphy.com/3o6UBoPSLlIKQ2dv7q.gif) ![](http://i.giphy.com/xT77XWjqECvdgjx9oA.gif)




### Programmatically Changing Region

One can change the mapview's position using refs and component methods, or by passing in an updated 
`region` prop.  The component methods will allow one to animate to a given position like the native 
API could.

![](http://i.giphy.com/3o6UB7poyB6YJ0KPWU.gif) ![](http://i.giphy.com/xT77Yc4wK3pzZusEbm.gif)



### Arbitrary React Views as Markers

![](http://i.giphy.com/3o6UBcsCLoLQtksJxe.gif) ![](http://i.giphy.com/3o6UB1qGEM9jYni3KM.gif)



### Using the MapView with the Animated API

The `<MapView />` component can be made to work with the Animated API, having the entire `region` prop
be declared as an animated value. This allows one to animate the zoom and position of the MapView along
with other gestures, giving a nice feel.

Further, Marker views can use the animated API to enhance the effect.

![](http://i.giphy.com/xT77XMw9IwS6QAv0nC.gif) ![](http://i.giphy.com/3o6UBdGQdM1GmVoIdq.gif)

Issue: Since android needs to render its marker views as a bitmap, the animations APIs may not be 
compatible with the Marker views. Not sure if this can be worked around yet or not.



### Polygon Creator

![](http://i.giphy.com/3o6UAZWqQBkOzs8HE4.gif) ![](http://i.giphy.com/xT77XVBRErNZl3zyWQ.gif)



### Other Overlays

So far, `<Circle />`, `<Polygon />`, and `<Polyline />` are available to pass in as children to the
`<MapView />` component.

![](http://i.giphy.com/xT77XZCH8JpEhzVcNG.gif) ![](http://i.giphy.com/xT77XZyA0aYeOX5jsA.gif)



### Default Markers

Default markers will be rendered unless a custom marker is specified. One can optionally adjust the
color of the default marker by using the `pinColor` prop.

![](http://i.giphy.com/xT77Y0pWKmUUnguHK0.gif) ![](http://i.giphy.com/3o6UBfk3I58VIwZjVe.gif)



### Custom Callouts

Callouts to markers can be completely arbitrary react views, similar to markers.  As a result, they 
can be interacted with like any other view.

Additionally, you can fall back to the standard behavior of just having a title/description through
the `<Marker />`'s `title` and `description` props.

Custom callout views can be the entire tooltip bubble, or just the content inside of the system
default bubble.

![](http://i.giphy.com/xT77XNePGnMIIDpbnq.gif) ![](http://i.giphy.com/xT77YdU0HXryvoRqaQ.gif)



### Image-based Markers

Markers can be customized by just using images, and specified using the `image` prop.

NOTE: this isn't implemented properly yet.





## Component API



## Using with the Animated API

