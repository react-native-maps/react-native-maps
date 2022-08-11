import type {HostComponent} from 'react-native';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import {NativeProps} from './MapMarker';
import {LatLng} from './sharedTypes';

export type MapMarkerNativeComponentType = HostComponent<NativeProps>;

interface NativeCommands {
  showCallout: (
    viewRef: React.RefObject<MapMarkerNativeComponentType>['current'],
  ) => void;
  hideCallout: (
    viewRef: React.RefObject<MapMarkerNativeComponentType>['current'],
  ) => void;
  redrawCallout: (
    viewRef: React.RefObject<MapMarkerNativeComponentType>['current'],
  ) => void;
  animateMarkerToCoordinate: (
    viewRef: React.RefObject<MapMarkerNativeComponentType>['current'],
    coordinate: LatLng,
    duration: number,
  ) => void;
  redraw: (
    viewRef: React.RefObject<MapMarkerNativeComponentType>['current'],
  ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: [
    'showCallout',
    'hideCallout',
    'redrawCallout',
    'animateMarkerToCoordinate',
    'redraw',
  ],
});
