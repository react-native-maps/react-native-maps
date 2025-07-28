import type {HostComponent} from 'react-native';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import type {NativeProps} from './MapMarker';
import type {LatLng} from './sharedTypes';

export type MapMarkerNativeComponentType = HostComponent<NativeProps>;

interface NativeCommands {
  showCallout: (
    viewRef: NonNullable<
      React.RefObject<MapMarkerNativeComponentType>['current']
    >,
  ) => void;
  hideCallout: (
    viewRef: NonNullable<
      React.RefObject<MapMarkerNativeComponentType>['current']
    >,
  ) => void;
  setCoordinates: (
    viewRef: NonNullable<
      React.RefObject<MapMarkerNativeComponentType>['current']
    >,
    coordinate: LatLng,
  ) => void;
  redrawCallout: (
    viewRef: NonNullable<
      React.RefObject<MapMarkerNativeComponentType>['current']
    >,
  ) => void;
  animateMarkerToCoordinate: (
    viewRef: NonNullable<
      React.RefObject<MapMarkerNativeComponentType>['current']
    >,
    coordinate: LatLng,
    duration: number,
  ) => void;
  redraw: (
    viewRef: NonNullable<
      React.RefObject<MapMarkerNativeComponentType>['current']
    >,
  ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: [
    'showCallout',
    'hideCallout',
    'animateMarkerToCoordinate',
    'setCoordinates',
    'redraw',
  ],
});
