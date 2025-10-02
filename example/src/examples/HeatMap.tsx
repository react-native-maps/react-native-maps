import React from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native';
import MapView, {Heatmap, PROVIDER_GOOGLE} from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class CustomMarkers extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      points: [
        {latitude: 37.78825, longitude: -122.4324, weight: 1},
        {latitude: 37.78925, longitude: -122.4334, weight: 0.8},
        {latitude: 37.78725, longitude: -122.4314, weight: 1.2},
        // etc.
      ],
    };
  }

  render() {
    if (this.props.provider !== PROVIDER_GOOGLE) {
      return (
        <View style={styles.error}>
          <Text>Heatmap is not supported on Apple maps.</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}>
          <Heatmap
            points={this.state.points}
            opacity={1}
            radius={50}
            gradient={{
              colors: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
              startPoints: [0.1, 0.3, 0.5, 0.7, 1],
              colorMapSize: 256,
            }}
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  error: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomMarkers;
