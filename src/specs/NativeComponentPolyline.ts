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

export type PolylinePressEventHandler = BubblingEventHandler<
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

export interface PolylineFabricNativeProps extends ViewProps {
  /**
   * An array of coordinates to describe the polygon
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  coordinates: ReadonlyArray<LatLng>;

  /**
   * Boolean to indicate whether to draw each segment of the line as a geodesic as opposed to straight lines on the Mercator projection.
   * A geodesic is the shortest path between two points on the Earth's surface.
   * The geodesic curve is constructed assuming the Earth is a sphere.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  geodesic?: boolean;

  /**
   * The line cap style to apply to the open ends of the path
   *
   * @default `round`
   * @platform iOS: Apple Maps only
   * @platform Android: supported
   * */
  lineCap?: WithDefault<'butt' | 'round' | 'square', 'butt'>;

  /**
   * An array of numbers specifying the dash pattern to use for the path.
   * The array contains one or more numbers that indicate the lengths (measured in points)
   * of the line segments and gaps in the pattern.
   * The values in the array alternate, starting with the first line segment length,
   * followed by the first gap length, followed by the second line segment length, and so on.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: supported
   */
  lineDashPattern?: ReadonlyArray<Double>;

  /**
   * The line join style to apply to corners of the path.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: supported
   */
  lineJoin?: WithDefault<'miter' | 'round' | 'bevel', 'miter'>;

  /**
   * Callback that is called when user taps on the map.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onPress?: PolylinePressEventHandler;

  /**
   * The stroke color to use for the path.
   *
   * @default `#000`, `rgba(r,g,b,0.5)`
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  strokeColor?: ColorValue;

  /**
   * The stroke colors to use for the path.
   * @default `#000`, `rgba(r,g,b,0.5)`
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  strokeColors?: ReadonlyArray<ColorValue>;
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

export default codegenNativeComponent<PolylineFabricNativeProps>(
  'RNMapsPolyline',
  {excludedPlatforms: ['iOS']},
) as HostComponent<PolylineFabricNativeProps>;
