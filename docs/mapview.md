# `<MapView />` Component API

## Props

| Prop                              | Type                                 | Default      | Note                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------------- | ------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `boundary`                        | `BoundingBox`                        |              | A boundary of an area within which the map’s center needs to remain.                                                                                                                                                                                                                                                                                               |
| `cacheEnabled`                    | `Boolean`                            | `false`      | If `true` map will be cached and displayed as an image instead of being interactable, for performance usage. **Note:** Apple Maps only                                                                                                                                                                                                                             |
| `camera`                          | `Camera`                             |              | The camera view the map should display. If you use this, the `region` property is ignored.                                                                                                                                                                                                                                                                         |
| `compassOffset`                   | `Point`                              |              | If set, changes the position of the compass. **Note:** iOS Maps only.                                                                                                                                                                                                                                                                                              |
| `customMapStyle`                  | `Array`                              |              | Adds custom styling to the map component. See [README](https://github.com/react-native-maps/react-native-maps#customizing-the-map-style) for more information.                                                                                                                                                                                                     |
| `followsUserLocation`             | `Boolean`                            | `false`      | If `true` the map will focus on the user's location. This only works if `showsUserLocation` is true and the user has shared their location. **Note**: Apple Maps only.                                                                                                                                                                                             |
| `initialCamera`                   | `Camera`                             |              | Like `initialRegion`, use this prop instead of `camera` only if you don't want to control the viewport of the map besides the initial camera setting.<br/><br/> Changing this prop after the component has mounted will not result in a region change.<br/><br/> This is similar to the `initialValue` prop of a text input.                                       |
| `initialRegion`                   | `Region`                             |              | The initial region to be displayed by the map. Use this prop instead of `region` only if you don't want to control the viewport of the map besides the initial region.<br/><br/> Changing this prop after the component has mounted will not result in a region change.<br/><br/> This is similar to the `initialValue` prop of a text input.                      |
| `isAccessibilityElement`          | `Boolean`                            | `false`      | Determines whether the MapView captures VoiceOver touches or forwards them to children. When `true`, map markers are not visible to VoiceOver. **Note:** iOS Maps only.                                                                                                                                                                                            |
| `kmlSrc`                          | `string`                             |              | The URL from KML file. **Note:** Google Maps and Markers only (either Android or iOS with `PROVIDER_GOOGLE`).                                                                                                                                                                                                                                                      |
| `legalLabelInsets`                | `EdgeInsets`                         |              | If set, changes the position of the "Legal" label link from the OS default. **Note:** iOS only.                                                                                                                                                                                                                                                                    |
| `liteMode`                        | `Boolean`                            | `false`      | Enable [lite mode](https://developers.google.com/maps/documentation/android-sdk/lite#overview_of_lite_mode). **Note**: Android only.                                                                                                                                                                                                                               |
| `loadingBackgroundColor`          | `Color`                              | `#FFFFFF`    | Sets loading background color, default to `#FFFFFF`.                                                                                                                                                                                                                                                                                                               |
| `loadingEnabled`                  | `Boolean`                            | `false`      | If `true` a loading indicator will show while the map is loading.                                                                                                                                                                                                                                                                                                  |
| `loadingIndicatorColor`           | `Color`                              | `#606060`    | Sets loading indicator color, default to `#606060`.                                                                                                                                                                                                                                                                                                                |
| `mapPadding`                      | `EdgePadding`                        |              | Adds custom padding to each side of the map. Useful when map elements/markers are obscured.                                                                                                                                                                                                                                                                        |
| `mapType`                         | `String`                             | `"standard"` | The map type to be displayed. <br/><br/> - standard: standard road map (default)<br/> - none: no map **Note** Not available on MapKit<br/> - satellite: satellite view<br/> - hybrid: satellite view with roads and points of interest overlayed<br/> - terrain: topographic view<br/> - mutedStandard: more subtle, makes markers/lines pop more (iOS 11.0+ only) |
| `maxZoomLevel`                    | `Number`                             | `20`         | Maximum zoom value for the map, must be between 0 and 20                                                                                                                                                                                                                                                                                                           |
| `minZoomLevel`                    | `Number`                             | `0`          | Minimum zoom value for the map, must be between 0 and 20. (Due to screen size and density, some devices may not support the lowest zoom levels)                                                                                                                                                                                                                    |
| `moveOnMarkerPress`               | `Boolean`                            | `true`       | `Android only` If `false` the map won't move when a marker is pressed.                                                                                                                                                                                                                                                                                             |
| `paddingAdjustmentBehavior`       | 'always' \| 'automatic' \| 'never'   | 'always'     | Indicates how/when to affect padding with safe area insets (`GoogleMaps` in iOS only)                                                                                                                                                                                                                                                                              |
| `pitchEnabled`                    | `Boolean`                            | `true`       | If `false` the user won't be able to adjust the camera’s pitch angle.                                                                                                                                                                                                                                                                                              |
| `provider`                        | `string`                             |              | The map framework to use. <br/><br/>Either `"google"` for GoogleMaps, otherwise `null` or `undefined` to use the native map framework (`MapKit` in iOS and `GoogleMaps` in android).                                                                                                                                                                               |
| `region`                          | `Region`                             |              | The region to be displayed by the map. <br/><br/>The region is defined by the center coordinates and the span of coordinates to display.                                                                                                                                                                                                                           |
| `rotateEnabled`                   | `Boolean`                            | `true`       | If `false` the user won't be able to pinch/rotate the map.                                                                                                                                                                                                                                                                                                         |
| `scrollDuringRotateOrZoomEnabled` | `Boolean`                            | `true`       | If `false` the map will stay centered while rotating or zooming. **Note:** Google Maps only                                                                                                                                                                                                                                                                        |
| `scrollEnabled`                   | `Boolean`                            | `true`       | If `false` the user won't be able to change the map region being displayed.                                                                                                                                                                                                                                                                                        |
| `showsBuildings`                  | `Boolean`                            | `true`       | A Boolean indicating whether the map displays extruded building information.                                                                                                                                                                                                                                                                                       |
| `showsCompass`                    | `Boolean`                            | `true`       | If `false` compass won't be displayed on the map.                                                                                                                                                                                                                                                                                                                  |
| `showsIndoorLevelPicker`          | `Boolean`                            | `false`      | A Boolean indicating whether indoor level picker should be enabled. **Note:** Google Maps only (either Android or iOS with `PROVIDER_GOOGLE`).                                                                                                                                                                                                                     |
| `showsIndoors`                    | `Boolean`                            | `true`       | A Boolean indicating whether indoor maps should be enabled.                                                                                                                                                                                                                                                                                                        |
| `showsMyLocationButton`           | `Boolean`                            | `true`       | If `false` hide the button to move map to the current user's location.                                                                                                                                                                                                                                                                                             |
| `showsPointsOfInterest`           | `Boolean`                            | `true`       | If `false` points of interest won't be displayed on the map. **Note**: Apple Maps only.                                                                                                                                                                                                                                                                            |
| `showsScale`                      | `Boolean`                            | `true`       | A Boolean indicating whether the map shows scale information. **Note**: Apple Maps only.                                                                                                                                                                                                                                                                           |
| `showsTraffic`                    | `Boolean`                            | `false`      | A Boolean value indicating whether the map displays traffic information.                                                                                                                                                                                                                                                                                           |
| `showsUserLocation`               | `Boolean`                            | `false`      | If `true` the users location will be shown on the map. **NOTE**: You need runtime location permissions prior to setting this to true, otherwise it is going to _fail silently_! Checkout the excellent [react-native-permissions](https://github.com/zoontek/react-native-permissions) for this.                                                                   |
| `tintColor`                       |  `color`                             | `null`       | Sets the tint color of the map. (Changes the color of the position indicator) Defaults to system blue. **Note:** iOS (Apple maps) only.                                                                                                                                                                                                                            |
| `toolbarEnabled`                  | `Boolean`                            | `true`       | `Android only` If `false` will hide 'Navigate' and 'Open in Maps' buttons on marker press. If you enable the toolbar, make sure to [edit your AndroidManifest.xml](https://github.com/react-native-maps/react-native-maps/issues/4403#issuecomment-1219856534)                                                                                                     |
| `userInterfaceStyle`              | 'light' \| 'dark'                    |              | Sets the map to the style selected. Default is whatever the system settings is. **Note:** iOS Maps only (aka MapKit).                                                                                                                                                                                                                                              |
| `userLocationAnnotationTitle`     | `String`                             |              | The title of the annotation for current user location. This only works if `showsUserLocation` is true. There is a default value `My Location` set by MapView. **Note**: iOS only.                                                                                                                                                                                  |
| `userLocationCalloutEnabled`      | `Boolean`                            | `false`      | If `true` clicking user location will show the default callout for userLocation annotation. **Note**: Apple Maps only.                                                                                                                                                                                                                                             |
| `userLocationFastestInterval`     | `Number`                             | 5000         | Fastest interval the application will actively acquire locations. See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html). **Note:** Android only.                                                                                                                                   |
| `userLocationPriority`            | 'balanced'\|'high'\|'low'\|'passive' | 'high'       | Set power priority of user location tracking. See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html). **Note:** Android only.                                                                                                                                                       |
| `userLocationUpdateInterval`      | `Number`                             | 5000         | Interval of user location updates in milliseconds. See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html). **Note:** Android only.                                                                                                                                                  |
| `zoomControlEnabled`              | `Boolean`                            | `true`       | If `false` the zoom control at the bottom right of the map won't be visible **Note:** Android only.                                                                                                                                                                                                                                                                |
| `zoomEnabled`                     | `Boolean`                            | `true`       | If `false` the user won't be able to pinch/zoom the map.                                                                                                                                                                                                                                                                                                           |
| `zoomTapEnabled`                  | `Boolean`                            | `true`       | If `false` the user won't be able to double tap to zoom the map. **Note:** But it will greatly decrease delay of tap gesture recognition. **Note:** Google Maps on iOS only                                                                                                                                                                                        |

## Events

To access event data, you will need to use `e.nativeEvent`. For example, `onPress={e => console.log(e.nativeEvent)}` will log the entire event object to your console.

| Event Name                | Returns                                                                  | Notes                                                                                                                                                                                                                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onCalloutPress`          |                                                                          | Callback that is called when a callout is tapped by the user.                                                                                                                                                                                                                                                                         |
| `onDoublePress`           | `{ coordinate: LatLng, position: Point }`                                | Callback that is called when user double taps on the map. **NOTE**: Not supported on Google Maps iOS                                                                                                                                                                                                                                  |
| `onIndoorBuildingFocused` | `IndoorBuilding`                                                         | Callback that is called when a indoor building is focused/unfocused                                                                                                                                                                                                                                                                   |
| `onIndoorLevelActivated`  | `IndoorLevel`                                                            | Callback that is called when a level on indoor building is activated                                                                                                                                                                                                                                                                  |
| `onKmlReady`              | `KmlContainer`                                                           | Callback that is called once the kml is fully loaded.                                                                                                                                                                                                                                                                                 |
| `onLongPress`             | `{ coordinate: LatLng, position: Point }`                                | Callback that is called when user makes a "long press" somewhere on the map.                                                                                                                                                                                                                                                          |
| `onMapReady`              |                                                                          | Callback that is called once the map is fully loaded.                                                                                                                                                                                                                                                                                 |
| `onMarkerDeselect`        |                                                                          | Callback that is called when a marker on the map becomes deselected. This will be called when the callout for that marker is about to be hidden. **Note**: iOS only.                                                                                                                                                                  |
| `onMarkerDrag`            | `{ coordinate: LatLng, position: Point }`                                | Callback called continuously as a marker is dragged                                                                                                                                                                                                                                                                                   |
| `onMarkerDragEnd`         | `{ coordinate: LatLng, position: Point }`                                | Callback that is called when a drag on a marker finishes. This is usually the point you will want to setState on the marker's coordinate again                                                                                                                                                                                        |
| `onMarkerDragStart`       | `{ coordinate: LatLng, position: Point }`                                | Callback that is called when the user initiates a drag on a marker (if it is draggable)                                                                                                                                                                                                                                               |
| `onMarkerPress`           |                                                                          | Callback that is called when a marker on the map is tapped by the user.                                                                                                                                                                                                                                                               |
| `onMarkerSelect`          |                                                                          | Callback that is called when a marker on the map becomes selected. This will be called when the callout for that marker is about to be shown. **Note**: iOS only.                                                                                                                                                                     |
| `onPanDrag`               | `{ coordinate: LatLng, position: Point }`                                | Callback that is called when user presses and drags the map. **NOTE**: for iOS `scrollEnabled` should be set to false to trigger the event                                                                                                                                                                                            |
| `onPoiClick`              | `{ coordinate: LatLng, position: Point, placeId: string, name: string }` | Callback that is called when user click on a POI.                                                                                                                                                                                                                                                                                     |
| `onPress`                 | `{ coordinate: LatLng, position: Point }`                                | Callback that is called when user taps on the map.                                                                                                                                                                                                                                                                                    |
| `onRegionChange`          | (`Region`, `{isGesture: boolean}`)                                       | Callback that is called continuously when the region changes, such as when a user is dragging the map. The second parameter is an object containing more details about the move. `isGesture` property indicates if the move was from the user (true) or an animation (false). **Note**: `isGesture` is supported by Google Maps only. |
| `onRegionChangeComplete`  | (`Region`, `{isGesture: boolean}`)                                       | Callback that is called once when the region changes, such as when the user is done moving the map. The second parameter is an object containing more details about the move. `isGesture` property indicates if the move was from the user (true) or an animation (false). **Note**: `isGesture` is supported by Google Maps only.    |
| `onUserLocationChange`    | `{ coordinate: Location }`                                               | Callback that is called when the underlying map figures our users current location (coordinate also includes isFromMockProvider value for Android API 18 and above). Make sure **showsUserLocation** is set to _true_.                                                                                                                |

## Methods

| Method Name                 | Arguments                                                                                | Notes                                                                                                                                                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `addressForCoordinate`      | `coordinate: LatLng`                                                                     | Converts a map coordinate to a address (`Address`). Returns a `Promise<Address>` **Note** Not supported on Google Maps for iOS.                                                                                        |
| `animateCamera`             | `camera: Camera`, `duration?: number`                                                    | Animate the camera to a new view. You can pass a partial camera object here; any property not given will remain unmodified. Returns `Promise<void>` when the animation finishes.                                       |
| `animateToRegion`           | `region: Region`, `duration?: number`                                                    | Animates to region. Returns `Promise<void>` when the animation finishes.                                                                                                                                               |
| `coordinateForPoint`        | `point: Point`                                                                           | Converts a view coordinate (`Point`) to a map coordinate. Returns a `Promise<Coordinate>`.                                                                                                                             |
| `fitToCoordinates`          | `coordinates: Array<LatLng>, options?: { edgePadding?: EdgePadding, duration?: number }` | Returns `Promise<void>` when the animation finishes.                                                                                                                                                                   |
| `fitToElements`             | `options?: { edgePadding?: EdgePadding, duration?: number }`                             | **Note** edgePadding is Google Maps only. Returns `Promise<void>` when the animation finishes.                                                                                                                         |
| `fitToSuppliedMarkers`      | `markerIDs: String[], options?: { edgePadding?: EdgePadding, duration?: number }`        | If you need to use this in `ComponentDidMount`, make sure you put it in a timeout or it will cause performance problems. Returns `Promise<void>` when the animation finishes. **Note** edgePadding is Google Maps only |
| `getCamera`                 |                                                                                          | Returns a `Promise<Camera>` structure indicating the current camera configuration.                                                                                                                                     |
| `getMapBoundaries`          |                                                                                          | `Promise<{northEast: LatLng, southWest: LatLng}>`                                                                                                                                                                      |
| `getMarkersFrames`          | `onlyVisible: Boolean`                                                                   | Get markers' centers and frames in view coordinates. Returns a `Promise<{ "markerID" : { point: Point, frame: Frame } }>`. **Note**: iOS only.                                                                         |
| `pointForCoordinate`        | `coordinate: LatLng`                                                                     | Converts a map coordinate to a view coordinate (`Point`). Returns a `Promise<Point>`.                                                                                                                                  |
| `setIndoorActiveLevelIndex` | `levelIndex: Number`                                                                     |

## Types

```
type Region {
  latitude: Number,
  longitude: Number,
  latitudeDelta: Number,
  longitudeDelta: Number,
}
```

```
type Camera = {
    center: {
       latitude: number,
       longitude: number,
   },
   pitch: number,
   heading: number,

   // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
   altitude: number,

   // Only when using Google Maps.
   zoom: number
}
```

```ts
interface BoundingBox {
  northEast: {
    latitude: number;
    longitude: number;
  };
  southWest: {
    latitude: number;
    longitude: number;
  };
}
```

Latitude and longitude are self explanatory while latitudeDelta and longitudeDelta may not.
On the [developer.apple.com](https://developer.apple.com/reference/mapkit/mkcoordinatespan/1452417-latitudedelta) website this is how the "latitudeDelta" property is explained:

> The amount of north-to-south distance (measured in degrees) to display on the map. Unlike longitudinal distances, which vary based on the latitude, one degree of latitude is always approximately 111 kilometers (69 miles).

If this is not enough, you can find a [visual explanation on stackoverflow](https://stackoverflow.com/questions/36685372/how-to-zoom-in-out-in-react-native-map/36688156#36688156).

Note that when using the `Camera`, MapKit on iOS and Google Maps differ in how the height is specified. For a cross-platform app, it is necessary
to specify both the zoom level and the altitude separately.

```
type LatLng {
  latitude: Number,
  longitude: Number,
}
```

```
type Location {
  latitude: Number,
  longitude: Number,
  altitude: Number,
  timestamp: Number, //Milliseconds since Unix epoch
  accuracy: Number,
  altitudeAccuracy: Number,
  speed: Number,
}
```

```
type Point {
  x: Number,
  y: Number,
}
```

```
type Frame {
  x: Number,
  y: Number,
  width: Number,
  height: Number,
}
```

```
enum MapType : String {
  "standard",
  "satellite",
  "hybrid",
  "terrain" //Android only
}
```

```
type EdgePadding {
  top: Number,
  right: Number,
  bottom: Number,
  left: Number
}
```

```
type EdgeInsets {
  top: Number,
  left: Number,
  bottom: Number,
  right: Number
}
```

```
type Marker {
  id: String,
  coordinate: LatLng,
  title: String,
  description: String
}
```

```
type KmlContainer {
  markers: [Marker]
}
```

```
type IndoorBuilding {
  underground: boolean,
  activeLevelIndex: Number,
  levels: Array<IndoorLevel>,
}
```

```
type IndoorLevel {
  index: Number,
  name: String,
  shortName: String,
}
```

```
type Address {
  name: String,
  thoroughfare: String,
  subThoroughfare: String,
  locality: String,
  subLocality: String,
  administrativeArea: String,
  subAdministrativeArea: String,
  postalCode: String,
  countryCode: String,
  country: String,
}
```
