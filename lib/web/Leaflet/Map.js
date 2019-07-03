import * as React from 'react';
import { Map as MapView, TileLayer } from 'react-leaflet';
import { StyleSheet } from 'react-native'
import { convertCoordinate, boundsToRegion, convertRegion, DEFAULT_CENTER } from './utils/coordinates';
import withRemoteStyles from './utils/withRemoteStyles';

const LeafletMap = withRemoteStyles(MapView);
const DEFAULT_ZOOM = 6;


const log = console.log.bind(this, 'Leaflet', 'Map');
// Leaflet map requires three default values. The TileLayer child, the center coordinate, and the zoom level.
export default class extends React.Component {

  _initialRegion;
  constructor(props) {
    super(props);

    this._initialRegion = props.initialRegion;
  }
  setNativeProps(props) {
    console.warn('TODO: Map.setNativeProps', props)
  }


  animateToRegion = (region, duration) => {

  }

  animateToCoordinate = (latLng, duration) => {

  }

  animateToBearing = (bearing, duration) => {

  }

  animateToViewingAngle = (angle, duration) => {

  }

  fitToElements = (animated) => {

  }

  fitToSuppliedMarkers = (markers, edgePadding, animated) => {

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

  }
  getMarkersFrames = (onlyVisible) => {

  }
  setCamera = (camera) => {

  }
  getCamera = () => {

  }
  animateCamera = (camera, duration) => {
    const ref = this.getLeaflet();
    console.log('animateCamera', ref, camera, duration)

    const center = camera.center ? convertCoordinate(camera.center) : ref.getCenter();

    if (typeof camera.heading === 'number') {
      console.warn('Camera heading is not supported in Leaflet');
    }
    if (typeof camera.pitch === 'number') {
      console.warn('Camera pitch is not supported in Leaflet');
    }

    ref.setView(center, ref.getZoom(), {
      "animate": duration !== 0,
      "pan": {
        "duration": duration * 0.001
      }
    });  
  }
  animateToNavigation = (location, bearing, angle, duration) => {

  }
  animateToRegion = (region, duration) => {
    const ref = this.getLeaflet();
    const bounds = convertRegion(region);
    log('animateToRegion', ref, region, bounds, duration)
    ref.flyToBounds(bounds, {
      animate: duration !== 0,
      duration: duration * 0.001
    });
  }

  getLeaflet = () => this.getRef().leafletElement;

  getRef = () => {
    if (!this.ref) throw new Error('Cannot perform operation before the component has finished rendering.')
    return this.ref.ref;
  } 

  setRef = (ref) => {
    this.ref = ref;

    if (this._initialRegion) {
      setTimeout(() => {
        this.getLeaflet().fitBounds(convertRegion(this._initialRegion));
        this._initialRegion = null;
      }, 10) 
    }
  }

  onMoveEnd = (event) => {
    if (this.props.onRegionChange) {
      const region = boundsToRegion(this.getLeaflet().getBounds());
      
      log('onMoveEnd', event, region);
      this.props.onRegionChange(region)
    }
  }

  onClick = (event) => {
    if (this.props.onPress) {
      log('onClick', event);
      this.props.onPress({ nativeEvent: {
        coordinate: {
          latitude: event.latlng.lat,
          longitude: event.latlng.lng,
        }
      } })
    }
  }

  render() {
    const { children, style, onPress, ...props } = this.props;
    // const center = convertCoordinate(initialRegion);
    log('render', props)
    return (
      <LeafletMap
        {...props}
        onClick={this.onClick}
        zoom={DEFAULT_ZOOM}
        center={DEFAULT_CENTER}
        onMoveEnd={this.onMoveEnd}
        ref={this.setRef}
        style={StyleSheet.flatten([{zIndex: 0}, style])}
        url="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </LeafletMap>
    );
  }
}