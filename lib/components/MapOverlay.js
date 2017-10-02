import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
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
  ...View.propTypes,
  // A custom image to be used as overlay.
  image: PropTypes.any.isRequired,
  // North East and South West coordinates for the overlay
  bounds: PropTypes.arrayOf(PropTypes.shape({
    /**
     * Latitude/Longitude coordinates
     */
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  })).isRequired,
  /**
   * Rotation angle of the image
   * Its a float value should be between 0 - 360
   * If not required set it to 0
   */
  bearing: PropTypes.number,
  /**
   * zIndex of Overlay Image
   * Supported on android only
   */
  zIndex: PropTypes.number,
  /**
   * Callback that is called when the user presses on the Overlay
   */
  onPress: PropTypes.func,
};

class MapOverlay extends Component {

  render() {
    let image;
    if (this.props.image) {
      image = resolveAssetSource(this.props.image) || {};
      image = image.uri || this.props.image;
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

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});

MapOverlay.Animated = Animated.createAnimatedComponent(MapOverlay);

module.exports = decorateMapComponent(MapOverlay, {
  componentType: 'Overlay',
  providers: {
    google: {
      ios: SUPPORTED,
      android: USES_DEFAULT_IMPLEMENTATION,
    },
  },
});
