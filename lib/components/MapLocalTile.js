import PropTypes from 'prop-types';
import React from 'react';

import {
  ViewPropTypes,
  View,
} from 'react-native';

import decorateMapComponent, {
  USES_DEFAULT_IMPLEMENTATION,
  SUPPORTED,
} from './decorateMapComponent';

// if ViewPropTypes is not defined fall back to View.propType (to support RN < 0.44)
const viewPropTypes = ViewPropTypes || View.propTypes;

const propTypes = {
  ...viewPropTypes,

  /**
   * The path template of the local tile source.
   * The patterns {x} {y} {z} will be replaced at runtime,
   * for example, /storage/emulated/0/tiles/{z}/{x}/{y}.png.
   */
  pathTemplate: PropTypes.string.isRequired,

  /**
   * The order in which this tile overlay is drawn with respect to other overlays. An overlay
   * with a larger z-index is drawn over overlays with smaller z-indices. The order of overlays
   * with the same z-index is arbitrary. The default zIndex is -1.
   *
   * @platform android
   */
  zIndex: PropTypes.number,

  /**
   * Size of tile images.
   */
  tileSize: PropTypes.number,
};

class MapLocalTile extends React.Component {
  render() {
    const AIRMapLocalTile = this.getAirComponent();
    return (
      <AIRMapLocalTile
        {...this.props}
      />
    );
  }
}

MapLocalTile.propTypes = propTypes;

export default decorateMapComponent(MapLocalTile, {
  componentType: 'LocalTile',
  providers: {
    google: {
      ios: SUPPORTED,
      android: USES_DEFAULT_IMPLEMENTATION,
    },
  },
});
