# `<Heatmap />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `points` | `Array<WeightedLatLng>` |  | Array of heatmap entries to apply towards density.
| `radius` | `Number` | `20` | The radius of the heatmap points in pixels, between 10 and 50.
| `opacity` | `Number` | `0.7` | The opacity of the heatmap.
| `gradient` | `Object` |  | Heatmap gradient configuration (See below for *Gradient Config*).


## Gradient Config

[Android Doc](https://developers.google.com/maps/documentation/android-sdk/utility/heatmap#custom) | [iOS Doc](https://developers.google.com/maps/documentation/ios-sdk/utility/heatmap#customize)

| Prop | Type | Default | Note |
|---|---|---|---|
| `colors` | `Array<String>` |  | Colors (one or more) to use for gradient.
| `startPoints` | `Array<Number>` |  | Array of floating point values from 0 to 1 representing where each color starts. Array length must be equal to `colors` array length.
| `colorMapSize` | `Number` | `256` | Resolution of color map -- number corresponding to the number of steps colors are interpolated into.


## Types

```
type WeightedLatLng = {
  latitude: Number;
  longitude: Number;
  weight?: Number;
}
```
