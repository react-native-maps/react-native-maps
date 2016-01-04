var React = require('react-native');
var {
  StyleSheet,
  PropTypes,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} = React;
var resolveAssetSource = require('resolveAssetSource');
var AssetRegistry = require('AssetRegistry');

var MapView = require('../components/MapView');
var PriceMarker = require('./PriceMarker');

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var DisplayLatLng = React.createClass({
  getInitialState() {
    return {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [

      ],
      coordinate: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },
      amount: 99,
    };
  },

  increment() {
    this.setState({ amount: this.state.amount + 1 });
  },

  decrement() {
    this.setState({ amount: this.state.amount - 1 });
  },

  render() {
    //var asset = resolveAssetSource(require('./assets/pin-green.png'));
    var asset = AssetRegistry.getAssetByID(require('./assets/pin-green.png'));
    var uri = resolveAssetSource.getPathInArchive(asset);
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={this.state.region}
        >
          {this.state.markers.map(marker => {

          })}
          <MapView.Marker
            coordinate={this.state.coordinate}
            image={{ uri }}
          />
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.decrement} style={[styles.bubble, styles.button]}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.increment} style={[styles.bubble, styles.button]}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>+</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Image source={require('./assets/pin-green.png')} />
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

module.exports = DisplayLatLng;
