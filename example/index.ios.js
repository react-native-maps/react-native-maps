var React = require('react');
var ReactNative = require('react-native');
var {
  AppRegistry,
} = ReactNative;

var App = require('./App');

var AirMapsExplorer = React.createClass({
  render() {
    return <App />
  },
});

AppRegistry.registerComponent('AirMapsExplorer', () => AirMapsExplorer);
