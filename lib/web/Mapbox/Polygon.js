import * as React from 'react';
import { Layer, Source, Feature } from 'react-mapbox-gl';

import { convertCoordinate } from './utils/coordinates';
import { getPaintFromUniversalProps } from './utils/paint';

export default ({
  // universal
  coordinates,
  holes,
  strokeWidth,
  strokeColor,
  fillColor,
  onPress,
  lineCap,
  lineJoin,
  miterLimit,
  lineDashPhase,
  lineDashPattern,

  // TODO
  geodesic,
  tappable,

  // non-standard
  id,
  /* object Properties object passed down to the feature at the creation of the source. */
  properties,
  /* (mapWithEvt: object) => void Triggered when the mouse enter the feature element */
  onMouseEnter,
  /* (mapWithEvt: object) => void Triggered when the mouse leave the feature element */
  onMouseLeave,
  /* (Default: false) : boolean Define wether the feature is draggable or not. */
  draggable,
  /* (mapWithEvt: object) => void Triggered when the user start dragging the feature. */
  onDragStart,
  /* (mapWithEvt: object) => void Triggered when the user continue dragging the feature (ie. move). */
  onDrag,
  /* (mapWithEvt: object) => void Triggered when the user stop dragging the feature. */
  onDragEnd,
}) => {
  const allPolygons = [coordinates, ...(holes || [])].filter(
    polygon => Array.isArray(polygon) && polygon.length
  );
  const positions = allPolygons.map(polygon =>
    polygon.map(coordinate => convertCoordinate(coordinate))
  );

  // Mapbox Paint API: https://docs.mapbox.com/mapbox-gl-js/style-spec/#layer-paint
  const paint = getPaintFromUniversalProps({
    lineWidth: strokeWidth,
    lineColor: strokeColor,
    fillColor: fillColor,
    lineCap,
    lineJoin,
    miterLimit,
    lineDashPhase,
    lineDashPattern,
  });

  const SOURCE_OPTIONS = {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: positions,
      },
    },
  };

  return (
    <>
      <Layer type="line" id={id} paint={paint}>
        <Source id={id} tileJsonSource={SOURCE_OPTIONS} />
      </Layer>
    </>
  );
};
