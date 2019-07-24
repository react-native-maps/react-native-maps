import * as React from 'react';
import { Polygon } from 'react-leaflet';
import { convertCoordinate } from './utils/coordinates';

import createLogger from '../utils/createLogger';
const logger = createLogger('Leaflet', 'Polygon');

function transformProps({
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
}) {
  if (Array.isArray(strokeColors) && strokeColor.length) {
    logger.warn('`strokeColors` is not supported');
  }

  const allPolygons = [coordinates, ...(holes || [])].filter(
    polygon => Array.isArray(polygon) && polygon.length
  );
  const positions = allPolygons.map(polygon =>
    polygon.map(coordinate => convertCoordinate(coordinate))
  );

  return {
    positions: positions,
    weight: strokeWidth,
    color: strokeColor,
    fillColor: fillColor,
    lineCap: lineCap,
    lineJoin: lineJoin,
    dashOffset: lineDashPhase,
    dashArray: lineDashPattern,
    interactive: tappable,
    click: onPress,
  };
}

export default class ExpoPolygon extends React.Component {
  setNativeProps(props) {
    this.ref.setStyleIfChanged(this.props, transformProps(props));
  }

  render() {
    const props = transformProps(this.props);

    return <Polygon ref={ref => (this.ref = ref)} {...props} />;
  }
}
