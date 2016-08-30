import React, { PropTypes } from 'react';
import {
  View,
  requireNativeComponent,
  StyleSheet,
} from 'react-native';

// eslint-disable-next-line react/prefer-es6-class
const MapCallout = React.createClass({
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

const styles = StyleSheet.create({
  callout: {
    position: 'absolute',
  },
});

const AIRMapCallout = requireNativeComponent('AIRMapCallout', MapCallout);

module.exports = MapCallout;
