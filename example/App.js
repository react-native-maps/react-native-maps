var React = require('react');
var ReactNative = require('react-native');
var {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} = ReactNative;
var DisplayLatLng = require('./examples/DisplayLatLng');
var ViewsAsMarkers = require('./examples/ViewsAsMarkers');
var EventListener = require('./examples/EventListener');
var MarkerTypes = require('./examples/MarkerTypes');
var DraggableMarkers = require('./examples/DraggableMarkers');
var PolygonCreator = require('./examples/PolygonCreator');
var PolylineCreator = require('./examples/PolylineCreator');
var AnimatedViews = require('./examples/AnimatedViews');
var AnimatedMarkers = require('./examples/AnimatedMarkers');
var Callouts = require('./examples/Callouts');
var Overlays = require('./examples/Overlays');
var DefaultMarkers = require('./examples/DefaultMarkers');
var CachedMap = require('./examples/CachedMap');
var LoadingMap = require('./examples/LoadingMap');
var TakeSnapshot = require('./examples/TakeSnapshot');
var FitToSuppliedMarkers = require('./examples/FitToSuppliedMarkers');

var App = React.createClass({

  getInitialState() {
    return { Component: null };
  },

  renderExample([Component, title], i) {
    return (
      <TouchableOpacity
        key={i}
        style={styles.button}
        onPress={() => this.setState({ Component })}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
    );
  },

  renderBackButton() {
    return (
      <TouchableOpacity
        style={styles.back}
        onPress={() => this.setState({ Component: null })}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 30 }}>&larr;</Text>
      </TouchableOpacity>
    );
  },

  renderExamples(examples) {
    var { Component } = this.state;
    return (
      <View style={styles.container}>
        {Component && <Component />}
        {Component && this.renderBackButton()}
        {!Component && (
          <ScrollView
            contentContainerStyle={styles.scrollview}
            showsVerticalScrollIndicator={false}>
            {examples.map(this.renderExample)}
          </ScrollView>
        )}
      </View>
    );
  },

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
  },
});

var styles = StyleSheet.create({
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
