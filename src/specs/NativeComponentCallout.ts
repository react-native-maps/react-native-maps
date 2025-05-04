import type {HostComponent, ViewProps} from 'react-native';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type {
  Double,
  BubblingEventHandler,
} from 'react-native/Libraries/Types/CodegenTypes';

export type LatLng = Readonly<{
  latitude: Double; // Non-nullable Double for latitude
  longitude: Double; // Non-nullable Double for longitude
}>;

export type CalloutPressEvent = BubblingEventHandler<
  Readonly<{
    action?: string;
    id: string;
    coordinate: {
      latitude: Double; // Inlined LatLng
      longitude: Double;
    };
    position?: {
      x: Double; // Inlined Point
      y: Double;
    }; // Optional position for Android
  }>
>;

export interface CalloutFabricNativeProps extends ViewProps {
  /**
   * If `true`, clicks on transparent areas in callout will be passed to map.
   *
   * @default false
   * @platform iOS: Supported
   * @platform Android: Not supported
   */
  alphaHitTest?: boolean;

  /**
   * Callback that is called when the user presses on the callout
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  onPress?: CalloutPressEvent;

  /**
   * If `false`, a default "tooltip" bubble window will be drawn around this callouts children.
   * If `true`, the child views can fully customize their appearance, including any "bubble" like styles.
   *
   * @default false
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  tooltip?: boolean;
}

export default codegenNativeComponent<CalloutFabricNativeProps>(
  'RNMapsCallout',
  {
    excludedPlatforms: ['iOS'],
  },
) as HostComponent<CalloutFabricNativeProps>;
