import type { Double, Float, BubblingEventHandler, WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps, HostComponent, ImageSourcePropType as ImageSource } from 'react-native';
export type LatLng = Readonly<{
    latitude: Double;
    longitude: Double;
}>;
export type OverlayPressEventHandler = BubblingEventHandler<Readonly<{
    action?: string;
    id: string;
    coordinate: {
        latitude: Double;
        longitude: Double;
    };
    position?: {
        x: Double;
        y: Double;
    };
}>>;
export interface OverlayFabricNativeProps extends ViewProps {
    /**
     * The bearing in degrees clockwise from north. Values outside the range [0, 360) will be normalized.
     *
     * @default 0
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    bearing?: Float;
    /**
     * The coordinates for the image (left-top corner, right-bottom corner). ie.```[[lat, long], [lat, long]]```
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    bounds: Readonly<{
        northEast: {
            latitude: Double;
            longitude: Double;
        };
        southWest: {
            latitude: Double;
            longitude: Double;
        };
    }>;
    /**
     * A custom image to be used as the overlay.
     * Only required local image resources and uri (as for images located in the net) are allowed to be used.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    image?: ImageSource | null;
    /**
     * Callback that is called when user taps on the map.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    onPress?: OverlayPressEventHandler;
    /**
     * The overlay's opacity between 0.0 and 1.0.
     *
     * @default 1.0
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    opacity?: WithDefault<Float, 1.0>;
    /**
     * Boolean to allow a polygon to be tappable and use the onPress function.
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    tappable?: boolean;
}
declare const _default: HostComponent<OverlayFabricNativeProps>;
export default _default;
