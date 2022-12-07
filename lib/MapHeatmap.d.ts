import * as React from 'react';
import { ProcessedColorValue, View, ViewProps } from 'react-native';
import { MapManagerCommand, NativeComponent, ProviderContext, UIManagerCommand } from './decorateMapComponent';
import { LatLng } from './sharedTypes';
import { Modify } from './sharedTypesInternal';
export declare type MapHeatmapProps = ViewProps & {
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
declare type NativeProps = Modify<MapHeatmapProps, {
    gradient?: Modify<MapHeatmapProps['gradient'], {
        colors: (ProcessedColorValue | null | undefined)[];
    }>;
}> & {
    ref: React.RefObject<View>;
};
export declare class MapHeatmap extends React.Component<MapHeatmapProps> {
    context: React.ContextType<typeof ProviderContext>;
    getNativeComponent: () => NativeComponent<NativeProps>;
    getMapManagerCommand: (name: string) => MapManagerCommand;
    getUIManagerCommand: (name: string) => UIManagerCommand;
    private heatmap;
    constructor(props: MapHeatmapProps);
    setNativeProps(props: Partial<NativeProps>): void;
    render(): JSX.Element;
}
declare const _default: typeof MapHeatmap;
export default _default;
declare type WeightedLatLng = LatLng & {
    weight?: number;
};
