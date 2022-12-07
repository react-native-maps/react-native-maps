import { ClickEvent, LatLng, Point, Region } from './sharedTypes';
import { NativeSyntheticEvent } from 'react-native';
export declare type Camera = {
    /**
     * Apple Maps
     */
    altitude?: number;
    center: LatLng;
    heading: number;
    pitch: number;
    /**
     * Google Maps
     */
    zoom?: number;
};
export declare type MapStyleElement = {
    featureType?: string;
    elementType?: string;
    stylers: object[];
};
export declare type EdgePadding = {
    top: Number;
    right: Number;
    bottom: Number;
    left: Number;
};
export declare type MapType = 'hybrid' | 'mutedStandard' | 'none' | 'satellite' | 'standard' | 'terrain';
export declare type MapTypes = {
    STANDARD: 'standard';
    SATELLITE: 'satellite';
    HYBRID: 'hybrid';
    TERRAIN: 'terrain';
    NONE: 'none';
    MUTEDSTANDARD: 'mutedStandard';
};
export declare type IndoorLevel = {
    index: number;
    name: string;
    shortName: string;
};
export declare type ActiveIndoorLevel = {
    activeLevelIndex: number;
    name: string;
    shortName: string;
};
export declare type IndoorLevelActivatedEvent = NativeSyntheticEvent<{
    IndoorLevel: ActiveIndoorLevel;
}>;
export declare type IndoorBuilding = {
    underground: boolean;
    activeLevelIndex: number;
    levels: IndoorLevel[];
};
export declare type IndoorBuildingEvent = NativeSyntheticEvent<{
    IndoorBuilding: IndoorBuilding;
}>;
export declare type KmlMarker = {
    id: string;
    title: string;
    description: string;
    coordinate: LatLng;
    position: Point;
};
export declare type KmlMapEvent = NativeSyntheticEvent<{
    markers: KmlMarker[];
}>;
export declare type LongPressEvent = ClickEvent<{
    /**
     * @platform Android
     */
    action?: 'long-press';
}>;
export declare type PanDragEvent = ClickEvent;
export declare type PoiClickEvent = NativeSyntheticEvent<{
    placeId: string;
    name: string;
    coordinate: LatLng;
    /**
     * @platform Android
     */
    position?: Point;
}>;
export declare type MapPressEvent = ClickEvent<{
    /**
     * @platform Android
     */
    action?: 'press' | 'marker-press';
}>;
export declare type Details = {
    isGesture?: boolean;
};
export declare type UserLocationChangeEvent = NativeSyntheticEvent<{
    coordinate?: LatLng & {
        altitude: number;
        timestamp: number;
        accuracy: number;
        speed: number;
        heading: number;
        /**
         * @platform iOS
         */
        altitudeAccuracy?: number;
        /**
         * @platform Android
         */
        isFromMockProvider?: boolean;
    };
    /**
     * @platform iOS
     */
    error?: {
        message: string;
    };
}>;
export declare type ChangeEvent = NativeSyntheticEvent<{
    continuous: boolean;
    region: Region;
    isGesture?: boolean;
}>;
export declare type FitToOptions = {
    edgePadding?: EdgePadding;
    animated?: boolean;
};
export declare type BoundingBox = {
    northEast: LatLng;
    southWest: LatLng;
};
export declare type SnapshotOptions = {
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
};
export declare type Address = {
    administrativeArea: string;
    country: string;
    countryCode: string;
    locality: string;
    name: string;
    postalCode: string;
    subAdministrativeArea: string;
    subLocality: string;
    thoroughfare: string;
};
export declare type NativeCommandName = 'animateCamera' | 'animateToRegion' | 'coordinateForPoint' | 'fitToCoordinates' | 'fitToElements' | 'fitToSuppliedMarkers' | 'getAddressFromCoordinates' | 'getCamera' | 'getMapBoundaries' | 'getMarkersFrames' | 'pointForCoordinate' | 'setCamera' | 'setIndoorActiveLevelIndex' | 'setMapBoundaries' | 'takeSnapshot';
