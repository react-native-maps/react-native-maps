var React = require('react-native');
var DisplayLatLng = require('./examples/DisplayLatLng');
var ViewsAsMarkers = require('./examples/ViewsAsMarkers');
var EventListener = require('./examples/EventListener');
var MarkerTypes = require('./examples/MarkerTypes');
var PolygonCreator = require('./examples/PolygonCreator');
var AnimatedViews = require('./examples/AnimatedViews');

var App = React.createClass({
  render() {
    //return <DisplayLatLng />;
    //return <ViewsAsMarkers />;
    //return <EventListener />;
    //return <MarkerTypes />;
    //return <PolygonCreator />;
    return <AnimatedViews />;
  },
});

module.exports = App;
