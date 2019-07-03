import * as React from 'react';
import { Map as MapView, TileLayer } from 'react-leaflet';
import { StyleSheet } from 'react-native'
import { convertCoordinate, DEFAULT_CENTER } from './utils/coordinates';
import withRemoteStyles from './utils/withRemoteStyles';

const LeafletMap = withRemoteStyles(MapView);
const DEFAULT_ZOOM = 6;
// Leaflet map requires three default values. The TileLayer child, the center coordinate, and the zoom level.
export default class extends React.Component {

  setNativeProps(props) {
    console.warn('TODO: Map.setNativeProps', props)
  }

  render() {
    const { children, zoom = DEFAULT_ZOOM, initialRegion = DEFAULT_CENTER, style, ...props } = this.props;
    const center = convertCoordinate(initialRegion);

    return (
      <LeafletMap
        {...props}
        style={StyleSheet.flatten([{zIndex: 0}, style])}
        url="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
        zoom={zoom}
        center={center}
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