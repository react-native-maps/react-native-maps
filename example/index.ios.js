let React = require('react');
const ReactNative = require('react-native');
const {
  AppRegistry,
} = ReactNative;

let App = require('./App');

const AirMapsExplorer = React.createClass({
  render() {
    return <App />;
  },
});

AppRegistry.registerComponent('AirMapsExplorer', () => AirMapsExplorer);
