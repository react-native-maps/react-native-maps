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

export type MapLocalTileProps = ViewProps & {
  /**
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  pathTemplate: string;

  /**
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  tileSize?: number;

  /**
   * Set to true to use pathTemplate to open files from Android's AssetManager. The default is false.
   * @platform android
   */
  useAssets?: boolean;

  /**
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  zIndex?: number;
};

type NativeProps = MapLocalTileProps;

export class MapLocalTile extends React.Component<MapLocalTileProps> {
  // declaration only, as they are set through decorateMap
  /// @ts-ignore
  context!: React.ContextType<typeof ProviderContext>;
  getNativeComponent!: () => NativeComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;

  render() {
    const AIRMapLocalTile = this.getNativeComponent();
    return <AIRMapLocalTile {...this.props} />;
  }
}

export default decorateMapComponent(MapLocalTile, 'LocalTile', {
  google: {
    ios: SUPPORTED,
    android: USES_DEFAULT_IMPLEMENTATION,
  },
});
