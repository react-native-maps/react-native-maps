import type {HostComponent, ViewProps, ColorValue} from 'react-native';

import {codegenNativeComponent} from 'react-native';
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
    };
  }>
>;

type LineCapType = 'butt' | 'round' | 'square';
type LineJoinType = 'miter' | 'round' | 'bevel';

export interface ApplePolygonFabricNativeProps extends ViewProps {
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
   * A 2d array of coordinates to describe holes of the polygon where each hole
   * has at least 3 points.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  holes?: ReadonlyArray<ReadonlyArray<LatLng>>;

  /**
   * The line cap style to use for the open ends of the stroke path.
   *
   * @default round
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  lineCap?: WithDefault<LineCapType, 'round'>;

  /**
   * The line join style to use for the corners of the stroke path.
   *
   * @default round
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  lineJoin?: WithDefault<LineJoinType, 'round'>;

  /**
   * The limiting value that helps avoid spikes at junctions between connected
   * line segments.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  miterLimit?: WithDefault<Float, 10.0>;

  /**
   * The phase at which to start the line dash pattern.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  lineDashPhase?: WithDefault<Float, 0.0>;

  /**
   * An array of numbers specifying the dash pattern to use for the path.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  lineDashPattern?: ReadonlyArray<Float>;

  /**
   * Callback that is called when the user taps the polygon.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onPress?: PolygonPressEventHandler;
}

export default codegenNativeComponent<ApplePolygonFabricNativeProps>(
  'RNMapsPolygon',
  {
    // iOS-only: on Android, polygons use the shared `RNMapsGooglePolygon` component.
    excludedPlatforms: ['android'],
  },
) as HostComponent<ApplePolygonFabricNativeProps>;
