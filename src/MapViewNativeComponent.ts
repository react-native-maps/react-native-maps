import type {HostComponent} from 'react-native';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import type {NativeProps} from './MapView';
import type {Camera, EdgePadding} from './MapView.types';
import type {LatLng, Region} from './sharedTypes';

export type MapViewNativeComponentType = HostComponent<NativeProps>;

interface NativeCommands {
  animateToRegion: (
    viewRef: NonNullable<
      React.RefObject<MapViewNativeComponentType>['current']
    >,
    region: Region,
    duration: number,
  ) => void;

  setCamera: (
    viewRef: NonNullable<
      React.RefObject<MapViewNativeComponentType>['current']
    >,
    camera: Partial<Camera>,
  ) => void;

  animateCamera: (
    viewRef: NonNullable<
      React.RefObject<MapViewNativeComponentType>['current']
    >,
    camera: Partial<Camera>,
    duration: number,
  ) => void;

  fitToElements: (
    viewRef: NonNullable<
      React.RefObject<MapViewNativeComponentType>['current']
    >,
    edgePadding: EdgePadding,
    animated: boolean,
  ) => void;

  fitToSuppliedMarkers: (
    viewRef: NonNullable<
      React.RefObject<MapViewNativeComponentType>['current']
    >,
    markers: string[],
    edgePadding: EdgePadding,
    animated: boolean,
  ) => void;

  fitToCoordinates: (
    viewRef: NonNullable<
      React.RefObject<MapViewNativeComponentType>['current']
    >,
    coordinates: LatLng[],
    edgePadding: EdgePadding,
    animated: boolean,
  ) => void;

  setMapBoundaries: (
    viewRef: NonNullable<
      React.RefObject<MapViewNativeComponentType>['current']
    >,
    northEast: LatLng,
    southWest: LatLng,
  ) => void;

  setIndoorActiveLevelIndex: (
    viewRef: NonNullable<
      React.RefObject<MapViewNativeComponentType>['current']
    >,
    activeLevelIndex: number,
  ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: [
    'animateToRegion',
    'setCamera',
    'animateCamera',
    'fitToElements',
    'fitToSuppliedMarkers',
    'fitToCoordinates',
    'setMapBoundaries',
    'setIndoorActiveLevelIndex',
  ],
});
