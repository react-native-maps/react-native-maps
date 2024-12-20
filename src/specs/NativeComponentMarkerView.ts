import {type ColorValue, HostComponent, ViewProps} from 'react-native';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import {
  DirectEventHandler,
  BubblingEventHandler,
  Double,
  Float,
} from 'react-native/Libraries/Types/CodegenTypes';

export type LatLng = Readonly<{
  latitude: Double; // Non-nullable Double for latitude
  longitude: Double; // Non-nullable Double for longitude
}>;

export type Point = Readonly<{
  x: Double; // Non-nullable Double for x
  y: Double; // Non-nullable Double for y
}>;

export type MarkerBubblingEventHandler = BubblingEventHandler<
  Readonly<{
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position: {
      x: Double; // Inlined Point
      y: Double;
    };
    action: string;
    id?: string; // Optional id for iOS
  }>
>;

export type MarkerEventHandler = DirectEventHandler<
  Readonly<{
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position: {
      x: Double; // Inlined Point
      y: Double;
    };
    action: string;
    id?: string; // Optional id for iOS
  }>
>;

export type CalloutEventHandler = DirectEventHandler<
  Readonly<{
    frame: {
      x: Double;
      y: Double;
      width: Double;
      height: Double;
    };
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    point: {
      x: Double; // Inlined Point
      y: Double;
    };
    position: {
      x: Double; // Inlined Point
      y: Double;
    };
    action: string;
    id?: string; // Optional id for iOS
  }>
>;

export interface MarkerFabricNativeProps extends ViewProps {
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
   * @platform Android: Not supported. See see the `calloutAnchor` prop
   */
  calloutOffset?: Point;

  /**
   * The offset (in points) at which to display the annotation view.
   *
   * By default, the center point of an annotation view is placed at the coordinate point of the associated annotation.
   *
   * Positive offset values move the annotation view down and to the right, while negative values move it up and to the left.
   *
   * @default {x: 0.0, y: 0.0}
   * @platform iOS: Apple Maps only. For Google Maps, see the `anchor` prop
   * @platform Android: Not supported. See see the `anchor` prop
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
   * A string that can be used to identify this marker.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  identifier?: string;

  /**
   * A custom image to be used as the marker's icon. Only local image resources are allowed to be used.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  // todo @salah: image?: ImageURISource | ImageRequireSource;

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
   * The marker's opacity between 0.0 and 1.0.
   *
   * @default 1.0
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  opacity?: Float;

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
   * Sets whether this marker should propagate `onPress` events.
   * Enabling it will stop the parent `MapView`'s `onPress` from being called.
   *
   * Android does not propagate `onPress` events.
   *
   * See [#1132](https://github.com/react-community/react-native-maps/issues/1132) for more information.
   *
   * @default false
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  stopPropagation?: boolean;

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
   * The order in which this tile overlay is drawn with respect to other overlays.
   * An overlay with a larger z-index is drawn over overlays with smaller z-indices.
   * The order of overlays with the same z-index is arbitrary.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  // todo: @salah fix me  zIndex?: Int32;

  /**
   * Visibility of the title text rendered beneath Marker balloon
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  titleVisibility?: string;
  /**
   * Visibility of the subtitle text rendered beneath Marker balloon
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  subtitleVisibility?: string;

  /**
   * Indicate type of default markers if it's true MKPinAnnotationView will be used and MKMarkerAnnotationView if it's false
   * It doesn't change anything if you are using custom Markers
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  useLegacyPinView?: boolean;
  /**
   * Callback that is called when the user taps the callout view.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onCalloutPress?: CalloutEventHandler;

  /**
   * Callback that is called when the marker is deselected, before the callout is hidden.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  onDeselect?: MarkerEventHandler;

  /**
   * Callback called continuously as the marker is dragged
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onDrag?: MarkerEventHandler;

  /**
   * Callback that is called when a drag on the marker finishes.
   * This is usually the point you will want to setState on the marker's coordinate again
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onDragEnd?: MarkerEventHandler;

  /**
   * Callback that is called when the user initiates a drag on the marker (if it is draggable)
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onDragStart?: MarkerEventHandler;

  /**
   * Callback that is called when the marker is tapped by the user.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  onPress?: MarkerBubblingEventHandler;

  /**
   * Callback that is called when the marker becomes selected.
   * This will be called when the callout for that marker is about to be shown.
   *
   * @platform iOS: Supported.
   * @platform Android: Supported
   */
  onSelect?: MarkerEventHandler;
}

export default codegenNativeComponent<MarkerFabricNativeProps>(
  'RNMapsMarkerView',
  {
    excludedPlatforms: ['android'],
  },
) as HostComponent<MarkerFabricNativeProps>;
