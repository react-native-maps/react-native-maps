/// <reference types="react" />
import type { HostComponent } from 'react-native';
import { NativeProps } from './MapPolyline';
export type MapPolylineNativeComponentType = HostComponent<NativeProps>;
interface NativeCommands {
    startPolylineAnimation: (viewRef: NonNullable<React.RefObject<MapPolylineNativeComponentType>['current']>, staticColor: string, animationDuration: number, delay: number) => void;
    stopPolylineAnimation: (viewRef: NonNullable<React.RefObject<MapPolylineNativeComponentType>['current']>) => void;
}
export declare const Commands: NativeCommands;
export {};
