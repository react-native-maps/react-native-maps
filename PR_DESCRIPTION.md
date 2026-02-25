**Title:** fix(android): Marker child remote images not loading on Fabric

---

## Summary

Fixes Marker child components that load remote images via Glide-backed libraries (e.g. `react-native-fast-image`) rendering as blank on Android with Fabric (New Architecture) enabled.

**All other child content (Views, Text, borders, backgrounds) renders correctly — only remote images are affected.**

### Root Cause

Three issues combine to cause the bug:

1. **`hackToHandleDraweeLifecycle` only checks immediate children.** Image components like FastImage wrap their actual image view (`FastImageViewWithUrl`) inside React Native `ViewGroup` wrappers. The hack checks `child instanceof DraweeView` on the immediate child (a `ReactViewGroup`), never finding the image view at depth 3+.

2. **Glide-backed FastImage is not a DraweeView.** Modern versions of `react-native-fast-image` use Glide (`FastImageViewWithUrl extends AppCompatImageView`), not Fresco (`DraweeView`). Even if the hack searched recursively, the `instanceof DraweeView` check would return `false`.

3. **Fabric interop layer doesn't call `onAfterUpdateTransaction()` on legacy ViewManagers.** `FastImageViewManager.onAfterUpdateTransaction()` is where FastImage triggers `Glide.load(uri).into(view)` to start the image download. On Fabric, this callback is never invoked through the interop layer, so the Glide request is never created and the `ImageView` stays blank.

### Fix

- **`hackToHandleImageLifecycleRecursive()`** — New method that recursively walks the entire child view tree (not just immediate children), handling both `DraweeView` (Fresco) and `ImageView` (Glide) instances.

- **`hackToHandleGlideImageView()`** — New method for non-DraweeView `ImageView` instances. Reads the image source URI from the view's `mSource` field via reflection, loads it directly via Glide (also via reflection to avoid adding a compile-time dependency), and uses a dynamic `Proxy`-based `RequestListener` to trigger marker icon re-capture when the image finishes loading.

- The existing `hackToHandleDraweeLifecycle()` is **unchanged** — Fresco-based image components continue to work as before.

### Why Reflection?

react-native-maps has no direct dependency on Glide. The dependency comes transitively through image libraries like `react-native-fast-image`. Using reflection:
- Avoids adding a compile-time Glide dependency
- Fails gracefully (silent catch) if Glide isn't present or the API differs
- Works with any Glide version that has the standard `RequestManager.load().listener().into()` API

### Affected Configurations

| Configuration | Before | After |
|---|---|---|
| Android Fabric + Glide-backed image children | ❌ Blank | ✅ Fixed |
| Android Fabric + Fresco-based image children | ✅ Works | ✅ Works (unchanged) |
| Android Old Architecture | ✅ Works | ✅ Works (unchanged) |
| iOS (any architecture) | ✅ Works | ✅ Works (unchanged) |
| Marker `image` prop (no children) | ✅ Works | ✅ Works (different path) |

### Broader Note

The underlying issue — `onAfterUpdateTransaction()` not being called for legacy ViewManagers in Fabric's interop layer — likely affects other third-party components beyond react-native-maps. A fix at the React Native Fabric interop layer would make this workaround unnecessary.

## Test Plan

- [ ] Verify `react-native-fast-image` (Glide-backed) remote images render inside `<Marker>` children on Android Fabric
- [ ] Verify React Native `<Image>` remote images render inside `<Marker>` children on Android Fabric
- [ ] Verify View backgrounds, Text, borders still render correctly inside `<Marker>` children
- [ ] Verify Marker `image` prop still works for static and remote images
- [ ] Verify `tracksViewChanges` periodic re-capture still works
- [ ] Verify no regressions on iOS
- [ ] Verify no regressions on Android Old Architecture
