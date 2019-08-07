import { latLngBounds as boundsForCooords, Marker as LeafletMarker } from 'leaflet';
import * as React from 'react';
import { Map as MapView, TileLayer } from 'react-leaflet';
import { StyleSheet, Text } from 'react-native';
import ReactDOMServer from 'react-dom/server';

import createLogger from '../utils/createLogger';
import {
  boundsToRegion,
  convertCoordinate,
  convertRegion,
  DEFAULT_CENTER,
  getCoordinatesForElements,
} from './utils/coordinates';
import withRemoteStyles from './utils/withRemoteStyles';
import { transformMapEvents } from './utils/events';

const LeafletMap = withRemoteStyles(MapView);
const DEFAULT_ZOOM = 6;
const logger = createLogger('Leaflet', 'Map');

// Leaflet map requires three default values. The TileLayer child, the center coordinate, and the zoom level.

export default class extends React.Component {
  constructor(props) {
    super(props);
    this._initialRegion = props.initialRegion;
    this._initialCamera = props.initialCamera;
  }

  setNativeProps({ initialRegion, ...props }) {
    if (initialRegion !== undefined) {
      if (this._initialRegion) {
        this._initialRegion = initialRegion;
      } else if (initialRegion) {
        this.leafletElement.fitBounds(convertRegion(initialRegion));
      }
    } else {
      logger.unsupported(props);
    }
  }

  animateToCoordinate = (latLng, duration) => {
    this.animateCamera({ center: latLng }, duration);
  };

  animateToBearing = (bearing, duration) => {
    logger.warn('animateToBearing() is unsupported in Leaflet');
  };

  animateToViewingAngle = (angle, duration) => {
    logger.warn('animateToViewingAngle() is unsupported in Leaflet');
  };

  ensureMarkers = markers => {
    let output = [];

    let markerIDs = [];
    for (const marker of markers) {
      if (typeof marker === 'string') {
        markerIDs.push(marker);
      } else if (marker instanceof LeafletMarker) {
        output.push(marker);
      } else {
        logger.warn('ensureMarkers', 'No valid marker for: ', marker);
      }
    }

    return [...Object.values(this.markersForIDs(markerIDs)), ...output];
  };

  markersForIDs = markerIDs => {
    let markers = {};
    if (!markerIDs.length) {
      return markers;
    }
    logger.log('markersForIDs', markerIDs);
    this.leafletElement.eachLayer(layer => {
      if (layer instanceof LeafletMarker && markerIDs.includes(layer.options.id)) {
        logger.log('markersForIDs', 'got marker', layer);
        markers[layer.options.id] = layer;
      }
    });
    return markers;
  };

  fitToElements = animated => {
    const ref = this.leafletElement;
    const features = [];
    ref.eachLayer(layer => {
      features.push(layer);
    });
    this.fitToSuppliedMarkers(features, 0, animated);
  };

  fitToSuppliedMarkers = (markers, edgePadding, animated) => {
    const ensuredMarkers = this.ensureMarkers(markers);
    const coords = getCoordinatesForElements(ensuredMarkers);
    logger.log('fitToSuppliedMarkers', 'markers', ensuredMarkers, coords);
    return this.fitToCoordinates(coords, edgePadding, animated);
  };

  fitToCoordinates = (coordinates, edgePadding, animated) => {
    if (edgePadding) {
      logger.warn('fitToCoordinates() edgePadding is unimplemented');
    }
    const bounds = boundsForCooords(coordinates.map(coord => convertCoordinate(coord)));
    this.leafletElement.flyToBounds(bounds, {
      animate: animated,
      duration: 0.5,
    });
  };

  getMapBoundaries = () => {
    const northEast = this.leafletElement.getBounds().getNorthEast();
    const southWest = this.leafletElement.getBounds().getSouthWest();
    return {
      northEast: {
        latitude: northEast.lat,
        longitude: northEast.lng,
      },
      southWest: {
        latitude: southWest.lat,
        longitude: southWest.lng,
      },
    };
  };

  setMapBoundaries = (northEast, southWest) => {
    this.leafletElement.fitBounds([convertCoordinate(northEast), convertCoordinate(southWest)]);
  };

  // setIndoorActiveLevelIndex = (activeLevelIndex) => {
  //   throw new Error('setIndoorActiveLevelIndex() is unsupported');
  // }

  // takeSnapshot = (width, height, region, format, quality, result, callback) => {
  //   callback(new Error('takeSnapshot() is unsupported'), null);
  // }

  // animateToNavigation = (location, bearing, angle, duration) => {

  // }

  pointForCoordinate = coordinate => {
    return this.leafletElement.latLngToContainerPoint(convertCoordinate(coordinate));
  };

  coordinateForPoint = point => {
    const ref = this.leafletElement;
    return ref.containerPointToLatLng(point);
  };

  getMarkersFrames = onlyVisible => {};

  setCamera = camera => {
    this.animateCamera(camera, 0);
  };

  getCamera = () => {
    if (!this.isReady) throw new Error('Leaflet.Map.getCamera(): map is not ready yet');
    const { leafletElement } = this;
    const center = leafletElement.getCenter();
    return {
      center: {
        latitude: center.lat,
        longitude: center.lng,
      },
      zoom: leafletElement.getZoom(),
    };
  };

  animateCamera = (camera, duration) => {
    const ref = this.leafletElement;
    logger.log('animateCamera', ref, camera, duration);

    const center = camera.center ? convertCoordinate(camera.center) : ref.getCenter();

    if (typeof camera.heading === 'number') {
      logger.warn('Camera heading is not supported in Leaflet');
    }
    if (typeof camera.pitch === 'number') {
      logger.warn('Camera pitch is not supported in Leaflet');
    }

    ref.setView(center, camera.zoom || ref.getZoom(), {
      animate: duration !== 0,
      pan: {
        duration: duration * 0.001,
      },
    });
  };

  animateToRegion = (region, duration) => {
    const ref = this.leafletElement;
    const bounds = convertRegion(region);
    logger.log('animateToRegion', ref, region, bounds, duration);
    ref.flyToBounds(bounds, {
      animate: duration !== 0,
      duration: duration * 0.001,
    });
  };

  setRef = ref => {
    this.ref = ref;
  };

  nativeEventForPoint = ({ x, y }) => {
    const coordinate = this.leafletElement.layerPointToLatLng([x, y]);
    return {
      nativeEvent: {
        position: { x, y },
        coordinate: {
          latitude: coordinate.lat,
          longitude: coordinate.lng,
        },
      },
    };
  };

  onClick = event => {
    if (this.props.onPress) {
      logger.log('onClick', event);
      this.props.onPress({
        nativeEvent: {
          coordinate: {
            latitude: event.latlng.lat,
            longitude: event.latlng.lng,
          },
        },
      });
    }
  };

  onViewportChange = ({ originalEvent }) => {
    if (!this.isReady) return;

    if (this.props.onRegionChange) {
      const region = boundsToRegion(this.leafletElement.getBounds());
      logger.log('onViewportChange', originalEvent, region);
      this.props.onRegionChange(region);
    }
    if (originalEvent && this.props.onPanDrag) {
      const { layerX: x, layerY: y } = originalEvent;
      logger.log('onPanDrag');
      this.props.onPanDrag(this.nativeEventForPoint({ x, y }));
    }
  };

  onViewportChanged = () => {
    if (!this.isReady) return;

    if (this.props.onRegionChangeComplete) {
      const region = boundsToRegion(this.leafletElement.getBounds());

      logger.log('onViewportChanged', event, region);
      this.props.onRegionChangeComplete(region);
    }
  };

  onReady = () => {
    if (this._initialCamera) {
      this.animateCamera(this._initialCamera, 0);
    } else if (this._initialRegion) {
      this.leafletElement.fitBounds(convertRegion(this._initialRegion));
    }
    this._initialCamera = null;
    this._initialRegion = null;
    this.leafletElement.on('move', this.onViewportChange);
    if (this.props.onMapReady) {
      this.props.onMapReady();
    }
  };

  get isReady() {
    return this.ref && this.ref.ref && this.ref.ref.leafletElement;
  }

  componentWillUnmount() {
    this.leafletElement.off('move', this.onViewportChange);
  }

  get leafletElement() {
    if (!this.isReady)
      throw new Error('Cannot perform operation before the component has finished rendering.');
    return this.ref.ref.leafletElement;
  }

  /* 
  paddingAdjustmentBehavior	'always'|'automatic'|'never'	'never'	Indicates how/when to affect padding with safe area insets (GoogleMaps in iOS only)
  mapType	String	"standard"	The map type to be displayed. 
  - standard: standard road map (default)
  - none: no map Note Not available on MapKit
  - satellite: satellite view
  - hybrid: satellite view with roads and points of interest overlayed
  - terrain: (Android only) topographic view
  - mutedStandard: more subtle, makes markers/lines pop more (iOS 11.0+ only)
  customMapStyle	Array		Adds custom styling to the map component. See README for more information.
  showsUserLocation	Boolean	false	If true the app will ask for the user's location. NOTE: You need to add NSLocationWhenInUseUsageDescription key in Info.plist to enable geolocation, otherwise it is going to fail silently! You will also need to add an explanation for why you need the users location against NSLocationWhenInUseUsageDescription in Info.plist. Otherwise Apple may reject your app submission.
  userLocationAnnotationTitle	String		The title of the annotation for current user location. This only works if showsUserLocation is true. There is a default value My Location set by MapView. Note: iOS only.
  followsUserLocation	Boolean	false	If true the map will focus on the user's location. This only works if showsUserLocation is true and the user has shared their location. Note: iOS only.
  showsMyLocationButton	Boolean	true	If false hide the button to move map to the current user's location.
  showsPointsOfInterest	Boolean	true	If false points of interest won't be displayed on the map.
  showsCompass	Boolean	true	If false compass won't be displayed on the map.
  showsScale	Boolean	true	A Boolean indicating whether the map shows scale information. Note: Apple Maps only.
  showsBuildings	Boolean	true	A Boolean indicating whether the map displays extruded building information.
  showsTraffic	Boolean	true	A Boolean value indicating whether the map displays traffic information.
  showsIndoors	Boolean	true	A Boolean indicating whether indoor maps should be enabled.
  showsIndoorLevelPicker	Boolean	false	A Boolean indicating whether indoor level picker should be enabled. Note: Google Maps only (either Android or iOS with PROVIDER_GOOGLE).
  rotateEnabled	Boolean	true	If false the user won't be able to pinch/rotate the map.
  pitchEnabled	Boolean	true	If false the user won't be able to adjust the camera’s pitch angle.
  
  camera	Camera		The camera view the map should display. If you use this, the region property is ignored.
  initialCamera	Camera		Like initialRegion, use this prop instead of camera only if you don't want to control the viewport of the map besides the initial camera setting. Changing this prop after the component has mounted will not result in a region change. This is similar to the initialValue prop of a text input.
  initialRegion	Region		The initial region to be displayed by the map. Use this prop instead of region only if you don't want to control the viewport of the map besides the initial region. Changing this prop after the component has mounted will not result in a region change. This is similar to the initialValue prop of a text input.
  mapPadding	EdgePadding		Adds custom padding to each side of the map. Useful when map elements/markers are obscured. Note Google Maps only.
  zoomEnabled	Boolean	true	If false the user won't be able to pinch/zoom the map.
  zoomTapEnabled	Boolean	true	If false the user won't be able to double tap to zoom the map. Note: But it will greatly decrease delay of tap gesture recognition. Note: Google Maps on iOS only
  zoomControlEnabled	Boolean	true	If false the zoom control at the bottom right of the map won't be visible Note: Android only.
  minZoomLevel	Number	0	Minimum zoom value for the map, must be between 0 and 20
  maxZoomLevel	Number	20	Maximum zoom value for the map, must be between 0 and 20
  scrollEnabled	Boolean	true	If false the user won't be able to change the map region being displayed.

  toolbarEnabled	Boolean	true	Android only If false will hide 'Navigate' and 'Open in Maps' buttons on marker press
  cacheEnabled	Boolean	false	If true map will be cached and displayed as an image instead of being interactable, for performance usage. Note: Apple Maps only
  moveOnMarkerPress	Boolean	true	Android only If false the map won't move when a marker is pressed.
  kmlSrc	string		The URL from KML file. Note: Google Maps and Markers only (either Android or iOS with PROVIDER_GOOGLE).


  legalLabelInsets	EdgeInsets		If set, changes the position of the "Legal" label link from the OS default. Note: iOS only.
  compassOffset	Point		If set, changes the position of the compass. Note: iOS Maps only.

  loadingEnabled	Boolean	false	If true a loading indicator will show while the map is loading.
  loadingIndicatorColor	Color	#606060	Sets loading indicator color, default to #606060.
  loadingBackgroundColor	Color	#FFFFFF	Sets loading background color, default to #FFFFFF.
 */

  /* 
  onKmlReady	KmlContainer	Callback that is called once the kml is fully loaded.
  onUserLocationChange	{ coordinate: Location }	Callback that is called when the underlying map figures our users current location (coordinate also includes isFromMockProvider value for Android API 18 and above). Make sure showsUserLocation is set to true and that the provider is "google".
  onPoiClick	{ coordinate: LatLng, position: Point, placeId: string, name: string }	Callback that is called when user click on a POI.
  onLongPress	{ coordinate: LatLng, position: Point }	Callback that is called when user makes a "long press" somewhere on the map.
  onMarkerPress		Callback that is called when a marker on the map is tapped by the user.
  onMarkerSelect		Callback that is called when a marker on the map becomes selected. This will be called when the callout for that marker is about to be shown. Note: iOS only.
  onMarkerDeselect		Callback that is called when a marker on the map becomes deselected. This will be called when the callout for that marker is about to be hidden. Note: iOS only.
  onCalloutPress		Callback that is called when a callout is tapped by the user.
  onMarkerDragStart	{ coordinate: LatLng, position: Point }	Callback that is called when the user initiates a drag on a marker (if it is draggable)
  onMarkerDrag	{ coordinate: LatLng, position: Point }	Callback called continuously as a marker is dragged
  onMarkerDragEnd	{ coordinate: LatLng, position: Point }	Callback that is called when a drag on a marker finishes. This is usually the point you will want to setState on the marker's coordinate again
  onIndoorLevelActivated	IndoorLevel	Callback that is called when a level on indoor building is activated
  onIndoorBuildingFocused  IndoorBuilding	Callback that is called when a indoor building is focused/unfocused
 */

  static defaultProps = {
    scrollEnabled: true,
    zoomEnabled: true,
    zoomTapEnabled: true,
    zoomControlEnabled: true,
    // minZoomLevel, maxZoomLevel, style, onPress
  };

  findUser = () => {
    // this.props.showsUserLocation
    this.leafletElement.locate();
  };

  handleLocationFound = ({ latlng }) => {
    // User location
  };

  render() {
    const {
      children,
      mapPadding,
      region,
      camera,
      scrollEnabled,
      zoomEnabled,
      zoomTapEnabled,
      zoomControlEnabled,
      minZoomLevel,
      maxZoomLevel,
      style,
      onPress,
    } = this.props;
    // const center = convertCoordinate(initialRegion);
    logger.log('render', this.props);

    const customOptions = {};

    if ('mapPadding' in this.props) {
      const boundsOptions = paddingToBoundOptions(mapPadding);
      if (boundsOptions) customOptions.boundsOptions = boundsOptions;
    }

    let transformProps;

    if (this._initialCamera || this._initialRegion) {
      transformProps = transformPropsFromCamera({
        camera: this._initialCamera,
        region: this._initialRegion,
      });
    } else if (camera || region) {
      transformProps = transformPropsFromCamera({
        camera,
        region,
      });
    }

    if (!transformProps) {
      if (this.isReady) {
        transformProps = {
          zoom: this.leafletElement.getZoom(),
          center: this.leafletElement.getCenter(),
        };
      } else {
        transformProps = {
          zoom: DEFAULT_ZOOM,
          center: DEFAULT_CENTER,
        };
      }
    }

    const events = transformMapEvents(this.props);

    if (this.props.customMapStyle) {
      logger.warn('prop customMapStyle is not supported');
    }
    return (
      <LeafletMap
        {...customOptions}
        {...transformProps}
        {...events}
        touchZoom={zoomEnabled}
        scrollWheelZoom={zoomEnabled}
        boxZoom={zoomEnabled}
        keyboard={zoomEnabled}
        doubleClickZoom={zoomTapEnabled}
        zoomControl={zoomControlEnabled}
        minZoom={minZoomLevel}
        maxZoom={maxZoomLevel}
        dragging={scrollEnabled}
        whenReady={this.onReady}
        onLocationfound={this.handleLocationFound}
        onViewportChanged={this.onViewportChanged}
        ref={this.setRef}
        style={StyleSheet.flatten([{ zIndex: 0 }, style])}
        url="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css">
        <TileLayer
          attribution={ReactDOMServer.renderToString(
            <Text accessibilityRole="link" href="http://osm.org/copyright" style={{ fontSize: 11 }}>
              OpenStreetMap
            </Text>
          )}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </LeafletMap>
    );
  }
}

function transformPropsFromCamera({ camera, region }) {
  if (camera) {
    const transformProps = {
      zoom: DEFAULT_ZOOM,
      center: DEFAULT_CENTER,
    };
    if ('center' in camera) {
      transformProps.center = convertCoordinate(camera.center);
    }
    if ('heading' in camera) transformProps.heading = camera.heading;
    if ('pitch' in camera) transformProps.pitch = camera.pitch;
    if ('zoom' in camera) transformProps.zoom = camera.zoom;
    if ('altitude' in camera) transformProps.altitude = camera.altitude;
    return transformProps;
  } else if (region) {
    return {
      bounds: convertRegion(region),
    };
  } else {
    return undefined;
  }
}

function paddingToBoundOptions(edgeInset) {
  if (!edgeInset) return undefined;

  if (typeof edgeInset === 'number') {
    return {
      padding: edgeInset,
    };
  }

  return {
    paddingTopLeft: [edgeInset.top, edgeInset.left],
    paddingBottomRight: [edgeInset.bottom, edgeInset.right],
  };
}
