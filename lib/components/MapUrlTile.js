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
   * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
   * For example, http://c.tile.openstreetmap.org/{z}/{x}/{y}.png
   */
  urlTemplate: PropTypes.string.isRequired,

  /**
   * The order in which this tile overlay is drawn with respect to other overlays. An overlay
   * with a larger z-index is drawn over overlays with smaller z-indices. The order of overlays
   * with the same z-index is arbitrary. The default zIndex is -1.
   *
   * @platform android
   */
  zIndex: PropTypes.number,
  /**
   * The maximum zoom level for this tile overlay.
   *
   */
  maximumZ: PropTypes.number,

  /**
   * The minimum zoom level for this tile overlay.
   *
   */
  minimumZ: PropTypes.number,

  /**
   * Corresponds to MKTileOverlay canReplaceMapContent.
   *
   * @platform ios
   */
  shouldReplaceMapContent: PropTypes.bool,

  /**
   * (Optional) Tile size for iOS only, default size is 256 * 256.
   *
   * @platform ios
   */
  tileSize: PropTypes.number,

  /**
   *
   * Allow tiles using the TMS coordinate system (origin bottom left)
   * to be used, and displayed at their correct coordinates
   *
   */
  flipY: PropTypes.bool,
};

class MapUrlTile extends React.Component {
  render() {
    const AIRMapUrlTile = this.getAirComponent();
    return (
      <AIRMapUrlTile
        {...this.props}
      />
    );
  }
}

MapUrlTile.propTypes = propTypes;

export default decorateMapComponent(MapUrlTile, {
  componentType: 'UrlTile',
  providers: {
    google: {
      ios: SUPPORTED,
      android: USES_DEFAULT_IMPLEMENTATION,
    },
  },
});
