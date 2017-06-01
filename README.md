# react-native-maps [![npm version](https://img.shields.io/npm/v/react-native-maps.svg?style=flat)](https://www.npmjs.com/package/react-native-maps)

React Native Map components for iOS + Android

## Installation

See [Installation Instructions](docs/installation.md).

See [Setup Instructions for the Included Example Project](docs/examples-setup.md).

## Compatibility

Due to the rapid changes being made in the React Native ecosystem, we are not officially going to
support this module on anything but the latest version of React Native. With that said, we will do
our best to stay compatible with older versions as much that is practical, and the peer dependency
of this requirement is set to `"react-native": "*"` explicitly for this reason. If you are using
an older version of React Native with this module though, some features may be buggy.

### Note about React requires

Since react-native 0.25.0, `React` should be required from `node_modules`.
React Native versions from 0.18 should be working out of the box, for lower
versions you should add `react` as a dependency in your `package.json`.

## Component API

[`<MapView />` Component API](docs/mapview.md)

[`<MapView.Marker />` Component API](docs/marker.md)

[`<MapView.Callout />` Component API](docs/callout.md)

[`<MapView.Polygon />` Component API](docs/polygon.md)

[`<MapView.Polyline />` Component API](docs/polyline.md)

[`<MapView.Circle />` Component API](docs/circle.md)

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

### Draggable Markers

```jsx
<MapView initialRegion={...}>
  <MapView.Marker draggable
    coordinate={this.state.x}
    onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
  />
</MapView>
```

### Using a custom Tile Overlay

```jsx
<MapView 
  region={this.state.region}
  onRegionChange={this.onRegionChange}
>
  <MapView.UrlTile
   /**
   * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
   * For example, http://c.tile.openstreetmap.org/{z}/{x}/{y}.png
   */
    urlTemplate={this.state.urlTemplate}
  />
</MapView>
```

For Android: add the following line in your AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.INTERNET" />
```
For IOS: configure [App Transport Security](https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW33) in your app

### Customizing the map style

Create the json object, or download a generated one from the [google style generator](https://mapstyle.withgoogle.com/).

```jsx
// The generated json object
mapStyle = [ ... ]

render() {
  return (
    <MapView
      region={this.state.region}
      onRegionChange={this.onRegionChange}
      customMapStyle={mapStyle}
    />
  );
}
```
For iOS, in addition to providing the `mapStyle` you will need to do the following

```jsx
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

// ...

<MapView
  provider={PROVIDER_GOOGLE}
  customMapStyle={MapStyle}
>
```

Then add the AirGoogleMaps directory:

https://github.com/airbnb/react-native-maps/blob/1e71a21f39e7b88554852951f773c731c94680c9/docs/installation.md#ios

An unofficial step-by-step guide is also available at https://gist.github.com/heron2014/e60fa003e9b117ce80d56bb1d5bfe9e0

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

![](http://i.imgur.com/mzrOjTR.png)



### Draggable Markers

Markers are draggable, and emit continuous drag events to update other UI during drags.

![](http://i.giphy.com/l2JImnZxdv1WbpQfC.gif) ![](http://i.giphy.com/l2JIhv4Jx6Ugx1EGI.gif)

### Lite Mode ( Android )

Enable lite mode on Android with `liteMode` prop. Ideal when having multiple maps in a View or ScrollView.

![](http://i.giphy.com/qZ2lAf18s89na.gif)

### Animated Region

The MapView can accept an `MapView.AnimatedRegion` value as its `region` prop. This allows you to utilize the Animated API to control the map's center and zoom.

```jsx
import MapView from 'react-native-maps';

getInitialState() {
  return {
    region: new MapView.AnimatedRegion({
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
    <MapView.Animated
      region={this.state.region}
      onRegionChange={this.onRegionChange}
    />
  );
}
```

### Animated Marker Position

Markers can also accept an `AnimatedRegion` value as a coordinate.

```jsx
getInitialState() {
  return {
    coordinate: new MapView.AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
    }),
  };
}

componentWillReceiveProps(nextProps) {
  if (this.props.coordinate !== nextProps.coordinate) {
    this.state.coordinate.timing({
      ...nextProps.coordinate,
      duration: 500
    }).start();
  }
}

render() {
  return (
    <MapView initialRegion={...}>
      <MapView.Marker.Animated coordinate={this.state.coordinate} />
    </MapView>
  );
}
```

### Take Snapshot of map

```jsx
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
        <MapView.Marker coordinate={this.state.coordinate} />
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

* Make sure that you have [properly installed](docs/installation.md) react-native-maps.
* Check in the logs if there is more informations about the issue.
* Try setting the style of the MapView to an absolute position with top, left, right and bottom values set.

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

* When inputs don't focus or elements don't respond to tap, look at the order of the view hierarchy, sometimes the issue could be due to ordering of rendered components, prefer putting MapView as the first component.

Bad:

```jsx
<View>
  <TextInput/>
  <MapView/>
</View>
```

Good:

```jsx
<View>
  <MapView/>
  <TextInput/>
</View>
```


License
--------

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
