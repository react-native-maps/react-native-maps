import * as React from 'react';
import { Map as MapView, TileLayer } from 'react-leaflet';
import { StyleSheet } from 'react-native'
import { convertCoordinate, boundsToRegion, convertRegion, DEFAULT_CENTER } from './utils/coordinates';
import withRemoteStyles from './utils/withRemoteStyles';
import { featureGroup as FeatureGroup } from 'leaflet';
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
    
    log('fitToSuppliedMarkers', ref, bounds)
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
    console.log('animateCamera', ref, camera, duration)

    const center = camera.center ? convertCoordinate(camera.center) : ref.getCenter();

    if (typeof camera.heading === 'number') {
      console.warn('Camera heading is not supported in Leaflet');
    }
    if (typeof camera.pitch === 'number') {
      console.warn('Camera pitch is not supported in Leaflet');
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
  }

  onMoveEnd = (event) => {
    if (this.props.onRegionChangeComplete) {
      const region = boundsToRegion(this.getLeaflet().getBounds());
      
      log('onMoveEnd', event, region);
      this.props.onRegionChangeComplete(region)
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

  onViewportChange = () => {
    if (this.props.onRegionChange) {
      const region = boundsToRegion(this.getLeaflet().getBounds());
      
      log('onViewportChange', event, region);
      this.props.onRegionChange(region)
    }
  }

  onReady = () => {
    if (this._initialRegion) {
        this.getLeaflet().fitBounds(convertRegion(this._initialRegion));
        this._initialRegion = null;
    }
    if (this.props.onMapReady) {
      this.props.onMapReady()
    }
  }

  render() {
    const { children, style, onPress, ...props } = this.props;
    // const center = convertCoordinate(initialRegion);
    log('render', props)
    return (
      <LeafletMap
        {...props}
        whenReady={this.onReady}
        onClick={this.onClick}
        zoom={DEFAULT_ZOOM}
        center={DEFAULT_CENTER}
        onMoveEnd={this.onMoveEnd}
        onViewportChange={this.onViewportChange}
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