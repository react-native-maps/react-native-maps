import PropTypes from 'prop-types';
import React from 'react';
import {
  EdgeInsetsPropType,
  Platform,
  Animated,
  requireNativeComponent,
  NativeModules,
  ColorPropType,
  findNodeHandle,
  ViewPropTypes,
} from 'react-native';
import MapMarker from './MapMarker';
import MapPolyline from './MapPolyline';
import MapPolygon from './MapPolygon';
import MapCircle from './MapCircle';
import MapCallout from './MapCallout';
import MapUrlTile from './MapUrlTile';
import AnimatedRegion from './AnimatedRegion';
import {
  contextTypes as childContextTypes,
  getAirMapName,
  googleMapIsInstalled,
  createNotSupportedComponent,
} from './decorateMapComponent';
import * as ProviderConstants from './ProviderConstants';

const MAP_TYPES = {
  STANDARD: 'standard',
  SATELLITE: 'satellite',
  HYBRID: 'hybrid',
  TERRAIN: 'terrain',
  NONE: 'none',
};

const GOOGLE_MAPS_ONLY_TYPES = [
  MAP_TYPES.TERRAIN,
  MAP_TYPES.NONE,
];

const viewConfig = {
  uiViewClassName: 'AIR<provider>Map',
  validAttributes: {
    region: true,
  },
};

const propTypes = {
  ...ViewPropTypes,
  /**
   * When provider is "google", we will use GoogleMaps.
   * Any value other than "google" will default to using
   * MapKit in iOS or GoogleMaps in android as the map provider.
   */
  provider: PropTypes.oneOf([
    'google',
  ]),

  /**
   * Used to style and layout the `MapView`.  See `StyleSheet.js` and
   * `ViewStylePropTypes.js` for more info.
   */
  style: ViewPropTypes.style,

  /**
   * A json object that describes the style of the map. This is transformed to a string
   * and saved in mayStyleString to be sent to android and ios
   * https://developers.google.com/maps/documentation/ios-sdk/styling#use_a_string_resource
   * https://developers.google.com/maps/documentation/android-api/styling
   */
  customMapStyle: PropTypes.array,

  /**
   * A json string that describes the style of the map
   * https://developers.google.com/maps/documentation/ios-sdk/styling#use_a_string_resource
   * https://developers.google.com/maps/documentation/android-api/styling
   */
  customMapStyleString: PropTypes.string,

  /**
   * If `true` the app will ask for the user's location.
   * Default value is `false`.
   *
   * **NOTE**: You need to add NSLocationWhenInUseUsageDescription key in
   * Info.plist to enable geolocation, otherwise it is going
   * to *fail silently*!
   */
  showsUserLocation: PropTypes.bool,

  /**
   * The title of the annotation for current user location. This only works if
   * `showsUserLocation` is true.
   * There is a default value `My Location` set by MapView.
   *
   * @platform ios
   */
  userLocationAnnotationTitle: PropTypes.string,

  /**
   * If `false` hide the button to move map to the current user's location.
   * Default value is `true`.
   *
   * @platform android
   */
  showsMyLocationButton: PropTypes.bool,

  /**
   * If `true` the map will focus on the user's location. This only works if
   * `showsUserLocation` is true and the user has shared their location.
   * Default value is `false`.
   *
   * @platform ios
   */
  followsUserLocation: PropTypes.bool,

  /**
   * If `false` points of interest won't be displayed on the map.
   * Default value is `true`.
   *
   */
  showsPointsOfInterest: PropTypes.bool,

  /**
   * If `false` compass won't be displayed on the map.
   * Default value is `true`.
   *
   * @platform ios
   */
  showsCompass: PropTypes.bool,

  /**
   * If `false` the user won't be able to pinch/zoom the map.
   * Default value is `true`.
   *
   */
  zoomEnabled: PropTypes.bool,

  /**
   * If `false` the user won't be able to pinch/rotate the map.
   * Default value is `true`.
   *
   */
  rotateEnabled: PropTypes.bool,

  /**
   * If `true` the map will be cached to an Image for performance
   * Default value is `false`.
   *
   */
  cacheEnabled: PropTypes.bool,

  /**
   * If `true` the map will be showing a loading indicator
   * Default value is `false`.
   *
   */
  loadingEnabled: PropTypes.bool,

  /**
   * Loading background color while generating map cache image or loading the map
   * Default color is light gray.
   *
   */
  loadingBackgroundColor: ColorPropType,

  /**
   * Loading indicator color while generating map cache image or loading the map
   * Default color is gray color for iOS, theme color for Android.
   *
   */
  loadingIndicatorColor: ColorPropType,

  /**
   * If `false` the user won't be able to change the map region being displayed.
   * Default value is `true`.
   *
   */
  scrollEnabled: PropTypes.bool,

  /**
   * If `false` the user won't be able to adjust the camera’s pitch angle.
   * Default value is `true`.
   *
   */
  pitchEnabled: PropTypes.bool,

  /**
   * If `false` will hide 'Navigate' and 'Open in Maps' buttons on marker press
   * Default value is `true`.
   *
   * @platform android
   */
  toolbarEnabled: PropTypes.bool,

  /**
   * A Boolean indicating whether on marker press the map will move to the pressed marker
   * Default value is `true`
   *
   * @platform android
   */
  moveOnMarkerPress: PropTypes.bool,

  /**
   * A Boolean indicating whether the map shows scale information.
   * Default value is `false`
   *
   */
  showsScale: PropTypes.bool,

  /**
   * A Boolean indicating whether the map displays extruded building information.
   * Default value is `true`.
   */
  showsBuildings: PropTypes.bool,

  /**
   * A Boolean value indicating whether the map displays traffic information.
   * Default value is `false`.
   */
  showsTraffic: PropTypes.bool,

  /**
   * A Boolean indicating whether indoor maps should be enabled.
   * Default value is `false`
   *
   * @platform android
   */
  showsIndoors: PropTypes.bool,

  /**
   * A Boolean indicating whether indoor level picker should be enabled.
   * Default value is `false`
   *
   * @platform android
   */
  showsIndoorLevelPicker: PropTypes.bool,

  /**
   * The map type to be displayed.
   *
   * - standard: standard road map (default)
   * - satellite: satellite view
   * - hybrid: satellite view with roads and points of interest overlayed
   * - terrain: topographic view
   * - none: no base map
   */
  mapType: PropTypes.oneOf(Object.values(MAP_TYPES)),

  /**
   * The region to be displayed by the map.
   *
   * The region is defined by the center coordinates and the span of
   * coordinates to display.
   */
  region: PropTypes.shape({
    /**
     * Coordinates for the center of the map.
     */
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,

    /**
     * Difference between the minimun and the maximum latitude/longitude
     * to be displayed.
     */
    latitudeDelta: PropTypes.number.isRequired,
    longitudeDelta: PropTypes.number.isRequired,
  }),

  /**
   * The initial region to be displayed by the map.  Use this prop instead of `region`
   * only if you don't want to control the viewport of the map besides the initial region.
   *
   * Changing this prop after the component has mounted will not result in a region change.
   *
   * This is similar to the `initialValue` prop of a text input.
   */
  initialRegion: PropTypes.shape({
    /**
     * Coordinates for the center of the map.
     */
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,

    /**
     * Difference between the minimun and the maximum latitude/longitude
     * to be displayed.
     */
    latitudeDelta: PropTypes.number.isRequired,
    longitudeDelta: PropTypes.number.isRequired,
  }),

  /**
   * A Boolean indicating whether to use liteMode for android
   * Default value is `false`
   *
   * @platform android
   */
  liteMode: PropTypes.bool,

  /**
   * Maximum size of area that can be displayed.
   *
   * @platform ios
   */
  maxDelta: PropTypes.number,

  /**
   * Minimum size of area that can be displayed.
   *
   * @platform ios
   */
  minDelta: PropTypes.number,

  /**
   * Insets for the map's legal label, originally at bottom left of the map.
   * See `EdgeInsetsPropType.js` for more information.
   */
  legalLabelInsets: EdgeInsetsPropType,

  /**
   * Callback that is called continuously when the user is dragging the map.
   */
  onRegionChange: PropTypes.func,

  /**
   * Callback that is called once, when the user is done moving the map.
   */
  onRegionChangeComplete: PropTypes.func,

  /**
   * Callback that is called when user taps on the map.
   */
  onPress: PropTypes.func,

  /**
   * Callback that is called when user makes a "long press" somewhere on the map.
   */
  onLongPress: PropTypes.func,

  /**
   * Callback that is called when user makes a "drag" somewhere on the map
   */
  onPanDrag: PropTypes.func,

  /**
   * Callback that is called when a marker on the map is tapped by the user.
   */
  onMarkerPress: PropTypes.func,

  /**
   * Callback that is called when a marker on the map becomes selected. This will be called when
   * the callout for that marker is about to be shown.
   *
   * @platform ios
   */
  onMarkerSelect: PropTypes.func,

  /**
   * Callback that is called when a marker on the map becomes deselected. This will be called when
   * the callout for that marker is about to be hidden.
   *
   * @platform ios
   */
  onMarkerDeselect: PropTypes.func,

  /**
   * Callback that is called when a callout is tapped by the user.
   */
  onCalloutPress: PropTypes.func,

  /**
   * Callback that is called when the user initiates a drag on a marker (if it is draggable)
   */
  onMarkerDragStart: PropTypes.func,

  /**
   * Callback called continuously as a marker is dragged
   */
  onMarkerDrag: PropTypes.func,

  /**
   * Callback that is called when a drag on a marker finishes. This is usually the point you
   * will want to setState on the marker's coordinate again
   */
  onMarkerDragEnd: PropTypes.func,

};

class MapView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: Platform.OS === 'ios',
    };

    this._onMapReady = this._onMapReady.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onLayout = this._onLayout.bind(this);
  }

  getChildContext() {
    return { provider: this.props.provider };
  }

  componentWillUpdate(nextProps) {
    const a = this.__lastRegion;
    const b = nextProps.region;
    if (!a || !b) return;
    if (
      a.latitude !== b.latitude ||
      a.longitude !== b.longitude ||
      a.latitudeDelta !== b.latitudeDelta ||
      a.longitudeDelta !== b.longitudeDelta
    ) {
      this.map.setNativeProps({ region: b });
    }
  }

  componentDidMount() {
    const { isReady } = this.state;
    if (isReady) {
      this._updateStyle();
    }
  }

  _updateStyle() {
    const { customMapStyle } = this.props;
    this.map.setNativeProps({ customMapStyleString: JSON.stringify(customMapStyle) });
  }

  _onMapReady() {
    const { region, initialRegion } = this.props;
    if (region) {
      this.map.setNativeProps({ region });
    } else if (initialRegion) {
      this.map.setNativeProps({ region: initialRegion });
    }
    this._updateStyle();
    this.setState({ isReady: true });
  }

  _onLayout(e) {
    const { layout } = e.nativeEvent;
    if (!layout.width || !layout.height) return;
    if (this.state.isReady && !this.__layoutCalled) {
      const region = this.props.region || this.props.initialRegion;
      if (region) {
        this.__layoutCalled = true;
        this.map.setNativeProps({ region });
      }
    }
    if (this.props.onLayout) {
      this.props.onLayout(e);
    }
  }

  _onChange(event) {
    this.__lastRegion = event.nativeEvent.region;
    if (event.nativeEvent.continuous) {
      if (this.props.onRegionChange) {
        this.props.onRegionChange(event.nativeEvent.region);
      }
    } else if (this.props.onRegionChangeComplete) {
      this.props.onRegionChangeComplete(event.nativeEvent.region);
    }
  }

  animateToRegion(region, duration) {
    this._runCommand('animateToRegion', [region, duration || 500]);
  }

  animateToCoordinate(latLng, duration) {
    this._runCommand('animateToCoordinate', [latLng, duration || 500]);
  }

  fitToElements(animated) {
    this._runCommand('fitToElements', [animated]);
  }

  fitToSuppliedMarkers(markers, animated) {
    this._runCommand('fitToSuppliedMarkers', [markers, animated]);
  }

  fitToCoordinates(coordinates = [], options) {
    const {
      edgePadding = { top: 0, right: 0, bottom: 0, left: 0 },
      animated = true,
    } = options;

    this._runCommand('fitToCoordinates', [coordinates, edgePadding, animated]);
  }

  /**
   * Takes a snapshot of the map and saves it to a picture
   * file or returns the image as a base64 encoded string.
   *
   * @param config Configuration options
   * @param [config.width] Width of the rendered map-view (when omitted actual view width is used).
   * @param [config.height] Height of the rendered map-view (when omitted actual height is used).
   * @param [config.region] Region to render (Only supported on iOS).
   * @param [config.format] Encoding format ('png', 'jpg') (default: 'png').
   * @param [config.quality] Compression quality (only used for jpg) (default: 1.0).
   * @param [config.result] Result format ('file', 'base64') (default: 'file').
   *
   * @return Promise Promise with either the file-uri or base64 encoded string
   */
  takeSnapshot(args) {
    // For the time being we support the legacy API on iOS.
    // This will be removed in a future release and only the
    // new Promise style API shall be supported.
    if (Platform.OS === 'ios' && (arguments.length === 4)) {
      console.warn('Old takeSnapshot API has been deprecated; will be removed in the near future'); //eslint-disable-line
      const width = arguments[0]; // eslint-disable-line
      const height = arguments[1]; // eslint-disable-line
      const region = arguments[2]; // eslint-disable-line
      const callback = arguments[3]; // eslint-disable-line
      this._runCommand('takeSnapshot', [
        width || 0,
        height || 0,
        region || {},
        'png',
        1,
        'legacy',
        callback,
      ]);
      return undefined;
    }

    // Sanitize inputs
    const config = {
      width: args.width || 0,
      height: args.height || 0,
      region: args.region || {},
      format: args.format || 'png',
      quality: args.quality || 1.0,
      result: args.result || 'file',
    };
    if ((config.format !== 'png') &&
        (config.format !== 'jpg')) throw new Error('Invalid format specified');
    if ((config.result !== 'file') &&
        (config.result !== 'base64')) throw new Error('Invalid result specified');

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
          (err, snapshot) => {
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

  _uiManagerCommand(name) {
    return NativeModules.UIManager[getAirMapName(this.props.provider)].Commands[name];
  }

  _mapManagerCommand(name) {
    return NativeModules[`${getAirMapName(this.props.provider)}Manager`][name];
  }

  _getHandle() {
    return findNodeHandle(this.map);
  }

  _runCommand(name, args) {
    switch (Platform.OS) {
      case 'android':
        NativeModules.UIManager.dispatchViewManagerCommand(
          this._getHandle(),
          this._uiManagerCommand(name),
          args
        );
        break;

      case 'ios':
        this._mapManagerCommand(name)(this._getHandle(), ...args);
        break;

      default:
        break;
    }
  }

  render() {
    let props;

    if (this.state.isReady) {
      props = {
        ...this.props,
        region: null,
        initialRegion: null,
        onChange: this._onChange,
        onMapReady: this._onMapReady,
        onLayout: this._onLayout,
      };
      if (Platform.OS === 'ios' && props.provider === ProviderConstants.PROVIDER_DEFAULT
        && GOOGLE_MAPS_ONLY_TYPES.includes(props.mapType)) {
        props.mapType = MAP_TYPES.standard;
      }
      props.handlePanDrag = !!props.onPanDrag;
    } else {
      props = {
        style: this.props.style,
        region: null,
        initialRegion: null,
        onChange: this._onChange,
        onMapReady: this._onMapReady,
        onLayout: this._onLayout,
      };
    }

    if (Platform.OS === 'android' && this.props.liteMode) {
      return (
        <AIRMapLite
          ref={ref => { this.map = ref; }}
          {...props}
        />
      );
    }

    const AIRMap = getAirMapComponent(this.props.provider);

    return (
      <AIRMap
        ref={ref => { this.map = ref; }}
        {...props}
      />
    );
  }
}

MapView.propTypes = propTypes;
MapView.viewConfig = viewConfig;
MapView.childContextTypes = childContextTypes;

MapView.MAP_TYPES = MAP_TYPES;

const nativeComponent = Component => requireNativeComponent(Component, MapView, {
  nativeOnly: {
    onChange: true,
    onMapReady: true,
    handlePanDrag: true,
  },
});
const airMaps = {
  default: nativeComponent('AIRMap'),
};
if (Platform.OS === 'android') {
  airMaps.google = airMaps.default;
} else {
  airMaps.google = googleMapIsInstalled ? nativeComponent('AIRGoogleMap') :
    createNotSupportedComponent('react-native-maps: AirGoogleMaps dir must be added to your xCode project to support GoogleMaps on iOS.'); // eslint-disable-line max-len
}
const getAirMapComponent = provider => airMaps[provider || 'default'];

const AIRMapLite = NativeModules.UIManager.AIRMapLite &&
  requireNativeComponent('AIRMapLite', MapView, {
    nativeOnly: {
      onChange: true,
      onMapReady: true,
      handlePanDrag: true,
    },
  });

MapView.Marker = MapMarker;
MapView.Polyline = MapPolyline;
MapView.Polygon = MapPolygon;
MapView.Circle = MapCircle;
MapView.UrlTile = MapUrlTile;
MapView.Callout = MapCallout;
Object.assign(MapView, ProviderConstants);
MapView.ProviderPropType = PropTypes.oneOf(Object.values(ProviderConstants));

MapView.Animated = Animated.createAnimatedComponent(MapView);
MapView.AnimatedRegion = AnimatedRegion;

module.exports = MapView;
