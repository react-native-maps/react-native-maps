const React = require('react');
const ReactNative = require('react-native');
let {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} = ReactNative;
const DisplayLatLng = require('./examples/DisplayLatLng');
const ViewsAsMarkers = require('./examples/ViewsAsMarkers');
const EventListener = require('./examples/EventListener');
const MarkerTypes = require('./examples/MarkerTypes');
const DraggableMarkers = require('./examples/DraggableMarkers');
const PolygonCreator = require('./examples/PolygonCreator');
const PolylineCreator = require('./examples/PolylineCreator');
const AnimatedViews = require('./examples/AnimatedViews');
const AnimatedMarkers = require('./examples/AnimatedMarkers');
const Callouts = require('./examples/Callouts');
const Overlays = require('./examples/Overlays');
const DefaultMarkers = require('./examples/DefaultMarkers');
const CachedMap = require('./examples/CachedMap');
const LoadingMap = require('./examples/LoadingMap');
const TakeSnapshot = require('./examples/TakeSnapshot');
const FitToSuppliedMarkers = require('./examples/FitToSuppliedMarkers');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Component: null,
    };
  }

  renderExample([Component, title]) {
    return (
      <TouchableOpacity
        key={title}
        style={styles.button}
        onPress={() => this.setState({ Component })}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
    );
  }

  renderBackButton() {
    return (
      <TouchableOpacity
        style={styles.back}
        onPress={() => this.setState({ Component: null })}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 30 }}>&larr;</Text>
      </TouchableOpacity>
    );
  }

  renderExamples(examples) {
    const { Component } = this.state;
    return (
      <View style={styles.container}>
        {Component && <Component />}
        {Component && this.renderBackButton()}
        {!Component &&
          <ScrollView
            contentContainerStyle={styles.scrollview}
            showsVerticalScrollIndicator={false}
          >
            {examples.map(example => this.renderExample(example))}
          </ScrollView>
        }
      </View>
    );
  }

  render() {
    return this.renderExamples([
      [DisplayLatLng, 'Tracking Position'],
      [ViewsAsMarkers, 'Arbitrary Views as Markers'],
      [EventListener, 'Events'],
      [MarkerTypes, 'Image Based Markers'],
      [DraggableMarkers, 'Draggable Markers'],
      [PolygonCreator, 'Polygon Creator'],
      [PolylineCreator, 'Polyline Creator'],
      [AnimatedViews, 'Animating with MapViews'],
      [AnimatedMarkers, 'Animated Marker Position'],
      [Callouts, 'Custom Callouts'],
      [Overlays, 'Circles, Polygons, and Polylines'],
      [DefaultMarkers, 'Default Markers'],
      [TakeSnapshot, 'Take Snapshot'],
      [CachedMap, 'Cached Map'],
      [LoadingMap, 'Map with loading'],
      [FitToSuppliedMarkers, 'Focus Map On Markers'],
    ]);
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scrollview: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  button: {
    flex: 1,
    marginTop: 10,
    backgroundColor: 'rgba(220,220,220,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    padding: 12,
    borderRadius: 20,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

module.exports = App;
