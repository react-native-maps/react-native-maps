declare module "react-native-maps" {
    import * as React from 'react';
    import { Animated } from 'react-native';

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
        x: number
        y: number
    }

    export type Coordinate = Number[];

    export class AnimatedRegion extends Animated.AnimatedWithChildren {
        latitude: Animated.Value
        longitude: Animated.Value
        latitudeDelta: Animated.Value
        longitudeDelta: Animated.Value

        constructor(region: Region);

        setValue(value: Region): void;
        setOffset(offset: Region): void;
        flattenOffset(): void;
        __getValue(): Region;
        __attach(): void;
        __detach(): void;
        stopAnimation(callback?: Function): void;
        addListener(callback: Function): string;
        removeListener(id: string): void;
        spring(config: any): any;
        timing(config: any): any;
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
        onPoiClick?: (value: {coordinate: LatLng, position: Point, placeId: string, name: string }) => void;
        minZoomLevel?: number;
        maxZoomLevel?: number;
        kmlSrc?: string;
    }

    export default class MapView extends React.Component<MapViewProps, any> {
        animateToRegion(region: Region, duration?: number): void;
        animateToCoordinate(latLng: LatLng, duration?: number): void;
        animateToBearing(bearing: number, duration?: number): void;
        animateToViewingAngle(angle: number, duration?: number): void;
        fitToElements(animated: boolean): void;
        fitToSuppliedMarkers(markers: string[], animated: boolean): void;
        fitToCoordinates(coordinates?: LatLng[], options?: {}): void;
        setMapBoundaries(northEast: LatLng, southWest: LatLng): void;
        takeSnapshot(options?: SnapshotOptions): Promise<string>;
    }

    export class MapViewAnimated extends React.Component<MapViewProps, any> {
        animateToRegion(region: Region, duration?: number): void;
        animateToCoordinate(latLng: LatLng, duration?: number): void;
        animateToBearing(bearing: number, duration?: number): void;
        animateToViewingAngle(angle: number, duration?: number): void;
        fitToElements(animated: boolean): void;
        fitToSuppliedMarkers(markers: string[], animated: boolean): void;
        fitToCoordinates(coordinates?: LatLng[], options?: {}): void;
        setMapBoundaries(northEast: LatLng, southWest: LatLng): void;
        takeSnapshot(options?: SnapshotOptions): Promise<string>;
    }

    export interface SnapshotOptions {
        width?: number;              // optional, when omitted the view-width is used
        height?: number;             // optional, when omitted the view-height is used
        region?: Region;             // iOS only, optional region to render
        format?: 'png' | 'jpg';      // image formats: 'png', 'jpg' (default: 'png')
        quality?: number;            // image quality: 0..1 (only relevant for jpg, default: 1)
        result?: 'file' | 'base64';  // result types: 'file', 'base64' (default: 'file')
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
        coordinate: { latitude: number; longitude: number } | AnimatedRegion;
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
        stopPropagation?: boolean
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

    export interface MapOverlayProps {
        image?: any;
        bounds: Coordinate[];
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
    export class Overlay extends React.Component<MapOverlayProps, any> { }
    export class Callout extends React.Component<MapCalloutProps, any> { }

    export class MarkerAnimated extends React.Component<MarkerProps, any> {
        showCallout(): void;
        hideCallout(): void;
        animateMarkerToCoordinate(coordinate: LatLng, duration: number): void;
    }
    export class OverlayAnimated extends React.Component<MapOverlayProps, any> { }
}
