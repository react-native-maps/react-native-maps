import React, { PropTypes } from 'react';
import {
  View,
  requireNativeComponent,
} from 'react-native';

const propTypes = {
  ...View.propTypes,

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
};

class MapUrlTile extends React.Component {
  render() {
    return (
      <AIRMapUrlTile
        {...this.props}
      />
    );
  }
}

MapUrlTile.propTypes = propTypes;

const AIRMapUrlTile = requireNativeComponent('AIRMapUrlTile', MapUrlTile);

module.exports = MapUrlTile;
