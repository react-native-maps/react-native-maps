import * as React from 'react';
import {StyleSheet, type ViewProps} from 'react-native';
import decorateMapComponent, {
  ProviderContext,
  SUPPORTED,
  USES_DEFAULT_IMPLEMENTATION,
  type MapManagerCommand,
  type NativeComponent,
  type UIManagerCommand,
} from './decorateMapComponent';
import type {CalloutPressEvent} from './sharedTypes';

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

export class MapCallout extends React.Component<MapCalloutProps> {
  // declaration only, as they are set through decorateMap
  /// @ts-ignore
  context!: React.ContextType<typeof ProviderContext>;
  getNativeComponent!: () => NativeComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;

  render() {
    const {tooltip = false, alphaHitTest = false} = this.props;
    const AIRMapCallout = this.getNativeComponent();
    return (
      <AIRMapCallout
        {...this.props}
        tooltip={tooltip}
        alphaHitTest={alphaHitTest}
        style={[styles.callout, this.props.style]}
      />
    );
  }
}

const styles = StyleSheet.create({
  callout: {
    position: 'absolute',
  },
});

export default decorateMapComponent(MapCallout, 'Callout', {
  google: {
    ios: SUPPORTED,
    android: USES_DEFAULT_IMPLEMENTATION,
  },
});
