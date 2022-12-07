import * as React from 'react';
import { NativeSyntheticEvent, ViewProps } from 'react-native';
import { ProviderContext, NativeComponent, MapManagerCommand, UIManagerCommand } from './decorateMapComponent';
import { Frame, Point } from './sharedTypes';
export declare type MapCalloutSubviewProps = ViewProps & {
    /**
     * Callback that is called when the user presses on this subview inside callout
     *
     * @platform iOS: Supported
     * @platform Android: Not supported
     */
    onPress?: (event: CalloutSubviewPressEvent) => void;
};
declare type NativeProps = MapCalloutSubviewProps;
export declare class MapCalloutSubview extends React.Component<MapCalloutSubviewProps> {
    context: React.ContextType<typeof ProviderContext>;
    getNativeComponent: () => NativeComponent<NativeProps>;
    getMapManagerCommand: (name: string) => MapManagerCommand;
    getUIManagerCommand: (name: string) => UIManagerCommand;
    render(): JSX.Element;
}
declare const _default: typeof MapCalloutSubview;
export default _default;
declare type CalloutSubviewPressEvent = NativeSyntheticEvent<{
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
