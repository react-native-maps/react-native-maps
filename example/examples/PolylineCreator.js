var React = require('react');
var ReactNative = require('react-native');
var {
  StyleSheet,
  PropTypes,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} = ReactNative;

var MapView = require('react-native-maps');
var PriceMarker = require('./PriceMarker');

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var id = 0;

var PolylineCreator = React.createClass({
  getInitialState() {
    return {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polygons: [],
      editing: null,
    };
  },

  finish() {
    var { polygons, editing } = this.state;
    this.setState({
      polygons: [...polygons, editing],
      editing: null,
    });
  },

  onPanDrag(e) {
    var { editing } = this.state;
    if (!editing) {
      this.setState({
        editing: {
          id: id++,
          coordinates: [e.nativeEvent.coordinate],
        },
      });
    } else {
      this.setState({
        editing: {
          ...editing,
          coordinates: [
            ...editing.coordinates,
            e.nativeEvent.coordinate,
          ],
        },
      });
    }
  },

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={this.state.region}
          scrollEnabled={false}
          onPanDrag={this.onPanDrag}
        >
          {this.state.polygons.map(polygon => (
            <MapView.Polyline
              key={polygon.id}
              coordinates={polygon.coordinates}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          ))}
          {this.state.editing && (
            <MapView.Polyline
              key={'editingPolyline'}
              coordinates={this.state.editing.coordinates}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          )}
        </MapView>
        <View style={styles.buttonContainer}>
          {this.state.editing && (
            <TouchableOpacity onPress={this.finish} style={[styles.bubble, styles.button]}>
              <Text>Finish</Text>
            </TouchableOpacity>
          )}
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

module.exports = PolylineCreator;
