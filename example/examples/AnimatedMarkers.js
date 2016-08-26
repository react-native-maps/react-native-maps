let React = require('react');
const ReactNative = require('react-native');
let {
  StyleSheet,
  PropTypes,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
} = ReactNative;

let MapView = require('react-native-maps');

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const AnimatedMarkers = React.createClass({
  getInitialState() {
    return {
      coordinate: new Animated.Region({
        latitude: LATITUDE,
        longitude: LONGITUDE,
      }),
    };
  },

  animate() {
    const { coordinate } = this.state;
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


let styles = StyleSheet.create({
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

module.exports = AnimatedMarkers;
