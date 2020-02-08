# `<MapView />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `provider` | `string` |  | The map framework to use. <br/><br/>Either `"google"` for GoogleMaps, otherwise `null` or `undefined` to use the native map framework (`MapKit` in iOS and `GoogleMaps` in android).
| `region` | `Region` |  | The region to be displayed by the map. <br/><br/>The region is defined by the center coordinates and the span of coordinates to display.
| `initialRegion` | `Region` |  | The initial region to be displayed by the map.  Use this prop instead of `region` only if you don't want to control the viewport of the map besides the initial region.<br/><br/> Changing this prop after the component has mounted will not result in a region change.<br/><br/> This is similar to the `initialValue` prop of a text input.
| `camera` | `Camera` |  | The camera view the map should display. If you use this, the `region` property is ignored.
| `initialCamera` | `Camera` |  | Like `initialRegion`, use this prop instead of `camera` only if you don't want to control the viewport of the map besides the initial camera setting.<br/><br/> Changing this prop after the component has mounted will not result in a region change.<br/><br/> This is similar to the `initialValue` prop of a text input.
| `mapPadding` | `EdgePadding` |  | Adds custom padding to each side of the map. Useful when map elements/markers are obscured.
| `paddingAdjustmentBehavior` | 'always' \| 'automatic' \| 'never' | 'never' | Indicates how/when to affect padding with safe area insets (`GoogleMaps` in iOS only)
| `liteMode` | `Boolean` | `false` | Enable lite mode. **Note**: Android only.
| `mapType` | `String` | `"standard"` | The map type to be displayed. <br/><br/> - standard: standard road map (default)<br/> - none: no map **Note** Not available on MapKit<br/> - satellite: satellite view<br/> - hybrid: satellite view with roads and points of interest overlayed<br/> - terrain: (Android only) topographic view<br/> - mutedStandard: more subtle, makes markers/lines pop more (iOS 11.0+ only)
| `customMapStyle` | `Array` |  | Adds custom styling to the map component. See [README](https://github.com/react-native-community/react-native-maps#customizing-the-map-style) for more information.
| `showsUserLocation` | `Boolean` | `false` | If `true` the app will ask for the user's location. **NOTE**: You need to add `NSLocationWhenInUseUsageDescription` key in Info.plist to enable geolocation, otherwise it is going to *fail silently*! You will also need to add an explanation for why you need the users location against `NSLocationWhenInUseUsageDescription` in Info.plist. Otherwise Apple may reject your app submission.
| `userLocationPriority` | 'balanced'\|'high'\|'low'\|'passive' | 'high' | Set power priority of user location tracking. See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html). **Note:** Android only.
| `userLocationUpdateInterval` | `Number` | 5000 | Interval of user location updates in milliseconds. See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html). **Note:** Android only.
| `userLocationFastestInterval` | `Number` |  | Fastest interval the application will actively acquire locations. See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html). **Note:** Android only.
| `userLocationAnnotationTitle` | `String` | | The title of the annotation for current user location. This only works if `showsUserLocation` is true. There is a default value `My Location` set by MapView. **Note**: iOS only.
| `followsUserLocation` | `Boolean` | `false` | If `true` the map will focus on the user's location. This only works if `showsUserLocation` is true and the user has shared their location. **Note**: iOS only.
| `showsMyLocationButton` | `Boolean` | `true` | If `false` hide the button to move map to the current user's location.
| `showsPointsOfInterest` | `Boolean` | `true` | If `false` points of interest won't be displayed on the map.
| `showsCompass` | `Boolean` | `true` | If `false` compass won't be displayed on the map.
| `showsScale` | `Boolean` | `true` | A Boolean indicating whether the map shows scale information. **Note**: Apple Maps only.
| `showsBuildings` | `Boolean` | `true` | A Boolean indicating whether the map displays extruded building information.
| `showsTraffic` | `Boolean` | `true` | A Boolean value indicating whether the map displays traffic information.
| `showsIndoors` | `Boolean` | `true` | A Boolean indicating whether indoor maps should be enabled.
| `showsIndoorLevelPicker` | `Boolean` | `false` | A Boolean indicating whether indoor level picker should be enabled. **Note:** Google Maps only (either Android or iOS with `PROVIDER_GOOGLE`).
| `zoomEnabled` | `Boolean` | `true` | If `false` the user won't be able to pinch/zoom the map.
| `zoomTapEnabled` | `Boolean` | `true` | If `false` the user won't be able to double tap to zoom the map. **Note:** But it will greatly decrease delay of tap gesture recognition. **Note:** Google Maps on iOS only
| `zoomControlEnabled` | `Boolean` | `true` | If `false` the zoom control at the bottom right of the map won't be visible **Note:** Android only.
| `minZoomLevel` | `Number` | `0` | Minimum zoom value for the map, must be between 0 and 20
| `maxZoomLevel` | `Number` | `20` | Maximum zoom value for the map, must be between 0 and 20
| `rotateEnabled` | `Boolean` | `true` | If `false` the user won't be able to pinch/rotate the map.
| `scrollEnabled` | `Boolean` | `true` | If `false` the user won't be able to change the map region being displayed.
| `pitchEnabled` | `Boolean` | `true` | If `false` the user won't be able to adjust the camera’s pitch angle.
| `toolbarEnabled` | `Boolean` | `true` | `Android only` If `false` will hide 'Navigate' and 'Open in Maps' buttons on marker press
| `cacheEnabled` | `Boolean` | `false` | If `true` map will be cached and displayed as an image instead of being interactable, for performance usage. **Note:** Apple Maps only
| `loadingEnabled` | `Boolean` | `false` | If `true` a loading indicator will show while the map is loading.
| `loadingIndicatorColor` | `Color` | `#606060` | Sets loading indicator color, default to `#606060`.
| `loadingBackgroundColor` | `Color` | `#FFFFFF` | Sets loading background color, default to `#FFFFFF`.
| `moveOnMarkerPress` | `Boolean` | `true` | `Android only` If `false` the map won't move when a marker is pressed.
| `legalLabelInsets` | `EdgeInsets` | | If set, changes the position of the "Legal" label link from the OS default. **Note:** iOS only.
| `kmlSrc` | `string` | | The URL from KML file. **Note:** Google Maps and Markers only (either Android or iOS with `PROVIDER_GOOGLE`).
| `compassOffset` | `Point` | | If set, changes the position of the compass. **Note:** iOS Maps only.
| `isAccessibilityElement` | `Boolean` | `false` | Determines whether the MapView captures VoiceOver touches or forwards them to children. When `true`, map markers are not visible to VoiceOver.  **Note:** iOS Maps only.


## Events

To access event data, you will need to use `e.nativeEvent`. For example, `onPress={e => console.log(e.nativeEvent)}` will log the entire event object to your console.

| Event Name | Returns | Notes
|---|---|---|
| `onMapReady` |  | Callback that is called once the map is fully loaded.
| `onKmlReady` | `KmlContainer` | Callback that is called once the kml is fully loaded.
| `onRegionChange` | `Region` | Callback that is called continuously when the region changes, such as when a user is dragging the map.
| `onRegionChangeComplete` | `Region` | Callback that is called once when the region changes, such as when the user is done moving the map.
| `onUserLocationChange` | `{ coordinate: Location }` | Callback that is called when the underlying map figures our users current location (coordinate also includes isFromMockProvider value for Android API 18 and above). Make sure **showsUserLocation** is set to *true*.
| `onPress` | `{ coordinate: LatLng, position: Point }` | Callback that is called when user taps on the map.
| `onDoublePress` | `{ coordinate: LatLng, position: Point }` | Callback that is called when user double taps on the map.
| `onPanDrag` | `{ coordinate: LatLng, position: Point }` | Callback that is called when user presses and drags the map. **NOTE**: for iOS `scrollEnabled` should be set to false to trigger the event
| `onPoiClick` | `{ coordinate: LatLng, position: Point, placeId: string, name: string }` | Callback that is called when user click on a POI.
| `onLongPress` | `{ coordinate: LatLng, position: Point }` | Callback that is called when user makes a "long press" somewhere on the map.
| `onMarkerPress` |  | Callback that is called when a marker on the map is tapped by the user.
| `onMarkerSelect` |  | Callback that is called when a marker on the map becomes selected. This will be called when the callout for that marker is about to be shown. **Note**: iOS only.
| `onMarkerDeselect` |  | Callback that is called when a marker on the map becomes deselected. This will be called when the callout for that marker is about to be hidden. **Note**: iOS only.
| `onCalloutPress` |  | Callback that is called when a callout is tapped by the user.
| `onMarkerDragStart` | `{ coordinate: LatLng, position: Point }` | Callback that is called when the user initiates a drag on a marker (if it is draggable)
| `onMarkerDrag` | `{ coordinate: LatLng, position: Point }` | Callback called continuously as a marker is dragged
| `onMarkerDragEnd` | `{ coordinate: LatLng, position: Point }` | Callback that is called when a drag on a marker finishes. This is usually the point you will want to setState on the marker's coordinate again
| `onIndoorLevelActivated` | `IndoorLevel` | Callback that is called when a level on indoor building is activated
| `onIndoorBuildingFocused` | `IndoorBuilding` | Callback that is called when a indoor building is focused/unfocused



## Methods

| Method Name | Arguments | Notes
|---|---|---|
| `getCamera` | | Returns a `Camera` structure indicating the current camera configuration.
| `animateCamera` | `camera: Camera`, `{ duration: Number }` | Animate the camera to a new view. You can pass a partial camera object here; any property not given will remain unmodified.
| `setCamera` | `camera: Camera`, `{ duration: Number }` | Like `animateCamera`, but sets the new view instantly, without an animation.
| `animateToRegion` | `region: Region`, `duration: Number` |
| `animateToNavigation` | `location: LatLng`, `bearing: Number`, `angle: Number`, `duration: Number` | Deprecated. Use `animateCamera` instead.
| `animateToCoordinate` | `coordinate: LatLng`, `duration: Number` | Deprecated. Use `animateCamera` instead.
| `animateToBearing` | `bearing: Number`, `duration: Number` | Deprecated. Use `animateCamera` instead.
| `animateToViewingAngle` | `angle: Number`, `duration: Number` | Deprecated. Use `animateCamera` instead.
| `getMapBoundaries` | | `Promise<{northEast: LatLng, southWest: LatLng}>`
| `setMapBoundaries` | `northEast: LatLng`, `southWest: LatLng` | The boundary is defined by the map's center coordinates, not the device's viewport itself. **Note:** Google Maps only.
| `setIndoorActiveLevelIndex` | `levelIndex: Number` |
| `fitToElements` | `animated: Boolean` |
| `fitToSuppliedMarkers` | `markerIDs: String[], options: { edgePadding: EdgePadding, animated: Boolean }` | If you need to use this in `ComponentDidMount`, make sure you put it in a timeout or it will cause performance problems.
| `fitToCoordinates` | `coordinates: Array<LatLng>, options: { edgePadding: EdgePadding, animated: Boolean }` | If called in `ComponentDidMount` in android, it will cause an exception. It is recommended to call it from the MapView `onLayout` event.
| `pointForCoordinate` | `coordinate: LatLng` | Converts a map coordinate to a view coordinate (`Point`). Returns a `Promise<Point>`.
| `coordinateForPoint` | `point: Point` | Converts a view coordinate (`Point`) to a map coordinate. Returns a `Promise<Coordinate>`.
| `getMarkersFrames` | `onlyVisible: Boolean` | Get markers' centers and frames in view coordinates. Returns a `Promise<{ "markerID" : { point: Point, frame: Frame } }>`. **Note**: iOS only.



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
   heading: number

   // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
   altitude: number.

   // Only when using Google Maps.
   zoom: number
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
  activeLevelIndex: Number,
  name: String,
  shortName: String,
}
```
