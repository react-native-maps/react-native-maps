/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {NewMapView, Marker} from 'react-native-maps';


const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6)}`;
}
function randomLocationInGermany() {
  // Germany bounding box coordinates
  const minLat = 47.2701114; // Southernmost latitude
  const maxLat = 55.058347; // Northernmost latitude
  const minLng = 5.8663153; // Westernmost longitude
  const maxLng = 15.0419319; // Easternmost longitude

  return {
    latitude: Math.random() * (maxLat - minLat) + minLat,
    longitude: Math.random() * (maxLng - minLng) + minLng,
  };
}

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [],
      compassVisible: false,
    };
  }
  onResetPress() {
    console.log("onResetPress");
    const newMarker = {
      coordinate: randomLocationInGermany(),
      key: id++,
      color: randomColor(),
    };

    this.setState({
      markers: [...this.state.markers, newMarker],
    });
  }
  onToggleCompass() {
    this.setState({
      compassVisible: !this.state.compassVisible,
    });
  }

  onMapPress(e: any) {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate,
          key: id++,
          color: randomColor(),
        },
      ],
    });
  }

  render() {
    console.log("markes count " + this.state.markers.length, this.state.compassVisible);
    return (
      <View style={styles.container}>
        <NewMapView
          provider={this.props.provider}
          style={styles.map}
          zoomEnabled={this.state.compassVisible}
          region={this.state.region}
          poiClickEnabled={false}
          onMapPress={e => this.onMapPress(e)}>
          {this.state.markers.map((marker: any) => (
            <Marker
              key={marker.key}
              coordinate={marker.coordinate}
              pinColor={marker.color}
            />
          ))}
        </NewMapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
              onPress={() => this.onResetPress()}
            style={styles.bubble}>
            <Text>Tap map to create a marker of random color</Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={() => this.onToggleCompass()}
              style={styles.bubble}>
            <Text>Tap map to toggle compass</Text>
          </TouchableOpacity>
        </View>
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
    margin: 5,
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
    flexDirection: 'column',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default App;
