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
        onRegionChange?: Function;
        onRegionChangeComplete?: Function;
        onPress?: Function;
        onLayout?: Function;
        onLongPress?: Function;
        onPanDrag?: Function;
        onMarkerPress?: Function;
        onMarkerSelect?: Function;
        onMarkerDeselect?: Function;
        onCalloutPress?: Function;
        onMarkerDragStart?: Function;
        onMarkerDrag?: Function;
        onMarkerDragEnd?: Function;
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
        onPress?: Function;
        onSelect?: Function;
        onDeselect?: Function;
        onCalloutPress?: Function;
        onDragStart?: Function;
        onDrag?: Function;
        onDragEnd?: Function;
        zIndex?: number;
        style?: any;
    }

    export interface MapPolylineProps {
        coordinates?: { latitude: number; longitude: number; }[];
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
        coordinates?: { latitude: number; longitude: number; }[];
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

    export interface MapCalloutProps {
        tooltip?: boolean;
        onPress?: Function;
        style?: any;
    }

    export class Marker extends React.Component<MarkerProps, any> { }
    export class Polyline extends React.Component<MapPolylineProps, any> { }
    export class Polygon extends React.Component<MapPolygonProps, any> { }
    export class Circle extends React.Component<MapCircleProps, any> { }
    export class UrlTile extends React.Component<MapUrlTileProps, any> { }
    export class LocalTile extends React.Component<MapLocalTileProps, any> { }
    export class Callout extends React.Component<MapCalloutProps, any> { }
}
