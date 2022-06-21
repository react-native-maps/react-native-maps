import {ClickEvent, LatLng, Point, Region} from './sharedTypes';
import {NativeSyntheticEvent} from 'react-native';

// All types in this file are directly exported with the package for external
// use.

export type Camera = {
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

export type MapType =
  | 'hybrid'
  | 'mutedStandard'
  | 'none'
  | 'satellite'
  | 'standard'
  | 'terrain';

export type MapTypes = {
  STANDARD: 'standard';
  SATELLITE: 'satellite';
  HYBRID: 'hybrid';
  TERRAIN: 'terrain';
  NONE: 'none';
  MUTEDSTANDARD: 'mutedStandard';
};

export type IndoorLevel = {
  index: number;
  name: string;
  shortName: string;
};

export type ActiveIndoorLevel = {
  activeLevelIndex: number;
  name: string;
  shortName: string;
};

export type IndoorLevelActivatedEvent = NativeSyntheticEvent<{
  IndoorLevel: ActiveIndoorLevel;
}>;

export type IndoorBuilding = {
  underground: boolean;
  activeLevelIndex: number;
  levels: IndoorLevel[];
};

export type IndoorBuildingEvent = NativeSyntheticEvent<{
  IndoorBuilding: IndoorBuilding;
}>;

export type KmlMarker = {
  id: string;
  title: string;
  description: string;
  coordinate: LatLng;
  position: Point;
};

export type KmlMapEvent = NativeSyntheticEvent<{markers: KmlMarker[]}>;

export type LongPressEvent = ClickEvent<{
  /**
   * @platform Android
   */
  action?: 'long-press';
}>;

export type PanDragEvent = ClickEvent;

export type PoiClickEvent = NativeSyntheticEvent<{
  placeId: string;
  name: string;
  coordinate: LatLng;

  /**
   * @platform Android
   */
  position?: Point;
}>;

export type MapPressEvent = ClickEvent<{
  /**
   * @platform Android
   */
  action?: 'press';
}>;

export type Details = {
  isGesture?: boolean;
};

export type UserLocationChangeEvent = NativeSyntheticEvent<{
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

export type ChangeEvent = NativeSyntheticEvent<{
  continuous: boolean;
  region: Region;
  isGesture?: boolean;
}>;

export type FitToOptions = {
  edgePadding?: EdgePadding;
  animated?: boolean;
};

export type BoundingBox = {northEast: LatLng; southWest: LatLng};

export type SnapshotOptions = {
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

export type Address = {
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

export type NativeCommandName =
  | 'animateCamera'
  | 'animateToRegion'
  | 'coordinateForPoint'
  | 'fitToCoordinates'
  | 'fitToElements'
  | 'fitToSuppliedMarkers'
  | 'getAddressFromCoordinates'
  | 'getCamera'
  | 'getMapBoundaries'
  | 'getMarkersFrames'
  | 'pointForCoordinate'
  | 'setCamera'
  | 'setIndoorActiveLevelIndex'
  | 'setMapBoundaries'
  | 'takeSnapshot';
