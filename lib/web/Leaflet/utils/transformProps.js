import { convertCoordinate } from './coordinates';
import { transformPathEvents } from './events';

export function transformProps(props) {
  const {
    coordinates = [],
    holes = [],
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
    radius,
    center,
    attribution,
    opacity,
  } = props;
  if (Array.isArray(strokeColors) && strokeColor.length) {
    console.warn('`strokeColors` is not supported');
  }

  const allPolygons = [coordinates, ...holes].filter(
    polygon => Array.isArray(polygon) && polygon.length
  );
  const positions = allPolygons.map(polygon =>
    polygon.map(coordinate => convertCoordinate(coordinate))
  );

  return {
    positions: positions.length ? positions : undefined,
    weight: strokeWidth,
    color: strokeColor,
    fillColor: fillColor,
    lineCap: lineCap,
    lineJoin: lineJoin,
    dashOffset: lineDashPhase,
    dashArray: lineDashPattern,
    interactive: tappable,
    center: center ? convertCoordinate(center) : undefined,
    radius: radius,
    attribution,
    opacity,
    ...transformPathEvents(props),
  };
}
