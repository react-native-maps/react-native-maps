import * as React from 'react';
import {ViewProps} from 'react-native';

import decorateMapComponent, {
  USES_DEFAULT_IMPLEMENTATION,
  SUPPORTED,
  ProviderContext,
  NativeComponent,
  MapManagerCommand,
  UIManagerCommand,
} from './decorateMapComponent';

type Props = ViewProps & {
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
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  zIndex?: number;
};

type NativeProps = Props;

export class MapLocalTile extends React.Component<Props> {
  // declaration only, as they are set through decorateMap
  declare context: React.ContextType<typeof ProviderContext>;
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
