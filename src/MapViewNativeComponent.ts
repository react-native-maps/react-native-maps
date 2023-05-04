import type {HostComponent} from 'react-native';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import {NativeProps} from './MapView';

export type MapViewNativeComponentType = HostComponent<NativeProps>;

interface NativeCommands {
  setIndoorActiveLevelIndex: (
    viewRef: NonNullable<
      React.RefObject<MapViewNativeComponentType>['current']
    >,
    activeLevelIndex: number,
  ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['setIndoorActiveLevelIndex'],
});
