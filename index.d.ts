declare module "react-native-maps" {
    import * as React from 'react';
    
    export interface Region {
        latitude: number
        longitude: number
        latitudeDelta: number
        longitudeDelta: number
    }
    
    export interface LatLng {
        latitude: number
        longitude: number
    }

    export interface Point {
        x: number;
        y: number;
    }

    // helper interface
    export interface MapEvent<T = {}> extends NativeSyntheticEvent<T & {
        coordinate: LatLng;
        position: Point;
    }> {}

    export type LineCapType = 'butt' | 'round' | 'square';
    export type LineJoinType = 'miter' | 'round' | 'bevel';

    // =======================================================================
    //  AnimatedRegion
    // =======================================================================

    interface AnimatedRegionTimingConfig extends Animated.AnimationConfig, Partial<Region> {
        easing?: (value: number) => number;
        duration?: number;
        delay?: number;
    }

    interface AnimatedRegionSpringConfig extends Animated.AnimationConfig, Partial<Region> {
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

    export class AnimatedRegion extends Animated.AnimatedWithChildren {
        latitude: Animated.Value
        longitude: Animated.Value
        latitudeDelta: Animated.Value
        longitudeDelta: Animated.Value

        constructor(region?: Region);

        setValue(value: Region): void;
        setOffset(offset: Region): void;
        flattenOffset(): void;
        stopAnimation(callback?: (region: Region) => void): void;
        addListener(callback: (region: Region) => void): string;
        removeListener(id: string): void;
        spring(config: AnimatedRegionSpringConfig): Animated.CompositeAnimation;
        timing(config: AnimatedRegionTimingConfig): Animated.CompositeAnimation;
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
                latitude: number,
                longitude: number,
                altitude: number,
                timestamp: number,
                accuracy: number,
                speed: number,
                isFromMockProvider: boolean,
            },
        };
    }

    /**
     * Map style elements.
     * @see https://developers.google.com/maps/documentation/ios-sdk/styling#use_a_string_resource
     * @see https://developers.google.com/maps/documentation/android-api/styling
     */
    export type MapStyleElement = {
        featureType?: string,
        elementType?: string,
        stylers: object[],
    };

    export type EdgePadding = {
        top: Number,
        right: Number,
        bottom: Number,
        left: Number,
    };

    export type EdgeInsets = {
        top: Number,
        right: Number,
        bottom: Number,
        left: Number,
    };

    export type KmlMarker = {
        id: String,
        title: String,
        description: String,
        coordinate: LatLng,
        position: Point,
    };

    /**
     * onKmlReady parameter
     */
    export interface KmlMapEvent extends NativeSyntheticEvent<{ markers: KmlMarker[] }> {
    }

    export interface MapViewProps {
        provider?: 'google';
        style: any;
        customMapStyle?: any[];
        customMapStyleString?: string;
        showsUserLocation?: boolean;
        userLocationAnnotationTitle?: string;
        showsMyLocationButton?: boolean;
        followsUserLocation?: boolean;
        showsPointsOfInterest?: boolean;
        showsCompass?: boolean;
        zoomEnabled?: boolean;
        zoomControlEnabled?: boolean;
        rotateEnabled?: boolean;
        cacheEnabled?: boolean;
        loadingEnabled?: boolean;
        loadingBackgroundColor?: any;
        loadingIndicatorColor?: any;
        scrollEnabled?: boolean;
        pitchEnabled?: boolean;
        toolbarEnabled?: boolean;
        moveOnMarkerPress?: boolean;
        showsScale?: boolean;
        showsBuildings?: boolean;
        showsTraffic?: boolean;
        showsIndoors?: boolean;
        showsIndoorLevelPicker?: boolean;
        mapType?: 'standard' | 'satellite' | 'hybrid' | 'terrain' | 'none' | 'mutedStandard';
        region?: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number; };
        initialRegion?: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number; };
        liteMode?: boolean;
        maxDelta?: number;
        minDelta?: number;
        legalLabelInsets?: any;
        onChange?: Function;
        onMapReady?: Function;
        onRegionChange?: (region: Region) => void;
        onRegionChangeComplete?: (region: Region) => void;
        onPress?: (value: { coordinate: LatLng, position: Point }) => void;
        onLayout?: Function;
        onLongPress?: (value: { coordinate: LatLng, position: Point }) => void;
        onPanDrag?: (value: {coordinate: LatLng, position: Point }) => void;
        onMarkerPress?: Function;
        onMarkerSelect?: Function;
        onMarkerDeselect?: Function;
        onCalloutPress?: Function;
        onMarkerDragStart?: (value: { coordinate: LatLng, position: Point }) => void;
        onMarkerDrag?: (value: { coordinate: LatLng, position: Point }) => void;
        onMarkerDragEnd?: (value: { coordinate: LatLng, position: Point }) => void;
        minZoomLevel?: number;
        maxZoomLevel?: number;
    }

    export default class MapView extends React.Component<MapViewProps, any> {
        static Animated: any;
        static AnimatedRegion: any;
        animateToRegion(region: Region, duration?: number): void;
        animateToCoordinate(latLng: LatLng, duration?: number): void;
        animateToBearing(bearing: number, duration?: number): void;
        animateToViewingAngle(angle: number, duration?: number): void;
        fitToElements(animated: boolean): void;
        fitToSuppliedMarkers(markers: string[], animated: boolean): void;
        fitToCoordinates(coordinates?: LatLng[], options?:{}): void;
        setMapBoundaries(northEast: LatLng, southWest: LatLng): void;
    }

    export type LineCapType = 'butt' | 'round' | 'square';
    export type LineJoinType = 'miter' | 'round' | 'bevel';

    export interface MarkerProps {
        identifier?: string;
        reuseIdentifier?: string;
        title?: string;
        description?: string;
        image?: any;
        opacity?: number;
        pinColor?: string;
        coordinate: { latitude: number; longitude: number };
        centerOffset?: { x: number; y: number };
        calloutOffset?: { x: number; y: number };
        anchor?: { x: number; y: number };
        calloutAnchor?: { x: number; y: number };
        flat?: boolean;
        draggable?: boolean;
        onPress?: (value: { coordinate: LatLng, position: Point }) => void;
        onSelect?: (value: { coordinate: LatLng, position: Point }) => void;
        onDeselect?: (value: { coordinate: LatLng, position: Point }) => void;
        onCalloutPress?: Function;
        onDragStart?: (value: { coordinate: LatLng, position: Point }) => void;
        onDrag?: (value: { coordinate: LatLng, position: Point }) => void;
        onDragEnd?: (value: { coordinate: LatLng, position: Point }) => void;
        zIndex?: number;
        style?: any;
        rotation?: number;
        tracksViewChanges?: boolean
        tracksInfoWindowChanges?: boolean
    }

    export interface MapPolylineProps {
        coordinates: { latitude: number; longitude: number; }[];
        onPress?: Function;
        tappable?: boolean;
        fillColor?: string;
        strokeWidth?: number;
        strokeColor?: string;
        zIndex?: number;
        lineCap?: LineCapType;
        lineJoin?: LineJoinType;
        miterLimit?: number;
        geodesic?: boolean;
        lineDashPhase?: number;
        lineDashPattern?: number[];
    }

    export interface MapPolygonProps {
        coordinates: { latitude: number; longitude: number; }[];
        holes?: { latitude: number; longitude: number; }[][];
        onPress?: Function;
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

    export interface MapCircleProps {
        center: { latitude: number; longitude: number };
        radius: number;
        onPress?: Function;
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

    export interface MapUrlTileProps {
        urlTemplate: string;
        zIndex?: number;
    }

    export interface MapLocalTileProps {
        pathTemplate: string;
        tileSize: number;
        zIndex?: number;
    }

    export interface MapMbTileProps {
        pathTemplate: string;
        tileSize: number;
        zIndex?: number;
    }

    export interface MapCalloutProps {
        tooltip?: boolean;
        onPress?: Function;
        style?: any;
    }

    export class Marker extends React.Component<MarkerProps, any> {
        showCallout(): void;
        hideCallout(): void;
        animateMarkerToCoordinate(coordinate: LatLng, duration: number): void;
    }
    export class Polyline extends React.Component<MapPolylineProps, any> { }
    export class Polygon extends React.Component<MapPolygonProps, any> { }
    export class Circle extends React.Component<MapCircleProps, any> { }
    export class UrlTile extends React.Component<MapUrlTileProps, any> { }
    export class LocalTile extends React.Component<MapLocalTileProps, any> { }
    export class MbTile extends React.Component<MapMbTileProps, any> { }
    export class Callout extends React.Component<MapCalloutProps, any> { }
}
