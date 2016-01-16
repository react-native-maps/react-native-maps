var React = require('react-native');
var {
  AppRegistry,
} = React;

var App = require('./App');

var AirMapsExplorer = React.createClass({
  render() {
    return <App />
  },
});

AppRegistry.registerComponent('AirMapsExplorer', () => AirMapsExplorer);
