import * as React from 'react';
import createMapViewFromToken, {} from "react-mapbox-gl";
import { StyleSheet } from 'react-native'
import { convertCoordinate, boundsToRegion, convertRegion, DEFAULT_CENTER } from './utils/coordinates';
import withRemoteStyles from './utils/withRemoteStyles';

const DEFAULT_ZOOM = 6;
import createLogger from '../utils/createLogger';

const logger = createLogger('Mapbox', 'Map');
const MapView = createMapViewFromToken({
  accessToken: "pk.eyJ1IjoieGJhY29uIiwiYSI6ImNqeG5uaHppdTAxNmYzaHFlZmZiY3Rvb3QifQ.DXVdwWUPePb-Xic2gj7LMQ"
});

// Leaflet map requires three default values. The TileLayer child, the center coordinate, and the zoom level.
export default class extends React.Component {

  _initialRegion;
  constructor(props) {
    super(props);

    this._initialRegion = props.initialRegion;
  }

  componentDidCatch(error, info) {
    logger.error(error, info);
  }

  setNativeProps(props) {
    logger.warn('TODO: Map.setNativeProps', props)
  }


  animateToCoordinate = (latLng, duration) => {

  }

  animateToBearing = (bearing, duration) => {

  }

  animateToViewingAngle = (angle, duration) => {

  }

  fitToElements = (animated) => {
    const ref = this.getLeaflet();
    const features = [];
    ref.eachLayer((layer) => {
      features.push(layer);
    });
    this.fitToSuppliedMarkers(features, 0, animated);
  }

  fitToSuppliedMarkers = (markers, edgePadding, animated) => {
    const ref = this.getLeaflet();

    const group = new FeatureGroup(markers);
    const bounds = group.getBounds().pad(0.5).pad(edgePadding);
    
    logger.log('fitToSuppliedMarkers', ref, bounds)
    ref.flyToBounds(bounds, {
      animate: animated,
      duration: animated ? 500 : 0
    });
  }
  fitToCoordinates = (coordinates, edgePadding, animated) => {

  }
  getMapBoundaries = () => {

  }
  setMapBoundaries = (northEast, southWest) => {

  }
  setIndoorActiveLevelIndex = (activeLevelIndex) => {

  }
  takeSnapshot = (width, height, region, format, quality, result, callback) => {
    callback(new Error(), null);
  }
  
  pointForCoordinate = (coordinate) => {

  }
  coordinateForPoint = (point) => {
    const ref = this.getLeaflet();
    return ref.containerPointToLatLng(point)
  }

  getMarkersFrames = (onlyVisible) => {

  }

  setCamera = (camera) => {
    this.animateCamera(camera, 0)
  }

  getCamera = () => {

  }

  animateCamera = (camera, duration) => {
    const ref = this.getLeaflet();
    logger.log('animateCamera', ref, camera, duration)

    const center = camera.center ? convertCoordinate(camera.center) : ref.getCenter();

    if (typeof camera.heading === 'number') {
      logger.warn('Camera heading is not supported in Leaflet');
    }
    if (typeof camera.pitch === 'number') {
      logger.warn('Camera pitch is not supported in Leaflet');
    }

    ref.setView(center, ref.getZoom(), {
      animate: duration !== 0,
      pan: {
        duration: duration * 0.001
      }
    });  
  }
  animateToNavigation = (location, bearing, angle, duration) => {

  }
  animateToRegion = (region, duration) => {
    const ref = this.getLeaflet();
    const bounds = convertRegion(region);
    logger.log('animateToRegion', ref, region, bounds, duration)
    ref.flyToBounds(bounds, {
      animate: duration !== 0,
      duration: duration * 0.001
    });
  }

  getLeaflet = () => this.getRef();

  getRef = () => {
    if (!this.map) throw new Error('Cannot perform operation before the component has finished rendering.')
    return this.map;
  } 

  setRef = (ref) => {
    this.ref = ref;
  }

  onMoveEnd = (event) => {
    if (this.props.onRegionChangeComplete) {
      const region = boundsToRegion(this.getLeaflet().getBounds());
      
      logger.log('onMoveEnd', event, region);
      this.props.onRegionChangeComplete(region)
    }
  }

  onClick = (event) => {
    if (this.props.onPress) {
      logger.log('onClick', event);
      this.props.onPress({ nativeEvent: {
        coordinate: {
          latitude: event.latlng.lat,
          longitude: event.latlng.lng,
        }
      } })
    }
  }

  onViewportChange = () => {
    if (this.props.onRegionChange) {
      const region = boundsToRegion(this.getLeaflet().getBounds());
      
      logger.log('onViewportChange', event, region);
      this.props.onRegionChange(region)
    }
  }

  onReady = (map, event) => {
    this.map = map;
    if (this._initialRegion) {
      const region = convertRegion(this._initialRegion);
      logger.log(region);
        this.getLeaflet().fitBounds(region);
        this._initialRegion = null;
    }
    if (this.props.onMapReady) {
      this.props.onMapReady()
    }
  }

  render() {
    const { children, style, onPress, ...props } = this.props;
    logger.log('render', props)
    return (
      <MapView
        onStyleLoad={this.onReady}
        onClick={this.onClick}
        style="mapbox://styles/mapbox/streets-v9"
        ref={this.setRef}
        containerStyle={StyleSheet.flatten([{zIndex: 0}, style])}
      >
        {children}
      </MapView>
    );
  }
}