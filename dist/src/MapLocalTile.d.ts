import * as React from 'react';
import type { ViewProps } from 'react-native';
import { ProviderContext, type NativeComponent, type MapManagerCommand, type UIManagerCommand } from './decorateMapComponent';
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
export declare class MapLocalTile extends React.Component<MapLocalTileProps> {
    context: React.ContextType<typeof ProviderContext>;
    getNativeComponent: () => NativeComponent<NativeProps>;
    getMapManagerCommand: (name: string) => MapManagerCommand;
    getUIManagerCommand: (name: string) => UIManagerCommand;
    render(): React.JSX.Element;
}
declare const _default: typeof MapLocalTile;
export default _default;
