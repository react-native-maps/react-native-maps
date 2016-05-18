# `<MapView.Heatmap />` Component API

- Uses GoogleMap api for Android.
- Uses [DTMHeatmap](https://github.com/dataminr/DTMHeatmap) for iOS.

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `points` | `Array<WeightedLatLng>` | (Required) | Points for the heatmap with optional weight.

## Types

```
type WeightedLatLng {
  latitude: Number,
  longitude: Number,
  weight: Number, // optional
}
```
