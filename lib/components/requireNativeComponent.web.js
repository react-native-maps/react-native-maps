import * as React from 'react';

import * as Maps from '../web';
import { StyleSheet } from 'react-native';

const Components = Maps.Leaflet;

export default function requireNativeComponent(name, Component, nativeProps) {
  if (!(name in Components)) throw new Error(`Component ${name} is not registered on web.`);
  const NativeComponent = Components[name];
  return React.forwardRef(({ style, ...props }, ref) => {
    const composed = StyleSheet.flatten(style);

    return <NativeComponent style={composed} {...props} ref={ref} {...nativeProps} />;
  });
}
