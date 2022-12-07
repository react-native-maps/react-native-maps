import * as React from 'react';
import { Animated, ViewProps, ImageURISource, ImageRequireSource, NativeSyntheticEvent } from 'react-native';
import { MapManagerCommand, NativeComponent, ProviderContext, UIManagerCommand } from './decorateMapComponent';
import { LatLng, Point } from './sharedTypes';
import { Modify } from './sharedTypesInternal';
export declare type MapOverlayProps = ViewProps & {
    /**
     * The bearing in degrees clockwise from north. Values outside the range [0, 360) will be normalized.
     *
     * @default 0
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    bearing?: number;
    /**
     * The coordinates for the image (left-top corner, right-bottom corner). ie.```[[lat, long], [lat, long]]```
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    bounds: [Coordinate, Coordinate];
    /**
     * A custom image to be used as the overlay.
     * Only required local image resources and uri (as for images located in the net) are allowed to be used.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    image: ImageURISource | ImageRequireSource;
    /**
     * Callback that is called when the user presses on the overlay
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    onPress?: (event: OverlayPressEvent) => void;
    /**
     * The opacity of the overlay.
     *
     * @default 1
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    opacity?: number;
    /**
     * Boolean to allow an overlay to be tappable and use the onPress function.
     *
     * @default false
     * @platform iOS: Not supported
     * @platform Android: Supported
     */
    tappable?: boolean;
};
declare type NativeProps = Modify<MapOverlayProps, {
    image?: string;
}>;
export declare class MapOverlay extends React.Component<MapOverlayProps> {
    context: React.ContextType<typeof ProviderContext>;
    getNativeComponent: () => NativeComponent<NativeProps>;
    getMapManagerCommand: (name: string) => MapManagerCommand;
    getUIManagerCommand: (name: string) => UIManagerCommand;
    static Animated: Animated.AnimatedComponent<typeof MapOverlay>;
    render(): JSX.Element;
}
declare type Coordinate = [number, number];
declare type OverlayPressEvent = NativeSyntheticEvent<{
    /**
     * @platform iOS: Apple Maps: `image-overlay-press`
     * @platform Android: `overlay-press`
     */
    action: 'overlay-press' | 'image-overlay-press';
    /**
     * @platform iOS: Apple maps
     */
    name?: string;
    /**
     * @platform iOS: Apple Maps
     * @platform Android
     */
    coordinate?: LatLng;
    /**
     * @platform Android
     */
    position?: Point;
}>;
declare const _default: typeof MapOverlay;
export default _default;
