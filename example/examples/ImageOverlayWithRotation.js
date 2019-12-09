import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

const LATITUDE = 23.117546;
const LONGITUDE = -82.368373;
const URL = 'https://www.gstatic.com/webp/gallery/2.jpg';
const REGION = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

export default class ImageOverlayWithRotation extends Component {
  static propTypes = {
    provider: MapView.ProviderPropType,
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={REGION}
        >
          <MapView.Overlay
            key={'0'}
            image={{ uri: URL }}
            location={[LATITUDE, LONGITUDE]}
            width={300}
            anchor={[0.5, 0.5]}
            bearing={-30}
          />
          <MapView.Overlay
            key={'1'}
            image={{ uri: URL }}
            location={[LATITUDE, LONGITUDE]}
            width={300}
            height={100}
            anchor={[1, 1]}
            bearing={30}
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
});
