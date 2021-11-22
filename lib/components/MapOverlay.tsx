import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Animated as RNAnimated,
  ViewProps,
  ImageURISource,
  ImageRequireSource,
  NativeSyntheticEvent,
} from 'react-native';
import { LatLng, Modify, Point } from '../types';

import decorateMapComponent, {
  AirComponent,
  MapManagerCommand,
  ProviderContext,
  SUPPORTED,
  UIManagerCommand,
  USES_DEFAULT_IMPLEMENTATION,
} from './decorateMapComponent';

const viewConfig = {
  uiViewClassName: 'AIR<provider>MapOverlay',
  validAttributes: {
    image: true,
  },
};

const defaultProps: Partial<Props> = {
  opacity: 1.0,
};

export class MapOverlay extends Component<Props> {
  static defaultProps = defaultProps;
  static viewConfig = viewConfig;

  // declaration only, as they are set through decorateMap
  declare context: React.ContextType<typeof ProviderContext>;
  getAirComponent!: () => AirComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;

  render() {
    let image;
    if (this.props.image) {
      image = Image.resolveAssetSource(this.props.image) || {};
      image = image.uri;
    }

    const AIRMapOverlay = this.getAirComponent();

    return (
      <AIRMapOverlay
        {...this.props}
        image={image}
        style={[styles.overlay, this.props.style]}
      />
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});

export const Animated = RNAnimated.createAnimatedComponent(MapOverlay);

export default decorateMapComponent(MapOverlay, {
  componentType: 'Overlay',
  providers: {
    google: {
      ios: SUPPORTED,
      android: USES_DEFAULT_IMPLEMENTATION,
    },
  },
});

type Coordinate = [number, number];

type Props = ViewProps & {
  /**
   * The bearing in degrees clockwise from north. Values outside the range [0, 360) will be normalized.
   *
   * @default 0
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  bearing?: number;

  /**
   * The coordinates for the image (left-top corner, right-bottom corner). ie.```[[lat, long], [lat, long]]```
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  bounds: [Coordinate, Coordinate];

  /**
   * A custom image to be used as the overlay.
   * Only required local image resources and uri (as for images located in the net) are allowed to be used.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  image: ImageURISource | ImageRequireSource;

  /**
   * Callback that is called when the user presses on the overlay
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onPress?: (event: OverlayPressEvent) => void;

  /**
   * The opacity of the overlay.
   *
   * @default 1
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  opacity?: number;

  /**
   * Boolean to allow an overlay to be tappable and use the onPress function.
   *
   * @default false
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  tappable?: boolean;
};

type OverlayPressEvent = NativeSyntheticEvent<{
  /**
   * @platform iOS: Apple Maps: `image-overlay-press`
   * @platform Android: `overlay-press`
   */
  action: 'overlay-press' | 'image-overlay-press';

  /**
   * @platform iOS: Apple maps
   */
  name?: string;

  /**
   * @platform iOS: Apple Maps
   * @platform Android
   */
  coordinate?: LatLng;

  /**
   * @platform Android
   */
  position?: Point;
}>;

type NativeProps = Modify<Props, { image?: string }>;
