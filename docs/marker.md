# `<Marker />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `title` | `String` |  | The title of the marker. This is only used if the <Marker /> component has no children that are a `<Callout />`, in which case the default callout behavior will be used, which will show both the `title` and the `description`, if provided.
| `description` | `String` |  | The description of the marker. This is only used if the <Marker /> component has no children that are a `<Callout />`, in which case the default callout behavior will be used, which will show both the `title` and the `description`, if provided.
| `image` | `ImageSource` |  | A custom image to be used as the marker's icon. Only local image resources are allowed to be used.
| `icon` | `ImageSource` |  | Marker icon to render (equivalent to `icon` property of GMSMarker Class).
| `pinColor` | `Color` |  | If no custom marker view or custom image is provided, the platform default pin will be used, which can be customized by this color. Ignored if a custom marker is being used.<br/><br/> For Android, the set of available colors is limited. Unsupported colors will fall back to red. See [#887](https://github.com/react-community/react-native-maps/issues/887) for more information.
| `coordinate` | `LatLng` |  | The coordinate for the marker.
| `centerOffset` | `Point` | (0, 0) | The offset (in points) at which to display the view.<br/><br/> By default, the center point of an annotation view is placed at the coordinate point of the associated annotation. You can use this property to reposition the annotation view as needed. This x and y offset values are measured in points. Positive offset values move the annotation view down and to the right, while negative values move it up and to the left.<br/><br/> For Google Maps, see the `anchor` prop.
| `calloutOffset` | `Point` | (0, 0) | The offset (in points) at which to place the callout bubble.<br/><br/> This property determines the additional distance by which to move the callout bubble. When this property is set to (0, 0), the anchor point of the callout bubble is placed on the top-center point of the marker view’s frame. Specifying positive offset values moves the callout bubble down and to the right, while specifying negative values moves it up and to the left.<br/><br/> For Google Maps, see the `calloutAnchor` prop.
| `anchor` | `Point` | (0.5, 1) | Sets the anchor point for the marker.<br/><br/> The anchor specifies the point in the icon image that is anchored to the marker's position on the Earth's surface.<br/><br/> The anchor point is specified in the continuous space [0.0, 1.0] x [0.0, 1.0], where (0, 0) is the top-left corner of the image, and (1, 1) is the bottom-right corner. The anchoring point in a W x H image is the nearest discrete grid point in a (W + 1) x (H + 1) grid, obtained by scaling the then rounding. For example, in a 4 x 2 image, the anchor point (0.7, 0.6) resolves to the grid point at (3, 1).<br/><br/> For MapKit on iOS, see the `centerOffset` prop.
| `calloutAnchor` | `Point` | (0.5, 0) | Specifies the point in the marker image at which to anchor the callout when it is displayed. This is specified in the same coordinate system as the anchor. See the `anchor` prop for more details.<br/><br/> The default is the top middle of the image.<br/><br/> For MapKit on iOS, see the `calloutOffset` prop.
| `flat` | `Boolean` | false | Sets whether this marker should be flat against the map true or a billboard facing the camera.
| `identifier` | `String` |  | An identifier used to reference this marker at a later date.
| `rotation` | `Float` | 0 | A float number indicating marker's rotation angle, in degrees.
| `draggable` | `<null>` |  | This is a non-value based prop. Adding this allows the marker to be draggable (re-positioned).
| `tracksViewChanges` | `Boolean` | true | Sets whether this marker should track view changes. It's recommended to turn it off whenever it's possible to improve custom marker performance.
| `tracksInfoWindowChanges` | `Boolean` | false | Sets whether this marker should track view changes in info window. Enabling it will let marker change content of info window after first render pass, but will lead to decreased performance, so it's recommended to disable it whenever you don't need it. **Note**: iOS Google Maps only.
| `stopPropagation` | `Boolean` | false | Sets whether this marker should propagate `onPress` events. Enabling it will stop the parent `MapView`'s `onPress` from being called. **Note**: iOS only. Android does not propagate `onPress` events. See [#1132](https://github.com/react-community/react-native-maps/issues/1132) for more information.
| `opacity` | `Float` | 1.0 | The marker's opacity between 0.0 and 1.0.
| `isPreselected` | `Boolean` | false | When true, the marker will be pre-selected. Setting this to true allows the user to drag the marker without needing to tap on it once to focus on it. **Note**: iOS Apple Maps only.

## Events

To access event data, you will need to use `e.nativeEvent`. For example, `onPress={e => console.log(e.nativeEvent)}` will log the entire event object to your console.

| Event Name | Returns | Notes
|---|---|---|
| `onPress` | `{ coordinate: LatLng, position: Point }` | Callback that is called when the user presses on the marker
| `onSelect` | `{ coordinate: LatLng, position: Point }` | Callback that is called when the user selects the marker, before the callout is shown. **Note**: iOS only.
| `onDeselect` | `{ coordinate: LatLng, position: Point }` | Callback that is called when the marker is deselected, before the callout is hidden. **Note**: iOS only.
| `onCalloutPress` |  | Callback that is called when the user taps the callout view.
| `onDragStart` | `{ coordinate: LatLng, position: Point }` | Callback that is called when the user initiates a drag on this marker (if it is draggable)
| `onDrag` | `{ coordinate: LatLng, position: Point }` | Callback called continuously as the marker is dragged
| `onDragEnd` | `{ coordinate: LatLng, position: Point }` | Callback that is called when a drag on this marker finishes. This is usually the point you will want to setState on the marker's coordinate again


## Methods

| Method Name | Arguments | Notes
|---|---|---|
| `showCallout` |  | Shows the callout for this marker
| `hideCallout` |  | Hides the callout for this marker
| `redrawCallout` |  | Causes a redraw of the marker's callout. Useful for Google Maps on iOS. **Note**: iOS only.
| `animateMarkerToCoordinate` | `coordinate: LatLng, duration: number` | Animates marker movement. **Note**: Android only
| `redraw` |  | Causes a redraw of the marker. Useful when there are updates to the marker and `tracksViewChanges` comes with a cost that is too high.



## Types

```
type LatLng {
  latitude: Number,
  longitude: Number,
}
```

```
type Point {
  x: Number,
  y: Number,
}
```

## Children Components

Children components can be added within a Marker and rendered content will replace the marker symbol.  This is a way of creating custom markers and allowing use of native SVGs.

Example:
```
<Marker ...>
 <View style={{backgroundColor: "red", padding: 10}}>
   <Text>SF</Text>
 </View>
</Marker>
```
