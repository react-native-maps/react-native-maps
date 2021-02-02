# `<Geojson />` Component API

## Props

| Prop      | Type | Default                                                | Note |
| --------- | ---- | ------------------------------------------------------ | ---- |
| `geojson` |  `GeoJSON`    |  | [Geojson](https://geojson.org/) description of object. |
| `strokeColor` | `String`     | stroke color in GeoJson if present else `#000` | The stroke color to use for the path.  |
| `fillColor` | `String`     | fill color in GeoJson | The fill color to use for the path. |
| `strokeWidth` | `Number`     | stroke width in Geojson if present else `1` | The stroke width to use for the path. |
| `lineDashPhase` | `Number`     |  |  (iOS only) The offset (in points) at which to start drawing the dash pattern. Use this property to start drawing a dashed line partway through a segment or gap. For example, a phase value of 6 for the patter 5-2-3-2 would cause drawing to begin in the middle of the first gap. |
| `lineDashPattern` | `Array<Number>`     |  | An array of numbers specifying the dash pattern to use for the path. The array contains one or more numbers that indicate the lengths (measured in points) of the  line segments and gaps in the pattern. The values in the array alternate, starting with the first line segment length, followed by the first gap length, followed by the second line segment length, and so on. |
| `lineCap` |  `'butt' | 'round' | 'square'`     |  |  The line cap style to apply to the open ends of the path. Possible values are `butt`, `round` or `square`.  Note: lineCap is not yet supported for GoogleMaps provider on iOS. |
| `lineJoin` | `'miter'| 'round' | 'bevel'`     |  |  The line join style to apply to corners of the path. Possible values are `miter`, `round` or `bevel`. |
| `miterLimit` | `Number`     |  | The limiting value that helps avoid spikes at junctions between connected line segments. The miter limit helps you avoid spikes in paths that use the `miter` `lineJoin` style. If the ratio of the miter length—that is, the diagonal length of the miter join—to the line thickness exceeds the miter limit, the joint is converted to a bevel join. The default miter limit is 10, which results in the conversion of miters whose angle at the joint is less than 11 degrees. | 
| `zIndex` | `Number`     |  | Layer level of the z-index value |

## Example

```
import React from 'react';
import MapView, {Geojson} from 'react-native-maps';

const myPlace = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [64.165329, 48.844287],
      }
    }
  ]
};

const Map = props => (
  <MapView>
    <Geojson 
      geojson={myPlace} 
      strokeColor="red"
      fillColor="green"
      strokeWidth={2}
    />
  </MapView>
);
```


