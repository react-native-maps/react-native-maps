import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import MapView, { ProviderPropType } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class ZoomProgramatically extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }

  zoomTo(zoom) {
    this.map.zoomTo(zoom);
  }

  zoomBy(zoom) {
    this.map.zoomBy(zoom);
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => { this.map = ref; }}
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
        />
        <View style={styles.wrapper}>
          <TouchableOpacity
            onPress={() => this.zoomTo(12)}
            style={styles.bubble}
          >
            <Text style={styles.text}>Zoom to level 12</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.zoomBy(-2)}
            style={styles.bubble}
          >
            <Text style={styles.text}>Zoom out by 2 level</Text>
          </TouchableOpacity>
          <View style={[styles.zoom]}>
            <TouchableOpacity
              onPress={() => this.zoomIn()}
              style={styles.bubble}
            >
              <Text style={styles.text}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.zoomOut()}
              style={styles.bubble}
            >
              <Text style={styles.text}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

ZoomProgramatically.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 16,
  },
  bubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  zoom: {
    height: 90,
  },
});

export default ZoomProgramatically;
