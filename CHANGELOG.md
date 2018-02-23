# Change Log

## 0.20.1 (February 13, 2018)
* Common: [hotfix PROVIDER_GOOGLE](https://github.com/react-community/react-native-maps/commit/cd868ea7b33a04c8bdd5e909cf134a133b2cb316)
* iOS: [#2019](https://github.com/airbnb/react-native-maps/pull/2019) Exposing the maximumZ property to AIRMapUrlTile


## 0.20.0 (February 9, 2018)
* Common: [#1889](https://github.com/airbnb/react-native-maps/pull/1889) Fix for 'Animated.Region undefined constructor' in recent react-native version.
* iOS: [#1853](https://github.com/airbnb/react-native-maps/pull/1853) Fixed onMapReady no longer getting called on iOS
* Android: [#1906](https://github.com/airbnb/react-native-maps/pull/1906) Manage Zoom Controls visibility on the map
* iOS: [#1911](https://github.com/airbnb/react-native-maps/pull/1911) Add gradient/multi-color polyline support for iOS (MapKit)
* Android: [#1918](https://github.com/airbnb/react-native-maps/pull/1918) Ground Overlay Support
* Common: [#1851](https://github.com/airbnb/react-native-maps/pull/1851) New methods to convert between LatLng and Point
* iOS: [#1846](https://github.com/airbnb/react-native-maps/pull/1846) Fix callouts appearing behind markers
* iOS: [#1969](https://github.com/airbnb/react-native-maps/pull/1969) Added tracksInfoWindowChanges property to iOS Google Maps
* iOS: [#1960](https://github.com/airbnb/react-native-maps/pull/1960) Fixed gradient polyline not always fully drawn + stability issues
* iOS: [#1953](https://github.com/airbnb/react-native-maps/pull/1953) Fix onMapReady not getting called after first time, initialRegion lat/lng delta not setting properly, setRegion method getting called even when map is not ready and prevent onRegionChange/ onRegionChangeComplete event until initialRegion or region is set.
* Android: [#1781](https://github.com/airbnb/react-native-maps/pull/1781) Polygon holes support
* Android: [#1976](https://github.com/airbnb/react-native-maps/pull/1976) Add native animation for Markers on Android

## 0.19.0 (December 14, 2017)
* Common: [#1715](https://github.com/airbnb/react-native-maps/pull/1715) Fixed region/initialRegion null overrides of this.props
* Common: [#1876](https://github.com/airbnb/react-native-maps/pull/1876) Added support for locally stored tile overlay
* iOS: [#1854](https://github.com/airbnb/react-native-maps/pull/1854) Update GoogleMaps dependency to 2.5.0

## 0.18.3 (November 30, 2017)
* Android: [#1839](https://github.com/airbnb/react-native-maps/pull/1839) [AirGoogleMapManager] Use RCTDirectEventBlock for onMarkerPress

## 0.18.2 (November 29, 2017)
* Android: [#1835](https://github.com/airbnb/react-native-maps/pull/1835)  [AirMapView] Null check map instance on view methods

## 0.18.1 (November 28, 2017)
* Android: [#1828](https://github.com/airbnb/react-native-maps/pull/1828) [AirMapManager] Update MapBuilder for getCommandsMap to support all entires

## 0.18.0 (November 28, 2017)
* Android/iOS: [#1587](https://github.com/airbnb/react-native-maps/pull/1750) Add support to set map boundaries
* Android/iOS: [#1750](https://github.com/airbnb/react-native-maps/pull/1750) Add mapPadding property
* Common: [#1792](https://github.com/airbnb/react-native-maps/pull/1792) Make all components use ViewPropTypes || View.propTypes
* iOS: [#1774](https://github.com/airbnb/react-native-maps/pull/1774) Added missing parameters to google map screenshot
* iOS: [#1824](https://github.com/airbnb/react-native-maps/pull/1824) Add new iOS `mutedStandard` map-type
* iOS: [#1705](https://github.com/airbnb/react-native-maps/pull/1705) Enable control of Google Maps Marker tracksViewChanges property.
* Android: [#1710](https://github.com/airbnb/react-native-maps/pull/1710) Added support for new Android camera movement APIs
* iOS: [#1741](https://github.com/airbnb/react-native-maps/pull/1741) Fixed iOS google MapView.onMarkerPress not receiving the marker identifier
* iOS: [#1816](https://github.com/airbnb/react-native-maps/pull/1816) Fix The name of the given podspec ‘yoga' doesn't match the expected one ‘Yoga'
* iOS: [#1797](https://github.com/airbnb/react-native-maps/pull/1797) Fixed onMapReady event on iOS to resemble onMapReady on Android
* Common: [#1817](https://github.com/airbnb/react-native-maps/pull/1817) Allow fitToCoordinates to be called without options parameter

## 0.17.1 (October 18, 2017)
* Common: [#1687](https://github.com/airbnb/react-native-maps/pull/1687) Fixed TypeScript definitions

## 0.17.0 (October 11, 2017)
* iOS: [#1527](https://github.com/airbnb/react-native-maps/pull/1527) Added [iOS / Google Maps] support for showsIndoorLevelPicker
* iOS/Android: [#1544](https://github.com/airbnb/react-native-maps/pull/1544) Adds support to animateToBearing and animateToViewingAngle ( IOS + Android )
* JS: [#1503](https://github.com/airbnb/react-native-maps/pull/1503) Remove caret from "react": "^16.0.0-alpha.12
* Android: [#1521](https://github.com/airbnb/react-native-maps/pull/1521) Fix rare android crashes when map size is 0
* Common: [#1601](https://github.com/airbnb/react-native-maps/pull/1610) Added Typescript Definitions
* Android: [#1612](https://github.com/airbnb/react-native-maps/pull/1612) Remove legalNotice from android AirMapModule

## 0.16.4 (September 13, 2017)
* Android: [#1643](https://github.com/airbnb/react-native-maps/pull/1643) [MapMarker] fix android release crash on custom marker

## 0.16.3 (September 2, 2017)
* iOS: [#1603](https://github.com/airbnb/react-native-maps/pull/1603) Added missing satellite option for iOS Google Maps
* iOS: [#1579](https://github.com/airbnb/react-native-maps/pull/1579) Set initial region on view

## 0.16.2 (August 17, 2017)
* Android: [#1563](https://github.com/airbnb/react-native-maps/pull/#1563) Add missing native method for setting initial region
* iOS: [#1187](https://github.com/airbnb/react-native-maps/pull/1187) Reverted due to build issues

## 0.16.1 (August 15, 2017)
* Android: [#1428](https://github.com/airbnb/react-native-maps/pull/#1428) Add ability to load marker image from drawable
* iOS: [#1187](https://github.com/airbnb/react-native-maps/pull/1187) Improve marker performance
* iOS/Android: [#1458](https://github.com/airbnb/react-native-maps/pull/1458) Add Google Maps legalNotice constant
* JS: [#1546](https://github.com/airbnb/react-native-maps/pull/1546) Fix initial region native prop

## 0.16.0 (August 9, 2017)
* Android: [#1481](https://github.com/airbnb/react-native-maps/pull/1481) Handle Android RN 0.47 breaking change
* iOS: [#1357](https://github.com/airbnb/react-native-maps/pull/1357) add MKTileOverlayRenderer
* iOS: [#1369](https://github.com/airbnb/react-native-maps/pull/1369) Add onMapReady callback
* Android/iOS/JS: [#1360](https://github.com/airbnb/react-native-maps/pull/1360) Add minZoom and maxZoom properties for android and ios
* JS: [#1479](https://github.com/airbnb/react-native-maps/pull/1479) Fix timing function used in AnimatedRegion.spring

## 0.15.3 (June 27, 2017)

* iOS: [#1362](https://github.com/airbnb/react-native-maps/pull/1362) Updates for React 0.43-0.45 and React 16.
* JS: [#1323](https://github.com/airbnb/react-native-maps/pull/1323) Updates for React 0.43-0.45 and React 16.
* Android/iOS/JS: [#1440](https://github.com/airbnb/react-native-maps/pull/1440) Updates for React 0.43-0.45 and React 16.
* iOS: [#1115](https://github.com/airbnb/react-native-maps/pull/1115) Fix animateToCoordinate and animateToRegion
* Android: [#1403](https://github.com/airbnb/react-native-maps/pull/1403) Fix an NPE

## 0.15.2 (May 20, 2017)

* iOS: [#1351](https://github.com/airbnb/react-native-maps/pull/1351) Fix file references

## 0.15.1 (May 19, 2017)

* iOS: [#1341](https://github.com/airbnb/react-native-maps/pull/1341) Fix compile error in rn version >= 0.40
* iOS: [#1194](https://github.com/airbnb/react-native-maps/pull/1194) Add onPress support for Google Maps Polyline
* iOS: [#1326](https://github.com/airbnb/react-native-maps/pull/1326) Add Marker rotation for Google Maps on iOS
* Android: [#1311](https://github.com/airbnb/react-native-maps/pull/1311) Fix overlay issue
* Common [#1313](https://github.com/airbnb/react-native-maps/pull/1313) Fix Android sourceDir for react-native-link

## 0.15.0 (May 8, 2017)

* iOS: [#1195](https://github.com/airbnb/react-native-maps/pull/1195) Rename project file to fix iOS build error
* Android: Update Google Play Services to version `10.2.4`

## 0.14.0 (April 4, 2017)

## Enhancements

* Restructure project #1164

* Add showsIndoorLevelPicker -> setIndoorLevelPickerEnabled to MapView #1019
[#1188](https://github.com/airbnb/react-native-maps/pull/1188)

* iOS - Added onPress support for Polygons on Google Maps
[#1024](https://github.com/airbnb/react-native-maps/pull/1024)

*  Add customized user location annotation text
[#1049](https://github.com/airbnb/react-native-maps/pull/1049)

* iOS - Google Maps - Add `showsMyLocationButton` support
[#1157](https://github.com/airbnb/react-native-maps/pull/1157)


## Patches

* Fix getResources() null crash in mapview
[#1188](https://github.com/airbnb/react-native-maps/pull/1188)

* Rename MapKit category to avoid conflicts with the one in RN
[#1172](https://github.com/airbnb/react-native-maps/pull/1172)

* Upgrade GMS dependencies to 10.2.0
[#1169](https://github.com/airbnb/react-native-maps/pull/1169)

* fix multiple-instance memory leak
[#1130](https://github.com/airbnb/react-native-maps/pull/1130)

* fix onSelected event for markers with custom view
[#1079](https://github.com/airbnb/react-native-maps/pull/1079)

* Crash in our App fix
[#1096](https://github.com/airbnb/react-native-maps/pull/1096)

* Use local RCTConvert+MapKit instead of the one in React Native
[#1138](https://github.com/airbnb/react-native-maps/pull/1138)


## 0.13.1 (March 21, 2017)


## Enhancements

* Add id identifier to marker-press event on Android
[#1008](https://github.com/airbnb/react-native-maps/pull/1008)
  (@stan229)

* setNativeProps, marker opacity, nested components
[#940](https://github.com/airbnb/react-native-maps/pull/940)
  (@unboundfire)


## Patches

* Update the android buildToolsVersion to 25.0.0
[#1152](https://github.com/airbnb/react-native-maps/pull/1152)
  (@markusguenther)

* use `provided` for RN gradle dependency
[#1151](https://github.com/airbnb/react-native-maps/pull/1151)
  (@gpeal)

* fix null activity crash
[#1150](https://github.com/airbnb/react-native-maps/pull/1150)
  (@lelandrichardson)

* Updated Google play services and gradle build plugin
[#1023](https://github.com/airbnb/react-native-maps/pull/1023)
  (@chris-at-translate)

* Sets the map value for the AirMapUrlTile so that it can be updated properly
[#992](https://github.com/airbnb/react-native-maps/pull/992)
  (@jschloer)

* onPress and onCalloutPress doesn't trigger on markers in iOS
[#954](https://github.com/airbnb/react-native-maps/pull/954)
  (@RajkumarPunchh)



## 0.13.0 (January 6, 2017)

### Breaking Changes

* Update iOS header imports and JS SyntheticEvent import for RN 0.40
  [#923](https://github.com/airbnb/react-native-maps/pull/923)
  (@ide)

### Patches

* Fix issue where callouts sometimes overlap or don't appear
  [#936](https://github.com/airbnb/react-native-maps/pull/936)
  (@RajkumarPunchh)

## 0.12.3 (January 6, 2017)

### Patches

* Fix "Animating with MapViews" example – fixes #763
  [#888](https://github.com/airbnb/react-native-maps/pull/888)
  (@javiercr)
* [iOS] Fix "Option 2" method of building Google Maps
  [#900](https://github.com/airbnb/react-native-maps/pull/900)
  (@vjeranc)
* [Android] Fix exception when animating region during initialization
  [#901](https://github.com/airbnb/react-native-maps/pull/901)
  (@mlanter)
* Updated documentation
  [#902](https://github.com/airbnb/react-native-maps/pull/902),
  [#904](https://github.com/airbnb/react-native-maps/pull/904),
  [#910](https://github.com/airbnb/react-native-maps/pull/910)
  (@anami, @dboydor, @ali-alamine)


## 0.12.2 (December 9, 2016)

### Patches

* [Android] Added support for taking snapshots on Android
  [#625](https://github.com/airbnb/react-native-maps/pull/625)
  (@IjzerenHein)
* [iOS] Allow legalLabelInsets to be changed and animated
  [#873](https://github.com/airbnb/react-native-maps/pull/873)
  (@scarlac)
* Added rotation attribute documentation
  [#871](https://github.com/airbnb/react-native-maps/pull/871)
  (@Arman92)
* Update mapview.md documentation
  [#866](https://github.com/airbnb/react-native-maps/pull/866)
  (@dccarmo)


## 0.12.1 (December 6, 2016)

This release only corrects the version in package.json.

## 0.12.0 (December 6, 2016)

NOTE: This version was not published because package.json was not properly updated

### Breaking Changes

* [android] If we've disabled scrolling within the map, then don't capture the touch events
  [#664](https://github.com/airbnb/react-native-maps/pull/664)
  (@mikelambert)
* [android] Use latest Google Play Services
  [#731](https://github.com/airbnb/react-native-maps/pull/731)
  (@mlanter)
* [android] update google play services
  [#805](https://github.com/airbnb/react-native-maps/pull/805)
  (@lrivera)

### Patches

* [iOS] Support iOS SDK < 10 ( XCode < 8 )
  [#708](https://github.com/airbnb/react-native-maps/pull/708)
  (@rops)
* [iOS] Added showsUserLocation property support for Google Maps
  [#721](https://github.com/airbnb/react-native-maps/pull/721)
  (@julien-rodrigues)
* [iOS] Added Google Maps Circle, Polygon, Polyline, MapType Support
  [#722](https://github.com/airbnb/react-native-maps/pull/722)
  (@unboundfire)
* [iOS] Fix Anchor point on Google Maps iOS
  [#734](https://github.com/airbnb/react-native-maps/pull/734)
  (@btoueg)
* [Google Maps iOS] Marker init with image props.
  [#738](https://github.com/airbnb/react-native-maps/pull/738)
  (@btoueg)
* [iOS] Fix dynamic imageSrc removal
  [#737](https://github.com/airbnb/react-native-maps/pull/737)
  (@btoueg)
* [iOS] implement fitToSuppliedMarkers and fitToCoordinates for google
  [#750](https://github.com/airbnb/react-native-maps/pull/750)
  (@gilbox)
* [iOS][android] Add onPress for polygons and polylines on iOS and Android
  [#760](https://github.com/airbnb/react-native-maps/pull/760)
  (@frankrowe)
* [iOS] Fix flicker of map pins on state change
  [#728](https://github.com/airbnb/react-native-maps/pull/728)
  (@mlanter)
* [iOS] Set region only when view has width&height
  [#785](https://github.com/airbnb/react-native-maps/pull/785)
  (@gilbox)
* [iOS] Implements animateToRegion for Google
  [#779](https://github.com/airbnb/react-native-maps/pull/779)
  (@btoueg)
* [iOS] Google Maps Custom Tile Support
  [#770](https://github.com/airbnb/react-native-maps/pull/770)
  (@unboundfire)
* [android] Map Styling for android
  [#808](https://github.com/airbnb/react-native-maps/pull/808)
  (@ali-alamine using @azt3k code)
* [iOS] IOS Google Map styling
  [#817](https://github.com/airbnb/react-native-maps/pull/817)
  (@ali-alamine using @azt3k code)
* [iOS] Add support for polygon holes for Apple Maps and Google Maps on iOS
  [#801](https://github.com/airbnb/react-native-maps/pull/801)
  (@therealgilles)
* [iOS] Fixes #470. Support legalLabelInsets on Apple Maps
  [#840](https://github.com/airbnb/react-native-maps/pull/840)
  (@scarlac)

## 0.11.0 (October 16, 2016)

NOTE: `0.10.4` was released *after* this version, and it's possible
`0.11.0` does not include everything in `0.10.4`. (see #851)

### Breaking Changes

* Update example app for RN 0.35, fix Gmaps bug for 0.35
  [#695](https://github.com/airbnb/react-native-maps/pull/695)
  (@spikebrehm)
* Upgraded to RN 0.35
  [#680](https://github.com/airbnb/react-native-maps/pull/680)
  (@eugenehp)

### Patches

* Update installation.md
  [#696](https://github.com/airbnb/react-native-maps/pull/696)
  (@securingsincity)
* [android] Fixes crash during Activity onPause()
  [#694](https://github.com/airbnb/react-native-maps/pull/694)
  (@felipecsl)
* Included MapUrlTile usage in README.md
  [#687](https://github.com/airbnb/react-native-maps/pull/687)
  (@ochanje210)
* [android] Add parameter to disable the moving on marker press
  [#676](https://github.com/airbnb/react-native-maps/pull/676)
  (@mlanter)
* Add support for setting zIndex on markers
  [#675](https://github.com/airbnb/react-native-maps/pull/675)
  (@mlanter)

## 0.10.4 (October 31, 2016)

### Patches

* [iOS] implement fitToSuppliedMarkers and fitToCoordinates for google maps
  [#750](https://github.com/airbnb/react-native-maps/pull/750)
  (@gilbox)
* [android] If we've disabled scrolling within the map, then don't capture the touch events
  [#664](https://github.com/airbnb/react-native-maps/pull/664)
  (@mikelambert)
* [iOS] Fix Anchor point on Google Maps iOS
  [#734](https://github.com/airbnb/react-native-maps/pull/734)
  (@btoueg)
* [iOS] Added showsUserLocation property support for Google Maps
  [#721](https://github.com/airbnb/react-native-maps/pull/721)
  (@julien-rodrigues)
* [iOS][android] Add support for setting zIndex on markers
  [#675](https://github.com/airbnb/react-native-maps/pull/675)
  (@mlanter)
* [android] Add parameter to disable the moving on marker press
  [#676](https://github.com/airbnb/react-native-maps/pull/676)
  (@mlanter)
* NOTE: v0.10.3 was not published

## 0.10.2 (October 19, 2016)

### Patches

* [android] Fixes crash during Activity onPause() (fixes #414)
  [#694](https://github.com/airbnb/react-native-maps/pull/694)
  (@felipecsl)

## 0.10.1 (October 10, 2016)

This release fixes issue [#656](https://github.com/airbnb/react-native-maps/issues/656)

### Patches

* [android] fix gradle build setup for explorer, bump to gradle 2.2.0
  [#666](https://github.com/airbnb/react-native-maps/pull/666)
  (@gilbox)
* [android] fix getAirMapName to fix ref-based commands
  [#665](https://github.com/airbnb/react-native-maps/pull/665)
  (@gilbox)

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

This error is caused by a @providesModule declaration with the same name across two different files.
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
