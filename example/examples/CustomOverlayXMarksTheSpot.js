import React from 'react';
import PropTypes from 'prop-types';

import { View } from 'react-native';
import { Polygon, Polyline, Marker } from 'react-native-maps';

class XMarksTheSpot extends React.Component {
  render() {
    return (
      <View>
        <Polygon
          coordinates={this.props.coordinates}
          strokeColor="rgba(0, 0, 0, 1)"
          strokeWidth={3}
        />
        <Polyline
          coordinates={[this.props.coordinates[0], this.props.coordinates[2]]}
        />
        <Polyline
          coordinates={[this.props.coordinates[1], this.props.coordinates[3]]}
        />
        <Marker coordinate={this.props.center} />
      </View>
    );
  }
}

XMarksTheSpot.propTypes = {
  coordinates: PropTypes.array,
  center: PropTypes.object,
  zIndex: PropTypes.number,
};

export default XMarksTheSpot;
