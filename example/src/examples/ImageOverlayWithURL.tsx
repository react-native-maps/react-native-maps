import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';

import MapView, {Overlay} from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 35.679976;
const LONGITUDE = 139.768458;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// 116423, 51613, 17
const OVERLAY1_SOUTH_WEST_COORDINATE = [35.679609609368576, 139.76531982421875];
const OVERLAY1_NORTH_EAST_COORDINATE = [35.68184060244454, 139.76806640625];
const IMAGE_URL1 = 'https://maps.gsi.go.jp/xyz/std/17/116423/51613.png';
// 116423, 51615, 17
const OVERLAY2_SOUTH_WEST_COORDINATE = [35.67514743608467, 139.76531982421875];
const OVERLAY2_NORTH_EAST_COORDINATE = [35.67737855391474, 139.76806640625];
const IMAGE_URL2 = 'https://maps.gsi.go.jp/xyz/std/17/116423/51615.png';

export default class ImageOverlayWithURL extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      overlay1: {
        bounds: [
          OVERLAY1_NORTH_EAST_COORDINATE,
          OVERLAY1_SOUTH_WEST_COORDINATE,
        ],
        image: IMAGE_URL1,
      },
      overlay2: {
        bounds: [
          OVERLAY2_NORTH_EAST_COORDINATE,
          OVERLAY2_SOUTH_WEST_COORDINATE,
        ],
        image: IMAGE_URL2,
      },
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}>
          <Overlay
            bounds={this.state.overlay1.bounds}
            image={this.state.overlay1.image}
          />
          <Overlay
            bounds={this.state.overlay2.bounds}
            image={this.state.overlay2.image}
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
