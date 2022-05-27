# `<Polygon />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `coordinates` | `Array<LatLng>` | (Required) | An array of coordinates to describe the polygon
| `holes` | `Array<Array<LatLng>>` |  | A 2d array of coordinates to describe holes of the polygon where each hole has at least 3 points.
| `strokeWidth` | `Number` | `1` | The stroke width to use for the path.
| `strokeColor` | `String` | `#000`, `rgba(r,g,b,0.5)` | The stroke color to use for the path.
| `fillColor` | `String` | `#000`, `rgba(r,g,b,0.5)` | The fill color to use for the path.
| `lineCap` | `String` | `round` | The line cap style to apply to the open ends of the path.
| `lineJoin` | `Array<LatLng>` |  | The line join style to apply to corners of the path.
| `miterLimit` | `Number` |  | The limiting value that helps avoid spikes at junctions between connected line segments. The miter limit helps you avoid spikes in paths that use the `miter` `lineJoin` style. If the ratio of the miter length—that is, the diagonal length of the miter join—to the line thickness exceeds the miter limit, the joint is converted to a bevel join. The default miter limit is 10, which results in the conversion of miters whose angle at the joint is less than 11 degrees.
| `geodesic` | `Boolean` |  | Boolean to indicate whether to draw each segment of the line as a geodesic as opposed to straight lines on the Mercator projection. A geodesic is the shortest path between two points on the Earth's surface. The geodesic curve is constructed assuming the Earth is a sphere.
| `lineDashPhase` | `Number` | `0` | (iOS only) The offset (in points) at which to start drawing the dash pattern. Use this property to start drawing a dashed line partway through a segment or gap. For example, a phase value of 6 for the patter 5-2-3-2 would cause drawing to begin in the middle of the first gap.
| `lineDashPattern` | `Array<Number>` | `null` | (iOS only) An array of numbers specifying the dash pattern to use for the path. The array contains one or more numbers that indicate the lengths (measured in points) of the  line segments and gaps in the pattern. The values in the array alternate, starting with the first line segment length, followed by the first gap length, followed by the second line segment length, and so on.
| `tappable` | `Bool` | `false` | Boolean to allow a polygon to be tappable and use the onPress function.
| `zIndex`   | `Number` | `0` | (Android Only) The order in which this polygon overlay is drawn with respect to other overlays. An overlay with a larger z-index is drawn over overlays with smaller z-indices. The order of overlays with the same z-index is arbitrary. The default zIndex is 0.

## Events

| Event Name | Returns | Notes
|---|---|---|
| `onPress` |  | Callback that is called when the user presses on the polygon

## Types

```
type LatLng {
  latitude: Number,
  longitude: Number,
}
```
