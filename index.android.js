var React = require('react-native');
var {
  AppRegistry,
} = React;

var App = require('./App');

var ExampleApp = React.createClass({
  render() {
    return <App />
  },
});

AppRegistry.registerComponent('rn_mapview', () => ExampleApp);
