import * as React from 'react';
import { Animated as RNAnimated, Animated, NativeSyntheticEvent, ViewProps } from 'react-native';
import { CalloutPressEvent, ClickEvent, Frame, LatLng, MarkerDeselectEvent, MarkerDragEvent, MarkerDragStartEndEvent, MarkerPressEvent, MarkerSelectEvent, Point, Provider, Region } from './sharedTypes';
import { Address, BoundingBox, Camera, CameraZoomRange, ChangeEvent, Details, EdgePadding, FitToOptions, IndoorBuildingEvent, IndoorLevelActivatedEvent, KmlMapEvent, LongPressEvent, MapPressEvent, MapStyleElement, MapType, MapTypes, PanDragEvent, PoiClickEvent, SnapshotOptions, UserLocationChangeEvent } from './MapView.types';
import { Modify } from './sharedTypesInternal';
import { MapViewNativeComponentType } from './MapViewNativeComponent';
import AnimatedRegion from './AnimatedRegion';
export declare const MAP_TYPES: MapTypes;
export type MapViewProps = ViewProps & {
    /**
     * If `true` map will be cached and displayed as an image instead of being interactable, for performance usage.
     *
     * @default false
     * @platform iOS: Apple maps only
     * @platform Android: Supported
     */
    cacheEnabled?: boolean;
    /**
     * The camera view the map should display.
     *
     * Use the camera system, instead of the region system, if you need control over
     * the pitch or heading. Using this will ignore the `region` property.
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    camera?: Camera;
    /**
     * If set, changes the position of the compass.
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    compassOffset?: Point;
    /**
     * Adds custom styling to the map component.
     * See [README](https://github.com/react-native-maps/react-native-maps#customizing-the-map-style) for more information.
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    customMapStyle?: MapStyleElement[];
    /**
     * If `true` the map will focus on the user's location.
     * This only works if `showsUserLocation` is true and the user has shared their location.
     *
     * @default false
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    followsUserLocation?: boolean;
    /**
     * The initial camera view the map should use.  Use this prop instead of `camera`
     * only if you don't want to control the camera of the map besides the initial view.
     *
     * Use the camera system, instead of the region system, if you need control over
     * the pitch or heading.
     *
     * Changing this prop after the component has mounted will not result in a camera change.
     *
     * This is similar to the `initialValue` prop of a text input.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    initialCamera?: Camera;
    /**
     * The initial region to be displayed by the map.  Use this prop instead of `region`
     * only if you don't want to control the viewport of the map besides the initial region.
     *
     * Changing this prop after the component has mounted will not result in a region change.
     *
     * This is similar to the `initialValue` prop of a text input.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    initialRegion?: Region;
    /**
     * The URL for KML file.
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    kmlSrc?: string;
    /**
     * If set, changes the position of the "Legal" label link in Apple maps.
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    legalLabelInsets?: EdgePadding;
    /**
     * Enables lite mode on Android
     *
     * @platform iOS: Not supported
     * @platform Android: Supported
     */
    liteMode?: boolean;
    /**
     * https://developers.google.com/maps/documentation/get-map-id
     * google cloud mapId to enable cloud styling and more
     */
    googleMapId?: string;
    /**
     * https://developers.google.com/maps/documentation/android-sdk/renderer
     * google maps renderer
     * @default `LATEST`
     * @platform iOS: Not supported
     * @platform Android: Supported
     */
    googleRenderer?: 'LATEST' | 'LEGACY';
    /**
     * Sets loading background color.
     *
     * @default `#FFFFFF`
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    loadingBackgroundColor?: string;
    /**
     * If `true` a loading indicator will show while the map is loading.
     *
     * @default false
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    loadingEnabled?: boolean;
    /**
     * Sets loading indicator color.
     *
     * @default `#606060`
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    loadingIndicatorColor?: string;
    /**
     * Adds custom padding to each side of the map. Useful when map elements/markers are obscured.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    mapPadding?: EdgePadding;
    /**
     * The map type to be displayed
     *
     * @default `standard`
     * @platform iOS: hybrid | mutedStandard | satellite | standard | terrain | hybridFlyover | satelliteFlyover
     * @platform Android: hybrid | none | satellite | standard | terrain
     */
    mapType?: MapType;
    /**
     * TODO: Add documentation
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    maxDelta?: number;
    /**
     * Maximum zoom value for the map, must be between 0 and 20
     *
     * @default 20
     * @platform iOS: Supported
     * @platform Android: Supported
     * @deprecated on Apple Maps, use `cameraZoomRange` instead
     */
    maxZoomLevel?: number;
    /**
     * TODO: Add documentation
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    minDelta?: number;
    /**
     * Minimum zoom value for the map, must be between 0 and 20
     *
     * @default 0
     * @platform iOS: Supported
     * @platform Android: Supported
     * @deprecated on Apple Maps, use `cameraZoomRange` instead
     */
    minZoomLevel?: number;
    /**
     * If `false` the map won't move to the marker when pressed.
     *
     * @default true
     * @platform iOS: Not supported
     * @platform Android: Supported
     */
    moveOnMarkerPress?: boolean;
    /**
     * Callback that is called when a callout is tapped by the user.
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    onCalloutPress?: (event: CalloutPressEvent) => void;
    /**
     * Callback that is called when user double taps on the map.
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    onDoublePress?: (event: ClickEvent) => void;
    /**
     * Callback that is called when an indoor building is focused/unfocused
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    onIndoorBuildingFocused?: (event: IndoorBuildingEvent) => void;
    /**
     * Callback that is called when a level on indoor building is activated
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    onIndoorLevelActivated?: (event: IndoorLevelActivatedEvent) => void;
    /**
     * Callback that is called once the kml is fully loaded.
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    onKmlReady?: (event: KmlMapEvent) => void;
    /**
     * Callback that is called when user makes a "long press" somewhere on the map.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    onLongPress?: (event: LongPressEvent) => void;
    /**
     * Callback that is called when the map has finished rendering all tiles.
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    onMapLoaded?: (event: NativeSyntheticEvent<{}>) => void;
    /**
     * Callback that is called once the map is ready.
     *
     * Event is optional, as the first onMapReady callback is intercepted
     * on Android, and the event is not passed on.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    onMapReady?: (event?: NativeSyntheticEvent<{}>) => void;
    /**
     * Callback that is called when a marker on the map becomes deselected.
     * This will be called when the callout for that marker is about to be hidden.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    onMarkerDeselect?: (event: MarkerDeselectEvent) => void;
    /**
     * Callback called continuously as a marker is dragged
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    onMarkerDrag?: (event: MarkerDragEvent) => void;
    /**
     * Callback that is called when a drag on a marker finishes.
     * This is usually the point you will want to setState on the marker's coordinate again
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    onMarkerDragEnd?: (event: MarkerDragStartEndEvent) => void;
    /**
     * Callback that is called when the user initiates a drag on a marker (if it is draggable)
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    onMarkerDragStart?: (event: MarkerDragStartEndEvent) => void;
    /**
     * Callback that is called when a marker on the map is tapped by the user.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    onMarkerPress?: (event: MarkerPressEvent) => void;
    /**
     * Callback that is called when a marker on the map becomes selected.
     * This will be called when the callout for that marker is about to be shown.
     *
     * @platform iOS: Supported.
     * @platform Android: Supported
     */
    onMarkerSelect?: (event: MarkerSelectEvent) => void;
    /**
     * Callback that is called when user presses and drags the map.
     * **NOTE**: for iOS `scrollEnabled` should be set to false to trigger the event
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    onPanDrag?: (event: PanDragEvent) => void;
    /**
     * Callback that is called when user click on a POI.
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    onPoiClick?: (event: PoiClickEvent) => void;
    /**
     * Callback that is called when user taps on the map.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    onPress?: (event: MapPressEvent) => void;
    /**
     * Callback that is called continuously when the region changes, such as when a user is dragging the map.
     * `isGesture` property indicates if the move was from the user (true) or an animation (false).
     * **Note**: `isGesture` is supported by Google Maps only.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    onRegionChange?: (region: Region, details: Details) => void;
    /**
     * Callback that is called once when the region changes, such as when the user is done moving the map.
     * `isGesture` property indicates if the move was from the user (true) or an animation (false).
     * **Note**: `isGesture` is supported by Google Maps only.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    onRegionChangeComplete?: (region: Region, details: Details) => void;
    /**
     * Callback that is called when the underlying map figures our users current location
     * (coordinate also includes isFromMockProvider value for Android API 18 and above).
     * Make sure **showsUserLocation** is set to *true*.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    onUserLocationChange?: (event: UserLocationChangeEvent) => void;
    /**
     * Indicates how/when to affect padding with safe area insets
     *
     * @platform iOS: Google Maps only
     * @platform Android: Not supported
     */
    paddingAdjustmentBehavior?: 'always' | 'automatic' | 'never';
    /**
     * If `false` the user won't be able to adjust the camera’s pitch angle.
     *
     * @default true
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    pitchEnabled?: boolean;
    /**
     * The map framework to use.
     * Either `"google"` for GoogleMaps, otherwise `undefined` to use the native map framework (`MapKit` in iOS and `GoogleMaps` in android).
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    provider?: Provider;
    /**
     * The region to be displayed by the map.
     * The region is defined by the center coordinates and the span of coordinates to display.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    region?: Region | AnimatedRegion;
    /**
     * If `false` the user won't be able to adjust the camera’s pitch angle.
     *
     * @default true
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    rotateEnabled?: boolean;
    /**
     * If `false` the map will stay centered while rotating or zooming.
     *
     * @default true
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    scrollDuringRotateOrZoomEnabled?: boolean;
    /**
     * If `false` the user won't be able to change the map region being displayed.
     *
     * @default true
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    scrollEnabled?: boolean;
    /**
     * A Boolean indicating whether the map displays extruded building information.
     *
     * @default true
     * @platform iOS: Not supported
     * @platform Android: Supported
     */
    showsBuildings?: boolean;
    /**
     * If `false` compass won't be displayed on the map.
     *
     * @default true
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    showsCompass?: boolean;
    /**
     * A Boolean indicating whether indoor level picker should be enabled.
     *
     * @default false
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    showsIndoorLevelPicker?: boolean;
    /**
     * A Boolean indicating whether indoor maps should be enabled.
     *
     * @default true
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    showsIndoors?: boolean;
    /**
     * If `false` hide the button to move map to the current user's location.
     *
     * @default true
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    showsMyLocationButton?: boolean;
    /**
     * If `false` points of interest won't be displayed on the map.
     * TODO: DEPRECATED? Doesn't seem to do anything
     *
     * @default true
     * @platform iOS: Maybe Apple Maps?
     * @platform Android: Not supported
     */
    showsPointsOfInterest?: boolean;
    /**
     * A Boolean indicating whether the map shows scale information.
     *
     * @default true
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    showsScale?: boolean;
    /**
     * A Boolean value indicating whether the map displays traffic information.
     * TODO: Look into android support
     *
     * @default false
     * @platform iOS: Supported
     * @platform Android: Not supported?
     */
    showsTraffic?: boolean;
    /**
     * If `true` the users location will be displayed on the map.
     *
     * This will cause iOS to ask for location permissions.
     * For iOS see: [DOCS](https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md#set-the-usage-description-property)
     * @default false
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    showsUserLocation?: boolean;
    /**
     * Sets the tint color of the map. (Changes the color of the position indicator)
     *
     * @default System Blue
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    tintColor?: string;
    /**
     * If `false` will hide 'Navigate' and 'Open in Maps' buttons on marker press
     *
     * @default true
     * @platform iOS: Not supported
     * @platform Android: Supported
     */
    toolbarEnabled?: boolean;
    /**
     * Sets the map to the style selected.
     *
     * @default System setting
     * @platform iOS: Apple Maps only (iOS >= 13.0)
     * @platform Android: Not supported
     */
    userInterfaceStyle?: 'light' | 'dark';
    /**
     * The title of the annotation for current user location.
     *
     * This only works if `showsUserLocation` is true.
     *
     * @default `My Location`
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    userLocationAnnotationTitle?: string;
    /**
     * If `true` clicking user location will show the default callout for userLocation annotation.
     *
     * @default false
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    userLocationCalloutEnabled?: boolean;
    /**
     * Fastest interval the application will actively acquire locations.
     *
     * See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html)
     *
     * @default 5000
     * @platform iOS: Not supported
     * @platform Android: Supported
     */
    userLocationFastestInterval?: number;
    /**
     * Set power priority of user location tracking.
     *
     * See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html)
     *
     * @default `high`
     * @platform iOS: Not supported
     * @platform Android: Supported
     */
    userLocationPriority?: 'balanced' | 'high' | 'low' | 'passive';
    /**
     * Interval of user location updates in milliseconds.
     *
     * See [Google APIs documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html)
     *
     * @default 5000
     * @platform iOS: Not supported
     * @platform Android: Supported
     */
    userLocationUpdateInterval?: number;
    /**
     * If `false` the zoom control at the bottom right of the map won't be visible.
     *
     * @default true
     * @platform iOS: Not supported
     * @platform Android: Supported
     */
    zoomControlEnabled?: boolean;
    /**
     * If `false` the user won't be able to pinch/zoom the map.
     *
     * TODO: Why is the Android reactprop defaultvalue set to false?
     *
     * @default true
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    zoomEnabled?: boolean;
    /**
     * If `false` the user won't be able to double tap to zoom the map.
     * **Note:** But it will greatly decrease delay of tap gesture recognition.
     *
     * @default true
     * @platform iOS: Google Maps only
     * @platform Android: Not supported
     */
    zoomTapEnabled?: boolean;
    /**
     * Map camera distance limits. `minCenterCoordinateDistance` for minimum distance, `maxCenterCoordinateDistance` for maximum.
     * `animated` for animated zoom changes.
     * Takes precedence if conflicting with `minZoomLevel`, `maxZoomLevel`.
     *
     * @platform iOS: 13.0+
     * @platform Android: Not supported
     */
    cameraZoomRange?: CameraZoomRange;
};
type ModifiedProps = Modify<MapViewProps, {
    region?: MapViewProps['region'] | null;
    initialRegion?: MapViewProps['initialRegion'] | null;
}>;
export type NativeProps = Omit<ModifiedProps, 'customMapStyle' | 'onRegionChange' | 'onRegionChangeComplete'> & {
    ref: React.RefObject<MapViewNativeComponentType>;
    customMapStyleString?: string;
    handlePanDrag?: boolean;
    onChange?: (e: ChangeEvent) => void;
};
type State = {
    isReady: boolean;
};
declare class MapView extends React.Component<MapViewProps, State> {
    static Animated: Animated.AnimatedComponent<typeof MapView>;
    private map;
    constructor(props: MapViewProps);
    setNativeProps(props: Partial<NativeProps>): void;
    private _onMapReady;
    private _onChange;
    getCamera(): Promise<Camera>;
    setCamera(camera: Partial<Camera>): void;
    animateCamera(camera: Partial<Camera>, opts?: {
        duration?: number;
    }): void;
    animateToRegion(region: Region, duration?: number): void;
    fitToElements(options?: FitToOptions): void;
    fitToSuppliedMarkers(markers: string[], options?: FitToOptions): void;
    fitToCoordinates(coordinates?: LatLng[], options?: FitToOptions): void;
    /**
     * Get visible boudaries
     *
     * @return Promise Promise with the bounding box ({ northEast: <LatLng>, southWest: <LatLng> })
     */
    getMapBoundaries(): Promise<BoundingBox>;
    setMapBoundaries(northEast: LatLng, southWest: LatLng): void;
    setIndoorActiveLevelIndex(activeLevelIndex: number): void;
    /**
     * Takes a snapshot of the map and saves it to a picture
     * file or returns the image as a base64 encoded string.
     *
     * @param args Configuration options
     * @param [args.width] Width of the rendered map-view (when omitted actual view width is used).
     * @param [args.height] Height of the rendered map-view (when omitted actual height is used).
     * @param [args.region] Region to render (Only supported on iOS).
     * @param [args.format] Encoding format ('png', 'jpg') (default: 'png').
     * @param [args.quality] Compression quality (only used for jpg) (default: 1.0).
     * @param [args.result] Result format ('file', 'base64') (default: 'file').
     *
     * @return Promise Promise with either the file-uri or base64 encoded string
     */
    takeSnapshot(args: SnapshotOptions): Promise<string>;
    /**
     * Convert a coordinate to address by using default Geocoder
     *
     * @param coordinate Coordinate
     * @param [coordinate.latitude] Latitude
     * @param [coordinate.longitude] Longitude
     *
     * @return Promise with return type Address
     */
    addressForCoordinate(coordinate: LatLng): Promise<Address>;
    /**
     * Convert a map coordinate to user-space point
     *
     * @param coordinate Coordinate
     * @param [coordinate.latitude] Latitude
     * @param [coordinate.longitude] Longitude
     *
     * @return Promise Promise with the point ({ x: Number, y: Number })
     */
    pointForCoordinate(coordinate: LatLng): Promise<Point>;
    /**
     * Convert a user-space point to a map coordinate
     *
     * @param point Point
     * @param [point.x] X
     * @param [point.x] Y
     *
     * @return Promise Promise with the coordinate ({ latitude: Number, longitude: Number })
     */
    coordinateForPoint(point: Point): Promise<LatLng>;
    /**
     * Get markers' centers and frames in user-space coordinates
     *
     * @param onlyVisible boolean true to include only visible markers, false to include all
     *
     * @return Promise Promise with { <identifier>: { point: Point, frame: Frame } }
     */
    getMarkersFrames(onlyVisible?: boolean): Promise<{
        [key: string]: {
            point: Point;
            frame: Frame;
        };
    }>;
    /**
     * Get bounding box from region
     *
     * @param region Region
     *
     * @return Object Object bounding box ({ northEast: <LatLng>, southWest: <LatLng> })
     */
    boundingBoxForRegion(region: Region): BoundingBox;
    private _mapManagerCommand;
    private _getHandle;
    private _runCommand;
    render(): React.JSX.Element;
}
export declare const AnimatedMapView: RNAnimated.AnimatedComponent<typeof MapView>;
export default MapView;
