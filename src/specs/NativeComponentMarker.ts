// @ts-nocheck
import type {HostComponent} from 'react-native';
import type {
  ViewProps,
  ColorValue,
  ImageSourcePropType as ImageSource,
} from 'react-native';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import type {
  Int32,
  Double,
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

type AppleMarkerVisibility = 'hidden' | 'adaptive' | 'visible';

export type AppleMarkerPriority = 'required' | 'high' | 'low';

export type Point = Readonly<{
  x: Double; // Non-nullable Double for x
  y: Double; // Non-nullable Double for y
}>;

export interface MarkerFabricNativeProps extends ViewProps {
  /**
   * Sets the anchor point for the marker.
   * The anchor specifies the point in the icon image that is anchored to the marker's position on the Earth's surface.
   *
   * The anchor point is specified in the continuous space [0.0, 1.0] x [0.0, 1.0],
   * where (0, 0) is the top-left corner of the image, and (1, 1) is the bottom-right corner.
   *
   * The anchoring point in a W x H image is the nearest discrete grid point in a (W + 1) x (H + 1) grid, obtained by scaling the then rounding.
   * For example, in a 4 x 2 image, the anchor point (0.7, 0.6) resolves to the grid point at (3, 1).
   *
   * @default {x: 0.5, y: 1.0}
   * @platform iOS: Google Maps only. For Apple Maps, see the `centerOffset` prop
   * @platform Android: Supported
   */
  anchor?: Point;
  /**
   * Specifies the point in the marker image at which to anchor the callout when it is displayed.
   * This is specified in the same coordinate system as the anchor.
   *
   * See the `anchor` prop for more details.
   *
   * @default {x: 0.5, y: 0.0}
   * @platform iOS: Google Maps only. For Apple Maps, see the `calloutOffset` prop
   * @platform Android: Supported
   */
  calloutAnchor?: Point;

  /**
   * A custom image to be used as the marker's icon. Only local image resources are allowed to be used.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  image?: ImageSource | null;

  /**
   * The offset (in points) at which to place the callout bubble.
   * When this property is set to (0, 0),
   * the anchor point of the callout bubble is placed on the top-center point of the marker view’s frame.
   *
   * Specifying positive offset values moves the callout bubble down and to the right,
   * while specifying negative values moves it up and to the left
   *
   * @default {x: 0.0, y: 0.0}
   * @platform iOS: Apple Maps only. For Google Maps, see the `calloutAnchor` prop
   * @platform Android: Not supported. See the `calloutAnchor` prop
   */
  calloutOffset?: Point;
  /**
     Constants that indicates the display priority for annotations.
     @default required
     @platform iOS: Apple Maps only.
     @platform Android: Not supported

      Required: A constant indicating that the item is required.
      High: A constant indicating that the item’s display priority is high.
      Low: A constant indicating that the item’s display priority is Low.
     */
  displayPriority?: WithDefault<AppleMarkerPriority, 'required'>;

  /**
   * The offset (in points) at which to display the annotation view.
   *
   * By default, the center point of an annotation view is placed at the coordinate point of the associated annotation.
   *
   * Positive offset values move the annotation view down and to the right, while negative values move it up and to the left.
   *
   * @default {x: 0.0, y: 0.0}
   * @platform iOS: Apple Maps only. For Google Maps, see the `anchor` prop
   * @platform Android: Not supported. see the `anchor` prop
   */
  centerOffset?: Point;

  /**
   * The coordinate for the marker.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  coordinate: LatLng;

  /**
   * The description of the marker.
   *
   * This is only used if the <Marker /> component has no children that are a `<Callout />`,
   * in which case the default callout behavior will be used,
   * which will show both the `title` and the `description`, if provided.
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
   * The title of the marker.
   * This is only used if the <Marker /> component has no `<Callout />` children.
   *
   * If the marker has <Callout /> children, default callout behavior will be used,
   * which will show both the `title` and the `description`, if provided.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  title?: string;

  /**
   * Sets whether this marker should track view changes.
   * It's recommended to turn it off whenever it's possible to improve custom marker performance.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  tracksViewChanges?: WithDefault<boolean, true>;

  /**
   * A string that can be used to identify this marker.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  identifier?: string;

  /**
   * When true, the marker will be pre-selected.
   * Setting this to true allows the user to drag the marker without needing to tap on it first to focus it.
   *
   * @default false
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  isPreselected?: boolean;

  /**
   * Callback that is called when the user taps the callout view.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onCalloutPress?: CalloutPressEventHandler;

  /**
   * Callback that is called when the marker is deselected, before the callout is hidden.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: supported
   */
  onDeselect?: MarkerPressEventHandler;

  /**
   * Callback called continuously as the marker is dragged
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onDrag?: MarkerDragEventHandler;

  /**
   * Callback that is called when a drag on the marker finishes.
   * This is usually the point you will want to setState on the marker's coordinate again
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onDragEnd?: MarkerDragEventHandler;

  /**
   * Callback that is called when the user initiates a drag on the marker (if it is draggable)
   *
   * @platform iOS: Apple Maps only
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
   * This will be called when the callout for that marker is about to be shown.
   *
   * @platform iOS: Supported.
   * @platform Android: Supported
   */
  onSelect?: MarkerPressEventHandler;

  /**
   * The marker's opacity between 0.0 and 1.0.
   *
   * @default 1.0
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  opacity?: WithDefault<Double, 1.0>;

  /**
   * If no custom marker view or custom image is provided, the platform default pin will be used, which can be customized by this color.
   * Ignored if a custom marker is being used.<br/><br/>
   * For Android, the set of available colors is limited. Unsupported colors will fall back to red.
   * See [#887](https://github.com/react-community/react-native-maps/issues/887) for more information.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  pinColor?: ColorValue;

  /**
   * Visibility of the title text rendered beneath Marker balloon
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  titleVisibility?: WithDefault<AppleMarkerVisibility, 'visible'>;

  /**
   * Visibility of the subtitle text rendered beneath Marker balloon
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  subtitleVisibility?: WithDefault<AppleMarkerVisibility, 'adaptive'>;

  /**
   * Indicate type of default markers if it's true MKPinAnnotationView will be used and MKMarkerAnnotationView if it's false
   * It doesn't change anything if you are using custom Markers
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  useLegacyPinView?: boolean;
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

export default codegenNativeComponent<MarkerFabricNativeProps>(
  'RNMapsMarker',
  {},
) as HostComponent<MarkerFabricNativeProps>;
