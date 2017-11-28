import React, { PropTypes } from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';

class XMarksTheSpot extends React.Component {
  render() {
    return (
      <View>
        <MapView.Polygon
          coordinates={this.props.coordinates}
          strokeColor="rgba(0, 0, 0, 1)"
          strokeWidth={3}
        />
        <MapView.Polyline
          coordinates={[this.props.coordinates[0], this.props.coordinates[2]]}
        />
        <MapView.Polyline
          coordinates={[this.props.coordinates[1], this.props.coordinates[3]]}
        />
        <MapView.Marker
          coordinate={this.props.center}
        />
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
