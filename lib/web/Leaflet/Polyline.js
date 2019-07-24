import * as React from 'react';
import { Polyline } from 'react-leaflet';

import createLogger from '../utils/createLogger';
import { convertCoordinate } from './utils/coordinates';

const logger = createLogger('Leaflet', 'Polyline');

export default ({
  coordinates,
  holes,
  strokeWidth,
  strokeColor,
  strokeColors,
  fillColor,
  lineCap,
  lineJoin,
  miterLimit,
  geodesic,
  lineDashPhase,
  lineDashPattern,
  tappable,
  onPress,
}) => {
  if (Array.isArray(strokeColors) && strokeColor.length) {
    logger.warn('`strokeColors` is not supported');
  }

  const allPolygons = [coordinates, ...(holes || [])].filter(
    polygon => Array.isArray(polygon) && polygon.length
  );
  const positions = allPolygons.map(polygon =>
    polygon.map(coordinate => convertCoordinate(coordinate))
  );

  return (
    <Polyline
      positions={positions}
      weight={strokeWidth}
      color={strokeColor}
      fillColor={fillColor}
      lineCap={lineCap}
      lineJoin={lineJoin}
      dashOffset={lineDashPhase}
      dashArray={lineDashPattern}
      interactive={tappable}
      click={onPress}
    />
  );
};
