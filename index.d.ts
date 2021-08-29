declare module 'react-native-maps' {
  import * as React from 'react';
  import {
    Animated as RNAnimated,
    ImageRequireSource,
    ImageURISource,
    NativeSyntheticEvent,
    ViewProperties,
  } from 'react-native';

  export interface Address {
    name: string;
    thoroughfare: string;
    subThoroughfare: string;
    locality: string;
    subLocality: string;
    administrativeArea: string;
    subAdministrativeArea: string;
    postalCode: string;
    countryCode: string;
    country: string;
  }

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface LatLng {
    latitude: number;
    longitude: number;
  }

  export interface Camera {
    center: LatLng;
    heading: number;
    pitch: number;
    zoom: number;
    altitude: number;
  }

  export interface Point {
    x: number;
    y: number;
  }

  export type EventActionType =
    | 'marker-press'
    | 'polygon-press'
    | 'polyline-press'
    | 'callout-press'
    | 'press'
    | 'long-press'
    | 'overlay-press'
    | undefined;

  // helper interface
  export interface MapEvent<T = {}>
    extends NativeSyntheticEvent<
      T & {
        coordinate: LatLng;
        position: Point;
        action: EventActionType;
        id?: string;
      }
    > {}

  export type LineCapType = 'butt' | 'round' | 'square';
  export type LineJoinType = 'miter' | 'round' | 'bevel';

  // =======================================================================
  //  AnimatedRegion
  // =======================================================================

  interface AnimatedRegionTimingConfig
    extends RNAnimated.AnimationConfig,
      Partial<Region> {
    easing?: (value: number) => number;
    duration?: number;
    delay?: number;
  }

  interface AnimatedRegionSpringConfig
    extends RNAnimated.AnimationConfig,
      Partial<Region> {
    overshootClamping?: boolean;
    restDisplacementThreshold?: number;
    restSpeedThreshold?: number;
    velocity?: number | Point;
    bounciness?: number;
    speed?: number;
    tension?: number;
    friction?: number;
    stiffness?: number;
    mass?: number;
    damping?: number;
  }

  export class AnimatedRegion extends RNAnimated.AnimatedWithChildren {
    latitude: RNAnimated.Value;
    longitude: RNAnimated.Value;
    latitudeDelta: RNAnimated.Value;
    longitudeDelta: RNAnimated.Value;

    constructor(region?: Region);

    setValue(value: Region): void;
    setOffset(offset: Region): void;
    flattenOffset(): void;
    stopAnimation(callback?: (region: Region) => void): void;
    addListener(callback: (region: Region) => void): string;
    removeListener(id: string): void;
    spring(config: AnimatedRegionSpringConfig): RNAnimated.CompositeAnimation;
    timing(config: AnimatedRegionTimingConfig): RNAnimated.CompositeAnimation;
  }

  // =======================================================================
  //  MapView (default export)
  // =======================================================================

  /**
   * takeSnapshot options
   */
  export interface SnapshotOptions {
    /** optional, when omitted the view-width is used */
    width?: number;
    /** optional, when omitted the view-height is used */
    height?: number;
    /** __iOS only__, optional region to render */
    region?: Region;
    /** image formats, defaults to 'png' */
    format?: 'png' | 'jpg';
    /** image quality: 0..1 (only relevant for jpg, default: 1) */
    quality?: number;
    /** result types, defaults to 'file' */
    result?: 'file' | 'base64';
  }

  /**
   * onUserLocationChange parameters
   */
  export interface EventUserLocation extends NativeSyntheticEvent<{}> {
    nativeEvent: {
      coordinate: {
        latitude: number;
        longitude: number;
        altitude: number;
        timestamp: number;
        accuracy: number;
        speed: number;
        heading: number;
        isFromMockProvider: boolean;
      };
    };
  }

  /**
   * Map style elements.
   * @see https://developers.google.com/maps/documentation/ios-sdk/styling#use_a_string_resource
   * @see https://developers.google.com/maps/documentation/android-api/styling
   */
  export type MapStyleElement = {
    featureType?: string;
    elementType?: string;
    stylers: object[];
  };

  export type EdgePadding = {
    top: Number;
    right: Number;
    bottom: Number;
    left: Number;
  };

  export type EdgeInsets = {
    top: Number;
    right: Number;
    bottom: Number;
    left: Number;
  };

  export type KmlMarker = {
    id: String;
    title: String;
    description: String;
    coordinate: LatLng;
    position: Point;
  };

  export type IndoorBuilding = {
    underground: boolean;
    activeLevelIndex: number;
    levels: Array<IndoorLevel>;
  };

  export type IndoorLevel = {
    index: number;
    name: string;
    shortName: string;
  };

  export interface IndoorBuildingEvent
    extends NativeSyntheticEvent<{ IndoorBuilding: IndoorBuilding }> {}

  /**
   * onKmlReady parameter
   */
  export interface KmlMapEvent
    extends NativeSyntheticEvent<{ markers: KmlMarker[] }> {}

  type MapTypes =
    | 'standard'
    | 'satellite'
    | 'hybrid'
    | 'terrain'
    | 'none'
    | 'mutedStandard';

  export interface MapViewProps extends ViewProperties {
    provider?: 'google' | null;
    customMapStyle?: MapStyleElement[];
    customMapStyleString?: string;
    userLocationPriority?: 'balanced' | 'high' | 'low' | 'passive';
    userLocationUpdateInterval?: number;
    userInterfaceStyle?: 'light' | 'dark';
    userLocationFastestInterval?: number;
    showsUserLocation?: boolean;
    userLocationAnnotationTitle?: string;
    showsMyLocationButton?: boolean;
    followsUserLocation?: boolean;
    userLocationCalloutEnabled?: boolean;
    showsPointsOfInterest?: boolean;
    showsCompass?: boolean;
    zoomEnabled?: boolean;
    zoomTapEnabled?: boolean;
    zoomControlEnabled?: boolean;
    rotateEnabled?: boolean;
    scrollDuringRotateOrZoomEnabled?: boolean;
    cacheEnabled?: boolean;
    loadingEnabled?: boolean;
    loadingBackgroundColor?: string;
    loadingIndicatorColor?: string;
    scrollEnabled?: boolean;
    pitchEnabled?: boolean;
    toolbarEnabled?: boolean;
    moveOnMarkerPress?: boolean;
    showsScale?: boolean;
    showsBuildings?: boolean;
    showsTraffic?: boolean;
    showsIndoors?: boolean;
    showsIndoorLevelPicker?: boolean;
    mapType?: MapTypes;
    region?: Region;
    initialRegion?: Region;
    camera?: Camera;
    initialCamera?: Camera;
    liteMode?: boolean;
    mapPadding?: EdgePadding;
    paddingAdjustmentBehavior?: 'always' | 'automatic' | 'never';
    maxDelta?: number;
    minDelta?: number;
    legalLabelInsets?: EdgeInsets;
    compassOffset?: { x: number; y: number };
    tintColor?: string;

    onMapLoaded?: () => void;
    onMapReady?: () => void;
    onKmlReady?: (values: KmlMapEvent) => void;
    onRegionChange?: (region: Region, details?: { isGesture: boolean }) => void;
    onRegionChangeComplete?: (
      region: Region,
      details?: { isGesture: boolean }
    ) => void;
    onPress?: (event: MapEvent) => void;
    onDoublePress?: (event: MapEvent) => void;
    onLongPress?: (event: MapEvent) => void;
    onUserLocationChange?: (event: EventUserLocation) => void;
    onPanDrag?: (event: MapEvent) => void;
    onPoiClick?: (event: MapEvent<{ placeId: string; name: string }>) => void;
    onMarkerPress?: (
      event: MapEvent<{ action: 'marker-press'; id: string }>
    ) => void;
    onMarkerSelect?: (
      event: MapEvent<{ action: 'marker-select'; id: string }>
    ) => void;
    onMarkerDeselect?: (
      event: MapEvent<{ action: 'marker-deselect'; id: string }>
    ) => void;
    onCalloutPress?: (event: MapEvent<{ action: 'callout-press' }>) => void;
    onMarkerDragStart?: (event: MapEvent) => void;
    onMarkerDrag?: (event: MapEvent) => void;
    onMarkerDragEnd?: (event: MapEvent) => void;
    onIndoorBuildingFocused?: (event: IndoorBuildingEvent) => void;

    minZoomLevel?: number;
    maxZoomLevel?: number;
    kmlSrc?: string;
  }

  export default class MapView extends React.Component<MapViewProps, any> {
    getCamera(): Promise<Camera>;
    setCamera(camera: Partial<Camera>): void;
    animateCamera(camera: Partial<Camera>, opts?: { duration?: number }): void;
    animateToNavigation(
      location: LatLng,
      bearing: number,
      angle: number,
      duration?: number
    ): void;
    animateToRegion(region: Region, duration?: number): void;
    animateToCoordinate(latLng: LatLng, duration?: number): void;
    animateToBearing(bearing: number, duration?: number): void;
    animateToViewingAngle(angle: number, duration?: number): void;
    fitToElements(options?: {
      edgePadding?: EdgePadding;
      animated?: boolean;
    }): void;
    fitToSuppliedMarkers(
      markers: string[],
      options?: { edgePadding?: EdgePadding; animated?: boolean }
    ): void;
    fitToCoordinates(
      coordinates?: LatLng[],
      options?: { edgePadding?: EdgePadding; animated?: boolean }
    ): void;
    setMapBoundaries(northEast: LatLng, southWest: LatLng): void;
    getMapBoundaries(): Promise<{ northEast: LatLng; southWest: LatLng }>;
    takeSnapshot(options?: SnapshotOptions): Promise<string>;
    addressForCoordinate(coordinate: LatLng): Promise<Address>;
    pointForCoordinate(coordinate: LatLng): Promise<Point>;
    coordinateForPoint(point: Point): Promise<LatLng>;
    setIndoorActiveLevelIndex(index: number): void;
  }

  export class Animated extends MapView {}

  // =======================================================================
  //  Marker
  // =======================================================================

  export interface MarkerProps extends ViewProperties {
    identifier?: string;
    reuseIdentifier?: string;
    title?: string;
    description?: string;
    image?: ImageURISource | ImageRequireSource;
    icon?: ImageURISource | ImageRequireSource;
    opacity?: number;
    pinColor?: string;
    coordinate: LatLng | AnimatedRegion;
    centerOffset?: Point;
    calloutOffset?: Point;
    anchor?: Point;
    calloutAnchor?: Point;
    flat?: boolean;
    draggable?: boolean;
    tracksViewChanges?: boolean;
    tracksInfoWindowChanges?: boolean;
    stopPropagation?: boolean;
    onPress?: (event: MapEvent<{ action: 'marker-press'; id: string }>) => void;
    onSelect?: (
      event: MapEvent<{ action: 'marker-select'; id: string }>
    ) => void;
    onDeselect?: (
      event: MapEvent<{ action: 'marker-deselect'; id: string }>
    ) => void;
    onCalloutPress?: (event: MapEvent<{ action: 'callout-press' }>) => void;
    onDragStart?: (event: MapEvent) => void;
    onDrag?: (event: MapEvent) => void;
    onDragEnd?: (event: MapEvent) => void;

    rotation?: number;
    zIndex?: number;
  }

  export class Marker extends React.Component<MarkerProps, any> {
    /**
     * Shows the callout for this marker
     */
    showCallout(): void;
    /**
     * Hides the callout for this marker
     */
    hideCallout(): void;
    /**
     * Redraws the callout for this marker
     * __iOS only__
     */
    redrawCallout(): void;
    /**
     * Causes a redraw of the marker. Useful when there are updates to the
     * marker and `tracksViewChanges` comes with a cost that is too high.
     */
    redraw(): void;
    /**
     * Animates marker movement.
     * __Android only__
     */
    animateMarkerToCoordinate(coordinate: LatLng, duration?: number): void;
  }

  export class MarkerAnimated extends Marker {}

  // =======================================================================
  //  Callout
  // =======================================================================

  export interface MapCalloutProps extends ViewProperties {
    tooltip?: boolean;
    onPress?: (event: MapEvent<{ action: 'callout-press' }>) => void;
  }

  export class Callout extends React.Component<MapCalloutProps, any> {}

  // =======================================================================
  //  CalloutSubview
  // =======================================================================

  export interface MapCalloutSubviewProps extends ViewProperties {
    onPress?: (event: MapEvent<{ action: 'callout-inside-press' }>) => void;
  }

  export class CalloutSubview extends React.Component<
    MapCalloutSubviewProps,
    any
  > {}

  // =======================================================================
  //  Polyline
  // =======================================================================

  export interface MapPolylineProps extends ViewProperties {
    coordinates: LatLng[];
    onPress?: (event: MapEvent) => void;
    tappable?: boolean;
    fillColor?: string;
    strokeWidth?: number;
    strokeColor?: string;
    strokeColors?: string[];
    zIndex?: number;
    lineCap?: LineCapType;
    lineJoin?: LineJoinType;
    miterLimit?: number;
    geodesic?: boolean;
    lineDashPhase?: number;
    lineDashPattern?: number[];
  }

  export class Polyline extends React.Component<MapPolylineProps, any> {}

  // =======================================================================
  //  Polygon
  // =======================================================================

  export interface MapPolygonProps extends ViewProperties {
    coordinates: LatLng[];
    holes?: LatLng[][];
    onPress?: (event: MapEvent) => void;
    tappable?: boolean;
    strokeWidth?: number;
    strokeColor?: string;
    fillColor?: string;
    zIndex?: number;
    lineCap?: LineCapType;
    lineJoin?: LineJoinType;
    miterLimit?: number;
    geodesic?: boolean;
    lineDashPhase?: number;
    lineDashPattern?: number[];
  }

  export class Polygon extends React.Component<MapPolygonProps, any> {}

  // =======================================================================
  //  Circle
  // =======================================================================

  export interface MapCircleProps extends ViewProperties {
    center: LatLng;
    radius: number;
    onPress?: (event: MapEvent) => void;
    strokeWidth?: number;
    strokeColor?: string;
    fillColor?: string;
    zIndex?: number;
    lineCap?: LineCapType;
    lineJoin?: LineJoinType;
    miterLimit?: number;
    lineDashPhase?: number;
    lineDashPattern?: number[];
  }

  export class Circle extends React.Component<MapCircleProps, any> {
    setNativeProps: (props: any) => void;
  }

  // =======================================================================
  //  UrlTile & LocalTile
  // =======================================================================

  export interface MapUrlTileProps extends ViewProperties {
    urlTemplate: string;
    minimumZ?: number;
    maximumZ?: number;
    zIndex?: number;
    tileSize?: number;
    shouldReplaceMapContent?: boolean;
    flipY?: boolean;
  }

  export class UrlTile extends React.Component<MapUrlTileProps, any> {}

  export interface MapLocalTileProps extends ViewProperties {
    pathTemplate: string;
    tileSize?: number;
    zIndex?: number;
    flipY?: boolean;
  }

  export class LocalTile extends React.Component<MapLocalTileProps, any> {}

  // =======================================================================
  //  WMSTile
  // =======================================================================

  export interface MapWMSTileProps extends ViewProperties {
    urlTemplate: string;
    maximumZ?: number;
    minimumZ?: number;
    tileSize: number;
    opacity: number;
    zIndex?: number;
    shouldReplaceMapContent?: boolean;
  }

  export class WMSTile extends React.Component<MapWMSTileProps, any> {}
  // =======================================================================
  //  Overlay
  // =======================================================================

  type Coordinate = [number, number];

  export interface MapOverlayProps extends ViewProperties {
    image?: ImageURISource | ImageRequireSource;
    bounds: [Coordinate, Coordinate];
    bearing?: number;
    tappable?: boolean;
    onPress?: (event: MapEvent<{ action: 'overlay-press' }>) => void;
  }

  export class Overlay extends React.Component<MapOverlayProps, any> {}

  export class OverlayAnimated extends Overlay {}

  // =======================================================================
  //  Heatmap
  // =======================================================================

  export interface WeightedLatLng {
    latitude: number;
    longitude: number;
    weight?: number;
  }

  export interface MapHeatmapProps extends ViewProperties {
    points: WeightedLatLng[];
    gradient?: {
      colors: string[];
      startPoints: number[];
      colorMapSize: number;
    };
    radius?: number;
    opacity?: number;
  }

  export class Heatmap extends React.Component<MapHeatmapProps, any> {}

  // =======================================================================
  //  Geojson
  // =======================================================================

  import GeoJSON from 'geojson';

  export interface GeojsonProps {
    geojson: GeoJSON.GeoJSON;
    strokeColor?: string;
    fillColor?: string;
    strokeWidth?: number;
    lineDashPhase?: number;
    lineDashPattern?: number[];
    lineCap?: 'butt' | 'round' | 'square';
    lineJoin?: 'miter' | 'round' | 'bevel';
    miterLimit?: number;
    zIndex?: number;
    onPress?: (event: MapEvent) => void;
    markerComponent?: React.ReactNode
  }

  export class Geojson extends React.Component<GeojsonProps, any> {}

  // =======================================================================
  //  Constants
  // =======================================================================

  export const MAP_TYPES: {
    STANDARD: MapTypes;
    SATELLITE: MapTypes;
    HYBRID: MapTypes;
    TERRAIN: MapTypes;
    NONE: MapTypes;
    MUTEDSTANDARD: MapTypes;
  };

  export const PROVIDER_DEFAULT: null;
  export const PROVIDER_GOOGLE: 'google';
}
