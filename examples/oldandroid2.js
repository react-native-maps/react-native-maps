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
  } = React;
var MapView = require('./components/MapView');
var PriceMarker = require('./components/PriceMarker');

var { width, height } = Dimensions.get('window');

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.1218;

var MapViewTest = React.createClass({
  getInitialState() {
    const scale = new Animated.Value(1);
    const latitudeDelta = scale.interpolate({
      inputRange: [1, 2],
      outputRange: [LATITUDE_DELTA, LATITUDE_DELTA * 0.6],
    });
    const longitudeDelta = scale.interpolate({
      inputRange: [1, 2],
      outputRange: [LONGITUDE_DELTA, LONGITUDE_DELTA * 0.6],
    });
    return {
      val: new Animated.Value(1),
      scale,
      region: new Animated.Region({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
      }),
      markers: [],
      coord: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },
    };
  },

  onRegionChange(region) {
    //console.log(region);
    this.state.region.setValue(region);
    //this.setState({ region });
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

  onAnimateZoom() {
    var { scale, region } = this.state;
    var toValue = scale.__getValue() > 1 ? 1 : 2;
    Animated.parallel([
      Animated.spring(region.latitude, {
        toValue: LATITUDE + LATITUDE_DELTA * (Math.random() - 0.5),
      }),
      Animated.spring(region.longitude, {
        toValue: LONGITUDE + LONGITUDE_DELTA * (Math.random() - 0.5),
      }),
      Animated.spring(scale, {
        toValue,
      }),
    ]).start();
  },

  onMapPress(e) {
    console.log("onMapPress", e);
  },

  onMarkerMove() {
    this.setState({
      coord: {
        latitude: LATITUDE + LATITUDE_DELTA * (Math.random() - 0.5),
        longitude: LONGITUDE + LONGITUDE_DELTA * (Math.random() - 0.5),
      },
    })
  },

  onAnimateMapRegion() {
    this.refs.map.refs.node.animateToRegion({
      latitude: LATITUDE + LATITUDE_DELTA * (Math.random() - 0.5),
      longitude: LONGITUDE + LONGITUDE_DELTA * (Math.random() - 0.5),
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }, 100);
  },

  render() {

    return (
      <View>
        <MapView.Animated
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          onPress={this.onMapPress}
          onMarkerPress={() => console.log("onMarkerPress")}
          onCalloutPress={() => console.log("onCalloutPress")}
          onMapPress={() => console.log("onMapPress")}
          ref="map"
          >
          <MapView.Marker
            coordinate={this.state.coord}
            onPress={() => console.log("Marker::onPress")}
            onCalloutPress={() => console.log("Marker::onCalloutPress")}
            >
            <PriceMarker />
            <MapView.Callout
              style={styles.callout}
              tooltip
              onPress={() => console.log("Callout::onPress")}
              >
              <View>
                <Text>Well hello there...</Text>
              </View>
            </MapView.Callout>
          </MapView.Marker>
          {this.state.markers.map((coord, i) => (
            <MapView.Marker
              key={i}
              coordinate={coord}
              onPress={() => console.log("Marker::onPress")}
              onCalloutPress={() => console.log("Marker::onCalloutPress")}
              >
              <PriceMarker />
              <MapView.Callout
                style={styles.callout}
                onPress={() => console.log("Callout::onPress")}
                >
                <View>
                  <Text>Well hello there...</Text>
                </View>
              </MapView.Callout>
            </MapView.Marker>
          ))}
        </MapView.Animated>

        <TouchableOpacity onPress={this.onAddMarker}>
          <View>
            <Text>Add Marker</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onAnimateZoom}>
          <View>
            <Text>Animate Zoom</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onMarkerMove}>
          <View>
            <Text>Move Marker</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onAnimateMapRegion}>
          <View>
            <Text>Animate Map Region</Text>
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
  },
  callout: {
    //flex: 0,
    //flexDirection: 'column',
    position: 'absolute',
    //flex: 0,
    //backgroundColor: '#fff',
    width: 100,
    height: 100,
  },
});

module.exports = MapViewTest;
AppRegistry.registerComponent('rn_mapview', () => MapViewTest);
