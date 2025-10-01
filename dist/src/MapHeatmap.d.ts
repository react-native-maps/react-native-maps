import * as React from 'react';
import { View, type ProcessedColorValue, type ViewProps } from 'react-native';
import { ProviderContext, type MapManagerCommand, type NativeComponent, type UIManagerCommand } from './decorateMapComponent';
import type { LatLng } from './sharedTypes';
import type { Modify } from './sharedTypesInternal';
export type MapHeatmapProps = ViewProps & {
    gradient?: {
        /**
         * Resolution of color map -- number corresponding to the number of steps colors are interpolated into.
         *
         * @default 256
         * @platform iOS: Google Maps only
         * @platform Android: Supported
         */
        colorMapSize: number;
        /**
         * Colors (one or more) to used for gradient.
         *
         * @platform iOS: Google Maps only
         * @platform Android: Supported
         */
        colors: string[];
        /**
         * Array of floating point values from 0 to 1 representing where each color starts.
         *
         * Array length must be equal to `colors` array length.
         *
         * @platform iOS: Google Maps only
         * @platform Android: Supported
         */
        startPoints: number[];
    };
    /**
     * The opacity of the heatmap.
     *
     * @default 0.7
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    opacity?: number;
    /**
     * Array of heatmap entries to apply towards density.
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    points?: WeightedLatLng[];
    /**
     * The radius of the heatmap points in pixels, between 10 and 50.
     *
     * @default 20
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    radius?: number;
};
type NativeProps = Modify<MapHeatmapProps, {
    gradient?: Modify<MapHeatmapProps['gradient'], {
        colors: (ProcessedColorValue | null | undefined)[];
    }>;
}> & {
    ref: React.RefObject<View | null>;
};
export declare class MapHeatmap extends React.Component<MapHeatmapProps | null> {
    context: React.ContextType<typeof ProviderContext>;
    getNativeComponent: () => NativeComponent<NativeProps>;
    getMapManagerCommand: (name: string) => MapManagerCommand;
    getUIManagerCommand: (name: string) => UIManagerCommand;
    private heatmap;
    constructor(props: MapHeatmapProps);
    setNativeProps(props: Partial<NativeProps>): void;
    render(): React.JSX.Element;
}
declare const _default: typeof MapHeatmap;
export default _default;
type WeightedLatLng = LatLng & {
    weight?: number;
};
