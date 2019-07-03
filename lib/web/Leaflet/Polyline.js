import * as React from 'react';
import { Polyline } from 'react-leaflet';
import { convertCoordinate } from './utils/coordinates';

export default ({
  coordinates,
  holes,
  strokeWidth,
  strokeColor,
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
