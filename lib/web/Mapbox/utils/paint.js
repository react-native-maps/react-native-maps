export function getPaintFromUniversalProps({
  lineWidth,
  lineColor,
  fillColor,
  circleRadius,
  circleStrokeWidth,
  circleStrokeColor,
  circleFillColor,
  lineCap,
  lineJoin,
  miterLimit,
  lineDashPhase,
  lineDashPattern,
}) {
  // Mapbox Paint API: https://docs.mapbox.com/mapbox-gl-js/style-spec/#layer-paint
  const paint = {
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#paint-line-line-width
    'line-width': lineWidth,
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#paint-line-line-color
    'line-color': lineColor,
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#paint-fill-fill-color
    'fill-color': fillColor,
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#paint-circle-circle-color
    'circle-color': circleFillColor,
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#paint-circle-circle-stroke-width
    'circle-stroke-width': circleStrokeWidth,
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#paint-circle-circle-stroke-color
    'circle-stroke-color': circleStrokeColor,
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#paint-circle-circle-radius
    'circle-radius': circleRadius,
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#layout-line-line-cap
    'line-cap': lineCap,
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#layout-line-line-join
    'line-join': lineJoin,
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#layout-line-line-miter-limit
    'line-miter-limit': miterLimit,
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#paint-line-line-dasharray
    'line-dasharray': lineDashPhase,
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#paint-line-line-pattern
    'line-pattern': lineDashPattern,
  };

  return paint;
}
