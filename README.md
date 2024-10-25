# react-native-maps [![npm version](https://img.shields.io/npm/v/react-native-maps.svg?style=flat)](https://www.npmjs.com/package/react-native-maps)

React Native Map components for iOS + Android

## Contributing

This project is being maintained by a small group of people, and any help with issues and pull requests are always appreciated. If you are able and willing to contribute, please read the [guidelines](./CONTRIBUTING.md).

## Installation

See [Installation Instructions](docs/installation.md).

See [Setup Instructions for the Included Example Project](docs/examples-setup.md).

## Compatibility

## React-Native Requirements

- **Version 1.14.0 and above**: Requires `react-native >= 0.74`.
- **Versions below 1.14.0**: Require `react-native >= 0.64.3`.

## Component API

[`<MapView />` Component API](docs/mapview.md)

[`<Marker />` Component API](docs/marker.md)

[`<Callout />` Component API](docs/callout.md)

[`<Polygon />` Component API](docs/polygon.md)

[`<Polyline />` Component API](docs/polyline.md)

[`<Circle />` Component API](docs/circle.md)

[`<Overlay />` Component API](docs/overlay.md)

[`<Heatmap />` Component API](docs/heatmap.md)

[`<Geojson />` Component API](docs/geojson.md)

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

## MapView

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
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
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
import {Marker} from 'react-native-maps';

<MapView region={this.state.region} onRegionChange={this.onRegionChange}>
  {this.state.markers.map((marker, index) => (
    <Marker
      key={index}
      coordinate={marker.latlng}
      title={marker.title}
      description={marker.description}
    />
  ))}
</MapView>;
```

### Rendering a Marker with a custom image

1. You need to generate an `png` image with various resolution (lets call them `custom_pin`) - for more information go to [Android](https://developer.android.com/studio/write/resource-manager#import), [iOS](https://developer.apple.com/documentation/xcode/adding-images-to-your-xcode-project)
2. put all images in Android drawables and iOS assets dir
3. Now you can use the following code:

```jsx
<Marker
  coordinate={{latitude: latitude, longitude: longitude}}
  image={{uri: 'custom_pin'}}
/>
```

Note: You can also pass the image binary data like `image={require('custom_pin.png')}`, but this will not scale good with the different screen sizes.

### Rendering a Marker with a custom view

Note: This has performance implications, if you wish for a simpler solution go with a custom image (save your self the headache)

```jsx
<Marker coordinate={{latitude: latitude, longitude: longitude}}>
  <MyCustomMarkerView {...marker} />
</Marker>
```

### Rendering a custom Marker with a custom Callout

```jsx
import {Callout} from 'react-native-maps';

<Marker coordinate={marker.latlng}>
  <MyCustomMarkerView {...marker} />
  <Callout>
    <MyCustomCalloutView {...marker} />
  </Callout>
</Marker>;
```

### Draggable Markers

```jsx
<MapView initialRegion={...}>
  <Marker draggable
    coordinate={this.state.x}
    onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
  />
</MapView>
```

### Using a custom Tile Overlay

#### Tile Overlay using tile server

```jsx
import {UrlTile} from 'react-native-maps';

<MapView region={this.state.region} onRegionChange={this.onRegionChange}>
  <UrlTile
    /**
     * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
     * For example, http://c.tile.openstreetmap.org/{z}/{x}/{y}.png
     */
    urlTemplate={this.state.urlTemplate}
    /**
     * The maximum zoom level for this tile overlay. Corresponds to the maximumZ setting in
     * MKTileOverlay. iOS only.
     */
    maximumZ={19}
    /**
     * flipY allows tiles with inverted y coordinates (origin at bottom left of map)
     * to be used. Its default value is false.
     */
    flipY={false}
  />
</MapView>;
```

For Android: add the following line in your AndroidManifest.xml

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

For IOS: configure [App Transport Security](https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW33) in your app

## React Native Configuration for Fabric / New Architecture

This library works with Fabric using the [New Renderer Interop Layer](https://github.com/reactwg/react-native-new-architecture/discussions/135)

There is a warning message that those steps are not necessary; but we couldn't get the example working without them so far.

### Configuration Steps

1. **Open your configuration file**: Locate the `react-native-config` file in your project directory.

2. **Add the following configuration**: Include the `unstable_reactLegacyComponentNames` array for both Android and iOS platforms as shown below:

```javascript
module.exports = {
  project: {
    android: {
      unstable_reactLegacyComponentNames: [
        'AIRMap',
        'AIRMapCallout',
        'AIRMapCalloutSubview',
        'AIRMapCircle',
        'AIRMapHeatmap',
        'AIRMapLocalTile',
        'AIRMapMarker',
        'AIRMapOverlay',
        'AIRMapPolygon',
        'AIRMapPolyline',
        'AIRMapUrlTile',
        'AIRMapWMSTile',
      ],
    },
    ios: {
      unstable_reactLegacyComponentNames: [
        'AIRMap',
        'AIRMapCallout',
        'AIRMapCalloutSubview',
        'AIRMapCircle',
        'AIRMapHeatmap',
        'AIRMapLocalTile',
        'AIRMapMarker',
        'AIRMapOverlay',
        'AIRMapPolygon',
        'AIRMapPolyline',
        'AIRMapUrlTile',
        'AIRMapWMSTile',
      ],
    },
  },
};
```

checkout the example project to see it in action.

#### Tile Overlay using local tiles

Tiles can be stored locally within device using xyz tiling scheme and displayed as tile overlay as well. This is usefull especially for offline map usage when tiles are available for selected map region within device storage.

```jsx
import {LocalTile} from 'react-native-maps';

<MapView region={this.state.region} onRegionChange={this.onRegionChange}>
  <LocalTile
    /**
     * The path template of the locally stored tiles. The patterns {x} {y} {z} will be replaced at runtime
     * For example, /storage/emulated/0/mytiles/{z}/{x}/{y}.png
     */
    pathTemplate={this.state.pathTemplate}
    /**
     * The size of provided local tiles (usually 256 or 512).
     */
    tileSize={256}
  />
</MapView>;
```

For Android: LocalTile is still just overlay over original map tiles. It means that if device is online, underlying tiles will be still downloaded. If original tiles download/display is not desirable set mapType to 'none'. For example:

```
<MapView
  mapType={Platform.OS == "android" ? "none" : "standard"}
>
```

See [OSM Wiki](https://wiki.openstreetmap.org/wiki/Category:Tile_downloading) for how to download tiles for offline usage.

### Overlaying other components on the map

Place components that you wish to overlay `MapView` underneath the `MapView` closing tag. Absolutely position these elements.

```jsx
render() {
  return (
    <MapView
      region={this.state.region}
    />
    <OverlayComponent
      style={{position: "absolute", bottom: 50}}
    />
  );
}
```

### Customizing the map style (Google Maps Only)

The `<MapView provider="google" googleMapId="yourStyledMapId" />` Google Maps on iOS and Android supports styling via google cloud platform, the styled maps are published under a googleMapId, by simply setting the property googleMapId to the MapView you can use that styled map
more info here: [google map id](https://developers.google.com/maps/documentation/get-map-id)

### MapView Events

The `<MapView />` component and its child components have several events that you can subscribe to.
This example displays some of them in a log as a demonstration.

![](http://i.giphy.com/3o6UBpncYQASu2WTW8.gif) ![](http://i.giphy.com/xT77YdviLqtjaecRYA.gif)

### Tracking Region / Location

![](http://i.giphy.com/3o6UBoPSLlIKQ2dv7q.gif) ![](http://i.giphy.com/xT77XWjqECvdgjx9oA.gif)

### Programmatically Changing Region

One can change the mapview's position using refs and component methods, or by passing in an updated
`region` prop. The component methods will allow one to animate to a given position like the native
API could.

![](http://i.giphy.com/3o6UB7poyB6YJ0KPWU.gif) ![](http://i.giphy.com/xT77Yc4wK3pzZusEbm.gif)

### Changing the style of the map

![](http://i.imgur.com/a9WqCL6.png)

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

Markers' coordinates can also be animated, as shown in this example:

![](http://i.giphy.com/xTcnTelp1OwGPu1Wh2.gif) ![](http://i.giphy.com/xTcnT6WVpwlCiQnFW8.gif)

### Polygon Creator

![](http://i.giphy.com/3o6UAZWqQBkOzs8HE4.gif) ![](http://i.giphy.com/xT77XVBRErNZl3zyWQ.gif)

### Other Overlays

So far, `<Circle />`, `<Polygon />`, and `<Polyline />` are available to pass in as children to the
`<MapView />` component.

![](http://i.giphy.com/xT77XZCH8JpEhzVcNG.gif) ![](http://i.giphy.com/xT77XZyA0aYeOX5jsA.gif)

### Gradient Polylines (iOS MapKit only)

Gradient polylines can be created using the `strokeColors` prop of the `<Polyline>` component.

![](https://i.imgur.com/P7UeqAm.png?1)

### Default Markers

Default markers will be rendered unless a custom marker is specified. One can optionally adjust the
color of the default marker by using the `pinColor` prop.

![](http://i.giphy.com/xT77Y0pWKmUUnguHK0.gif) ![](http://i.giphy.com/3o6UBfk3I58VIwZjVe.gif)

### Custom Callouts

Callouts to markers can be completely arbitrary react views, similar to markers. As a result, they
can be interacted with like any other view.

Additionally, you can fall back to the standard behavior of just having a title/description through
the `<Marker />`'s `title` and `description` props.

Custom callout views can be the entire tooltip bubble, or just the content inside of the system
default bubble.

To handle press on specific subview of callout use `<CalloutSubview />` with `onPress`.
See `Callouts.js` example.

![](http://i.giphy.com/xT77XNePGnMIIDpbnq.gif) ![](http://i.giphy.com/xT77YdU0HXryvoRqaQ.gif)

### Image-based Markers

Markers can be customized by just using images, and specified using the `image` prop.

![](http://i.imgur.com/mzrOjTR.png)

### Draggable Markers

Markers are draggable, and emit continuous drag events to update other UI during drags.

![](http://i.giphy.com/l2JImnZxdv1WbpQfC.gif) ![](http://i.giphy.com/l2JIhv4Jx6Ugx1EGI.gif)

### Lite Mode ( Android )

Enable lite mode on Android with `liteMode` prop. Ideal when having multiple maps in a View or ScrollView.

![](http://i.giphy.com/qZ2lAf18s89na.gif)

### On Poi Click (Google Maps Only)

Poi are clickable, you can catch the event to get its information (usually to get the full detail from Google Place using the placeId).

![](https://media.giphy.com/media/3480VsCKnHr31uCLU3/giphy.gif)

### Animated Region

The MapView can accept an `AnimatedRegion` value as its `region` prop. This allows you to utilize the Animated API to control the map's center and zoom.

```jsx
import MapView, { AnimatedRegion, Animated } from 'react-native-maps';

getInitialState() {
  return {
    region: new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  };
}

onRegionChange(region) {
  this.state.region.setValue(region);
}

render() {
  return (
    <Animated
      region={this.state.region}
      onRegionChange={this.onRegionChange}
    />
  );
}
```

### Animated Marker Position

Markers can also accept an `AnimatedRegion` value as a coordinate.

```jsx
import MapView, { AnimatedRegion, MarkerAnimated } from 'react-native-maps';

getInitialState() {
  return {
    coordinate: new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
    }),
  };
}

componentWillReceiveProps(nextProps) {
  const duration = 500

  if (this.props.coordinate !== nextProps.coordinate) {
    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker.animateMarkerToCoordinate(
          nextProps.coordinate,
          duration
        );
      }
    } else {
      this.state.coordinate.timing({
        ...nextProps.coordinate,
        useNativeDriver: true, // defaults to false if not passed explicitly
        duration
      }).start();
    }
  }
}

render() {
  return (
    <MapView initialRegion={...}>
      <MarkerAnimated
        ref={marker => { this.marker = marker }}
        coordinate={this.state.coordinate}
      />
    </MapView>
  );
}
```

### Take Snapshot of map

```jsx
import MapView, { Marker } from 'react-native-maps';

getInitialState() {
  return {
    coordinate: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
    },
  };
}

takeSnapshot () {
  // 'takeSnapshot' takes a config object with the
  // following options
  const snapshot = this.map.takeSnapshot({
    width: 300,      // optional, when omitted the view-width is used
    height: 300,     // optional, when omitted the view-height is used
    region: {..},    // iOS only, optional region to render
    format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
    quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
    result: 'file'   // result types: 'file', 'base64' (default: 'file')
  });
  snapshot.then((uri) => {
    this.setState({ mapSnapshot: uri });
  });
}

render() {
  return (
    <View>
      <MapView initialRegion={...} ref={map => { this.map = map }}>
        <Marker coordinate={this.state.coordinate} />
      </MapView>
      <Image source={{ uri: this.state.mapSnapshot.uri }} />
      <TouchableOpacity onPress={this.takeSnapshot}>
        Take Snapshot
      </TouchableOpacity>
    </View>
  );
}
```

### Zoom to Specified Markers

Pass an array of marker identifiers to have the map re-focus.

![](http://i.giphy.com/3o7qEbOQnO0yoXqKJ2.gif) ![](http://i.giphy.com/l41YdrQZ7m6Dz4h0c.gif)

### Zoom to Specified Coordinates

Pass an array of coordinates to focus a map region on said coordinates.

![](https://cloud.githubusercontent.com/assets/1627824/18609960/da5d9e06-7cdc-11e6-811e-34e255093df9.gif)

### Troubleshooting

#### My map is blank

- Make sure that you have [properly installed](docs/installation.md) react-native-maps.
- Check in the logs if there is more informations about the issue.
- Try setting the style of the MapView to an absolute position with top, left, right and bottom values set.
- Make sure you have enabled Google Maps API in [Google developer console](https://console.developers.google.com/apis/library)

```javascript
const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
```

```jsx
<MapView
  style={styles.map}
  // other props
/>
```

#### Inputs don't focus

- When inputs don't focus or elements don't respond to tap, look at the order of the view hierarchy, sometimes the issue could be due to ordering of rendered components, prefer putting MapView as the first component.

Bad:

```jsx
<View>
  <TextInput />
  <MapView />
</View>
```

Good:

```jsx
<View>
  <MapView />
  <TextInput />
</View>
```

#### Children Components Not Re-Rendering

Components that aren't declared by this library (Ex: Markers, Polyline) must not be children of the MapView component due to MapView's unique rendering methodology. Have your custom components / views outside the MapView component and position absolute to ensure they only re-render as needed.
Example:
Bad:

```jsx
<View style={StyleSheet.absoluteFillObject}>
  <MapView style={StyleSheet.absoluteFillObject}>
    <View style={{position: 'absolute', top: 100, left: 50}} />
  </MapView>
</View>
```

Good:

```jsx
<View style={StyleSheet.absoluteFillObject}>
  <MapView style={StyleSheet.absoluteFillObject} />
  <View style={{position: 'absolute', top: 100, left: 50}} />
</View>
```

Source: https://github.com/react-native-maps/react-native-maps/issues/1901

#### Crashing with EXC_BAD_ACCESS on iOS when switching apps

`<MapView>` using Apple Maps in `mapType: "standard"` will sometimes crash when you background the app or switch into another app. This is only an issue in XCode using Metal API Validation, and won't happen in production. To eliminate this problem even while debugging in XCode, go to `Edit Scheme... -> Run (Debug) -> Diagnostics` and uncheck `Metal -> API Validation`. (h/t [@Simon-TechForm](https://github.com/Simon-TechForm)).

Source: https://github.com/react-native-maps/react-native-maps/issues/3957#issuecomment-924161121

#### onRegionChangeComplete() callback is called infinitely

If changing the state in `onRegionChangeComplete` is called infinitely, add a condition to limit these calls to occur only when the region change was done as a result of a user's action.

```javascript
onRegionChangeComplete={ (region, gesture) => {
	// This fix only works on Google Maps because isGesture is NOT available on Apple Maps
	if (!gesture.isGesture) {
    return;
  }

  // You can use
  dispatch({ type: "map_region", payload: { mapRegion: region }}); // if using useReducer
	// setMapRegionState(region); // if using useState
}}
```

Source: https://github.com/react-native-maps/react-native-maps/issues/846#issuecomment-1210079461

## License

     Copyright (c) 2017 Airbnb

     Licensed under the The MIT License (MIT) (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

        https://raw.githubusercontent.com/airbnb/react-native-maps/master/LICENSE

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
