import type { HostComponent } from 'react-native';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import { NativeProps } from './MapPolyline';

export type MapPolylineNativeComponentType = HostComponent<NativeProps>;

interface NativeCommands {
    startPolylineAnimation: (
        viewRef: NonNullable<
            React.RefObject<MapPolylineNativeComponentType>['current']
        >,
        staticColor: string,
        animationDuration: number,
        delay: number
    ) => void;
    stopPolylineAnimation: (
        viewRef: NonNullable<
            React.RefObject<MapPolylineNativeComponentType>['current']
        >,
    ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
    supportedCommands: [
        'startPolylineAnimation',
        'stopPolylineAnimation'
    ],
});
