import * as React from 'react';
import {
  StyleSheet,
  type NativeSyntheticEvent,
  type ViewProps,
} from 'react-native';
import decorateMapComponent, {
  SUPPORTED,
  NOT_SUPPORTED,
  ProviderContext,
  type NativeComponent,
  type MapManagerCommand,
  type UIManagerCommand,
} from './decorateMapComponent';
import type {Frame, Point} from './sharedTypes';

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

export class MapCalloutSubview extends React.Component<MapCalloutSubviewProps> {
  // declaration only, as they are set through decorateMap
  /// @ts-ignore
  context!: React.ContextType<typeof ProviderContext>;
  getNativeComponent!: () => NativeComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;
  render() {
    const AIRMapCalloutSubview = this.getNativeComponent();
    return (
      <AIRMapCalloutSubview
        {...this.props}
        style={[styles.calloutSubview, this.props.style]}
      />
    );
  }
}

const styles = StyleSheet.create({
  calloutSubview: {},
});

export default decorateMapComponent(MapCalloutSubview, 'CalloutSubview', {
  google: {
    ios: SUPPORTED,
    android: NOT_SUPPORTED,
  },
});

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
