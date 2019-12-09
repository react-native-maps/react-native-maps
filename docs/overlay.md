# `<Overlay />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `image` | `ImageSource` | A custom image to be used as the overlay. Only required local image resources and uri (as for images located in the net) are allowed to be used.
| `bounds` | `Array<LatLng>` |  | The coordinates for the image (left-top corner, right-bottom corner). ie.```[[lat, long], [lat, long]]```
| `bearing` | `Float` | `0` | `Google Maps API only` The bearing in degrees clockwise from north. Values outside the range [0, 360) will be normalized.
| `tappable` | `Bool` | `false` | `Android only` Boolean to allow an overlay to be tappable and use the onPress function.
| `location` | `[Float, Float]` |  | `Android only` Location of the image overlay.
| `width` | `Float` |  | `Android only` The width of the overlay (in meters).
| `height` | `Float` |  | `Android only` The height of the overlay (in meters).
| `anchor` | `[Float, Float]` |  | `Android only` Anchor point is specified in 2D continuous space where [0, 0], [1, 0], [0, 1] and [1, 1] denote the top-left, top-right, bottom-left and bottom-right corners respectively.

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
## Android only - Specifying overlay location
There are two ways to specify the position of the overlay in `Android`:

**Using a location:** You must provide an image of the overlay, a LatLng to which the anchor will be fixed and the width of the overlay (in meters). The anchor is, by default, 50% from the top of the image and 50% from the left of the image. This can be changed. You can optionally provide the height of the overlay (in meters). If you do not provide the height of the overlay, it will be automatically calculated to preserve the proportions of the image.

**Using a Bounds:** You must provide a `Array<LatLng>` which will contain the image's left-top corner, right-bottom corner.