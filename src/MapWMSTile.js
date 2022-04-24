import PropTypes from 'prop-types';
import React from 'react';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

import decorateMapComponent, {
  USES_DEFAULT_IMPLEMENTATION,
  SUPPORTED,
} from './decorateMapComponent';

const propTypes = {
  ...ViewPropTypes,

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
   * (Optional) The maximum native zoom level for this tile overlay. Tiles are auto-scaled for higher
   * zoom levels.
   *
   */
  maximumNativeZ: PropTypes.number,

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
   * (Optional) Tile size only, default size is 256 (for tiles of 256 * 256 pixels)
   *
   */
  tileSize: PropTypes.number,

  /**
   *
   * Allow tiles using the TMS coordinate system (origin bottom left)
   * to be used, and displayed at their correct coordinates
   *
   */
  flipY: PropTypes.bool,

  /**
   *
   * (Optional) Enable caching of tiles in the specified directory. Directory
   * can be specified either as a normal path or in URL format (file://). Tiles
   * are stored in tileCachePath directory as follows "/{z}/{x}/{y}" i.e. in
   * sub-directories 2-levels deep, filename tile y-coordinate without any
   * filetype-extension.
   * NB! All cache management needs to be implemented by client e.g. deleting tiles
   * to manage use of storage space etc.
   *
   */
  tileCachePath: PropTypes.string,

  /**
   * (Optional) Defines how maximum age in seconds for cached tile before they
   * are refreshed. NB! Refresh logic is "serve-stale-while-refresh" i.e. to
   * ensure map availability a stale (over max age) tile is served while a tile
   * refresh process is started in the background.
   */
  tileCacheMaxAge: PropTypes.number,

  /**
   * (Optional) Sets offline-mode. In offline-mode tiles are not fetched from
   * the tile servers, rather only tiles stored in the cache directory are used.
   * Furthermore automated tile scaling is activated: if tile at a desired zoom
   * level is not found from the cache directory, then lower zoom level tile is
   * used (until minimumZ) and scaled.
   */
  offlineMode: PropTypes.bool,

  /**
   * (Optional) Map layer opacity. Value between 0 - 1, with 0 meaning fully
   * transparent.
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
