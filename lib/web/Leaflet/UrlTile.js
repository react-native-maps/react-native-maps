import * as React from 'react';
import { TileLayer } from 'react-leaflet';
// Not supported

export default ({ urlTemplate, attribution, opacity, zIndex }) => (
  <TileLayer url={urlTemplate} attribution={attribution} opacity={opacity} maximumZ={zIndex} />
);
