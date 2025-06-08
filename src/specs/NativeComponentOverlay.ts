import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type {
  Double,
  Float,
  BubblingEventHandler,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import type {
  ViewProps,
  HostComponent,
  ImageSourcePropType as ImageSource,
} from 'react-native';
export type LatLng = Readonly<{
  latitude: Double; // Non-nullable Double for latitude
  longitude: Double; // Non-nullable Double for longitude
}>;

export type OverlayPressEventHandler = BubblingEventHandler<
  Readonly<{
    action?: string;
    id: string;
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position?: {
      x: Double; // Inlined Point
      y: Double;
    }; // Optional position for Android
  }>
>;

export interface OverlayFabricNativeProps extends ViewProps {
  /**
   * The bearing in degrees clockwise from north. Values outside the range [0, 360) will be normalized.
   *
   * @default 0
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  bearing?: Float;

  /**
   * The coordinates for the image (left-top corner, right-bottom corner). ie.```[[lat, long], [lat, long]]```
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  bounds: Readonly<{
    northEast: {
      latitude: Double; // Non-nullable Double for latitude
      longitude: Double; // Non-nullable Double for longitude
    };
    southWest: {
      latitude: Double; // Non-nullable Double for latitude
      longitude: Double; // Non-nullable Double for longitude
    };
  }>;

  /**
   * A custom image to be used as the overlay.
   * Only required local image resources and uri (as for images located in the net) are allowed to be used.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  image?: ImageSource | null;

  /**
   * Callback that is called when user taps on the map.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onPress?: OverlayPressEventHandler;

  /**
   * The overlay's opacity between 0.0 and 1.0.
   *
   * @default 1.0
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  opacity?: WithDefault<Float, 1.0>;

  /**
   * Boolean to allow a polygon to be tappable and use the onPress function.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  tappable?: boolean;
}

export default codegenNativeComponent<OverlayFabricNativeProps>(
  'RNMapsOverlay',
  {excludedPlatforms: ['iOS']},
) as HostComponent<OverlayFabricNativeProps>;
