import * as React from 'react';
import { Animated, ViewProps, ImageURISource, ImageRequireSource } from 'react-native';
import { MapManagerCommand, NativeComponent, ProviderContext, UIManagerCommand } from './decorateMapComponent';
import { MapMarkerNativeComponentType } from './MapMarkerNativeComponent';
import { CalloutPressEvent, LatLng, MarkerDeselectEvent, MarkerDragEvent, MarkerDragStartEndEvent, MarkerPressEvent, MarkerSelectEvent, Point } from './sharedTypes';
import { Modify } from './sharedTypesInternal';
type AppleMarkerVisibility = 'hidden' | 'adaptive' | 'visible';
export type MapMarkerProps = ViewProps & {
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
     * Sets whether this marker should be flat against the map true or a billboard facing the camera.
     *
     * @default false
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    flat?: boolean;
    /**
     * Marker icon to render (equivalent to `icon` property of GMSMarker Class).
     * Only local image resources are allowed to be used.
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    icon?: ImageURISource | ImageRequireSource;
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
    image?: ImageURISource | ImageRequireSource;
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
    onCalloutPress?: (event: CalloutPressEvent) => void;
    /**
     * Callback that is called when the marker is deselected, before the callout is hidden.
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    onDeselect?: (event: MarkerDeselectEvent) => void;
    /**
     * Callback called continuously as the marker is dragged
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    onDrag?: (event: MarkerDragEvent) => void;
    /**
     * Callback that is called when a drag on the marker finishes.
     * This is usually the point you will want to setState on the marker's coordinate again
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    onDragEnd?: (event: MarkerDragStartEndEvent) => void;
    /**
     * Callback that is called when the user initiates a drag on the marker (if it is draggable)
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    onDragStart?: (event: MarkerDragStartEndEvent) => void;
    /**
     * Callback that is called when the marker is tapped by the user.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    onPress?: (event: MarkerPressEvent) => void;
    /**
     * Callback that is called when the marker becomes selected.
     * This will be called when the callout for that marker is about to be shown.
     *
     * @platform iOS: Supported.
     * @platform Android: Supported
     */
    onSelect?: (event: MarkerSelectEvent) => void;
    /**
     * The marker's opacity between 0.0 and 1.0.
     *
     * @default 1.0
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    opacity?: number;
    /**
     * If no custom marker view or custom image is provided, the platform default pin will be used, which can be customized by this color.
     * Ignored if a custom marker is being used.<br/><br/>
     * For Android, the set of available colors is limited. Unsupported colors will fall back to red.
     * See [#887](https://github.com/react-community/react-native-maps/issues/887) for more information.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    pinColor?: string;
    /**
     * A float number indicating marker's rotation angle, in degrees.
     *
     * @default 0
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    rotation?: number;
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
     * Sets whether marker should be tappable.
     * If set to false, the marker will not have onPress events.
     *
     * @default true
     * @platform iOS: Google Maps only
     * @platform Android: Not supported
     */
    tappable?: boolean;
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
     * Sets whether this marker should track view changes in info window.
     * Enabling it will let marker change content of info window after first render pass, but will lead to decreased performance,
     * so it's recommended to disable it whenever you don't need it.
     * **Note**: iOS Google Maps only.
     *
     * @default false
     * @platform iOS: Google Maps only
     * @platform Android: Not supported
     */
    tracksInfoWindowChanges?: boolean;
    /**
     * Sets whether this marker should track view changes.
     * It's recommended to turn it off whenever it's possible to improve custom marker performance.
     *
     * @default true
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    tracksViewChanges?: boolean;
    /**
     * The order in which this tile overlay is drawn with respect to other overlays.
     * An overlay with a larger z-index is drawn over overlays with smaller z-indices.
     * The order of overlays with the same z-index is arbitrary.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    zIndex?: number;
    /**
     * Visibility of the title text rendered beneath Marker balloon
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    titleVisibility?: AppleMarkerVisibility;
    /**
     * Visibility of the subtitle text rendered beneath Marker balloon
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    subtitleVisibility?: AppleMarkerVisibility;
    /**
     * Indicate type of default markers if it's true MKPinAnnotationView will be used and MKMarkerAnnotationView if it's false
     * It doesn't change anything if you are using custom Markers
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    useLegacyPinView?: boolean;
};
type OmittedProps = Omit<MapMarkerProps, 'stopPropagation'>;
export type NativeProps = Modify<OmittedProps, {
    icon?: string;
    image?: MapMarkerProps['image'] | string;
}> & {
    ref: React.RefObject<MapMarkerNativeComponentType>;
};
export declare class MapMarker extends React.Component<MapMarkerProps> {
    context: React.ContextType<typeof ProviderContext>;
    getNativeComponent: () => NativeComponent<NativeProps>;
    getMapManagerCommand: (name: string) => MapManagerCommand;
    getUIManagerCommand: (name: string) => UIManagerCommand;
    static Animated: Animated.AnimatedComponent<typeof MapMarker>;
    private marker;
    constructor(props: MapMarkerProps);
    setNativeProps(props: Partial<NativeProps>): void;
    showCallout(): void;
    hideCallout(): void;
    setCoordinates(coordinate: LatLng): void;
    redrawCallout(): void;
    animateMarkerToCoordinate(coordinate: LatLng, duration?: number): void;
    redraw(): void;
    render(): React.JSX.Element;
}
declare const _default: typeof MapMarker;
export default _default;
