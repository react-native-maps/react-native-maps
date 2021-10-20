import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { CalloutPressEvent } from '../types';
import decorateMapComponent, {
  AirComponent,
  MapManagerCommand,
  ProviderContext,
  SUPPORTED,
  UIManagerCommand,
  USES_DEFAULT_IMPLEMENTATION,
} from './decorateMapComponent';

const defaultProps: Partial<Props> = {
  tooltip: false,
  alphaHitTest: false,
};

export class MapCallout extends React.Component<Props> {
  static defaultProps = defaultProps;

  // declaration only, as they are set through decorateMap
  declare context: React.ContextType<typeof ProviderContext>;
  getAirComponent!: () => AirComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;

  render() {
    const AIRMapCallout = this.getAirComponent();
    return (
      <AIRMapCallout
        {...this.props}
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

export default decorateMapComponent(MapCallout, {
  componentType: 'Callout',
  providers: {
    google: {
      ios: SUPPORTED,
      android: USES_DEFAULT_IMPLEMENTATION,
    },
  },
});

type Props = ViewProps & {
  /**
   * If `true`, clicks on transparent areas in callout will be passed to map.
   *
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

type NativeProps = Props;
