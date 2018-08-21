# `<Polyline />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `coordinates` | `Array<LatLng>` | (Required) | An array of coordinates to describe the polyline
| `strokeWidth` | `Number` | `1` | The stroke width to use for the path.
| `strokeColor` | `String` | `#000` | The stroke color to use for the path.
| `strokeColors` | `Array<String>` | `null` | The stroke colors to use for the path (iOS only). Must be the same length as `coordinates`.
| `lineCap` | `String` | `round` | The line cap style to apply to the open ends of the path. Possible values are `butt`, `round` or `square`.  Note: lineCap is not yet supported for GoogleMaps provider on iOS.
| `lineJoin` | `String` | `round` | The line join style to apply to corners of the path. Possible values are `miter`, `round` or `bevel`.
| `miterLimit` | `Number` |  | The limiting value that helps avoid spikes at junctions between connected line segments. The miter limit helps you avoid spikes in paths that use the `miter` `lineJoin` style. If the ratio of the miter length—that is, the diagonal length of the miter join—to the line thickness exceeds the miter limit, the joint is converted to a bevel join. The default miter limit is 10, which results in the conversion of miters whose angle at the joint is less than 11 degrees.
| `geodesic` | `Boolean` |  | Boolean to indicate whether to draw each segment of the line as a geodesic as opposed to straight lines on the Mercator projection. A geodesic is the shortest path between two points on the Earth's surface. The geodesic curve is constructed assuming the Earth is a sphere.
| `lineDashPhase` | `Number` | `0` | (iOS only) The offset (in points) at which to start drawing the dash pattern. Use this property to start drawing a dashed line partway through a segment or gap. For example, a phase value of 6 for the patter 5-2-3-2 would cause drawing to begin in the middle of the first gap.
| `lineDashPattern` | `Array<Number>` | `null` | (iOS only) An array of numbers specifying the dash pattern to use for the path. The array contains one or more numbers that indicate the lengths (measured in points) of the  line segments and gaps in the pattern. The values in the array alternate, starting with the first line segment length, followed by the first gap length, followed by the second line segment length, and so on.

## Events

| Event Name | Returns | Notes
|---|---|---|
| `onPress` |  | Callback that is called when the user presses on the polyline

## Types

```
type LatLng {
  latitude: Number,
  longitude: Number,
}
```

## Gradient Polylines (iOS MapKit only)

Gradient polylines can be created by using the `strokeColors` prop. `strokeColors` must be an array with the same number of elements as `coordinates`.

Example:

```js
import MapView, { Polyline } from 'react-native-maps';

<MapView>
	<Polyline
		coordinates={[
			{ latitude: 37.8025259, longitude: -122.4351431 },
			{ latitude: 37.7896386, longitude: -122.421646 },
			{ latitude: 37.7665248, longitude: -122.4161628 },
			{ latitude: 37.7734153, longitude: -122.4577787 },
			{ latitude: 37.7948605, longitude: -122.4596065 },
			{ latitude: 37.8025259, longitude: -122.4351431 }
		]}
		strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
		strokeColors={[
			'#7F0000',
			'#00000000', // no color, creates a "long" gradient between the previous and next coordinate
			'#B24112',
			'#E5845C',
			'#238C23',
			'#7F0000'
		]}
		strokeWidth={6}
	/>
</MapView>
```
