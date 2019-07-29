import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';

import MapView, {
  MAP_TYPES,
  ProviderPropType,
  WMSTile,
} from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 40.71095;
const LONGITUDE = -74.00997;
const LATITUDE_DELTA = 0.0152;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class WMSTiles extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
  }

  render() {
    const { region } = this.state;
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          mapType={MAP_TYPES.SATELLITE}
          style={styles.map}
          initialRegion={region}
        >
          <WMSTile
            urlTemplate="https://demo.geo-solutions.it/geoserver/tiger/wms?service=WMS&version=1.1.0&request=GetMap&layers=tiger:poi&styles=&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true&format_options=dpi:213"
            zIndex={1}
            opacity={0.5}
            tileSize={512}
          />
        </MapView>
        <View style={styles.buttonContainer}>
          <View style={styles.bubble}>
            <Text>WMS Tiles</Text>
          </View>
        </View>
      </View>
    );
  }
}

WMSTiles.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
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

export default WMSTiles;
