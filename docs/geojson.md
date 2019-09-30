# `<Geojson />` Component API

## Props

| Prop      | Type | Default                                                | Note |
| --------- | ---- | ------------------------------------------------------ | ---- |
| `geojson` |      | [Geojson](https://geojson.org/) description of object. |

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
    <Geojson geojson={myPlace} />
  </MapView>
);
```


