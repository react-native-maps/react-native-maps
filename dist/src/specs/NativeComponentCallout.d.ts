import type { HostComponent, ViewProps } from 'react-native';
import type { Double, BubblingEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
export type LatLng = Readonly<{
    latitude: Double;
    longitude: Double;
}>;
export type CalloutPressEvent = BubblingEventHandler<Readonly<{
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
export interface CalloutFabricNativeProps extends ViewProps {
    /**
     * If `true`, clicks on transparent areas in callout will be passed to map.
     *
     * @default false
     * @platform iOS: Supported
     * @platform Android: Not supported
     */
    alphaHitTest?: boolean;
    /**
     * Callback that is called when the user presses on the callout
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    onPress?: CalloutPressEvent;
    /**
     * If `false`, a default "tooltip" bubble window will be drawn around this callouts children.
     * If `true`, the child views can fully customize their appearance, including any "bubble" like styles.
     *
     * @default false
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    tooltip?: boolean;
}
declare const _default: HostComponent<CalloutFabricNativeProps>;
export default _default;
