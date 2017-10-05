import * as React from 'react';

declare module "react-native-maps" {

    export type ProviderType = 'google';
    export type MapType = 'standard' | 'satellite' | 'hybrid' | 'terrain' | 'none';
    export type LineCapType = 'butt' | 'round' | 'square';
    export type LineJoinType = 'miter' | 'round' | 'bevel';

    export interface MapViewProperties {
        provider?: ProviderType;
        style?: any;
        customMapStyle?: any[];
        customMapStyleString?: string;
        showsUserLocation?: boolean;
        userLocationAnnotationTitle?: string;
        showsMyLocationButton?: boolean;
        followsUserLocation?: boolean;
        showsPointsOfInterest?: boolean;
        showsCompass?: boolean;
        zoomEnabled?: boolean;
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
        mapType?: MapType;
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

    export interface MarkerProperties {
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
    }

    export interface MapPolylineProperties {
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

    export interface MapPolygonProperties {
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

    export interface MapCircleProperties {
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

    export interface MapUrlTitleProperties {
        urlTemplate: string;
        zIndex?: number;
    }

    export interface MapCalloutProperties {
        tooltip?: boolean;
        onPress?: Function;
    }

    class MapView extends React.Component<MapViewProperties, any> {
        static Animated: any;
        static AnimatedRegion: any;
    }

    namespace MapView {
        class Marker extends React.Component<MarkerProperties, any> {}
        class Polyline extends React.Component<MapPolylineProperties, any> {}
        class Polygon extends React.Component<MapPolygonProperties, any> {}
        class Circle extends React.Component<MapCircleProperties, any> {}
        class UrlTile extends React.Component<MapUrlTitleProperties, any> {}
        class Callout extends React.Component<MapCalloutProperties, any> {}
    }
    
    export default MapView;
}
