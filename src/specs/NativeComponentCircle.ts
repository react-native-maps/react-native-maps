import type {HostComponent, ViewProps, ColorValue} from 'react-native';

import {codegenNativeComponent} from 'react-native';
import type {
  Double,
  Float,
  BubblingEventHandler,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

export type LatLng = Readonly<{
  latitude: Double; // Non-nullable Double for latitude
  longitude: Double; // Non-nullable Double for longitude
}>;

export type CirclePressEventHandler = BubblingEventHandler<
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

export interface CircleFabricNativeProps extends ViewProps {
  /**
   * The coordinates of the center of the circle.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  center: LatLng;

  /**
   * The stroke color to use for the path.
   *
   * @default `#000`, `rgba(r,g,b,0.5)`
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  fillColor?: ColorValue;

  /**
   * The radius of the circle to be drawn (in meters)
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  radius: Double;

  /**
   * The stroke color to use for the path.
   *
   * @default `#000`, `rgba(r,g,b,0.5)`
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  strokeColor?: ColorValue;

  /**
   * Callback that is called when user taps on the map.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onPress?: CirclePressEventHandler;

  /**
   * The stroke width to use for the path.
   *
   * @default 1
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  strokeWidth?: WithDefault<Float, 1.0>;

  /**
   * Boolean to allow a polygon to be tappable and use the onPress function.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  tappable?: boolean;
}

export default codegenNativeComponent<CircleFabricNativeProps>('RNMapsCircle', {
  excludedPlatforms: ['iOS'],
}) as HostComponent<CircleFabricNativeProps>;
