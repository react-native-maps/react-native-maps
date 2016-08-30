const React = require('react');
const ReactNative = require('react-native');
const {
  AppRegistry,
} = ReactNative;

const App = require('./App');

class AirMapsExplorer extends React.Component {
  render() {
    return <App />;
  }
}

AppRegistry.registerComponent('AirMapsExplorer', () => AirMapsExplorer);
