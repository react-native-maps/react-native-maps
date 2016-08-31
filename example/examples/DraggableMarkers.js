import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import MapView from 'react-native-maps';
import PriceMarker from './PriceMarker';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

class MarkerTypes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      a: {
        latitude: LATITUDE + SPACE,
        longitude: LONGITUDE + SPACE,
      },
      b: {
        latitude: LATITUDE - SPACE,
        longitude: LONGITUDE - SPACE,
      },
    };
  }

  render() {
    return (
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
          <MapView.Marker
            coordinate={this.state.a}
            onSelect={(e) => console.log('onSelect', e)}
            onDrag={(e) => console.log('onDrag', e)}
            onDragStart={(e) => console.log('onDragStart', e)}
            onDragEnd={(e) => console.log('onDragEnd', e)}
            onPress={(e) => console.log('onPress', e)}
            draggable
          >
            <PriceMarker amount={99} />
          </MapView.Marker>
          <MapView.Marker
            coordinate={this.state.b}
            onSelect={(e) => console.log('onSelect', e)}
            onDrag={(e) => console.log('onDrag', e)}
            onDragStart={(e) => console.log('onDragStart', e)}
            onDragEnd={(e) => console.log('onDragEnd', e)}
            onPress={(e) => console.log('onPress', e)}
            draggable
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

module.exports = MarkerTypes;
