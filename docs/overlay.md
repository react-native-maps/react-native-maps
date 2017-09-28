# `<MapView.Overlay />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `image` | `ImageSource` |  | A custom image to be used as the overlay. Only required local image resources and uri (as for images located in the net) are allowed to be used.
| `bounds` | `Array<LatLng>` |  | The coordinates for the image (north-east corner, south-west corner).
| `bearing` | `Number` | 0 | The angle at which the image should be rotated

## Types

```
type LatLng {
  latitude: Number,
  longitude: Number,
}
```
