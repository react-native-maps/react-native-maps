import * as React from 'react';
import type {ViewProps} from 'react-native';

import decorateMapComponent, {
  USES_DEFAULT_IMPLEMENTATION,
  SUPPORTED,
  ProviderContext,
  type NativeComponent,
  type MapManagerCommand,
  type UIManagerCommand,
} from './decorateMapComponent';

export type MapWMSTileProps = ViewProps & {
  /**
   * The maximum native zoom level for this tile overlay i.e. the highest zoom level that the tile server provides.
   * Tiles are auto-scaled for higher zoom levels.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  maximumNativeZ?: number;

  /**
   * The maximum zoom level for this tile overlay.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  maximumZ?: number;

  /**
   * The minimum zoom level for this tile overlay.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  minimumZ?: number;

  /**
   * In offline-mode tiles are not fetched from the tile servers, rather only tiles stored in the cache directory are used.
   * Furthermore, automated tile scaling is activated: if tile at a desired zoom level is not found from the cache directory,
   * then lower zoom level tile is used (up to 4 levels lower) and scaled.
   *
   * @default false
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  offlineMode?: boolean;

  /**
   * Map layer opacity. Value between 0 - 1, with 0 meaning fully transparent.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  opacity?: number;

  /**
   * Corresponds to MKTileOverlay canReplaceMapContent i.e. if true then underlying iOS basemap is not shown.
   *
   * @default false
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  shouldReplaceMapContent?: boolean;

  /**
   * Defines maximum age in seconds for a cached tile before it's refreshed.
   *
   * NB! Refresh logic is "serve-stale-while-refresh"
   * i.e. to ensure map availability a stale (over max age) tile is served
   * while a tile refresh process is started in the background.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  tileCacheMaxAge?: number;

  /**
   * Enable caching of tiles in the specified directory.
   * Directory can be specified either as a normal path or in URL format (`file://`).
   *
   * Tiles are stored in tileCachePath directory as `/{z}/{x}/{y}` i.e. in sub-directories 2-levels deep,
   * filename is tile y-coordinate without any filetype-extension.
   *
   * NB! All cache management needs to be implemented by client e.g. deleting tiles to manage use of storage space etc.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  tileCachePath?: string;

  /**
   * Tile size, default size is 256 (for tiles of 256 _ 256 pixels).
   * High-res (aka 'retina') tiles are 512 (tiles of 512 _ 512 pixels)
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  tileSize?: number;

  /**
   * The url template of the map tileserver.
   * (URLTile) The patterns {x} {y} {z} will be replaced at runtime.
   * For example, http://c.tile.openstreetmap.org/{z}/{x}/{y}.png.
   *
   * It is also possible to refer to tiles in local filesystem with file:///top-level-directory/sub-directory/{z}/{x}/{y}.png URL-format.
   * (WMSTile) The patterns {minX} {maxX} {minY} {maxY} {width} {height} will be replaced at runtime according to EPSG:900913 specification bounding box.
   * For example, https://demo.geo-solutions.it/geoserver/tiger/wms?service=WMS&version=1.1.0&request=GetMap&layers=tiger:poi&styles=&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true&format_options=dpi:213.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  urlTemplate: string;

  /**
   * The order in which this tile overlay is drawn with respect to other overlays.
   * An overlay with a larger z-index is drawn over overlays with smaller z-indices.
   * The order of overlays with the same z-index is arbitrary.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  zIndex?: number;
};

type NativeProps = MapWMSTileProps;

export class MapWMSTile extends React.Component<MapWMSTileProps> {
  // declaration only, as they are set through decorateMap
  /// @ts-ignore
  context!: React.ContextType<typeof ProviderContext>;
  getNativeComponent!: () => NativeComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;

  render() {
    const AIRMapWMSTile = this.getNativeComponent();
    return <AIRMapWMSTile {...this.props} />;
  }
}

export default decorateMapComponent(MapWMSTile, 'WMSTile', {
  google: {
    ios: SUPPORTED,
    android: USES_DEFAULT_IMPLEMENTATION,
  },
});
