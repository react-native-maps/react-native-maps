import * as React from 'react';
import { type ViewProps } from 'react-native';
import { ProviderContext, type MapManagerCommand, type NativeComponent, type UIManagerCommand } from './decorateMapComponent';
import type { CalloutPressEvent } from './sharedTypes';
export type MapCalloutProps = ViewProps & {
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
    onPress?: (event: CalloutPressEvent) => void;
    /**
     * If `false`, a default "tooltip" bubble window will be drawn around this callouts children.
     * If `true`, the child views can fully customize their appearance, including any "bubble" like styles.
     *
     * @default false
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    tooltip?: boolean;
};
type NativeProps = MapCalloutProps;
export declare class MapCallout extends React.Component<MapCalloutProps> {
    context: React.ContextType<typeof ProviderContext>;
    getNativeComponent: () => NativeComponent<NativeProps>;
    getMapManagerCommand: (name: string) => MapManagerCommand;
    getUIManagerCommand: (name: string) => UIManagerCommand;
    render(): React.JSX.Element;
}
declare const _default: typeof MapCallout;
export default _default;
