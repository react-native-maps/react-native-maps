# Change Log

## 0.10.0 (October 5, 2016)

### Breaking Changes

* Upgrade to `react-native@0.33.0`

## 0.9.0 (September 28, 2016)

As of this release, this repository has moved from
`lelandrichardson/react-native-maps` to `airbnb/react-native-maps`.

### Breaking Changes

* [iOS] Support Google Maps on iOS
  [#548](https://github.com/airbnb/react-native-maps/pull/548)
  (@gilbox)

### Patches

* Added support for AnimatedRegion without modifying the AnimatedImplementation.js of react-native
  [#608](https://github.com/airbnb/react-native-maps/pull/608)
  (@IjzerenHein)
* [iOS] Remove pod stuff. Fix AirMaps.xcodeproj related to missing pod stuff
  [#620](https://github.com/airbnb/react-native-maps/pull/620)
  (@gilbox)
* [iOS] Fix import of AIRMapSnapshot
  [#622](https://github.com/airbnb/react-native-maps/pull/622)
  (@spikebrehm)
* [iOS] Fix nullability issue
  [#614](https://github.com/airbnb/react-native-maps/pull/614)
  (@simonmitchell)
* [iOS] Added support for drawing polylines on snapshots on iOS
  [#615](https://github.com/airbnb/react-native-maps/pull/615)
  (@IjzerenHein)
* Add `fitToCoordinates` method
  [#545](https://github.com/airbnb/react-native-maps/pull/545)
  (@naoufal)
* [Android] Fix list of examples on Android
  [#597](https://github.com/airbnb/react-native-maps/pull/597)
  (@spikebrehm)
* [Android] Fix overlapping map issue
  [#589](https://github.com/airbnb/react-native-maps/pull/589)
  (@fdnhkj)
* Add tile overlay support
  [#595](https://github.com/airbnb/react-native-maps/pull/595)
  (@cascadian, @spikebrehm)
* [Android] Support Android LiteMode
  [#546](https://github.com/airbnb/react-native-maps/pull/546)
  (@rops)
* s/lelandrichardson/airbnb/
  [#573](https://github.com/airbnb/react-native-maps/pull/573)
  (@spikebrehm)
* [Android] Don't fit to elements if no positions added
  [#567](https://github.com/airbnb/react-native-maps/pull/567)
  (@ryankask)
* [iOS] Add class prefix to EmptyCalloutBackgroundView
  [#563](https://github.com/airbnb/react-native-maps/pull/563)
  (@terribleben)
* [Android] Minor code cleanup
  [#564](https://github.com/airbnb/react-native-maps/pull/564)
  (@felipecsl)
* Documentation updates
  [#566](https://github.com/airbnb/react-native-maps/pull/566),
  [#591](https://github.com/airbnb/react-native-maps/pull/591),
  [#601](https://github.com/airbnb/react-native-maps/pull/601),
  [#602](https://github.com/airbnb/react-native-maps/pull/602),
  [#624](https://github.com/airbnb/react-native-maps/pull/624)
  (@felipecsl, @Alastairm, @Keksike, @bbodenmiller)

## 0.8.2 (September 8, 2016)

We realized immediately after publishing 0.8.1 that the NPM package contained
some test code in the `example2/` directory that contained a copy of the
`react-native` package, causing this packager error:

```
Failed to build DependencyGraph: @providesModule naming collision:
  Duplicate module name: String.prototype.es6
  Paths: /Users/<path to project>/node_modules/react-native-maps/example2/node_modules/react-native/packager/react-packager/src/Resolver/polyfills/String.prototype.es6.js collides with /Users/<path to project>/node_modules/react-native/packager/react-packager/src/Resolver/polyfills/String.prototype.es6.js

This error is caused by a @providesModule declaration with the same name accross two different files.
```

0.8.2 is identical to 0.8.1, except with the offending code removed from the NPM package.


## 0.8.1 (September 8, 2016) *[DEPRECATED]*

#### *NOTE: 0.8.1 has been unpublished from NPM because it was faulty. Please use 0.8.2.*

### Patches

- [Android] Use latest available (wildcard version) of RN to build Android ([PR #547](https://github.com/airbnb/react-native-maps/pull/547))
- [Android] Use `Activity` to call `MapsInitialier.initialize()` ([PR #449](https://github.com/airbnb/react-native-maps/pull/449))
- [Android] Fix file path for `AirMapModule` ([PR #526](https://github.com/airbnb/react-native-maps/pull/526))
- [Android] Fix path to React Native in `node_modules` ([PR #527](https://github.com/airbnb/react-native-maps/pull/527))
- [Android] Bump Google Play Services dependency to `9.4.0` ([PR #533](https://github.com/airbnb/react-native-maps/pull/533))
- [iOS] Fix a few warnings ([PR #534](https://github.com/airbnb/react-native-maps/pull/534))
- [JS] Fix ESLint violations ([PR #515](https://github.com/airbnb/react-native-maps/pull/515))

## 0.8.0 (August 30, 2016)

### Breaking Changes

- Upgrade to `react-native@0.32.0`, and update Android code to match ([#502](https://github.com/airbnb/react-native-maps/pull/502))

### Patches

- [android] Add `showsMyLocationButton` prop ([#382](https://github.com/airbnb/react-native-maps/pull/382))

- Add `fitToSuppliedMarkers()` method ([#386](https://github.com/airbnb/react-native-maps/pull/386))

- [ios] Update AirMapMarker to use loadImageWithURLRequest ([#389](https://github.com/airbnb/react-native-maps/pull/389))

- Improvements to watch and copy script ([#445](https://github.com/airbnb/react-native-maps/pull/445))

- [ios] Added check on marker class in predicate ([#485](https://github.com/airbnb/react-native-maps/pull/485))

- Use `StyleSheet.absoluteFillObject` where appropriate ([#500](https://github.com/airbnb/react-native-maps/pull/500)) and ([#493](https://github.com/airbnb/react-native-maps/pull/493))

- Add ESLint and fix a number of linting violations ([#501](https://github.com/airbnb/react-native-maps/pull/501))

- Remove unused `NativeMethodsMixin` for compat with RN 0.32 ([#511](https://github.com/airbnb/react-native-maps/pull/511))


## 0.7.1 (July 9, 2016)

### Patches

- Fix iOS CocoaPods Issue ([#308](https://github.com/airbnb/react-native-maps/pull/308))



## 0.7.0 (July 9, 2016)

### Breaking Changes

- RN 0.29 compatibility changes ([#363](https://github.com/airbnb/react-native-maps/pull/363) and [#370](https://github.com/airbnb/react-native-maps/pull/370))


### Patches

- Fixing scrolling map inside a scrollView ([#343](https://github.com/airbnb/react-native-maps/pull/343))

- Fix shouldUsePinView ([#344](https://github.com/airbnb/react-native-maps/pull/344))

- Not calling setLoadingIndicatorColor when null ([#337](https://github.com/airbnb/react-native-maps/pull/337))

- Fixes `Undefined symbols for architecture x86_64: “std::terminate()”` ([#329](https://github.com/airbnb/react-native-maps/pull/329))



## 0.6.0

## 0.5.0

* [Android] Updated package to `com.airbnb.android.react.maps` (PR #225)
* [Android] Lint fixes (PR #232)

## 0.4.0

 * Initial release
