import type {HostComponent} from 'react-native';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import {NativeProps} from './MapView';
import {Camera} from './MapView.types';

export type MapViewNativeComponentType = HostComponent<NativeProps>;

interface NativeCommands {
  setCamera: (
    viewRef: NonNullable<
      React.RefObject<MapViewNativeComponentType>['current']
    >,
    camera: Partial<Camera>,
  ) => void;

  setIndoorActiveLevelIndex: (
    viewRef: NonNullable<
      React.RefObject<MapViewNativeComponentType>['current']
    >,
    activeLevelIndex: number,
  ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['setCamera', 'setIndoorActiveLevelIndex'],
});
