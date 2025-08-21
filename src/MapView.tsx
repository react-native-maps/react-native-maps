import * as React from 'react';
import {
  Animated as RNAnimated,
  Animated,
  findNodeHandle,
  Platform,
  requireNativeComponent,
  type HostComponent,
  type NativeSyntheticEvent,
  type ViewProps,
} from 'react-native';
import {
  createNotSupportedComponent,
  ProviderContext,
  type NativeComponent,
} from './decorateMapComponent';
import type {
  CalloutPressEvent,
  ClickEvent,
  Frame,
  LatLng,
  MarkerDeselectEvent,
  MarkerDragEvent,
  MarkerDragStartEndEvent,
  MarkerPressEvent,
  MarkerSelectEvent,
  Point,
  Provider,
  Region,
  MKPointOfInterestCategoryType,
} from './sharedTypes';
import type {
  ActiveIndoorLevel,
  Address,
  BoundingBox,
  Camera,
  CameraZoomRange,
  ChangeEvent,
  Details,
  EdgePadding,
  FitToOptions,
  IndoorBuilding,
  KmlMapEvent,
  LongPressEvent,
  MapPressEvent,
  MapStyleElement,
  MapType,
  MapTypes,
  PanDragEvent,
  PoiClickEvent,
  SnapshotOptions,
  UserLocationChangeEvent,
} from './MapView.types';
import type {Modify} from './sharedTypesInternal';
import {
  Commands,
  type MapViewNativeComponentType,
} from './MapViewNativeComponent';

import FabricMapView, {
  Commands as FabricCommands,
  type MapFabricNativeProps,
} from './specs/NativeComponentMapView';
import GoogleMapView, {
  Commands as GoogleCommands,
} from './specs/NativeComponentGoogleMapView';
import createFabricMap, {type FabricMapHandle} from './createFabricMap';

const FabricMap = createFabricMap(FabricMapView, FabricCommands);
var FabricGoogleMap: any = null;
if (Platform.OS === 'ios') {
  FabricGoogleMap = createFabricMap(GoogleMapView, GoogleCommands);
}
import AnimatedRegion from './AnimatedRegion';

export const MAP_TYPES: MapTypes = {
  STANDARD: 'standard',
  SATELLITE: 'satellite',
  HYBRID: 'hybrid',
  TERRAIN: 'terrain',
  NONE: 'none',
  MUTEDSTANDARD: 'mutedStandard',
  SATELLITE_FLYOVER: 'satelliteFlyover',
  HYBRID_FLYOVER: 'hybridFlyover',
};

export type MapViewProps = ViewProps & {
  /**
   * If `true` map will be cached and displayed as an image instead of being interactable, for performance usage.
   *
   * @default false
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  cacheEnabled?: boolean;

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
   * If set, changes the position of the compass.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  compassOffset?: Point;

  /**
   * Adds custom styling to the map component.
   * See [README](https://github.com/react-native-maps/react-native-maps#customizing-the-map-style) for more information.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  customMapStyle?: MapStyleElement[];

  /**
   * If `true` the map will focus on the user's location.
   * This only works if `showsUserLocation` is true and the user has shared their location.
   *
   * @default false
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  followsUserLocation?: boolean;

  /**
   * If `false` the map will not capture PoI clicks
   * This can improve click handling on the map for android
   *
   * @default true
   * @platform iOS: Not supported
   * @platform Android: supported
   */
  poiClickEnabled?: boolean;

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
   * If set, changes the position of the "Legal" label link in Apple Maps.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  legalLabelInsets?: EdgePadding;

  /**
   * Enables lite mode on Android
   *
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  liteMode?: boolean;

  /**
   * https://developers.google.com/maps/documentation/get-map-id
   * google cloud mapId to enable cloud styling and more
   */
  googleMapId?: string;

  /**
   * https://developers.google.com/maps/documentation/android-sdk/renderer
   * google maps renderer
   * @default `LATEST`
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  googleRenderer?: 'LATEST' | 'LEGACY';

  /**
   * Sets loading background color.
   *
   * @default `#FFFFFF`
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  loadingBackgroundColor?: string;

  /**
   * If `true` a loading indicator will show while the map is loading.
   *
   * @default false
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  loadingEnabled?: boolean;

  /**
   * Sets loading indicator color.
   *
   * @default `#606060`
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  loadingIndicatorColor?: string;

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
  mapType?: MapType;

  /**
   * TODO: Add documentation
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  maxDelta?: number;

  /**
   * Maximum zoom value for the map, must be between 0 and 20
   *
   * @default 20
   * @platform iOS: Supported
   * @platform Android: Supported
   * @deprecated on Apple Maps, use `cameraZoomRange` instead
   */
  maxZoomLevel?: number;

  /**
   * TODO: Add documentation
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  minDelta?: number;

  /**
   * Minimum zoom value for the map, must be between 0 and 20
   *
   * @default 0
   * @platform iOS: Supported
   * @platform Android: Supported
   * @deprecated on Apple Maps, use `cameraZoomRange` instead
   */
  minZoomLevel?: number;

  /**
   * If `false` the map won't move to the marker when pressed.
   *
   * @default true
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  moveOnMarkerPress?: boolean;

  /**
   * Callback that is called when a callout is tapped by the user.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onCalloutPress?: (event: CalloutPressEvent) => void;

  /**
   * Callback that is called when user double taps on the map.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onDoublePress?: (event: ClickEvent) => void;

  /**
   * Callback that is called when an indoor building is focused/unfocused
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onIndoorBuildingFocused?: (indoorBuilding: IndoorBuilding) => void;

  /**
   * Callback that is called when a level on indoor building is activated
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onIndoorLevelActivated?: (indoorLevel: ActiveIndoorLevel) => void;

  /**
   * Callback that is called once the kml is fully loaded.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onKmlReady?: (event: KmlMapEvent) => void;

  /**
   * Callback that is called when user makes a "long press" somewhere on the map.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onLongPress?: (event: LongPressEvent) => void;

  /**
   * Callback that is called when the map has finished rendering all tiles.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onMapLoaded?: (event: NativeSyntheticEvent<null>) => void;

  /**
   * Callback that is called once the map is ready.
   *
   * Event is optional, as the first onMapReady callback is intercepted
   * on Android, and the event is not passed on.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onMapReady?: (event?: NativeSyntheticEvent<null>) => void;

  /**
   * Callback that is called when a marker on the map becomes deselected.
   * This will be called when the callout for that marker is about to be hidden.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onMarkerDeselect?: (event: MarkerDeselectEvent) => void;

  /**
   * Callback called continuously as a marker is dragged
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onMarkerDrag?: (event: MarkerDragEvent) => void;

  /**
   * Callback that is called when a drag on a marker finishes.
   * This is usually the point you will want to setState on the marker's coordinate again
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onMarkerDragEnd?: (event: MarkerDragStartEndEvent) => void;

  /**
   * Callback that is called when the user initiates a drag on a marker (if it is draggable)
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onMarkerDragStart?: (event: MarkerDragStartEndEvent) => void;

  /**
   * Callback that is called when a marker on the map is tapped by the user.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onMarkerPress?: (event: MarkerPressEvent) => void;

  /**
   * Callback that is called when a marker on the map becomes selected.
   * This will be called when the callout for that marker is about to be shown.
   *
   * @platform iOS: Supported.
   * @platform Android: Supported
   */
  onMarkerSelect?: (event: MarkerSelectEvent) => void;

  /**
   * Callback that is called when user presses and drags the map.
   * **NOTE**: for iOS `scrollEnabled` should be set to false to trigger the event
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onPanDrag?: (event: PanDragEvent) => void;

  /**
   * Callback that is called when user click on a POI.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onPoiClick?: (event: PoiClickEvent) => void;

  /**
   * Callback that is called when user taps on the map.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onPress?: (event: MapPressEvent) => void;

  /**
   * Callback that is called once before the region changes, such as when the user starts moving the map.
   * `isGesture` property indicates if the move was from the user (true) or an animation (false).
   * **Note**: `isGesture` is supported by Google Maps only.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onRegionChangeStart?: (region: Region, details: Details) => void;

  /**
   * Callback that is called continuously when the region changes, such as when a user is dragging the map.
   * `isGesture` property indicates if the move was from the user (true) or an animation (false).
   * **Note**: `isGesture` is supported by Google Maps only.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onRegionChange?: (region: Region, details: Details) => void;

  /**
   * Callback that is called once when the region changes, such as when the user is done moving the map.
   * `isGesture` property indicates if the move was from the user (true) or an animation (false).
   * **Note**: `isGesture` is supported by Google Maps only.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onRegionChangeComplete?: (region: Region, details: Details) => void;

  /**
   * Callback that is called when the underlying map figures our users current location
   * (coordinate also includes isFromMockProvider value for Android API 18 and above).
   * Make sure **showsUserLocation** is set to *true*.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onUserLocationChange?: (event: UserLocationChangeEvent) => void;

  /**
   * Indicates how/when to affect padding with safe area insets
   *
   * @platform iOS: Google Maps only
   * @platform Android: Not supported
   */
  paddingAdjustmentBehavior?: 'always' | 'automatic' | 'never';

  /**
   * If `false` the user won't be able to adjust the camera’s pitch angle.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  pitchEnabled?: boolean;

  /**
   * The map framework to use.
   * Either `"google"` for GoogleMaps, otherwise `undefined` to use the native map framework (`MapKit` in iOS and `GoogleMaps` in android).
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  provider?: Provider;

  /**
   * The region to be displayed by the map.
   * The region is defined by the center coordinates and the span of coordinates to display.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  region?: Region | AnimatedRegion;

  /**
   * If `false` the user won't be able to adjust the camera’s pitch angle.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  rotateEnabled?: boolean;

  /**
   * If `false` the map will stay centered while rotating or zooming.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  scrollDuringRotateOrZoomEnabled?: boolean;

  /**
   * If `false` the user won't be able to change the map region being displayed.
   *
   * @default true
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  scrollEnabled?: boolean;

  /**
   * A Boolean indicating whether the map displays extruded building information.
   *
   * @default true
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  showsBuildings?: boolean;

  /**
   * If `false` compass is not displayed on the map.
   *
   * @default true
   * @platform iOS: Supported (adaptive, visible only if the map is not pointing north)
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
  showsIndoors?: boolean;

  /**
   * If `false` hide the button to move map to the current user's location.
   *
   * @default false
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  showsMyLocationButton?: boolean;

  /**
   * A Boolean indicating whether points of interest should be displayed.
   * Use `pointsOfInterestFilter` for more granular control.
   * @see pointsOfInterestFilter
   */
  showsPointsOfInterests?: boolean;

  /**
   * An array of category strings to show on the map.
   * If this is set, it takes precedence over `showsPointsOfInterests`.
   * @see showsPointsOfInterests
   */
  pointsOfInterestFilter?: MKPointOfInterestCategoryType[];

  /**
   * A Boolean indicating whether the map shows scale information.
   *
   * @default false
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  showsScale?: boolean;

  /**
   * A Boolean value indicating whether the map displays traffic information.
   *
   * @default false
   * @platform iOS: Supported
   * @platform Android: Supported
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
   * Sets the tint color of the map. (Changes the color of the position indicator)
   *
   * @default System Blue
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  tintColor?: string;

  /**
   * If `false` will hide 'Navigate' and 'Open in Maps' buttons on marker press
   *
   * @default true
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  toolbarEnabled?: boolean;

  /**
   * Sets the map to the style selected.
   *
   * @default System setting
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  userInterfaceStyle?: 'light' | 'dark';

  /**
   * The title of the annotation for current user location.
   *
   * This only works if `showsUserLocation` is true.
   *
   * @default `My Location`
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  userLocationAnnotationTitle?: string;

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
  userLocationFastestInterval?: number;

  /**
   * Set power priority of user location tracking.
   *
   * See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html)
   *
   * @default `high`
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  userLocationPriority?: 'balanced' | 'high' | 'low' | 'passive';

  /**
   * Interval of user location updates in milliseconds.
   *
   * See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html)
   *
   * @default 5000
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  userLocationUpdateInterval?: number;

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
  zoomEnabled?: boolean;

  /**
   * If `false` the user won't be able to double tap to zoom the map.
   * **Note:** But it will greatly decrease delay of tap gesture recognition.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Not supported
   */
  zoomTapEnabled?: boolean;

  /**
   * Map camera distance limits. `minCenterCoordinateDistance` for minimum distance, `maxCenterCoordinateDistance` for maximum.
   * `animated` for animated zoom changes.
   * Takes precedence if conflicting with `minZoomLevel`, `maxZoomLevel`.
   *
   * @platform iOS: 13.0+
   * @platform Android: Not supported
   */
  cameraZoomRange?: CameraZoomRange;
};

type ModifiedProps = Modify<
  MapViewProps,
  {
    region?: MapViewProps['region'] | null;
    initialRegion?: MapViewProps['initialRegion'] | null;
  }
>;

export type NativeProps = Omit<
  ModifiedProps,
  'customMapStyle' | 'onRegionChange' | 'onRegionChangeComplete'
> & {
  ref: React.RefObject<MapViewNativeComponentType | null>;
  customMapStyleString?: string;
  handlePanDrag?: boolean;
  onChange?: (e: ChangeEvent) => void;
};

type State = {
  isReady: boolean;
};

class MapView extends React.Component<MapViewProps, State> {
  static Animated: Animated.AnimatedComponent<typeof MapView>;
  private map: NativeProps['ref'];

  private fabricMap = React.createRef<FabricMapHandle>();

  constructor(props: MapViewProps) {
    super(props);

    this.map = React.createRef<MapViewNativeComponentType>();
    this.state = {
      isReady: false,
    };

    this._onMapReady = this._onMapReady.bind(this);
  }

  setNativeProps(props: Partial<NativeProps>) {
    // @ts-ignore
    this.map.current?.setNativeProps(props);
  }

  private _onMapReady() {
    const {onMapReady} = this.props;
    this.setState({isReady: true}, () => {
      if (onMapReady) {
        onMapReady();
      }
    });
  }

  getCamera(): Promise<Camera> {
    if (this.fabricMap.current) {
      return this.fabricMap.current.getCamera();
    }
    return Promise.reject('getCamera not supported on this platform');
  }

  setCamera(camera: Partial<Camera>) {
    if (this.fabricMap.current) {
      this.fabricMap.current.setCamera(camera);
    } else if (this.map.current) {
      Commands.setCamera(this.map.current, camera);
    }
  }

  animateCamera(camera: Partial<Camera>, opts?: {duration?: number}) {
    if (this.fabricMap.current) {
      this.fabricMap.current.animateCamera(
        camera,
        opts?.duration ? opts.duration : 500,
      );
    } else if (this.map.current) {
      Commands.animateCamera(
        this.map.current,
        camera,
        opts?.duration ? opts.duration : 500,
      );
    }
  }

  animateToRegion(region: Region, duration: number = 500) {
    if (this.fabricMap.current) {
      this.fabricMap.current.animateToRegion(region, duration);
    } else if (this.map.current) {
      Commands.animateToRegion(this.map.current, region, duration);
    }
  }
  setRegion(region: Region) {
    if (this.fabricMap.current) {
      this.fabricMap.current.animateToRegion(region, 0);
    }
    //TODO fix for android
  }

  fitToElements(options: FitToOptions = {}) {
    const {
      edgePadding = {top: 0, right: 0, bottom: 0, left: 0},
      animated = true,
    } = options;
    if (this.fabricMap.current) {
      this.fabricMap.current.fitToElements(edgePadding, animated);
    } else if (this.map.current) {
      Commands.fitToElements(this.map.current, edgePadding, animated);
    }
  }

  fitToSuppliedMarkers(markers: string[], options: FitToOptions = {}) {
    const {
      edgePadding = {top: 0, right: 0, bottom: 0, left: 0},
      animated = true,
    } = options;
    if (this.fabricMap.current) {
      this.fabricMap.current.fitToSuppliedMarkers(
        markers,
        edgePadding,
        animated,
      );
    } else if (this.map.current) {
      Commands.fitToSuppliedMarkers(
        this.map.current,
        markers,
        edgePadding,
        animated,
      );
    }
  }

  fitToCoordinates(coordinates: LatLng[] = [], options: FitToOptions = {}) {
    const {
      edgePadding = {top: 0, right: 0, bottom: 0, left: 0},
      animated = true,
    } = options;
    if (this.fabricMap.current) {
      this.fabricMap.current.fitToCoordinates(
        coordinates,
        edgePadding,
        animated,
      );
    } else if (this.map.current) {
      Commands.fitToCoordinates(
        this.map.current,
        coordinates,
        edgePadding,
        animated,
      );
    }
  }

  /**
   * Get visible boudaries
   *
   * @return Promise Promise with the bounding box ({ northEast: <LatLng>, southWest: <LatLng> })
   */
  async getMapBoundaries(): Promise<BoundingBox> {
    if (this.fabricMap.current) {
      return this.fabricMap.current.getMapBoundaries();
    }
    return Promise.reject('getMapBoundaries not supported on this platform');
  }

  setMapBoundaries(northEast: LatLng, southWest: LatLng) {
    if (this.map.current) {
      Commands.setMapBoundaries(this.map.current, northEast, southWest);
    }
  }

  setIndoorActiveLevelIndex(activeLevelIndex: number) {
    if (this.fabricMap.current) {
      return this.fabricMap.current.setIndoorActiveLevelIndex(activeLevelIndex);
    }
    return Promise.reject('getMapBoundaries not supported on this platform');
  }

  /**
   * Takes a snapshot of the map and saves it to a picture
   * file or returns the image as a base64 encoded string.
   *
   * @param args Configuration options
   * @param [args.width] Width of the rendered map-view (when omitted actual view width is used).
   * @param [args.height] Height of the rendered map-view (when omitted actual height is used).
   * @param [args.region] Region to render (Only supported on iOS).
   * @param [args.format] Encoding format ('png', 'jpg') (default: 'png').
   * @param [args.quality] Compression quality (only used for jpg) (default: 1.0).
   * @param [args.result] Result format ('file', 'base64') (default: 'file').
   *
   * @return Promise Promise with either the file-uri or base64 encoded string
   */
  takeSnapshot(args: SnapshotOptions): Promise<string> {
    // Sanitize inputs
    const config = {
      width: args.width || 0,
      height: args.height || 0,
      region: args.region || {},
      format: args.format || 'png',
      quality: args.quality || 1.0,
      result: args.result || 'file',
    };
    if (config.format !== 'png' && config.format !== 'jpg') {
      throw new Error('Invalid format specified');
    }
    if (config.result !== 'file' && config.result !== 'base64') {
      throw new Error('Invalid result specified');
    }

    if (this.fabricMap.current) {
      // @ts-ignore
      return this.fabricMap.current.takeSnapshot(config);
    }
    return Promise.reject('takeSnapshot not supported on this platform');
  }

  /**
   * Convert a coordinate to address by using default Geocoder
   *
   * @param coordinate Coordinate
   * @param [coordinate.latitude] Latitude
   * @param [coordinate.longitude] Longitude
   *
   * @return Promise with return type Address
   */
  addressForCoordinate(coordinate: LatLng): Promise<Address> {
    if (this.fabricMap.current) {
      return this.fabricMap.current.getAddressFromCoordinates(coordinate);
    }
    return Promise.reject('getAddress not supported on this platform');
  }

  /**
   * Convert a map coordinate to user-space point
   *
   * @param coordinate Coordinate
   * @param [coordinate.latitude] Latitude
   * @param [coordinate.longitude] Longitude
   *
   * @return Promise Promise with the point ({ x: Number, y: Number })
   */
  pointForCoordinate(coordinate: LatLng): Promise<Point> {
    if (this.fabricMap.current) {
      return this.fabricMap.current.getPointForCoordinate(coordinate);
    }
    return Promise.reject('pointForCoordinate not supported on this platform');
  }

  /**
   * Convert a user-space point to a map coordinate
   *
   * @param point Point
   * @param [point.x] X
   * @param [point.x] Y
   *
   * @return Promise Promise with the coordinate ({ latitude: Number, longitude: Number })
   */
  coordinateForPoint(point: Point): Promise<LatLng> {
    if (this.fabricMap.current) {
      return this.fabricMap.current.getCoordinateForPoint(point);
    }
    return Promise.reject('coordinateForPoint not supported on this platform');
  }

  /**
   * Get markers' centers and frames in user-space coordinates
   *
   * @param onlyVisible boolean true to include only visible markers, false to include all
   *
   * @return Promise Promise with { <identifier>: { point: Point, frame: Frame } }
   */
  getMarkersFrames(onlyVisible: boolean = false): Promise<{
    [key: string]: {point: Point; frame: Frame};
  }> {
    if (this.fabricMap.current) {
      // @ts-ignore
      return this.fabricMap.current.getMarkersFrames(onlyVisible);
    }
    return Promise.reject('getMarkersFrames not supported on this platform');
  }

  /**
   * Get bounding box from region
   *
   * @param region Region
   *
   * @return Object Object bounding box ({ northEast: <LatLng>, southWest: <LatLng> })
   */
  boundingBoxForRegion(region: Region): BoundingBox {
    return {
      northEast: {
        latitude: region.latitude + region.latitudeDelta / 2,
        longitude: region.longitude + region.longitudeDelta / 2,
      },
      southWest: {
        latitude: region.latitude - region.latitudeDelta / 2,
        longitude: region.longitude - region.longitudeDelta / 2,
      },
    };
  }

  // @ts-ignore
  private _getHandle() {
    return findNodeHandle(this.map.current);
  }

  private handleMapPress = (event: any) => {
    if (this.props.onPress) {
      this.props.onPress(event);
    }
  };

  private handleMarkerPress = (event: NativeSyntheticEvent<any>) => {
    if (this.props.onMarkerPress) {
      this.props.onMarkerPress(event);
    }
  };

  private handleMarkerSelect = (event: NativeSyntheticEvent<any>) => {
    if (this.props.onMarkerSelect) {
      this.props.onMarkerSelect(event);
    }
  };

  private handleKmlReady = (event: NativeSyntheticEvent<any>) => {
    if (this.props.onKmlReady) {
      this.props.onKmlReady(event);
    }
  };

  private handleMarkerDeselect = (event: NativeSyntheticEvent<any>) => {
    if (this.props.onMarkerDeselect) {
      this.props.onMarkerDeselect(event);
    }
  };
  private handleRegionChange = (event: NativeSyntheticEvent<any>) => {
    if (this.props.onRegionChange) {
      this.props.onRegionChange(event.nativeEvent.region, {
        isGesture: event.nativeEvent.isGesture,
      });
    }
  };
  private handleRegionChangeStarted = (event: NativeSyntheticEvent<any>) => {
    if (this.props.onRegionChangeStart) {
      this.props.onRegionChangeStart(event.nativeEvent.region, {
        isGesture: event.nativeEvent.isGesture,
      });
    }
  };

  private handleIndoorBuildingFocused = (event: any) => {
    if (this.props.onIndoorBuildingFocused) {
      if (typeof event.nativeEvent.levels === 'string') {
        event.nativeEvent.levels = JSON.parse(event.nativeEvent.levels);
      }
      this.props.onIndoorBuildingFocused(event);
    }
  };

  private handleIndoorLevelActivated = (event: any) => {
    if (this.props.onIndoorLevelActivated) {
      this.props.onIndoorLevelActivated(event);
    }
  };

  private handleRegionChangeComplete = (event: NativeSyntheticEvent<any>) => {
    if (this.props.onRegionChangeComplete) {
      this.props.onRegionChangeComplete(event.nativeEvent.region, {
        isGesture: event.nativeEvent.isGesture,
      });
    }
  };

  private handleLongPress = (event: NativeSyntheticEvent<any>) => {
    if (this.props.onLongPress) {
      this.props.onLongPress(event);
    }
  };

  render() {
    // Define props specifically for MapFabricNativeProps
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      onCalloutPress,
      onIndoorBuildingFocused,
      onKmlReady,
      onLongPress,
      onMarkerDeselect,
      onMarkerPress,
      onMarkerSelect,
      onRegionChangeStart,
      onRegionChange,
      onRegionChangeComplete,
      onPress,
      onMapReady,
      minZoomLevel,
      maxZoomLevel,
      region,
      provider,
      children,
      customMapStyle,
      ...restProps
    } = this.props;

    /* eslint-enable @typescript-eslint/no-unused-vars */
    const userInterfaceStyle = this.props.userInterfaceStyle || 'system';
    const customMapStyleString = customMapStyle
      ? JSON.stringify(this.props.customMapStyle)
      : undefined;

    const props: MapFabricNativeProps = {
      onMapReady: this._onMapReady,
      liteMode: this.props.liteMode,
      googleMapId: this.props.googleMapId,
      googleRenderer: this.props.googleRenderer,
      onPress: this.handleMapPress,
      onMarkerPress: this.handleMarkerPress,
      onMarkerSelect: this.handleMarkerSelect,
      onMarkerDeselect: this.handleMarkerDeselect,
      onKmlReady: this.handleKmlReady,
      userInterfaceStyle: userInterfaceStyle,
      customMapStyleString,
      minZoom: minZoomLevel,
      maxZoom: maxZoomLevel,
      onRegionChange: this.handleRegionChange,
      onRegionChangeStart: this.handleRegionChangeStarted,
      onRegionChangeComplete: this.handleRegionChangeComplete,
      onIndoorBuildingFocused: this.handleIndoorBuildingFocused,
      // @ts-ignore
      onIndoorLevelActivated: this.handleIndoorLevelActivated,
      onLongPress: this.handleLongPress,
      showsPointsOfInterests: this.props.showsPointsOfInterests,
      pointsOfInterestFilter: this.props.pointsOfInterestFilter,
      ...restProps,
    };
    if (this.props.region) {
      props.region = {
        latitude: this.props.region.latitude,
        longitude: this.props.region.longitude,
        latitudeDelta: this.props.region.latitudeDelta,
        longitudeDelta: this.props.region.longitudeDelta,
      };
    }

    if (this.state.isReady) {
      if (props.onPanDrag) {
        props.handlePanDrag = !!props.onPanDrag;
      }
    } else {
      props.style = this.props.style;
      props.initialCamera = this.props.initialCamera;
      props.onLayout = this.props.onLayout;
    }

    const childrenNodes = this.state.isReady ? children : null;

    if (provider === 'google' && Platform.OS === 'ios') {
      return (
        <ProviderContext.Provider value={this.props.provider}>
          <FabricGoogleMap {...props} ref={this.fabricMap}>
            {childrenNodes}
          </FabricGoogleMap>
        </ProviderContext.Provider>
      );
    } else {
      return (
        <ProviderContext.Provider value={this.props.provider}>
          <FabricMap {...props} ref={this.fabricMap}>
            {childrenNodes}
          </FabricMap>
        </ProviderContext.Provider>
      );
    }
  }
}

const airMaps: {
  default: HostComponent<NativeProps>;
  google: NativeComponent<NativeProps>;
} = {
  default: requireNativeComponent<NativeProps>('AIRMap'),
  google: () => null,
};

if (Platform.OS === 'android') {
  airMaps.google = airMaps.default;
} else {
  airMaps.google = createNotSupportedComponent(
    'react-native-maps: AirGoogleMaps dir must be added to your xCode project to support GoogleMaps on iOS.',
  );
}

export const AnimatedMapView = RNAnimated.createAnimatedComponent(MapView);

MapView.Animated = AnimatedMapView;

export default MapView;
