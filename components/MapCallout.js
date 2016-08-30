import React, { PropTypes } from 'react';
import {
  View,
  requireNativeComponent,
  StyleSheet,
} from 'react-native';

const propTypes = {
  ...View.propTypes,
  tooltip: PropTypes.bool,
  onPress: PropTypes.func,
};

const defaultProps = {
  tooltip: false,
};

class MapCallout extends React.Component {
  render() {
    return <AIRMapCallout {...this.props} style={[styles.callout, this.props.style]} />;
  }
}

MapCallout.propTypes = propTypes;
MapCallout.defaultProps = defaultProps;

const styles = StyleSheet.create({
  callout: {
    position: 'absolute',
  },
});

const AIRMapCallout = requireNativeComponent('AIRMapCallout', MapCallout);

module.exports = MapCallout;
