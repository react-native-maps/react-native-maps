import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import MapView from 'react-native-maps';
import overlayFlag from './assets/flag-pink.png';


const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const OVERLAY_TOP_LEFT_COORDINATE = [37.80357770113398, -122.44756892323494];
const OVERLAY_BOTTOM_RIGHT_COORDINATE = [37.79399485340466, -122.43389233946799];

export default class ImageOverlay extends Component {

  static propTypes = {
    provider: MapView.ProviderPropType,
  };

  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      overlay: {
        bounds: [OVERLAY_TOP_LEFT_COORDINATE, OVERLAY_BOTTOM_RIGHT_COORDINATE],
        image: overlayFlag,
      },
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
        >
          <MapView.Overlay
            bounds={this.state.overlay.bounds}
            image={this.state.overlay.image}
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
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
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
