import * as React from 'react';
import {
  StyleSheet,
  Animated,
  Platform,
  type ViewProps,
  type ImageURISource,
  type ImageRequireSource,
  type NativeSyntheticEvent,
} from 'react-native';

import decorateMapComponent, {
  ProviderContext,
  SUPPORTED,
  USES_DEFAULT_IMPLEMENTATION,
  type MapManagerCommand,
  type NativeComponent,
  type UIManagerCommand,
} from './decorateMapComponent';
import type {LatLng, Point} from './sharedTypes';
import type {Modify} from './sharedTypesInternal';
import {fixImageProp} from './fixImageProp';

export type MapOverlayProps = ViewProps & {
  /**
   * The bearing in degrees clockwise from north. Values outside the range [0, 360) will be normalized.
   *
   * @default 0
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  bearing?: number;

  /**
   * The coordinates for the image (right-top corner, left-bottom corner). ie.```[[lat, long], [lat, long]]```
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

type NativeProps = Modify<MapOverlayProps, {image?: string}>;

function normalizeBounds(bounds: [number, number][]): any {
  return {
    northEast: {latitude: bounds[0][0], longitude: bounds[0][1]},
    southWest: {latitude: bounds[1][0], longitude: bounds[1][1]},
  };
}

export class MapOverlay extends React.Component<MapOverlayProps> {
  // declaration only, as they are set through decorateMap
  /// @ts-ignore
  context!: React.ContextType<typeof ProviderContext>;
  getNativeComponent!: () => NativeComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;

  static Animated: Animated.AnimatedComponent<typeof MapOverlay>;

  private fabricOverlay?: Boolean = undefined;

  render() {
    const {opacity = 1.0, bounds} = this.props;

    if (this.fabricOverlay === undefined) {
      this.fabricOverlay = Platform.OS === 'android';
    }

    const AIRMapOverlay = this.getNativeComponent();
    let image: any = this.props.image;

    let boundsParam: any = bounds;
    if (this.fabricOverlay) {
      if (this.props.image) {
        image = fixImageProp(this.props.image);
      }
      if (bounds) {
        boundsParam = normalizeBounds(bounds);
      }
    } else {
      if (this.props.image) {
        image = fixImageProp(this.props.image);
        if (image.uri) {
          image = image.uri;
        }
      }
    }
    return (
      <AIRMapOverlay
        // @ts-ignore
        bounds={boundsParam}
        opacity={opacity}
        // @ts-ignore
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
   * @platform iOS: Apple Maps
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
