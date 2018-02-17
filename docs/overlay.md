# `<Overlay />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `image` | `ImageSource` | A custom image to be used as the overlay. Only required local image resources and uri (as for images located in the net) are allowed to be used.
| `bounds` | `Array<LatLng>` |  | The coordinates for the image (left-top corner, right-bottom corner).

## Types

```
type LatLng {
  latitude: Number,
  longitude: Number,
}
```

## Limitation

When placing images close to each other, some images will be break with zooming up operation in iOS, see [#2022](https://github.com/react-community/react-native-maps/pull/2022) .
