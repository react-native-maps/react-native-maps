import type {HostComponent} from 'react-native';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import {NativeProps} from './MapMarker';
import {LatLng} from './sharedTypes';

export type MapMarkerNativeComponentType = HostComponent<NativeProps>;

interface NativeCommands {
  showCallout: (
    viewRef: React.ElementRef<MapMarkerNativeComponentType>,
  ) => void;
  hideCallout: (
    viewRef: React.ElementRef<MapMarkerNativeComponentType>,
  ) => void;
  redrawCallout: (
    viewRef: React.ElementRef<MapMarkerNativeComponentType>,
  ) => void;
  animateMarkerToCoordinate: (
    viewRef: React.ElementRef<MapMarkerNativeComponentType>,
    coordinate: LatLng,
    duration: number,
  ) => void;
  redraw: (viewRef: React.ElementRef<MapMarkerNativeComponentType>) => void;
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
