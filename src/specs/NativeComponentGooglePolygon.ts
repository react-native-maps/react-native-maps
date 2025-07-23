import type {HostComponent, ViewProps, ColorValue} from 'react-native';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type {
  Double,
  BubblingEventHandler,
  Float,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

export type LatLng = Readonly<{
  latitude: Double; // Non-nullable Double for latitude
  longitude: Double; // Non-nullable Double for longitude
}>;

export type PolygonPressEventHandler = BubblingEventHandler<
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

export interface PolygonFabricNativeProps extends ViewProps {
  /**
   * An array of coordinates to describe the polygon
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  coordinates: ReadonlyArray<LatLng>;
  /**
   * The fill color to use for the path.
   *
   * @default `#000`, `rgba(r,g,b,0.5)`
   * @platform iOS: Supported
   * @platform Android: Supported
   */

  fillColor?: ColorValue;

  /**
   * The stroke color to use for the path.
   *
   * @default `#000`, `rgba(r,g,b,0.5)`
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  strokeColor?: ColorValue;

  /**
   * The stroke width to use for the path.
   *
   * @default 1
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  strokeWidth?: WithDefault<Float, 1.0>;

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
   * A 2d array of coordinates to describe holes of the polygon where each hole has at least 3 points.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  holes?: ReadonlyArray<ReadonlyArray<LatLng>>;

  /**
   * Boolean to allow a polygon to be tappable and use the onPress function.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  tappable?: boolean;

  /**
   * Callback that is called when user taps on the map.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onPress?: PolygonPressEventHandler;
}

export default codegenNativeComponent<PolygonFabricNativeProps>(
  'RNMapsGooglePolygon',
  {},
) as HostComponent<PolygonFabricNativeProps>;
