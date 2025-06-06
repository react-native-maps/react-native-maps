import React from 'react';
import type {ViewProps} from 'react-native';
import {useProviderComponent} from './hooks/useProviderComponent.ts';
import {
  SUPPORTED,
  USES_DEFAULT_IMPLEMENTATION,
} from './decorateMapComponent.ts';

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

const PROVIDER_CONFIG = {
  google: {
    ios: SUPPORTED,
    android: USES_DEFAULT_IMPLEMENTATION,
  },
};

export function MapLocalTile(props: MapLocalTileProps) {
  const AIRMapLocalTile = useProviderComponent('LocalTile', PROVIDER_CONFIG);

  return <AIRMapLocalTile {...props} />;
}

export default MapLocalTile;
