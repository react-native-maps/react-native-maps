/// <reference types="react" />
import type { HostComponent } from 'react-native';
import { NativeProps } from './MapMarker';
import { LatLng } from './sharedTypes';
export declare type MapMarkerNativeComponentType = HostComponent<NativeProps>;
interface NativeCommands {
    showCallout: (viewRef: NonNullable<React.RefObject<MapMarkerNativeComponentType>['current']>) => void;
    hideCallout: (viewRef: NonNullable<React.RefObject<MapMarkerNativeComponentType>['current']>) => void;
    redrawCallout: (viewRef: NonNullable<React.RefObject<MapMarkerNativeComponentType>['current']>) => void;
    animateMarkerToCoordinate: (viewRef: NonNullable<React.RefObject<MapMarkerNativeComponentType>['current']>, coordinate: LatLng, duration: number) => void;
    redraw: (viewRef: NonNullable<React.RefObject<MapMarkerNativeComponentType>['current']>) => void;
}
export declare const Commands: NativeCommands;
export {};
