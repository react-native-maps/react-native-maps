import React from 'react';
import PropTypes from 'prop-types';
import Marker from './MapMarker';
import Polyline from './MapPolyline';
import Polygon from './MapPolygon';
import { ColorPropType } from 'deprecated-react-native-prop-types';

const propTypes = {
  /**
   * [Geojson](https://geojson.org/) description of object.
   */
  geojson: PropTypes.object.isRequired,

  /**
   * The stroke color to use for the path.
   */
  strokeColor: ColorPropType,

  /**
   * The fill color to use for the path.
   */
  fillColor: ColorPropType,

  /**
   * The stroke width to use for the path.
   */
  strokeWidth: PropTypes.number,

  /**
   * The offset (in points) at which to start drawing the dash pattern.
   *
   * Use this property to start drawing a dashed line partway through a segment or gap. For
   * example, a phase value of 6 for the patter 5-2-3-2 would cause drawing to begin in the
   * middle of the first gap.
   *
   * The default value of this property is 0.
   *
   * @platform ios
   */
  lineDashPhase: PropTypes.number,

  /**
   * Make the `Polygon` or `Polyline` tappable
   *
   */
  tappable: PropTypes.boolean,

  /**
   * An array of numbers specifying the dash pattern to use for the path.
   *
   * The array contains one or more numbers that indicate the lengths (measured in points) of the
   * line segments and gaps in the pattern. The values in the array alternate, starting with the
   * first line segment length, followed by the first gap length, followed by the second line
   * segment length, and so on.
   *
   * This property is set to `null` by default, which indicates no line dash pattern.
   *
   * @platform ios
   */
  lineDashPattern: PropTypes.arrayOf(PropTypes.number),

  /**
   * The line cap style to apply to the open ends of the path.
   * The default style is `round`.
   *
   * @platform ios
   */
  lineCap: PropTypes.oneOf(['butt', 'round', 'square']),

  /**
   * The line join style to apply to corners of the path.
   * The default style is `round`.
   *
   * @platform ios
   */
  lineJoin: PropTypes.oneOf(['miter', 'round', 'bevel']),

  /**
   * The limiting value that helps avoid spikes at junctions between connected line segments.
   * The miter limit helps you avoid spikes in paths that use the `miter` `lineJoin` style. If
   * the ratio of the miter length—that is, the diagonal length of the miter join—to the line
   * thickness exceeds the miter limit, the joint is converted to a bevel join. The default
   * miter limit is 10, which results in the conversion of miters whose angle at the joint
   * is less than 11 degrees.
   *
   * @platform ios
   */
  miterLimit: PropTypes.number,

  /**
   * The order in which this tile overlay is drawn with respect to other overlays. An overlay
   * with a larger z-index is drawn over overlays with smaller z-indices. The order of overlays
   * with the same z-index is arbitrary. The default zIndex is 0.
   *
   * @platform android
   */
  zIndex: PropTypes.number,

  /**
   * Callback that is called when the user presses on the polygon
   */
  onPress: PropTypes.func,

  /**
   * Component to render in place of the default marker when the overlay type is a `point`
   *
   */
  markerComponent: PropTypes.node,

  /**
   * The title of the marker. This is only used if the <Marker /> component has no children that
   * are a `<Callout />`, in which case the default callout behavior will be used, which
   * will show both the `title` and the `description`, if provided.
   */
  title: PropTypes.string,
};

const Geojson = (props) => {
  const {
    title,
    image,
    zIndex,
    onPress,
    lineCap,
    lineJoin,
    tappable,
    miterLimit,
    lineDashPhase,
    lineDashPattern,
    markerComponent,
  } = props;
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
              image={image}
              title={title}
              pinColor={markerColor}
              zIndex={zIndex}
              onPress={() => onPress && onPress(overlay)}
            >
              {markerComponent}
            </Marker>
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
              tappable={tappable}
              onPress={() => onPress && onPress(overlay)}
              zIndex={zIndex}
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
              lineDashPhase={lineDashPhase}
              lineDashPattern={lineDashPattern}
              lineCap={lineCap}
              lineJoin={lineJoin}
              miterLimit={miterLimit}
              zIndex={zIndex}
              tappable={tappable}
              onPress={() => onPress && onPress(overlay)}
            />
          );
        }
      })}
    </React.Fragment>
  );
};

Geojson.propTypes = propTypes;

export default Geojson;

export const makeOverlays = (features) => {
  const points = features
    .filter(
      (f) =>
        f.geometry &&
        (f.geometry.type === 'Point' || f.geometry.type === 'MultiPoint')
    )
    .map((feature) =>
      makeCoordinates(feature).map((coordinates) =>
        makeOverlay(coordinates, feature)
      )
    )
    .reduce(flatten, [])
    .map((overlay) => ({ ...overlay, type: 'point' }));

  const lines = features
    .filter(
      (f) =>
        f.geometry &&
        (f.geometry.type === 'LineString' ||
          f.geometry.type === 'MultiLineString')
    )
    .map((feature) =>
      makeCoordinates(feature).map((coordinates) =>
        makeOverlay(coordinates, feature)
      )
    )
    .reduce(flatten, [])
    .map((overlay) => ({ ...overlay, type: 'polyline' }));

  const multipolygons = features
    .filter((f) => f.geometry && f.geometry.type === 'MultiPolygon')
    .map((feature) =>
      makeCoordinates(feature).map((coordinates) =>
        makeOverlay(coordinates, feature)
      )
    )
    .reduce(flatten, []);

  const polygons = features
    .filter((f) => f.geometry && f.geometry.type === 'Polygon')
    .map((feature) => makeOverlay(makeCoordinates(feature), feature))
    .reduce(flatten, [])
    .concat(multipolygons)
    .map((overlay) => ({ ...overlay, type: 'polygon' }));

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

const makePoint = (c) => ({ latitude: c[1], longitude: c[0] });

const makeLine = (l) => l.map(makePoint);

const makeCoordinates = (feature) => {
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
    return g.coordinates.map((p) => p.map(makeLine));
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
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
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
  return;
};

const getStrokeWidth = (props, overlay) => {
  if (props.hasOwnProperty('strokeWidth')) {
    return props.strokeWidth;
  }
  if (doesOverlayContainProperty(overlay, 'stroke-width')) {
    return overlay.feature.properties['stroke-width'];
  }
  return;
};
