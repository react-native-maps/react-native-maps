import * as React from 'react';
import { WMSTileLayer } from 'react-leaflet';
// Not supported

export default ({ attribution, urlTemplate, zIndex, opacity, tileSize }) => (
  <WMSTileLayer
    url={urlTemplate}
    zIndex={zIndex}
    opacity={opacity}
    attribution={attribution}
    tileSize={tileSize}
  />
);
