import * as React from 'react';
import { TileLayer } from 'react-leaflet';

import createLogger from '../utils/createLogger';
import { transformProps } from './utils/transformProps';

const logger = createLogger('Leaflet', 'LocalTile');

function localTransformProps(props) {
  return {
    ...transformProps(props),
    url: props.urlTemplate,
    maximumZ: props.zIndex,
  };
}

export default class ExpoLocalTile extends React.Component {
  setNativeProps(props) {
    this.ref.setStyleIfChanged(this.props, localTransformProps(props));
  }

  render() {
    const props = localTransformProps(this.props);

    return <TileLayer ref={ref => (this.ref = ref)} {...props} />;
  }
}
