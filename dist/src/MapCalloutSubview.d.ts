import * as React from 'react';
import { type NativeSyntheticEvent, type ViewProps } from 'react-native';
import { ProviderContext, type NativeComponent, type MapManagerCommand, type UIManagerCommand } from './decorateMapComponent';
import type { Frame, Point } from './sharedTypes';
export type MapCalloutSubviewProps = ViewProps & {
    /**
     * Callback that is called when the user presses on this subview inside callout
     *
     * @platform iOS: Supported
     * @platform Android: Not supported
     */
    onPress?: (event: CalloutSubviewPressEvent) => void;
};
type NativeProps = MapCalloutSubviewProps;
export declare class MapCalloutSubview extends React.Component<MapCalloutSubviewProps> {
    context: React.ContextType<typeof ProviderContext>;
    getNativeComponent: () => NativeComponent<NativeProps>;
    getMapManagerCommand: (name: string) => MapManagerCommand;
    getUIManagerCommand: (name: string) => UIManagerCommand;
    render(): React.JSX.Element;
}
declare const _default: typeof MapCalloutSubview;
export default _default;
type CalloutSubviewPressEvent = NativeSyntheticEvent<{
    /**
     * Apple Maps: `callout-inside-press`
     *
     * Google Maps: `marker-inside-overlay-press`
     */
    action: 'callout-inside-press' | 'marker-inside-overlay-press';
    frame: Frame;
    id: string;
    point: Point;
}>;
