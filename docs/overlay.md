# `<Overlay />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `image` | `ImageSource` | A custom image to be used as the overlay. Only required local image resources and uri (as for images located in the net) are allowed to be used.
| `bounds` | `Array<LatLng>` |  | The coordinates for the image (left-top corner, right-bottom corner). ie.```[[lat, long], [lat, long]]```
| `tappable` | `Bool` | `false` | `Android only` Boolean to allow an overlay to be tappable and use the onPress function.
| `opacity` | `Number` | `1.0` | `Google maps only` The opacity of the overlay.

## Events

| Event Name | Returns | Notes
|---|---|---|
| `onPress` |  | `Android only` Callback that is called when the user presses on the overlay

## Types

```
type LatLng = [
  latitude: Number,
  longitude: Number,
]
```
