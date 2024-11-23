import type {HostComponent, ViewProps} from 'react-native';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';


interface NativeProps extends ViewProps {

}

export default codegenNativeComponent<NativeProps>('RNMapsMapView', {
  excludedPlatforms: ['android'],
}) as HostComponent<NativeProps>;
