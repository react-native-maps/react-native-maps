import * as React from 'react';
import { Layer, Feature } from 'react-mapbox-gl';

import { convertCoordinate } from './utils/coordinates';
import { getPaintFromUniversalProps } from './utils/paint';

// TODO: Opacity

export default ({
  // universal
  center,
  radius,
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
  zIndex,

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
  // Mapbox Paint API: https://docs.mapbox.com/mapbox-gl-js/style-spec/#layer-paint
  const paint = getPaintFromUniversalProps({
    circleRadius: radius,
    circleStrokeWidth: strokeWidth,
    circleStrokeColor: strokeColor,
    circleFillColor: fillColor,
    lineCap,
    lineJoin,
    miterLimit,
    lineDashPhase,
    lineDashPattern,
  });

  const coordinates = convertCoordinate(center);
  return (
    <Layer type="circle" id={id} paint={paint}>
      <Feature coordinates={coordinates} onClick={onPress} />
    </Layer>
  );
};
