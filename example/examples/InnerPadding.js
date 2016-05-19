var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Dimensions
} = React;

var {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;

var InnerPadding = React.createClass({

  render() {
    let region = {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0922 / ASPECT_RATIO
    };

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          innerPadding={[0, 0, 0, 110]} // left, top, right, bottom
        />

        <View style={styles.message}>
          <Text style={styles.messageText}>
            With padding you can, for example, put a view at the bottom of the map while preserving
            the Google logo.
          </Text>
        </View>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  map: {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    position: 'absolute'
  },
  message: {
    borderRadius: 3,
    position: 'absolute',
    left: 10,
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    elevation: 5,
    padding: 15,
    height: 100,
    justifyContent: 'center'
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 27
  }
});

module.exports = InnerPadding;
