import React, { PropTypes } from 'react';
import {
  View,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import { LatLonSpherical as LatLon } from 'geodesy';

import MapMarker from './MapMarker';
import Callout from './MapCallout';

const { height } = Dimensions.get('window');

const propTypes = {
  ...View.propTypes,
  region: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    latitudeDelta: PropTypes.number.isRequired,
    longitudeDelta: PropTypes.number.isRequired,
  }).isRequired,
  bounds: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.number.isRequired,
    ).isRequired
  ).isRequired,
  image: PropTypes.any.isRequired,
  name: PropTypes.string,
  rotation: PropTypes.number,
  zIndex: PropTypes.number,
  transparency: PropTypes.number,
  onPress: PropTypes.func,
};

const defaultProps = {
  rotation: 0,
  zIndex: 0,
  transparency: 0,
};

class MapOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  onPress() {
  }

  render() {
    const { image, bounds, rotation, zIndex, transparency, name, region } = this.props;

    if (!bounds || !image || !region) return null;

    const { latitude, longitude, latitudeDelta } = region;
    const coordinateNE = bounds[0];
    const coordinateSW = bounds[1];

    // How many metres in px
    const p1 = new LatLon(latitude, longitude);
    const p2 = new LatLon(latitude + (latitudeDelta / 2), longitude);
    const scale = (p1.distanceTo(p2) * 2) / height;

    // Compute width and height
    const p3 = new LatLon(coordinateSW[0], coordinateSW[1]); // South-West point
    const p4 = new LatLon(coordinateNE[0], coordinateNE[1]); // North-East point
    const p5 = new LatLon(coordinateNE[0], coordinateSW[1]); // North-West point

    const distanceHeight = p5.distanceTo(p3);
    const distanceWidth = p5.distanceTo(p4);

    const overlayHeight = distanceHeight / scale;
    const overlayWidth = distanceWidth / scale;

    return (
      <MapMarker
        coordinate={{
          latitude: coordinateSW[0],
          longitude: coordinateSW[1],
        }}
        centerOffset={{ x: overlayWidth / 2, y: -overlayHeight / 2 }}
        onPress={this.onPress}
      >
        <Image
          source={image}

          style={{
            height: overlayHeight,
            width: overlayWidth,

            opacity: 1 - transparency,
            transform: [{
              rotate: `${rotation}deg`,
            }],
            zIndex,
          }}
        />

        <Callout>
          <View>
            <Text>{name || 'No name'}</Text>
          </View>
        </Callout>
      </MapMarker>
    );
  }
}

MapOverlay.propTypes = propTypes;
MapOverlay.defaultProps = defaultProps;

module.exports = MapOverlay;
