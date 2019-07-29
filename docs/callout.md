# `<Callout />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `tooltip` | `Boolean` | `false` | If `false`, a default "tooltip" bubble window will be drawn around this callouts children. If `true`, the child views can fully customize their appearance, including any "bubble" like styles. 
| `alphaHitTest` | `Boolean` | `false` | If `true`, clicks on transparent areas in callout will be passed to map. **Note**: iOS only.

## Events

| Event Name | Returns | Notes
|---|---|---|
| `onPress` |  | Callback that is called when the user presses on the callout



---



# `<CalloutSubview />` Component API

**Note**: Supported on iOS only.
Use to handle press on specific subview of callout.
Put this component inside `<Callout />`.

## Events

| Event Name | Returns | Notes
|---|---|---|
| `onPress` |  | Callback that is called when the user presses on this subview inside callout

## Notes
Native press event has property `action`, which is:
- `callout-press` (or `marker-overlay-press` for GoogleMaps on iOS) for press on `<Callout />`
- `callout-inside-press` (or `marker-inside-overlay-press` for GoogleMaps on iOS) for press on `<CalloutSubview />`

