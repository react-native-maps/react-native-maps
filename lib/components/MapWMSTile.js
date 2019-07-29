import PropTypes from 'prop-types';
import React from 'react';

import { ViewPropTypes, View } from 'react-native';

import decorateMapComponent, {
  USES_DEFAULT_IMPLEMENTATION,
  SUPPORTED,
} from './decorateMapComponent';

// if ViewPropTypes is not defined fall back to View.propType (to support RN < 0.44)
const viewPropTypes = ViewPropTypes || View.propTypes;

const propTypes = {
  ...viewPropTypes,

  /**
   * The url template of the tile server. The patterns {minX} {maxX} {minY} {maxY} {width} {height}
   * will be replaced at runtime according to EPSG:900913 specification bounding box.
   * For example, https://demo.geo-solutions.it/geoserver/tiger/wms?service=WMS&version=1.1.0&request=GetMap&layers=tiger:poi&styles=&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true&format_options=dpi:213
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
   * tileSize.
   *
   */
  tileSize: PropTypes.number,

  /**
   * opacity. between 0 - 1
   *
   */
  opacity: PropTypes.number,
};

class MapWMSTile extends React.Component {
  render() {
    const AIRMapWMSTile = this.getAirComponent();
    return <AIRMapWMSTile {...this.props} />;
  }
}

MapWMSTile.propTypes = propTypes;
export default decorateMapComponent(MapWMSTile, {
  componentType: 'WMSTile',
  providers: {
    google: {
      ios: SUPPORTED,
      android: USES_DEFAULT_IMPLEMENTATION,
    },
  },
});
