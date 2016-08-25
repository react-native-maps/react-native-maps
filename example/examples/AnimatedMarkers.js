var React = require('react');
var ReactNative = require('react-native');
var {
  StyleSheet,
  PropTypes,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
} = ReactNative;

var MapView = require('react-native-maps');

var screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var AnimatedMarkers = React.createClass({
  getInitialState() {
    return {
      coordinate: new Animated.Region({
        latitude: LATITUDE,
        longitude: LONGITUDE,
      }),
    };
  },

  animate() {
    var { coordinate } = this.state;
    coordinate.timing({
      latitude: LATITUDE + (Math.random() - 0.5) * LATITUDE_DELTA / 2,
      longitude: LONGITUDE + (Math.random() - 0.5) * LONGITUDE_DELTA / 2,
    }).start();
  },

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
          <MapView.Marker.Animated
            coordinate={this.state.coordinate}
          />
        </MapView>
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.animate} style={[styles.bubble, styles.button]}>
              <Text>Animate</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  },
});



var styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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

module.exports = AnimatedMarkers;
