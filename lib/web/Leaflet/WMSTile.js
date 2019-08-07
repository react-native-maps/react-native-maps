import * as React from 'react';
import { WMSTileLayer } from 'react-leaflet';

import createLogger from '../utils/createLogger';
import { transformProps } from './utils/transformProps';

const logger = createLogger('Leaflet', 'WMSTile');

function localTransformProps(props) {
  return {
    ...transformProps(props),
    url: props.urlTemplate,
    tileSize: props.tileSize,
    maximumZ: props.zIndex,
    // zIndex
  };
}

export default class ExpoWMSTile extends React.Component {
  setNativeProps(props) {
    this.ref.setStyleIfChanged(this.props, localTransformProps(props));
  }

  render() {
    const props = localTransformProps(this.props);

    return <WMSTileLayer ref={ref => (this.ref = ref)} {...props} />;
  }
}
