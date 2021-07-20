import * as React from 'react';
import { ImageOverlay } from 'react-leaflet';
import { latLngBounds } from 'leaflet';

import createLogger from '../utils/createLogger';
import { transformProps } from './utils/transformProps';

const logger = createLogger('Leaflet', 'Overlay');

function localTransformProps(props) {
  return {
    ...transformProps(props),
    bounds: latLngBounds(props.bounds[0], props.bounds[1]),
    url: props.url,
    zIndex: props.zIndex,
  };
}

// TODO: Bacon: If the URL is a video then use VideoOverlay
export default class ExpoOverlay extends React.Component {
  setNativeProps(props) {
    this.ref.setStyleIfChanged(this.props, localTransformProps(props));
  }

  render() {
    const props = localTransformProps(this.props);

    return <ImageOverlay ref={ref => (this.ref = ref)} {...props} />;
  }
}
