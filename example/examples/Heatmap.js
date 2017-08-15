import React from 'react';
import MapView from 'react-native-maps';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Heatmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      points: this.getHeatMapPoints(50),
      weightEnabled: false,
    };
  }

  getHeatMapPoints = (size, withWeight = false) => {
    const points = [];

    for (let i = 0; i < size; i++) {
      const pointData = {
        latitude: LATITUDE + (Math.random() / 50),
        longitude: LONGITUDE + (Math.random() / 50),
      };
      if (withWeight) {
        pointData.weight = Math.round((Math.random() * 10) + 1);
      }
      points.push(pointData);
    }

    return points;
  };

  changeHeatmap = () => {
    this.setState({
      points: this.getHeatMapPoints(50, this.state.weightEnabled),
    });
  };

  toggleWeightEnabled = () => {
    this.setState({ weightEnabled: !this.state.weightEnabled });
  };

  render = () => (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <MapView.Heatmap points={this.state.points} />
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={this.changeHeatmap}
          style={[styles.bubble, styles.button]}
        >
          <Text>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.toggleWeightEnabled}
          style={[styles.bubble, styles.button]}
        >
          <Text>
            {this.state.weightEnabled ? 'With weight' : 'Without weight'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    );
}

let styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default Heatmap;
