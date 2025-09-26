// @ts-nocheck
import type {HostComponent, ViewProps, ColorValue} from 'react-native';

import {codegenNativeComponent, codegenNativeCommands} from 'react-native';
import type {
  Double,
  Int32,
  WithDefault,
  Float,
  DirectEventHandler,
  BubblingEventHandler,
} from 'react-native/Libraries/Types/CodegenTypes';
import GoogleMapView from './NativeComponentGoogleMapView';

export type EdgePadding = Readonly<{
  top: Double; // Non-nullable Double for top
  right: Double; // Non-nullable Double for right
  bottom: Double; // Non-nullable Double for bottom
  left: Double; // Non-nullable Double for left
}>;

export type ActionType =
  | 'callout-press'
  | 'press'
  | 'marker-press'
  | 'long-press'
  | 'marker-deselect'
  | 'marker-select';

export type Frame = Readonly<{
  x: Double;
  y: Double;
  width: Double;
  height: Double;
}>;

export type ClickEvent = BubblingEventHandler<
  Readonly<{
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position: {
      x: Double; // Inlined Point
      y: Double;
    };
  }>
>;

export type KmlMarker = {
  id: string; // Non-nullable string
  title: string; // Non-nullable string
  description: string; // Non-nullable string
  coordinate: {
    latitude: Double; // Inlined LatLng
    longitude: Double;
  }; // Non-nullable LatLng
  position: {
    x: Double; // Inlined Point
    y: Double;
  }; // Non-nullable Point
};

export type LongPressEventHandler = BubblingEventHandler<
  Readonly<{
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position: {
      x: Double; // Inlined Point
      y: Double;
    };
    action?: string;
  }>
>;

export type MarkerDeselectEventHandler = BubblingEventHandler<
  Readonly<{
    action?: string;
    id: string;
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
  }>
>;

export type MarkerSelectEventHandler = BubblingEventHandler<
  Readonly<{
    action?: string;
    id: string;
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
  }>
>;

export type CalloutPressEvent = BubblingEventHandler<{
  action?: string;

  /**
   * @platform iOS
   */
  frame?: {
    x: Double;
    y: Double;
    width: Double;
    height: Double;
  };

  /**
   * @platform iOS
   */
  id?: string;

  /**
   * @platform iOS
   */
  point?: {
    x: Double; // Non-nullable Double for x
    y: Double; // Non-nullable Double for y
  };

  /**
   * @platform Android
   */
  coordinate?: {
    latitude: Double; // Non-nullable Double for latitude
    longitude: Double; // Non-nullable Double for longitude
  };

  /**
   * @platform Android
   */
  position?: {
    x: Double; // Non-nullable Double for x
    y: Double; // Non-nullable Double for y
  };
}>;

export type CalloutPressEventHandler = DirectEventHandler<CalloutPressEvent>;

export type Camera = Readonly<{
  /**
   * Apple Maps
   */
  altitude?: Double; // Nullable Double for altitude
  center: LatLng; // Non-nullable center
  heading: Double; // Non-nullable Double for heading
  pitch: Double; // Non-nullable Double for pitch

  /**
   * Google Maps
   */
  zoom?: Float; // Nullable Double for zoom
}>;

export type LatLng = Readonly<{
  latitude: Double; // Non-nullable Double for latitude
  longitude: Double; // Non-nullable Double for longitude
}>;

export type Point = Readonly<{
  x: Double; // Non-nullable Double for x
  y: Double; // Non-nullable Double for y
}>;

export type Region = Readonly<
  LatLng & {
    latitudeDelta: Double; // Non-nullable Double for latitudeDelta
    longitudeDelta: Double; // Non-nullable Double for longitudeDelta
  }
>;

export type IndoorLevel = Readonly<{
  index: Int32; // Int32 for integers
  name: string; // Non-nullable string
  shortName: string; // Non-nullable string
}>;

export type IndoorLevelActivatedEventHandler = DirectEventHandler<
  Readonly<{
    activeLevelIndex: Int32; // Int32 for integers
    name: string; // Non-nullable string
    shortName: string; // Non-nullable string
  }>
>;

export type IndoorBuilding = Readonly<{
  underground: boolean; // Non-nullable boolean
  activeLevelIndex: Int32; // Int32 for integers
  levels: ReadonlyArray<IndoorLevel>; // Immutable array of IndoorLevel
}>;

export type IndoorBuildingEventHandler = DirectEventHandler<
  Readonly<{
    underground: boolean; // Non-nullable boolean
    activeLevelIndex: Int32; // Int32 for integers
    levels: string; // Immutable array of IndoorLevel
  }>
>;

export type KmlMapEventHandler = DirectEventHandler<Readonly<{}>>;

export type MapLoadedEventHandler = DirectEventHandler<Readonly<{}>>;

export type MapReadyEventHandler = DirectEventHandler<Readonly<{}>>;

export type Details = Readonly<{
  isGesture?: boolean; // Optional boolean for gesture detail
}>;

export type MarkerDragEventHandler = BubblingEventHandler<
  Readonly<{
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position: {
      x: Double; // Inlined Point
      y: Double;
    };
    id?: string; // Optional id for iOS
  }>
>;

export type MarkerDragStartEndEventHandler = BubblingEventHandler<
  Readonly<{
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    id?: string; // Optional id for iOS
    position?: {
      x: Double; // Inlined Point
      y: Double;
    }; // Optional position for Android
  }>
>;

export type MarkerPressEventHandler = BubblingEventHandler<
  Readonly<{
    action?: string;
    id: string;
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position?: {
      x: Double; // Inlined Point
      y: Double;
    }; // Optional position for Android
  }>
>;

export type PanDragEventHandler = BubblingEventHandler<
  Readonly<{
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position: {
      x: Double; // Inlined Point
      y: Double;
    };
  }>
>;

export type PoiClickEventHandler = BubblingEventHandler<
  Readonly<{
    placeId: string;
    name: string;
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position?: {
      x: Double; // Inlined Point
      y: Double;
    }; // Optional position for Android
  }>
>;

export type MapPressEventHandler = BubblingEventHandler<
  Readonly<{
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position: {
      x: Double; // Inlined Point
      y: Double;
    };
    action?: string;
  }>
>;

export type RegionChangeStartEventHandler = DirectEventHandler<Details>;

export type RegionChangeEvent = Readonly<{
  region: {
    latitude: Double; // Non-nullable Double for latitude
    longitude: Double;
    latitudeDelta: Double; // Non-nullable Double for latitudeDelta
    longitudeDelta: Double; // Non-nullable Double for longitudeDelta
  }; // The region object
  isGesture?: boolean;
}>;

export type RegionChangeEventHandler = BubblingEventHandler<RegionChangeEvent>;

export type UserLocationChangeEvent = Readonly<{
  coordinate?: {
    latitude: Double; // Non-nullable Double for latitude
    longitude: Double;
    altitude: Double; // Use Double for numeric values
    timestamp: Double;
    accuracy: Float;
    speed: Float;
    heading: Float;

    /**
     * @platform iOS
     */
    altitudeAccuracy?: Float; // Optional altitude accuracy

    /**
     * @platform Android
     */
    isFromMockProvider?: boolean; // Optional boolean for mock provider
  };

  /**
   * @platform iOS
   */
  error?: Readonly<{
    message: string; // Error message as string
  }>;
}>;

export type UserLocationChangeEventHandler =
  DirectEventHandler<UserLocationChangeEvent>;

export type CameraZoomRange = Readonly<{
  minCenterCoordinateDistance?: Double; // Use Double for numeric values
  maxCenterCoordinateDistance?: Double; // Use Double for numeric values
  animated?: boolean; // Non-nullable boolean
}>;

export interface MapFabricNativeProps extends ViewProps {
  /**
   * The camera view the map should display.
   *
   * Use the camera system, instead of the region system, if you need control over
   * the pitch or heading. Using this will ignore the `region` property.
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  camera?: Camera;

  /**
   * The initial camera view the map should use.  Use this prop instead of `camera`
   * only if you don't want to control the camera of the map besides the initial view.
   *
   * Use the camera system, instead of the region system, if you need control over
   * the pitch or heading.
   *
   * Changing this prop after the component has mounted will not result in a camera change.
   *
   * This is similar to the `initialValue` prop of a text input.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  initialCamera?: Camera;

  /**
   * The initial region to be displayed by the map.  Use this prop instead of `region`
   * only if you don't want to control the viewport of the map besides the initial region.
   *
   * Changing this prop after the component has mounted will not result in a region change.
   *
   * This is similar to the `initialValue` prop of a text input.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  initialRegion?: Region;

  /**
   * The URL for KML file.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  kmlSrc?: string;

  /**
   * https://developers.google.com/maps/documentation/get-map-id
   * google cloud mapId to enable cloud styling and more
   */
  googleMapId?: string;

  /**
   * Sets loading background color.
   *
   * @default `#FFFFFF`
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  loadingBackgroundColor?: ColorValue;

  /**
   * Adds custom padding to each side of the map. Useful when map elements/markers are obscured.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  mapPadding?: EdgePadding;

  /**
   * The map type to be displayed
   *
   * @default `standard`
   * @platform iOS: hybrid | mutedStandard | satellite | standard | terrain | hybridFlyover | satelliteFlyover
   * @platform Android: hybrid | none | satellite | standard | terrain
   */
  mapType?: WithDefault<
    | 'hybrid'
    | 'mutedStandard'
    | 'none'
    | 'satellite'
    | 'standard'
    | 'terrain'
    | 'satelliteFlyover'
    | 'hybridFlyover',
    'standard'
  >;

  /**
   * Maximum zoom value for the map, must be between 0 and 20
   *
   * @default 20
   * @platform iOS: Supported
   * @platform Android: Supported
   * @deprecated on Apple Maps, use `cameraZoomRange` instead
   */
  maxZoom?: Float;

  /**
   * Minimum zoom value for the map, must be between 0 and 20
   *
   * @default 0
   * @platform iOS: Supported
   * @platform Android: Supported
   * @deprecated on Apple Maps, use `cameraZoomRange` instead
   */
  minZoom?: Float;

  /**
   * Callback that is called when an indoor building is focused/unfocused
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onIndoorBuildingFocused?: IndoorBuildingEventHandler;

  /**
   * Callback that is called when a level on indoor building is activated
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onIndoorLevelActivated?: IndoorLevelActivatedEventHandler;

  /**
   * Callback that is called once the kml is fully loaded.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onKmlReady?: KmlMapEventHandler;

  /**
   * Callback that is called when user makes a "long press" somewhere on the map.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onLongPress?: LongPressEventHandler;

  /**
   * Callback that is called when the map has finished rendering all tiles.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onMapLoaded?: MapLoadedEventHandler;

  /**
   * Callback that is called once the map is ready.
   *
   * Event is optional, as the first onMapReady callback is intercepted
   * on Android, and the event is not passed on.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onMapReady?: MapReadyEventHandler;

  /**
   * Callback that is called when a marker on the map becomes deselected.
   * This will be called when the callout for that marker is about to be hidden.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onMarkerDeselect?: MarkerDeselectEventHandler;

  /**
   * Callback called continuously as a marker is dragged
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onMarkerDrag?: MarkerDragEventHandler;

  /**
   * Callback that is called when a drag on a marker finishes.
   * This is usually the point you will want to setState on the marker's coordinate again
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onMarkerDragEnd?: MarkerDragStartEndEventHandler;

  /**
   * Callback that is called when the user initiates a drag on a marker (if it is draggable)
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onMarkerDragStart?: MarkerDragStartEndEventHandler;

  /**
   * Callback that is called when a marker on the map is tapped by the user.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onMarkerPress?: MarkerPressEventHandler;

  /**
   * Callback that is called when a marker on the map becomes selected.
   * This will be called when the callout for that marker is about to be shown.
   *
   * @platform iOS: Supported.
   * @platform Android: Supported
   */
  onMarkerSelect?: MarkerSelectEventHandler;

  /**
   * Callback that is called when user presses and drags the map.
   * **NOTE**: for iOS `scrollEnabled` should be set to false to trigger the event
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onPanDrag?: PanDragEventHandler;

  /**
   * Callback that is called when user click on a POI.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onPoiClick?: PoiClickEventHandler;

  /**
   * Callback that is called when user taps on the map.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onPress?: MapPressEventHandler;

  /**
   * Callback that is called once before the region changes, such as when the user starts moving the map.
   * `isGesture` property indicates if the move was from the user (true) or an animation (false).
   * **Note**: `isGesture` is supported by Google Maps only.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onRegionChangeStart?: RegionChangeEventHandler;

  /**
   * Callback that is called continuously when the region changes, such as when a user is dragging the map.
   * `isGesture` property indicates if the move was from the user (true) or an animation (false).
   * **Note**: `isGesture` is supported by Google Maps only.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onRegionChange?: RegionChangeEventHandler;

  /**
   * Callback that is called once when the region changes, such as when the user is done moving the map.
   * `isGesture` property indicates if the move was from the user (true) or an animation (false).
   * **Note**: `isGesture` is supported by Google Maps only.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onRegionChangeComplete?: RegionChangeEventHandler;

  /**
   * Callback that is called when the underlying map figures our users current location
   * (coordinate also includes isFromMockProvider value for Android API 18 and above).
   * Make sure **showsUserLocation** is set to *true*.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onUserLocationChange?: UserLocationChangeEventHandler;

  /**
   * Indicates how/when to affect padding with safe area insets
   *
   * @platform iOS: Google Maps only
   * @platform Android: Not supported
   */
  paddingAdjustmentBehavior?: WithDefault<
    'always' | 'automatic' | 'never',
    'never'
  >;

  /**
   * If `false` the user won't be able to adjust the camera’s pitch angle.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  pitchEnabled?: WithDefault<boolean, true>;

  /**
   * The region to be displayed by the map.
   * The region is defined by the center coordinates and the span of coordinates to display.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  region?: Region;

  /**
   * If `false` the user won't be able to adjust the camera’s pitch angle.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  rotateEnabled?: WithDefault<boolean, true>;

  /**
   * If `false` the map will stay centered while rotating or zooming.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  scrollDuringRotateOrZoomEnabled?: WithDefault<boolean, true>;

  /**
   * If `false` the user won't be able to change the map region being displayed.
   *
   * @default true
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  scrollEnabled?: WithDefault<boolean, true>;

  /**
   * A Boolean indicating whether the map displays extruded building information.
   *
   * @default true
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  showsBuildings?: WithDefault<boolean, true>;

  /**
   * If `false` compass won't be displayed on the map.
   *
   * @default true
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  showsCompass?: boolean;

  /**
   * A Boolean indicating whether indoor level picker should be enabled.
   *
   * @default false
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  showsIndoorLevelPicker?: boolean;

  /**
   * A Boolean indicating whether indoor maps should be enabled.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  showsIndoors?: WithDefault<boolean, true>;

  /**
   * If `false` hide the button to move the map to the current user's location.
   *
   * @default false
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  showsMyLocationButton?: boolean;

  /**
   * A Boolean indicating whether the map shows scale information.
   *
   * @default true
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  showsScale?: boolean;

  /**
   * A Boolean value indicating whether the map displays traffic information.
   *
   * @default false
   * @platform iOS: Supported
   * @platform Android: Not supported?
   */
  showsTraffic?: boolean;

  /**
   * If `true` the users location will be displayed on the map.
   *
   * This will cause iOS to ask for location permissions.
   * For iOS see: [DOCS](https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md#set-the-usage-description-property)
   * @default false
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  showsUserLocation?: boolean;

  /**
   * Sets the map to the style selected.
   *
   * @default System setting
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  userInterfaceStyle?: WithDefault<'system' | 'light' | 'dark', 'system'>;

  /**
   * Adds custom styling to the map component.
   * See [README](https://github.com/react-native-maps/react-native-maps#customizing-the-map-style) for more information.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  customMapStyleString?: string;

  /**
   * If `true` clicking user location will show the default callout for userLocation annotation.
   *
   * @default false
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  userLocationCalloutEnabled?: boolean;

  /**
   * Fastest interval the application will actively acquire locations.
   *
   * See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html)
   *
   * @default 5000
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  userLocationFastestInterval?: Int32;

  /**
   * Set power priority of user location tracking.
   *
   * See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html)
   *
   * @default `high`
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  userLocationPriority?: WithDefault<
    'balanced' | 'high' | 'low' | 'passive',
    'high'
  >;

  /**
   * Interval of user location updates in milliseconds.
   *
   * See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html)
   *
   * @default 5000
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  userLocationUpdateInterval?: Int32;

  /**
   * If `false` the zoom control at the bottom right of the map won't be visible.
   *
   * @default true
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  zoomControlEnabled?: boolean;

  /**
   * If `false` the user won't be able to pinch/zoom the map.
   *
   * TODO: Why is the Android reactprop defaultvalue set to false?
   *
   * @default true
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  zoomEnabled?: WithDefault<boolean, true>;

  /**
   * If `false` the user won't be able to double tap to zoom the map.
   * **Note:** But it will greatly decrease delay of tap gesture recognition.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Not supported
   */
  zoomTapEnabled?: WithDefault<boolean, true>;
}

interface NativeCommands {
  animateToRegion: (
    viewRef: React.ElementRef<typeof GoogleMapView>,
    regionJSON: string,
    duration: Int32,
  ) => void;

  setCamera: (
    viewRef: React.ElementRef<typeof GoogleMapView>,
    cameraJSON: string,
  ) => void;

  animateCamera: (
    viewRef: React.ElementRef<typeof GoogleMapView>,
    cameraJSON: string,
    duration: Int32,
  ) => void;

  fitToElements: (
    viewRef: React.ElementRef<typeof GoogleMapView>,
    edgePaddingJSON: string,
    animated: boolean,
  ) => void;

  fitToSuppliedMarkers: (
    viewRef: React.ElementRef<typeof GoogleMapView>,
    markersJSON: string,
    edgePaddingJSON: string,
    animated: boolean,
  ) => void;

  fitToCoordinates: (
    viewRef: React.ElementRef<typeof GoogleMapView>,
    coordinatesJSON: string,
    edgePaddingJSON: string,
    animated: boolean,
  ) => void;
  setIndoorActiveLevelIndex: (
    viewRef: React.ElementRef<typeof GoogleMapView>,
    activeLevelIndex: Int32,
  ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: [
    'animateToRegion',
    'setCamera',
    'animateCamera',
    'fitToElements',
    'fitToSuppliedMarkers',
    'fitToCoordinates',
    'setIndoorActiveLevelIndex',
  ],
});

export default codegenNativeComponent<MapFabricNativeProps>(
  'RNMapsGoogleMapView',
  {
    excludedPlatforms: ['android'],
  },
) as HostComponent<MapFabricNativeProps>;
