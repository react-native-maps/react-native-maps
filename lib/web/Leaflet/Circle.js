import * as React from 'react';
import { Circle } from 'react-leaflet';

import { convertCoordinate } from './utils/coordinates';
import { transformProps } from './utils/transformProps';

function localTransformProps(props) {
  const { center, radius } = props;

  return {
    ...transformProps(props),
    center: convertCoordinate(center),
  };
}

export default class ExpoCircle extends React.Component {
  setNativeProps(props) {
    this.ref.setStyleIfChanged(this.props, localTransformProps(props));
  }

  render() {
    const props = localTransformProps(this.props);
    return <Circle ref={ref => (this.ref = ref)} {...props} />;
  }
}
