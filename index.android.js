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

const LATD = LATITUDE - 38.89399;
const LNGD = LONGITUDE + 77.03659;

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
    //console.log("onRegionChange", region);
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

  onZoomToFit() {
    this.refs.map.refs.node.fitToElements(true);
  },

  render() {

    return (
      <View>
        <MapView.Animated
          ref="map"
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          onRegionChangeComplete={(e) => console.log("Map::onRegionChangeComplete", e.nativeEvent)}
          onPress={(e) => console.log("Map::onPress", e.nativeEvent)}
          onLongPress={(e) => console.log("Map::onLongPress", e.nativeEvent)}
          onMarkerPress={(e) => console.log("Map::onMarkerPress", e.nativeEvent)}
          onMarkerSelect={(e) => console.log("Map::onMarkerSelect", e.nativeEvent)}
          onMarkerDeselect={(e) => console.log("Map::onMarkerDeselect", e.nativeEvent)}
          onCalloutPress={(e) => console.log("Map::onCalloutPress", e.nativeEvent)}
          >
          <MapView.Circle
            center={{ latitude: LATITUDE, longitude: LONGITUDE }}
            radius={500}
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={0.5}
            />
          <MapView.Polygon
            coordinates={[
              { latitude: LATITUDE, longitude: LONGITUDE },
              { latitude: LATITUDE + 0.04, longitude: LONGITUDE },
              { latitude: LATITUDE + 0.04, longitude: LONGITUDE + 0.04 },
              { latitude: LATITUDE, longitude: LONGITUDE + 0.04 },
              { latitude: LATITUDE, longitude: LONGITUDE },
            ]}
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={0.5}
            strokeColor="#000"
            />
          <MapView.Polyline
            coordinates={[
              { latitude: 38.893596444352134 + LATD, longitude: -77.03814983367920 + LNGD},
              { latitude: 38.893379333722040 + LATD, longitude: -77.03792452812195 + LNGD},
              { latitude: 38.893162222428310 + LATD, longitude: -77.03761339187622 + LNGD},
              { latitude: 38.893028615148424 + LATD, longitude: -77.03731298446655 + LNGD},
              { latitude: 38.892920059048464 + LATD, longitude: -77.03691601753235 + LNGD},
              { latitude: 38.892903358095296 + LATD, longitude: -77.03637957572937 + LNGD},
              { latitude: 38.893011914220770 + LATD, longitude: -77.03592896461487 + LNGD},
              { latitude: 38.893162222428310 + LATD, longitude: -77.03549981117249 + LNGD},
              { latitude: 38.893404384982480 + LATD, longitude: -77.03514575958252 + LNGD},
              { latitude: 38.893596444352134 + LATD, longitude: -77.03496336936950 + LNGD},
            ]}
            />
          <MapView.Marker
            coordinate={this.state.coord}
            onPress={(e) => console.log("Marker::onPress", e.nativeEvent)}
            onCalloutPress={(e) => console.log("Marker::onCalloutPress", e.nativeEvent)}
            >
            <PriceMarker />
            <MapView.Callout
              style={styles.callout}
              tooltip
              onPress={(e) => console.log("Callout::onPress", e.nativeEvent)}
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
              onPress={(e) => console.log("Marker::onPress", e.nativeEvent)}
              onCalloutPress={(e) => console.log("Marker::onCalloutPress", e.nativeEvent)}
              >
              <PriceMarker />
              <MapView.Callout
                style={styles.callout}
                onPress={(e) => console.log("Callout::onPress", e.nativeEvent)}
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

        <TouchableOpacity onPress={this.onZoomToFit}>
          <View>
            <Text>Fit To Elements</Text>
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
    //position: 'absolute',
    //flex: 0,
    //backgroundColor: '#fff',
    //width: 100,
    //height: 100,
  },
});

module.exports = MapViewTest;
AppRegistry.registerComponent('rn_mapview', () => MapViewTest);
