import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 23.736906;
const LONGITUDE = 90.397768;
const LATITUDE_DELTA = 0.022;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      offlineMap: false,
    };
  }

  _toggleOfflineMap = () => {
    this.setState({
      offlineMap: !this.state.offlineMap,
    });
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          loadingEnabled
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
          mapType={Platform.OS === 'android' && this.state.offlineMap ? 'none' : 'standard'}
        >
          {this.state.offlineMap ?
            <MapView.MbTile
              pathTemplate={'Path/to/mBTilesDatabase.mbtiles'}
              tileSize={256}
            /> : null}
        </MapView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this._toggleOfflineMap()}
        >
          <Text> {this.state.offlineMap ? 'Switch to Online Map' : 'Switch to Offline Map'} </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'lightblue',
    zIndex: 999999,
    height: 50,
    width: width / 2,
    borderRadius: width / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
