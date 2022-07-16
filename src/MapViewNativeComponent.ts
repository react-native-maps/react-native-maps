import type {HostComponent} from 'react-native';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import {NativeProps} from './MapView';
import {Address, BoundingBox, Camera, EdgePadding} from './MapView.types';
import {Frame, LatLng, Point, Region} from './sharedTypes';

export type MapViewNativeComponentType = HostComponent<NativeProps>;

interface NativeCommands {
  animateToRegion: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
    region: Region,
    duration: number,
  ) => void;
  getCamera: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
  ) => Promise<Camera>;
  setCamera: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
    camera: Partial<Camera>,
  ) => void;
  animateCamera: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
    camera: Partial<Camera>,
    duration: number,
  ) => void;
  fitToElements: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
    edgePadding: EdgePadding,
    animated: boolean,
  ) => void;
  fitToSuppliedMarkers: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
    markers: string[],
    edgePadding: EdgePadding,
    animated: boolean,
  ) => void;
  fitToCoordinates: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
    coordinates: LatLng[],
    edgePadding: EdgePadding,
    animated: boolean,
  ) => void;
  getMapBoundaries: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
  ) => Promise<BoundingBox>;
  setMapBoundaries: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
    northEast: LatLng,
    southWest: LatLng,
  ) => void;
  setIndoorActiveLevelIndex: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
    activeLevelIndex: number,
  ) => void;
  takeSnapshot: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
    width: number,
    height: number,
    region: Partial<Region>,
    format: 'png' | 'jpg',
    quality: number,
    result: 'file' | 'base64',
    callback: (error?: unknown, snapshot?: string) => void,
  ) => void;
  getAddressFromCoordinates: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
    coordinate: LatLng,
  ) => Promise<Address>;
  pointForCoordinate: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
    coordinate: LatLng,
  ) => Promise<Point>;
  coordinateForPoint: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
    point: Point,
  ) => Promise<LatLng>;
  getMarkersFrames: (
    viewRef: React.ElementRef<MapViewNativeComponentType>,
    onlyVisible: boolean,
  ) => Promise<{
    [key: string]: {point: Point; frame: Frame};
  }>;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: [
    'animateCamera',
    'animateToRegion',
    'coordinateForPoint',
    'fitToCoordinates',
    'fitToElements',
    'fitToSuppliedMarkers',
    'getAddressFromCoordinates',
    'getCamera',
    'getMapBoundaries',
    'getMarkersFrames',
    'pointForCoordinate',
    'setCamera',
    'setIndoorActiveLevelIndex',
    'setMapBoundaries',
    'takeSnapshot',
  ],
});
