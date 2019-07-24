import * as React from 'react';
import { Polygon } from 'react-leaflet';
import { convertCoordinate } from './utils/coordinates';

import createLogger from '../utils/createLogger';
const logger = createLogger('Leaflet', 'Polygon');

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
    <Polygon
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
