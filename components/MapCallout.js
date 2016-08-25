
let React = require('react');
const {
  PropTypes,
} = React;

const ReactNative = require('react-native');
let {
  View,
  NativeMethodsMixin,
  requireNativeComponent,
  StyleSheet,
} = ReactNative;

const MapCallout = React.createClass({
  mixins: [NativeMethodsMixin],

  propTypes: {
    ...View.propTypes,
    tooltip: PropTypes.bool,
    onPress: PropTypes.func,
  },

  getDefaultProps() {
    return {
      tooltip: false,
    };
  },

  render() {
    return <AIRMapCallout {...this.props} style={[styles.callout, this.props.style]} />;
  },
});

let styles = StyleSheet.create({
  callout: {
    position: 'absolute',
    //flex: 0,
    //backgroundColor: 'transparent',
  },
});

let AIRMapCallout = requireNativeComponent('AIRMapCallout', MapCallout);

module.exports = MapCallout;
