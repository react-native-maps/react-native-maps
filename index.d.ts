import * as React from 'react';

interface MapViewProps {
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

declare class MapView extends React.Component<MapViewProps, any> {
    static Animated: any;
    static AnimatedRegion: any;
}

declare namespace MapView {

    type LineCapType = 'butt' | 'round' | 'square';
    type LineJoinType = 'miter' | 'round' | 'bevel';

    interface MarkerProps {
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

    interface MapPolylineProps {
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

    interface MapPolygonProps {
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

    interface MapCircleProps {
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

    interface MapUrlTileProps {
        urlTemplate: string;
        zIndex?: number;
    }

    interface MapLocalTileProps {
        pathTemplate: string;
        tileSize: number;
        zIndex?: number;
    }

    interface MapCalloutProps {
        tooltip?: boolean;
        onPress?: Function;
        style?: any;
    }

    export class Marker extends React.Component<MarkerProps, any> {}
    export class Polyline extends React.Component<MapPolylineProps, any> {}
    export class Polygon extends React.Component<MapPolygonProps, any> {}
    export class Circle extends React.Component<MapCircleProps, any> {}
    export class UrlTile extends React.Component<MapUrlTileProps, any> {}
    export class LocalTile extends React.Component<MapLocalTileProps, any> {}
    export class Callout extends React.Component<MapCalloutProps, any> {}
}

export = MapView;
