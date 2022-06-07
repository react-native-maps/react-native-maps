import * as React from 'react';
import {
  StyleSheet,
  Image,
  Animated,
  ViewProps,
  ImageURISource,
  ImageRequireSource,
  NativeSyntheticEvent,
} from 'react-native';

import decorateMapComponent, {
  MapManagerCommand,
  NativeComponent,
  ProviderContext,
  SUPPORTED,
  UIManagerCommand,
  USES_DEFAULT_IMPLEMENTATION,
} from './decorateMapComponent';
import {LatLng, Modify, Point} from './sharedTypes';

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

type NativeProps = Modify<Props, {image?: string}>;

export class MapOverlay extends React.Component<Props> {
  // declaration only, as they are set through decorateMap
  declare context: React.ContextType<typeof ProviderContext>;
  getNativeComponent!: () => NativeComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;

  static Animated: Animated.AnimatedComponent<typeof MapOverlay>;

  render() {
    const {opacity = 1.0} = this.props;
    let image: string | undefined;
    if (
      typeof this.props.image !== 'number' &&
      this.props.image.uri?.startsWith('http')
    ) {
      image = this.props.image.uri;
    } else {
      const sourceAsset = Image.resolveAssetSource(this.props.image) || {};
      image = sourceAsset.uri;
    }

    const AIRMapOverlay = this.getNativeComponent();

    return (
      <AIRMapOverlay
        {...this.props}
        opacity={opacity}
        image={image}
        style={[styles.overlay, this.props.style]}
      />
    );
  }
}

type Coordinate = [number, number];

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

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});

MapOverlay.Animated = Animated.createAnimatedComponent(MapOverlay);

export default decorateMapComponent(MapOverlay, 'Overlay', {
  google: {
    ios: SUPPORTED,
    android: USES_DEFAULT_IMPLEMENTATION,
  },
});
