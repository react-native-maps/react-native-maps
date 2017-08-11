# `<MapHeatmap />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `points` | `Array of points` | (Required) | An array of points(see below), with optional weight
| 'point' | 'point' | (Required) | Contains a latitude, longitude, and a weight.
| 'weightEnabled' | 'boolean' | (Optional) | A boolean toggling whether or not points are rendered as weighted.

## Types

```
type Point {
	latitude: Number,
	longitude: Number,
	weight: Number,
}
```