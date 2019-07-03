import * as React from 'react';
import { Circle } from 'react-leaflet';

import { convertCoordinate } from './utils/coordinates';

export default ({
  center,
  radius,
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
}) => (
  <Circle
    center={convertCoordinate(center)}
    radius={radius}
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
