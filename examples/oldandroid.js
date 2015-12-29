/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  //MapView,
  } = React;
//var MapRegionInput = require('./components/MapRegionInput');
var MapView = require('./components/MapView');
var PriceMarker = require('./components/PriceMarker');

var { width, height } = Dimensions.get('window');

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.1218;

var rn_mapview = React.createClass({
  getInitialState() {
    return {
      val: new Animated.Value(1),
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [],
      coord: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },
    };
  },

  onRegionChange(region) {
    //this.setState({ region });
    console.log("onRegionChange", region);
  },

  onAnimate() {
    var { val } = this.state;
    Animated.sequence([
      Animated.timing(val, { toValue: 0, duration: 500 }),
      Animated.timing(val, { toValue: 1, duration: 500 }),
    ]).start();
  },

  onAddMarker() {
    var coordinate = {
      latitude: LATITUDE + LATITUDE_DELTA * (Math.random() - 0.5),
      longitude: LONGITUDE + LONGITUDE_DELTA * (Math.random() - 0.5),
    };
    var markers = [...this.state.markers, coordinate];
    if (markers.length > 5) {
      markers = markers.slice(1);
    }
    this.setState({ markers });
  },

  onUpdateCenter() {
    var region = {
      latitude: LATITUDE + LATITUDE_DELTA * (Math.random() - 0.5),
      longitude: LONGITUDE + LONGITUDE_DELTA * (Math.random() - 0.5),
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    this.setState({ region });
  },

  render() {
    return (
      <View>
        <MapView
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          onPress={this.onMapPress}
          >

          <MapView.Marker
            coordinate={this.state.coord}
            style={{ width: 30, height: 30 }}
            >
            <PriceMarker
              style={{ width: 30, height: 30 }}
              />
          </MapView.Marker>
          {this.state.markers.map((coord, i) => (
            <MapView.Marker
              key={i}
              coordinate={coord}
              >
              <PriceMarker
                style={{ width: 30, height: 30 }}
                />
            </MapView.Marker>
          ))}

        </MapView>

        <TouchableOpacity onPress={this.onAddMarker}>
          <View>
            <Text>Add Marker</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onUpdateCenter}>
          <View>
            <Text>Update Center</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  map: {
    height: 350,
    margin: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    width: 150,
    height: 20,
    borderWidth: 0.5,
    borderColor: '#aaaaaa',
    fontSize: 13,
    padding: 4,
  },
  changeButton: {
    alignSelf: 'center',
    marginTop: 5,
    padding: 3,
    borderWidth: 0.5,
    borderColor: '#777777',
  },
  red: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
  },
  blue: {
    width: 50,
    height: 50,
    backgroundColor: 'blue',
  }
});

AppRegistry.registerComponent('rn_mapview', () => rn_mapview);
