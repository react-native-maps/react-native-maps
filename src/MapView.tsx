import * as React from 'react';
import {
  Animated as RNAnimated,
  Animated,
  findNodeHandle,
  HostComponent,
  LayoutChangeEvent,
  NativeModules,
  NativeSyntheticEvent,
  Platform,
  requireNativeComponent,
  UIManager,
  View,
  ViewProps,
} from 'react-native';
import {
  createNotSupportedComponent,
  getNativeMapName,
  googleMapIsInstalled,
  NativeComponent,
  ProviderContext,
} from './decorateMapComponent';
import * as ProviderConstants from './ProviderConstants';
import {
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
} from './sharedTypes';
import {
  Address,
  BoundingBox,
  Camera,
  ChangeEvent,
  Details,
  EdgePadding,
  FitToOptions,
  IndoorBuildingEvent,
  IndoorLevelActivatedEvent,
  KmlMapEvent,
  LongPressEvent,
  MapPressEvent,
  MapStyleElement,
  MapType,
  MapTypes,
  NativeCommandName,
  PanDragEvent,
  PoiClickEvent,
  SnapshotOptions,
  UserLocationChangeEvent,
} from './MapView.types';
import {Modify} from './sharedTypesInternal';

export const MAP_TYPES: MapTypes = {
  STANDARD: 'standard',
  SATELLITE: 'satellite',
  HYBRID: 'hybrid',
  TERRAIN: 'terrain',
  NONE: 'none',
  MUTEDSTANDARD: 'mutedStandard',
};

const GOOGLE_MAPS_ONLY_TYPES: MapType[] = [MAP_TYPES.TERRAIN, MAP_TYPES.NONE];

export type MapViewProps = ViewProps & {
  /**
   * If `true` map will be cached and displayed as an image instead of being interactable, for performance usage.
   *
   * @default false
   * @platform iOS: Apple maps only
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
   * If set, changes the position of the "Legal" label link in Apple maps.
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
   * Sets loading background color.
   *
   * @default `#FFFFFF`
   * @platform iOS: Apple Maps only
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
   * @platform iOS: hybrid | mutedStandard | sattelite | standard | terrain
   * @platform Android: hybrid | none | sattelite | standard | terrain
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
  onIndoorBuildingFocused?: (event: IndoorBuildingEvent) => void;

  /**
   * Callback that is called when a level on indoor building is activated
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onIndoorLevelActivated?: (event: IndoorLevelActivatedEvent) => void;

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
  onMapLoaded?: (event: NativeSyntheticEvent<{}>) => void;

  /**
   * Callback that is called once the map is ready.
   *
   * Event is optional, as the first onMapReady callback is intercepted
   * on Android, and the event is not passed on.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onMapReady?: (event?: NativeSyntheticEvent<{}>) => void;

  /**
   * Callback that is called when a marker on the map becomes deselected.
   * This will be called when the callout for that marker is about to be hidden.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
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
   * @platform iOS: Apple Maps only.
   * @platform Android: Not supported
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
  region?: Region;

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
  showsIndoors?: boolean;

  /**
   * If `false` hide the button to move map to the current user's location.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  showsMyLocationButton?: boolean;

  /**
   * If `false` points of interest won't be displayed on the map.
   * TODO: DEPRECATED? Doesn't seem to do anything
   *
   * @default true
   * @platform iOS: Maybe Apple Maps?
   * @platform Android: Not supported
   */
  showsPointsOfInterest?: boolean;

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
   * TODO: Look into android support
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
   * @platform iOS: Apple Maps only (iOS >= 13.0)
   * @platform Android: Not supported
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
};

type ModifiedProps = Modify<
  MapViewProps,
  {
    region?: MapViewProps['region'] | null;
    initialRegion?: MapViewProps['initialRegion'] | null;
  }
>;

type NativeProps = Omit<
  ModifiedProps,
  'customMapStyle' | 'onRegionChange' | 'onRegionChangeComplete'
> & {
  ref: React.RefObject<View>;
  customMapStyleString?: string;
  handlePanDrag?: boolean;
  onChange?: (e: ChangeEvent) => void;
};

type State = {
  isReady: boolean;
};

type SnapShot = Region | null;

class MapView extends React.Component<MapViewProps, State, SnapShot> {
  static Animated: Animated.AnimatedComponent<typeof MapView>;
  private map: NativeProps['ref'];
  private __lastRegion: Region | undefined;
  private __layoutCalled: boolean | undefined;

  constructor(props: MapViewProps) {
    super(props);

    this.map = React.createRef<View>();

    this.state = {
      isReady: Platform.OS === 'ios',
    };

    this._onMapReady = this._onMapReady.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onLayout = this._onLayout.bind(this);
  }

  setNativeProps(props: Partial<NativeProps>) {
    this.map.current?.setNativeProps(props);
  }

  getSnapshotBeforeUpdate(prevProps: MapViewProps) {
    if (
      this.state.isReady &&
      this.props.customMapStyle !== prevProps.customMapStyle
    ) {
      this._updateStyle(this.props.customMapStyle);
    }
    return this.props.region || null;
  }

  componentDidUpdate(
    _prevProps: MapViewProps,
    _prevState: State,
    region: SnapShot,
  ) {
    const a = this.__lastRegion;
    const b = region;
    if (!a || !b) {
      return;
    }
    if (
      a.latitude !== b.latitude ||
      a.longitude !== b.longitude ||
      a.latitudeDelta !== b.latitudeDelta ||
      a.longitudeDelta !== b.longitudeDelta
    ) {
      this.map.current?.setNativeProps({region: b});
    }
  }

  componentDidMount() {
    const {isReady} = this.state;
    if (isReady) {
      this._updateStyle(this.props.customMapStyle);
    }
  }

  private _updateStyle(customMapStyle: MapViewProps['customMapStyle']) {
    this.map.current?.setNativeProps({
      customMapStyleString: JSON.stringify(customMapStyle),
    });
  }

  private _onMapReady() {
    const {region, initialRegion, onMapReady} = this.props;
    if (region) {
      this.map.current?.setNativeProps({region});
    } else if (initialRegion) {
      this.map.current?.setNativeProps({initialRegion});
    }
    this._updateStyle(this.props.customMapStyle);
    this.setState({isReady: true}, () => {
      if (onMapReady) {
        onMapReady();
      }
    });
  }

  private _onLayout(e: LayoutChangeEvent) {
    const {layout} = e.nativeEvent;
    if (!layout.width || !layout.height) {
      return;
    }
    if (this.state.isReady && !this.__layoutCalled) {
      const {region, initialRegion} = this.props;
      if (region) {
        this.__layoutCalled = true;
        this.map.current?.setNativeProps({region});
      } else if (initialRegion) {
        this.__layoutCalled = true;
        this.map.current?.setNativeProps({initialRegion});
      }
    }
    if (this.props.onLayout) {
      this.props.onLayout(e);
    }
  }

  private _onChange({nativeEvent}: ChangeEvent) {
    this.__lastRegion = nativeEvent.region;
    const isGesture = nativeEvent.isGesture;
    const details = {isGesture};

    if (nativeEvent.continuous) {
      if (this.props.onRegionChange) {
        this.props.onRegionChange(nativeEvent.region, details);
      }
    } else if (this.props.onRegionChangeComplete) {
      this.props.onRegionChangeComplete(nativeEvent.region, details);
    }
  }

  getCamera(): Promise<Camera> {
    if (Platform.OS === 'android') {
      return NativeModules.AirMapModule.getCamera(this._getHandle());
    } else if (Platform.OS === 'ios') {
      return this._runCommand('getCamera', []);
    }
    return Promise.reject('getCamera not supported on this platform');
  }

  setCamera(camera: Partial<Camera>) {
    this._runCommand('setCamera', [camera]);
  }

  animateCamera(camera: Partial<Camera>, opts?: {duration?: number}) {
    this._runCommand('animateCamera', [camera, opts ? opts.duration : 500]);
  }

  animateToRegion(region: Region, duration: number = 500) {
    this._runCommand('animateToRegion', [region, duration]);
  }

  fitToElements(options: FitToOptions = {}) {
    const {
      edgePadding = {top: 0, right: 0, bottom: 0, left: 0},
      animated = true,
    } = options;

    this._runCommand('fitToElements', [edgePadding, animated]);
  }

  fitToSuppliedMarkers(markers: string[], options: FitToOptions = {}) {
    const {
      edgePadding = {top: 0, right: 0, bottom: 0, left: 0},
      animated = true,
    } = options;

    this._runCommand('fitToSuppliedMarkers', [markers, edgePadding, animated]);
  }

  fitToCoordinates(coordinates: LatLng[] = [], options: FitToOptions = {}) {
    const {
      edgePadding = {top: 0, right: 0, bottom: 0, left: 0},
      animated = true,
    } = options;

    this._runCommand('fitToCoordinates', [coordinates, edgePadding, animated]);
  }

  /**
   * Get visible boudaries
   *
   * @return Promise Promise with the bounding box ({ northEast: <LatLng>, southWest: <LatLng> })
   */
  async getMapBoundaries(): Promise<BoundingBox> {
    if (Platform.OS === 'android') {
      return await NativeModules.AirMapModule.getMapBoundaries(
        this._getHandle(),
      );
    } else if (Platform.OS === 'ios') {
      return await this._runCommand('getMapBoundaries', []);
    }
    return Promise.reject('getMapBoundaries not supported on this platform');
  }

  setMapBoundaries(northEast: LatLng, southWest: LatLng) {
    this._runCommand('setMapBoundaries', [northEast, southWest]);
  }

  setIndoorActiveLevelIndex(activeLevelIndex: number) {
    this._runCommand('setIndoorActiveLevelIndex', [activeLevelIndex]);
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

    // Call native function
    if (Platform.OS === 'android') {
      return NativeModules.AirMapModule.takeSnapshot(this._getHandle(), config);
    } else if (Platform.OS === 'ios') {
      return new Promise((resolve, reject) => {
        this._runCommand('takeSnapshot', [
          config.width,
          config.height,
          config.region,
          config.format,
          config.quality,
          config.result,
          (err: unknown, snapshot: string) => {
            if (err) {
              reject(err);
            } else {
              resolve(snapshot);
            }
          },
        ]);
      });
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
    if (Platform.OS === 'android') {
      return NativeModules.AirMapModule.getAddressFromCoordinates(
        this._getHandle(),
        coordinate,
      );
    } else if (Platform.OS === 'ios') {
      return this._runCommand('getAddressFromCoordinates', [coordinate]);
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
    if (Platform.OS === 'android') {
      return NativeModules.AirMapModule.pointForCoordinate(
        this._getHandle(),
        coordinate,
      );
    } else if (Platform.OS === 'ios') {
      return this._runCommand('pointForCoordinate', [coordinate]);
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
    if (Platform.OS === 'android') {
      return NativeModules.AirMapModule.coordinateForPoint(
        this._getHandle(),
        point,
      );
    } else if (Platform.OS === 'ios') {
      return this._runCommand('coordinateForPoint', [point]);
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
    if (Platform.OS === 'ios') {
      return this._runCommand('getMarkersFrames', [onlyVisible]);
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

  private _uiManagerCommand(name: NativeCommandName) {
    const componentName = getNativeMapName(this.props.provider);
    return UIManager.getViewManagerConfig(componentName).Commands[name];
  }

  private _mapManagerCommand(name: NativeCommandName) {
    return NativeModules[`${getNativeMapName(this.props.provider)}Manager`][
      name
    ];
  }

  private _getHandle() {
    return findNodeHandle(this.map.current);
  }

  private _runCommand(name: NativeCommandName, args: any[]) {
    switch (Platform.OS) {
      case 'android':
        return UIManager.dispatchViewManagerCommand(
          this._getHandle(),
          this._uiManagerCommand(name),
          args,
        );

      case 'ios':
        return this._mapManagerCommand(name)(this._getHandle(), ...args);

      default:
        return Promise.reject(`Invalid platform was passed: ${Platform.OS}`);
    }
  }

  render() {
    let props: NativeProps;

    if (this.state.isReady) {
      props = {
        region: null,
        initialRegion: null,
        onChange: this._onChange,
        onMapReady: this._onMapReady,
        onLayout: this._onLayout,
        ref: this.map,
        ...this.props,
      };
      if (
        Platform.OS === 'ios' &&
        props.provider === ProviderConstants.PROVIDER_DEFAULT &&
        props.mapType &&
        GOOGLE_MAPS_ONLY_TYPES.includes(props.mapType)
      ) {
        props.mapType = MAP_TYPES.STANDARD;
      }
      if (props.onPanDrag) {
        props.handlePanDrag = !!props.onPanDrag;
      }
    } else {
      props = {
        style: this.props.style,
        region: null,
        initialRegion: this.props.initialRegion || null,
        ref: this.map,
        onChange: this._onChange,
        onMapReady: this._onMapReady,
        onLayout: this._onLayout,
      };
    }

    if (Platform.OS === 'android' && this.props.liteMode) {
      return (
        <ProviderContext.Provider value={this.props.provider}>
          <AIRMapLite {...props} />
        </ProviderContext.Provider>
      );
    }

    const AIRMap = getNativeMapComponent(this.props.provider);

    return (
      <ProviderContext.Provider value={this.props.provider}>
        <AIRMap {...props} />
      </ProviderContext.Provider>
    );
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
  airMaps.google = googleMapIsInstalled
    ? requireNativeComponent<NativeProps>('AIRGoogleMap')
    : createNotSupportedComponent(
        'react-native-maps: AirGoogleMaps dir must be added to your xCode project to support GoogleMaps on iOS.',
      );
}
const getNativeMapComponent = (provider: Provider) =>
  airMaps[provider || 'default'];

const AIRMapLite = UIManager.getViewManagerConfig('AIRMapLite')
  ? requireNativeComponent<NativeProps>('AIRMapLite')
  : () => null;

export const AnimatedMapView = RNAnimated.createAnimatedComponent(MapView);

export const enableLatestRenderer = () => {
  if (Platform.OS !== 'android') {
    return;
  }
  return NativeModules.AirMapModule.enableLatestRenderer();
};

MapView.Animated = AnimatedMapView;

export default MapView;
