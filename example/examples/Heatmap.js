var React = require('react');
var {
  StyleSheet,
  PropTypes,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} = require('react-native');

var MapView = require('react-native-maps');

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

function getHeatMapPoints(size, withWeight = false) {
  let points = [];

  for (i = 0; i < size; i++) {
    let pointData = {latitude: LATITUDE + Math.random() / 50, longitude: LONGITUDE + Math.random() / 50};
    if (withWeight) {
      pointData.weight = Math.round(Math.random() * 10 + 1);
    }
    points.push(pointData);
  }

  return points;
}

var Heatmap = React.createClass({
  getInitialState() {
    return {
      points: getHeatMapPoints(50),
      weightEnabled: false,
    }
  },

  changeHeatmap() {
    this.setState({points: getHeatMapPoints(50, this.state.weightEnabled)});
  },

  toggleWeightEnabled() {
    this.setState({weightEnabled: !this.state.weightEnabled});
    this.changeHeatmap();
  },

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          style={styles.map}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <MapView.Heatmap
            points={this.state.points}
          />
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.changeHeatmap} style={[styles.bubble, styles.button]}>
            <Text>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleWeightEnabled} style={[styles.bubble, styles.button]}>
            <Text>{this.state.weightEnabled ? "With weight" : 'Without weight'}</Text>
          </TouchableOpacity>
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
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
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

module.exports = Heatmap;
