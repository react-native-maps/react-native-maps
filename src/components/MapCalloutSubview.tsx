import React from 'react';
import { NativeSyntheticEvent, StyleSheet, ViewProps } from 'react-native';
import { Frame, Point } from '../types';
import decorateMapComponent, {
  SUPPORTED,
  NOT_SUPPORTED,
  AirComponent,
  UIManagerCommand,
  MapManagerCommand,
  ProviderContext,
} from './decorateMapComponent';

export class MapCalloutSubview extends React.Component<Props> {
  // declaration only, as they are set through decorateMap
  declare context: React.ContextType<typeof ProviderContext>;
  getAirComponent!: () => AirComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;

  render() {
    const AIRMapCalloutSubview = this.getAirComponent();
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

export default decorateMapComponent(MapCalloutSubview, {
  componentType: 'CalloutSubview',
  providers: {
    google: {
      ios: SUPPORTED,
      android: NOT_SUPPORTED,
    },
  },
});

type Props = ViewProps & {
  /**
   * Callback that is called when the user presses on this subview inside callout
   *
   * @platform iOS: Supported
   * @platform Android: Not supported
   */
  onPress?: (event: CalloutSubviewPressEvent) => void;
};

export type NativeProps = Props;

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
