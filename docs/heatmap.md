# `<MapView.Heatmap />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `points` | `Array of points` | (Required) | An array of points(see below), with optional weight

## Types

```
type Point {
	latitude: Number,
	longitude: Number,
	weight: Number,
}
```