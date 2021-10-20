import React from 'react';
import {
  processColor,
  ProcessedColorValue,
  View,
  ViewProps,
} from 'react-native';
import { LatLng, Modify } from '../types';
import decorateMapComponent, {
  AirComponent,
  MapManagerCommand,
  ProviderContext,
  SUPPORTED,
  UIManagerCommand,
  USES_DEFAULT_IMPLEMENTATION,
} from './decorateMapComponent';

export class MapHeatmap extends React.Component<Props> {
  private heatmap: NativeProps['ref'];
  // declaration only, as they are set through decorateMap
  declare context: React.ContextType<typeof ProviderContext>;
  getAirComponent!: () => AirComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;

  constructor(props: Props) {
    super(props);
    this.heatmap = React.createRef<View>();
  }

  setNativeProps(props: Partial<NativeProps>) {
    this.heatmap.current?.setNativeProps(props);
  }

  render() {
    const AIRMapHeatmap = this.getAirComponent();
    const propGradient = this.props.gradient;
    let gradient: NativeProps['gradient'];
    if (propGradient) {
      const colors = propGradient.colors.map((c) => processColor(c));
      gradient = { ...propGradient, colors };
    }
    return (
      <AIRMapHeatmap {...this.props} gradient={gradient} ref={this.heatmap} />
    );
  }
}

export default decorateMapComponent(MapHeatmap, {
  componentType: 'Heatmap',
  providers: {
    google: {
      ios: SUPPORTED,
      android: USES_DEFAULT_IMPLEMENTATION,
    },
  },
});

type WeightedLatLng = LatLng & {
  weight?: number;
};

type Props = ViewProps & {
  gradient?: {
    /**
     * Resolution of color map -- number corresponding to the number of steps colors are interpolated into.
     *
     * @default 256
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    colorMapSize: number;

    /**
     * Colors (one or more) to used for gradient.
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    colors: string[];

    /**
     * Array of floating point values from 0 to 1 representing where each color starts.
     *
     * Array length must be equal to `colors` array length.
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    startPoints: number[];
  };

  /**
   * The opacity of the heatmap.
   *
   * @default 0.7
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  opacity?: number;

  /**
   * Array of heatmap entries to apply towards density.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  points?: WeightedLatLng[];

  /**
   * The radius of the heatmap points in pixels, between 10 and 50.
   *
   * @default 20
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  radius?: number;
};

type NativeProps = Modify<
  Props,
  {
    gradient?: Modify<
      Props['gradient'],
      { colors: (ProcessedColorValue | null | undefined)[] }
    >;
  }
> & {
  ref: React.RefObject<View>;
};
