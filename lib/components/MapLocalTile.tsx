import React from 'react';

import decorateMapComponent, {
  USES_DEFAULT_IMPLEMENTATION,
  SUPPORTED,
  AirComponent,
  UIManagerCommand,
  MapManagerCommand,
  ProviderContext,
} from './decorateMapComponent';
import { ViewProps } from 'react-native';

export class MapLocalTile extends React.Component<Props> {
  // declaration only, as they are set through decorateMap
  declare context: React.ContextType<typeof ProviderContext>;
  getAirComponent!: () => AirComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;

  render() {
    const AIRMapLocalTile = this.getAirComponent();
    return <AIRMapLocalTile {...this.props} />;
  }
}

export default decorateMapComponent(MapLocalTile, {
  componentType: 'LocalTile',
  providers: {
    google: {
      ios: SUPPORTED,
      android: USES_DEFAULT_IMPLEMENTATION,
    },
  },
});

type Props = ViewProps & {
  // flipY?: boolean;
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
