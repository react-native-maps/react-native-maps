import * as React from 'react';
import { DivOverlay, Popup } from 'react-leaflet';

import { transformProps } from './utils/transformProps';

function localTransformProps({ style, ...props }) {
  return {
    style,
    ...transformProps(props),
  };
}

export default class ExpoCallout extends React.Component {
  setNativeProps(props) {
    this.ref.setStyleIfChanged(this.props, localTransformProps(props));
  }

  render() {
    const props = localTransformProps(this.props);
    return <Popup ref={ref => (this.ref = ref)} {...props} />;
  }
}
