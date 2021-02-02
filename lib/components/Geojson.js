import React from 'react';
import Marker from './MapMarker';
import Polyline from './MapPolyline';
import Polygon from './MapPolygon';

export const makeOverlays = features => {
  const points = features
    .filter(
      f =>
        f.geometry &&
        (f.geometry.type === 'Point' || f.geometry.type === 'MultiPoint')
    )
    .map(feature =>
      makeCoordinates(feature).map(coordinates =>
        makeOverlay(coordinates, feature)
      )
    )
    .reduce(flatten, [])
    .map(overlay => ({ ...overlay, type: 'point' }));

  const lines = features
    .filter(
      f =>
        f.geometry &&
        (f.geometry.type === 'LineString' ||
          f.geometry.type === 'MultiLineString')
    )
    .map(feature =>
      makeCoordinates(feature).map(coordinates =>
        makeOverlay(coordinates, feature)
      )
    )
    .reduce(flatten, [])
    .map(overlay => ({ ...overlay, type: 'polyline' }));

  const multipolygons = features
    .filter(f => f.geometry && f.geometry.type === 'MultiPolygon')
    .map(feature =>
      makeCoordinates(feature).map(coordinates =>
        makeOverlay(coordinates, feature)
      )
    )
    .reduce(flatten, []);

  const polygons = features
    .filter(f => f.geometry && f.geometry.type === 'Polygon')
    .map(feature => makeOverlay(makeCoordinates(feature), feature))
    .reduce(flatten, [])
    .concat(multipolygons)
    .map(overlay => ({ ...overlay, type: 'polygon' }));

  return points.concat(lines).concat(polygons);
};

const flatten = (prev, curr) => prev.concat(curr);

const makeOverlay = (coordinates, feature) => {
  let overlay = {
    feature,
  };
  if (
    feature.geometry.type === 'Polygon' ||
    feature.geometry.type === 'MultiPolygon'
  ) {
    overlay.coordinates = coordinates[0];
    if (coordinates.length > 1) {
      overlay.holes = coordinates.slice(1);
    }
  } else {
    overlay.coordinates = coordinates;
  }
  return overlay;
};

const makePoint = c => ({ latitude: c[1], longitude: c[0] });

const makeLine = l => l.map(makePoint);

const makeCoordinates = feature => {
  const g = feature.geometry;
  if (g.type === 'Point') {
    return [makePoint(g.coordinates)];
  } else if (g.type === 'MultiPoint') {
    return g.coordinates.map(makePoint);
  } else if (g.type === 'LineString') {
    return [makeLine(g.coordinates)];
  } else if (g.type === 'MultiLineString') {
    return g.coordinates.map(makeLine);
  } else if (g.type === 'Polygon') {
    return g.coordinates.map(makeLine);
  } else if (g.type === 'MultiPolygon') {
    return g.coordinates.map(p => p.map(makeLine));
  } else {
    return [];
  }
};

const doesOverlayContainProperty = (overlay, property) => {
  // Geojson may have 0 for the opacity when intention is to not specify the
  // opacity. Therefore, we evaluate the truthiness of the propery where 0
  // would return false.
  return (
    overlay.feature &&
    overlay.feature.properties &&
    overlay.feature.properties[property]
  );
};

const getRgbaFromHex = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

const getColor = (props, overlay, colorType, overrideColorProp) => {
  if (props.hasOwnProperty(overrideColorProp)) {
    return props[overrideColorProp];
  }
  if (doesOverlayContainProperty(overlay, colorType)) {
    let color = overlay.feature.properties[colorType];
    const opacityProperty = colorType + '-opacity';
    if (
      doesOverlayContainProperty(overlay, opacityProperty) &&
      color[0] === '#'
    ) {
      color = getRgbaFromHex(
        color,
        overlay.feature.properties[opacityProperty]
      );
    }
    return color;
  }
  return null;
};

const getStrokeWidth = (props, overlay) => {
  if (props.hasOwnProperty('strokeWidth')) {
    return props['strokeWidth'];
  }
  if (doesOverlayContainProperty(overlay, 'stroke-width')) {
    return overlay.feature.properties['stroke-width'];
  }
  return null;
};

const Geojson = props => {
  const overlays = makeOverlays(props.geojson.features);
  return (
    <React.Fragment>
      {overlays.map((overlay, index) => {
        const fillColor = getColor(props, overlay, 'fill', 'fillColor');
        const strokeColor = getColor(props, overlay, 'stroke', 'strokeColor');
        const markerColor = getColor(props, overlay, 'marker-color', 'color');
        const strokeWidth = getStrokeWidth(props, overlay);
        if (overlay.type === 'point') {
          return (
            <Marker
              key={index}
              coordinate={overlay.coordinates}
              image={props.image}
              pinColor={markerColor}
              zIndex={props.zIndex}
            />
          );
        }
        if (overlay.type === 'polygon') {
          return (
            <Polygon
              key={index}
              coordinates={overlay.coordinates}
              holes={overlay.holes}
              strokeColor={strokeColor}
              fillColor={fillColor}
              strokeWidth={strokeWidth}
              tappable={props.tappable}
              onPress={props.onPress}
              zIndex={props.zIndex}
            />
          );
        }
        if (overlay.type === 'polyline') {
          return (
            <Polyline
              key={index}
              coordinates={overlay.coordinates}
              strokeColor={strokeColor}
              strokeWidth={strokeWidth}
              lineDashPhase={props.lineDashPhase}
              lineDashPattern={props.lineDashPattern}
              lineCap={props.lineCap}
              lineJoin={props.lineJoin}
              miterLimit={props.miterLimit}
              zIndex={props.zIndex}
            />
          );
        }
      })}
    </React.Fragment>
  );
};

export default Geojson;
