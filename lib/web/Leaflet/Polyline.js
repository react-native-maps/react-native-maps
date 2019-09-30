import * as React from 'react';
import { Polyline } from 'react-leaflet';

import createLogger from '../utils/createLogger';
import { transformProps } from './utils/transformProps';

const logger = createLogger('Leaflet', 'Polyline');

function localTransformProps(props) {
  const { strokeColor, strokeColors } = props;
  if (Array.isArray(strokeColors) && strokeColor.length) {
    logger.warn('`strokeColors` is not supported');
  }

  return transformProps(props);
}

export default class ExpoPolyline extends React.Component {
  setNativeProps(props) {
    this.ref.setStyleIfChanged(this.props, localTransformProps(props));
  }

  render() {
    const props = localTransformProps(this.props);

    return <Polyline ref={ref => (this.ref = ref)} {...props} />;
  }
}
