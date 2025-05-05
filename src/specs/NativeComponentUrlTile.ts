import type {HostComponent, ViewProps} from 'react-native';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type {
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

export interface UrlTileFabricNativeProps extends ViewProps {
  /**
   * Doubles tile size from 256 to 512 utilising higher zoom levels
   * i.e loading 4 higher zoom level tiles and combining them for one high-resolution tile.
   * iOS does this automatically, even if it is not desirable always.
   * NB! using this makes text labels smaller than in the original map style.
   *
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  doubleTileSize?: boolean;

  /**
   * Allow tiles using the TMS coordinate system (origin bottom left) to be used,
   * and displayed at their correct coordinates.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  flipY?: boolean;

  /**
   * The maximum native zoom level for this tile overlay i.e. the highest zoom level that the tile server provides.
   * Tiles are auto-scaled for higher zoom levels.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  maximumNativeZ?: WithDefault<Int32, 100>;

  /**
   * The maximum zoom level for this tile overlay.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  maximumZ?: WithDefault<Int32, 100>;

  /**
   * The minimum zoom level for this tile overlay.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  minimumZ?: Int32;

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
  tileCacheMaxAge?: Int32;

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
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  tileSize?: WithDefault<Int32, 256>;

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
}

export default codegenNativeComponent<UrlTileFabricNativeProps>(
  'RNMapsUrlTile',
  {
    excludedPlatforms: ['iOS'],
  },
) as HostComponent<UrlTileFabricNativeProps>;
