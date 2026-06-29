// @ts-nocheck
import type {HostComponent} from 'react-native';
import type {
  ViewProps,
  ColorValue,
  ImageSourcePropType as ImageSource,
} from 'react-native';

import {codegenNativeComponent, codegenNativeCommands} from 'react-native';
import type {
  Int32,
  Double,
  Float,
  BubblingEventHandler,
  DirectEventHandler,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

export type LatLng = Readonly<{
  latitude: Double; // Non-nullable Double for latitude
  longitude: Double; // Non-nullable Double for longitude
}>;

export type MarkerPressEventHandler = BubblingEventHandler<
  Readonly<{
    action: string;
    id?: string;
    coordinate?: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position?: {
      x: Double;
      y: Double;
    };
  }>
>;

export type MarkerDragEventHandler = DirectEventHandler<
  Readonly<{
    id?: string;
    coordinate?: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position?: {
      x: Double;
      y: Double;
    };
  }>
>;

export type MarkerSelectEventHandler = DirectEventHandler<
  Readonly<{
    action?: string;
    id?: string;
    coordinate?: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position?: {
      x: Double;
      y: Double;
    };
  }>
>;

export type CalloutPressEventHandler = BubblingEventHandler<
  Readonly<{
    action: string;
    id?: string;
    frame?: {
      x: Double; // Inlined LatLng
      y: Double;
      width: Double; // Inlined LatLng
      height: Double;
    };
    point?: {
      x: Double;
      y: Double;
    };
  }>
>;

export type Point = Readonly<{
  x: Double; // Non-nullable Double for x
  y: Double; // Non-nullable Double for y
}>;

export interface GoogleMarkerFabricNativeProps extends ViewProps {
  /**
   * Sets the anchor point for the marker.
   * The anchor specifies the point in the icon image that is anchored to the
   * marker's position on the Earth's surface.
   *
   * @default {x: 0.5, y: 1.0}
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  anchor?: Point;

  /**
   * Specifies the point in the marker image at which to anchor the callout when
   * it is displayed.
   *
   * @default {x: 0.5, y: 0.0}
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  calloutAnchor?: Point;

  /**
   * A custom image to be used as the marker's icon. Only local image resources
   * are allowed to be used.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  image?: ImageSource | null;

  /**
   * A custom image to be used as the marker's icon (Google Maps icon source).
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  icon?: ImageSource | null;

  /**
   * The coordinate for the marker.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  coordinate: LatLng;

  /**
   * The description of the marker, shown in the default callout.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  description?: string;

  /**
   * if `true` allows the marker to be draggable (re-positioned).
   *
   * @default false
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  draggable?: boolean;

  /**
   * The title of the marker, shown in the default callout.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  title?: string;

  /**
   * Sets whether this marker should track view changes.
   * Turn it off whenever possible to improve custom marker performance.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  tracksViewChanges?: WithDefault<boolean, true>;

  /**
   * Captures a static bitmap snapshot of the marker in its current visual state.
   * Useful for performance optimizations (e.g. rendering complex custom views as images).
   * Doesn't work with `tracksViewChanges`. When `snapshot` is enabled, `tracksViewChanges` will be automatically disabled.
   * Use `redraw` to refresh the snapshot.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Not supported
   */
  useSnapshot?: WithDefault<boolean, false>;

  /**
   * Optional cache key for the marker's snapshot.
   * When provided, the snapshot image will be reused across renders
   * as long as the cache key remains the same.
   *
   * Useful when multiple markers share the same appearance or
   * when you want to persist a snapshot between updates.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Not supported
   */
  snapshotCacheKey?: string;

  /**
   * Sets whether this marker's info window should track view changes.
   *
   * @default false
   * @platform iOS: Google Maps only
   * @platform Android: Not supported
   */
  tracksInfoWindowChanges?: WithDefault<boolean, false>;

  /**
   * Sets whether this marker should be flat against the map (true) or a
   * billboard facing the camera (false).
   *
   * @default false
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  flat?: WithDefault<boolean, false>;

  /**
   * The rotation of the marker in degrees clockwise from the default position.
   *
   * @default 0
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  rotation?: WithDefault<Float, 0>;

  /**
   * A string that can be used to identify this marker.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  identifier?: string;

  /**
   * Whether the marker is tappable.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  tappable?: WithDefault<boolean, true>;

  /**
   * Callback that is called when the user taps the callout view.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onCalloutPress?: CalloutPressEventHandler;

  /**
   * Callback called continuously as the marker is dragged.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onDrag?: MarkerDragEventHandler;

  /**
   * Callback that is called when a drag on the marker finishes.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onDragEnd?: MarkerDragEventHandler;

  /**
   * Callback that is called when the user initiates a drag on the marker.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onDragStart?: MarkerDragEventHandler;

  /**
   * Callback that is called when the marker is tapped by the user.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onPress?: MarkerPressEventHandler;

  /**
   * Callback that is called when the marker becomes selected.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onSelect?: MarkerSelectEventHandler;

  /**
   * Callback that is called when the marker is deselected.
   *
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  onDeselect?: MarkerSelectEventHandler;

  /**
   * The marker's opacity between 0.0 and 1.0.
   *
   * @default 1.0
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  opacity?: WithDefault<Double, 1.0>;

  /**
   * If no custom marker view or custom image is provided, the platform default
   * pin will be used, which can be customized by this color.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  pinColor?: ColorValue;
}

export interface NativeCommands {
  animateToCoordinates: (
    viewRef: React.ElementRef<React.ComponentType>,
    latitude: Double,
    longitude: Double,
    duration: Int32,
  ) => void;
  setCoordinates: (
    viewRef: React.ElementRef<React.ComponentType>,
    latitude: Double,
    longitude: Double,
  ) => void;
  showCallout: (viewRef: React.ElementRef<React.ComponentType>) => void;
  hideCallout: (viewRef: React.ElementRef<React.ComponentType>) => void;
  redrawCallout: (viewRef: React.ElementRef<React.ComponentType>) => void;
  redraw: (viewRef: React.ElementRef<React.ComponentType>) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: [
    'setCoordinates',
    'animateToCoordinates',
    'showCallout',
    'hideCallout',
    'redrawCallout',
    'redraw',
  ],
});

export default codegenNativeComponent<GoogleMarkerFabricNativeProps>(
  'RNMapsGoogleMarker',
  {
    // iOS-only: on Android, markers use the shared `RNMapsMarker` component.
    excludedPlatforms: ['android'],
  },
) as HostComponent<GoogleMarkerFabricNativeProps>;
