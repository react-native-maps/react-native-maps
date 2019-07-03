import * as React from 'react';
import { ImageOverlay } from 'react-leaflet';
import { latLngBounds } from 'leaflet';

// TODO: Bacon: If the URL is a video then use VideoOverlay
export default ({ url, bounds, attribution, opacity, zIndex, ...props }) => (
  <ImageOverlay
    {...props}
    bounds={latLngBounds(bounds[0], bounds[1])}
    url={url}
    attribution={attribution}
    opacity={opacity}
    zIndex={zIndex}
  />
);
