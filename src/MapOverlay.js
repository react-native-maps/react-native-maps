import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, Animated } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

import decorateMapComponent, {
  SUPPORTED,
  USES_DEFAULT_IMPLEMENTATION,
} from './decorateMapComponent';

const viewConfig = {
  uiViewClassName: 'AIR<provider>MapOverlay',
  validAttributes: {
    image: true,
  },
};

const propTypes = {
  ...ViewPropTypes,
  // A custom image to be used as overlay.
  image: PropTypes.any.isRequired,
  // Top left and bottom right coordinates for the overlay
  bounds: PropTypes.arrayOf(PropTypes.array.isRequired).isRequired,
  // The bearing in degrees clockwise from north.
  bearing: PropTypes.number,
  /* Boolean to allow an overlay to be tappable and use the
   * onPress function
   */
  tappable: PropTypes.bool,
  // Callback that is called when the user presses on the overlay
  onPress: PropTypes.func,
  // The opacity of the overlay.
  opacity: PropTypes.number,
};

class MapOverlay extends Component {
  render() {
    let image;
    if (this.props.image) {
      if (
        typeof this.props.image.startsWith === 'function' &&
        this.props.image.startsWith('http')
      ) {
        image = this.props.image;
      } else {
        image = Image.resolveAssetSource(this.props.image) || {};
        image = image.uri;
      }
    }

    const AIRMapOverlay = this.getAirComponent();

    return (
      <AIRMapOverlay
        {...this.props}
        image={image}
        style={[styles.overlay, this.props.style]}
      />
    );
  }
}

MapOverlay.propTypes = propTypes;
MapOverlay.viewConfig = viewConfig;
MapOverlay.defaultProps = {
  opacity: 1.0,
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});

MapOverlay.Animated = Animated.createAnimatedComponent(MapOverlay);

export default decorateMapComponent(MapOverlay, {
  componentType: 'Overlay',
  providers: {
    google: {
      ios: SUPPORTED,
      android: USES_DEFAULT_IMPLEMENTATION,
    },
  },
});
