import * as React from 'react';
import { Animated, type ViewProps, type ImageURISource, type ImageRequireSource, type NativeSyntheticEvent } from 'react-native';
import { ProviderContext, type MapManagerCommand, type NativeComponent, type UIManagerCommand } from './decorateMapComponent';
import type { LatLng, Point } from './sharedTypes';
import type { Modify } from './sharedTypesInternal';
export type MapOverlayProps = ViewProps & {
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
type NativeProps = Modify<MapOverlayProps, {
    image?: string;
}>;
export declare class MapOverlay extends React.Component<MapOverlayProps> {
    context: React.ContextType<typeof ProviderContext>;
    getNativeComponent: () => NativeComponent<NativeProps>;
    getMapManagerCommand: (name: string) => MapManagerCommand;
    getUIManagerCommand: (name: string) => UIManagerCommand;
    static Animated: Animated.AnimatedComponent<typeof MapOverlay>;
    private fabricOverlay?;
    render(): React.JSX.Element;
}
type Coordinate = [number, number];
type OverlayPressEvent = NativeSyntheticEvent<{
    /**
     * @platform iOS: Apple Maps: `image-overlay-press`
     * @platform Android: `overlay-press`
     */
    action: 'overlay-press' | 'image-overlay-press';
    /**
     * @platform iOS: Apple Maps
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
