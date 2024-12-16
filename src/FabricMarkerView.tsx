import React, {forwardRef, useImperativeHandle, useRef} from 'react';

import FabricMarkerView, {
  MarkerFabricNativeProps,
} from './specs/NativeComponentMarkerView';

export interface FabricMarkerHandle {}

export const FabricMarker = forwardRef<
  FabricMarkerHandle,
  MarkerFabricNativeProps
>((props, ref) => {
  const fabricRef = useRef<React.ElementRef<React.ComponentType>>(null);
  // Use Imperative Handle to expose commands
  useImperativeHandle(ref, () => ({}));

  return <FabricMarkerView {...props} ref={fabricRef} />;
});

export default FabricMarker;
