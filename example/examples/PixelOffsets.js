var React = require('react');
var ReactNative = require('react-native');
var {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} = ReactNative;

var MapView = require('react-native-maps');

var { width, height, scale } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const OFFSET_AMOUNT = Platform.OS == 'ios'
  ? Math.floor(height / 4)
  : Math.floor(height * scale / 4);

const OFFSETS = [
  { x: 0, y: 0 },
  { x: 0, y: OFFSET_AMOUNT },
  { x: 0, y: 0 },
  { x: 0, y: -OFFSET_AMOUNT },
];

var PixelOffsetsDemo = React.createClass({
  getInitialState() {
    return {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      offsetIndex: -1
    };
  },

  componentDidMount () {
    this.interval = setInterval(function () {
      let nextIndex = this.state.offsetIndex + 1;
      if (nextIndex >= OFFSETS.length) { nextIndex = 0 }

      this.refs.map.animateToRegion(this.state.region, 400, OFFSETS[nextIndex]);

      this.setState({ offsetIndex: nextIndex });
    }.bind(this), 1000);
  },

  componentWillUnmount () {
    clearInterval(this.interval);
  },

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref='map'
          style={styles.map}
          initialRegion={this.state.region}
          onPress={this.onMapPress}
          zoomEnabled={false}
          rotateEnabled={false}
          scrollEnabled={false}
          pitchEnabled={false}
        >
          <MapView.Marker
            coordinate={{
              latitude: LATITUDE,
              longitude: LONGITUDE,
            }}
          />
        </MapView>
        <View style={{ borderWidth: 1, width }} flex={1} />
        <View style={{ borderWidth: 1, width }} flex={1} />
        <View style={{ borderWidth: 1, width }} flex={1} />
        <View style={{
          borderWidth: 1,
          width,
          justifyContent: 'flex-end',
          alignItems: 'center'
        }} flex={1}>
          <View style={styles.buttonContainer}>
            <View style={styles.bubble}>
              <Text>Animating with pixel offsets</Text>
            </View>
          </View>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

module.exports = PixelOffsetsDemo;
