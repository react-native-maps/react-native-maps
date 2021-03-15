# `<Overlay />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `image` | `ImageSource` | A custom image to be used as the overlay. Only required local image resources and uri (as for images located in the net) are allowed to be used.
| `bounds` | `Array<LatLng>` |  | The coordinates for the image (left-top corner, right-bottom corner). ie.```[[lat, long], [lat, long]]```

## Types

```
type LatLng = [
  latitude: Number,
  longitude: Number,
]
```
