import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';

import MapView, {Overlay} from 'react-native-maps';
// @ts-ignore
import flagPinkImg from './assets/flag-pink.png';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 35.679976;
const LONGITUDE = 139.768458;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// 116423, 51613, 17
const OVERLAY_TOP_LEFT_COORDINATE = [35.68184060244454, 139.76531982421875];
const OVERLAY_BOTTOM_RIGHT_COORDINATE = [35.679609609368576, 139.76806640625];
const IMAGE = flagPinkImg;

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
      overlay: {
        bounds: [OVERLAY_TOP_LEFT_COORDINATE, OVERLAY_BOTTOM_RIGHT_COORDINATE],
        image: IMAGE,
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
