# `<MapView.Marker />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `title` | `String` |  | The title of the marker. This is only used if the <Marker /> component has no children that are an `<MapView.Callout />`, in which case the default callout behavior will be used, which will show both the `title` and the `description`, if provided.
| `description` | `String` |  | The description of the marker. This is only used if the <Marker /> component has no children that are an `<MapView.Callout />`, in which case the default callout behavior will be used, which will show both the `title` and the `description`, if provided.
| `image` | `ImageSource` |  | A custom image to be used as the marker's icon. Only local image resources are allowed to be used.
| `pinColor` | `Color` |  | If no custom marker view or custom image is provided, the platform default pin will be used, which can be customized by this color. Ignored if a custom marker is being used.
| `coordinate` | `LatLng` |  | The coordinate for the marker.
| `centerOffset` | `Point` |  | The offset (in points) at which to display the view.<br/><br/> By default, the center point of an annotation view is placed at the coordinate point of the associated annotation. You can use this property to reposition the annotation view as needed. This x and y offset values are measured in points. Positive offset values move the annotation view down and to the right, while negative values move it up and to the left.<br/><br/> For Google Maps, see the `anchor` prop.
| `calloutOffset` | `Point` |  | The offset (in points) at which to place the callout bubble.<br/><br/> This property determines the additional distance by which to move the callout bubble. When this property is set to (0, 0), the anchor point of the callout bubble is placed on the top-center point of the marker view’s frame. Specifying positive offset values moves the callout bubble down and to the right, while specifying negative values moves it up and to the left.<br/><br/> For android, see the `calloutAnchor` prop.
| `anchor` | `Point` |  | Sets the anchor point for the marker.<br/><br/> The anchor specifies the point in the icon image that is anchored to the marker's position on the Earth's surface.<br/><br/> The anchor point is specified in the continuous space [0.0, 1.0] x [0.0, 1.0], where (0, 0) is the top-left corner of the image, and (1, 1) is the bottom-right corner. The anchoring point in a W x H image is the nearest discrete grid point in a (W + 1) x (H + 1) grid, obtained by scaling the then rounding. For example, in a 4 x 2 image, the anchor point (0.7, 0.6) resolves to the grid point at (3, 1).<br/><br/> For MapKit on iOS, see the `centerOffset` prop.
| `calloutAnchor` | `Point` |  | Specifies the point in the marker image at which to anchor the callout when it is displayed. This is specified in the same coordinate system as the anchor. See the `anchor` prop for more details.<br/><br/> The default is the top middle of the image.<br/><br/> For ios, see the `calloutOffset` prop.
| `flat` | `Boolean` |  | Sets whether this marker should be flat against the map true or a billboard facing the camera false.
| `identifier` | `String` |  | An identifier used to reference this marker at a later date.
| `rotation` | `Float` |  | A float number indicating marker's rotation angle.
| `draggable` | `<null>` |  | This is a non-value based prop. Adding this allows the marker to be draggable (re-positioned).

## Events

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
