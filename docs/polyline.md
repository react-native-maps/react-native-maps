# `<MapView.Polyline />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `coordinates` | `Array<LatLng>` | (Required) | An array of coordinates to describe the polygon
| `strokeWidth` | `Number` | `1` | The stroke width to use for the path.
| `strokeColor` | `String` | `#000` | The stroke color to use for the path.
| `lineCap` | `String` | `round` | The line cap style to apply to the open ends of the path.
| `lineJoin` | `Array<LatLng>` |  | The line join style to apply to corners of the path.
| `miterLimit` | `Number` |  | The limiting value that helps avoid spikes at junctions between connected line segments. The miter limit helps you avoid spikes in paths that use the `miter` `lineJoin` style. If the ratio of the miter length—that is, the diagonal length of the miter join—to the line thickness exceeds the miter limit, the joint is converted to a bevel join. The default miter limit is 10, which results in the conversion of miters whose angle at the joint is less than 11 degrees.
| `geodesic` | `Boolean` |  | Boolean to indicate whether to draw each segment of the line as a geodesic as opposed to straight lines on the Mercator projection. A geodesic is the shortest path between two points on the Earth's surface. The geodesic curve is constructed assuming the Earth is a sphere.


## Types

```
type LatLng {
  latitude: Number,
  longitude: Number,
}
```
