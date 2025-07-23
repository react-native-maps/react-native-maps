import * as React from 'react';
import type {
  Feature,
  FeatureCollection,
  Point,
  Position,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
} from 'geojson';
import Marker, {type MapMarkerProps as MarkerProps} from './MapMarker';
import type {MapPolygonProps as PolygonProps} from './MapPolygon';
import type {MapPolylineProps as PolylineProps} from './MapPolyline';
import Polyline from './MapPolyline';
import MapPolygon from './MapPolygon';
import type {LatLng} from './sharedTypes';

export type GeojsonProps = {
  /**
   * Sets the anchor point for the marker.
   * The anchor specifies the point in the icon image that is anchored to the marker's position on the Earth's surface.
   *
   * The anchor point is specified in the continuous space [0.0, 1.0] x [0.0, 1.0],
   * where (0, 0) is the top-left corner of the image, and (1, 1) is the bottom-right corner.
   *
   * The anchoring point in a W x H image is the nearest discrete grid point in a (W + 1) x (H + 1) grid, obtained by scaling the then rounding.
   * For example, in a 4 x 2 image, the anchor point (0.7, 0.6) resolves to the grid point at (3, 1).
   *
   * @default {x: 0.5, y: 1.0}
   * @platform iOS: Google Maps only. For Apple Maps, see the `centerOffset` prop
   * @platform Android: Supported
   */
  anchor?: MarkerProps['anchor'];

  /**
   * The offset (in points) at which to display the annotation view.
   *
   * By default, the center point of an annotation view is placed at the coordinate point of the associated annotation.
   *
   * Positive offset values move the annotation view down and to the right, while negative values move it up and to the left.
   *
   * @default {x: 0.0, y: 0.0}
   * @platform iOS: Apple Maps only. For Google Maps, see the `anchor` prop
   * @platform Android: Not supported. See see the `anchor` prop
   */
  centerOffset?: MarkerProps['centerOffset'];

  /**
   * The pincolor used on markers
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  color?: MarkerProps['pinColor'];

  /**
   * The fill color to use for the path.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  fillColor?: PolygonProps['fillColor'];

  /**
   * [Geojson](https://geojson.org/) description of object.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  geojson: FeatureCollection;

  /**
   * A custom image to be used as the marker's icon. Only local image resources are allowed to be
   * used.
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  image?: MarkerProps['image'];

  /**
   * The line cap style to apply to the open ends of the path.
   * The default style is `round`.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Supported
   */
  lineCap?: PolylineProps['lineCap'];

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
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  lineDashPattern?:
    | PolygonProps['lineDashPattern']
    | PolylineProps['lineDashPattern'];

  /**
   * The offset (in points) at which to start drawing the dash pattern.
   *
   * Use this property to start drawing a dashed line partway through a segment or gap. For
   * example, a phase value of 6 for the patter 5-2-3-2 would cause drawing to begin in the
   * middle of the first gap.
   *
   * The default value of this property is 0.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  lineDashPhase?: PolylineProps['lineDashPhase'];

  /**
   * The line join style to apply to corners of the path.
   * The default style is `round`.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  lineJoin?: PolylineProps['lineJoin'];

  /**
   * Component to render in place of the default marker when the overlay type is a `point`
   *
   * @platform iOS: Supported
   * @platform Android: Supported
   */
  markerComponent?: MarkerProps['children'];

  /**
   * The limiting value that helps avoid spikes at junctions between connected line segments.
   * The miter limit helps you avoid spikes in paths that use the `miter` `lineJoin` style. If
   * the ratio of the miter length—that is, the diagonal length of the miter join—to the line
   * thickness exceeds the miter limit, the joint is converted to a bevel join. The default
   * miter limit is 10, which results in the conversion of miters whose angle at the joint
   * is less than 11 degrees.
   *
   * @platform iOS: Apple Maps only
   * @platform Android: Not supported
   */
  miterLimit?: PolylineProps['miterLimit'];

  /**
   * Callback that is called when the user presses any of the overlays
   */
  onPress?: (event: OverlayPressEvent) => void;

  /**
   * The stroke color to use for the path.
   *
   * @platform — iOS: Supported
   * @platform — Android: Supported
   */
  strokeColor?: PolygonProps['strokeColor'] | PolylineProps['strokeColor'];

  /**
   * The stroke width to use for the path.
   *
   * @platform — iOS: Supported
   * @platform — Android: Supported
   */
  strokeWidth?: PolygonProps['strokeWidth'] | PolylineProps['strokeWidth'];

  /**
   * Make the `Polygon` or `Polyline` tappable
   *
   * @platform — iOS: Google Maps only
   * @platform — Android: Supported
   */
  tappable?: PolygonProps['tappable'] | PolylineProps['tappable'];

  /**
   * The title of the marker. This is only used if the <Marker /> component has no children that
   * are a `<Callout />`, in which case the default callout behavior will be used, which
   * will show both the `title` and the `description`, if provided.
   *
   * @platform — iOS: Supported
   * @platform — Android: Supported
   */
  title?: MarkerProps['title'];

  /**
   * Sets whether this marker should track view changes.
   * It's recommended to turn it off whenever it's possible to improve custom marker performance.
   * This is the default value for all point markers in your geojson data. It can be overriden
   * on a per point basis by adding a `trackViewChanges` property to the `properties` object on the point.
   *
   * @default true
   * @platform iOS: Google Maps only
   * @platform Android: Supported
   */
  tracksViewChanges?: boolean;

  /**
   * The order in which this tile overlay is drawn with respect to other overlays. An overlay
   * with a larger z-index is drawn over overlays with smaller z-indices. The order of overlays
   * with the same z-index is arbitrary. The default zIndex is 0.
   *
   * @platform iOS: Apple Maps: [Marker], Google Maps: [Marker, Polygon, Polyline]
   * @platform Android: Supported
   */
  zIndex?:
    | MarkerProps['zIndex']
    | PolygonProps['zIndex']
    | PolylineProps['zIndex'];
};

const Geojson = (props: GeojsonProps) => {
  const {
    anchor,
    centerOffset,
    geojson,
    strokeColor,
    fillColor,
    strokeWidth,
    color,
    title,
    image,
    zIndex,
    onPress,
    lineCap,
    lineJoin,
    tappable,
    tracksViewChanges,
    miterLimit,
    lineDashPhase,
    lineDashPattern,
    markerComponent,
  } = props;
  const pointOverlays = makePointOverlays(geojson.features);
  const lineOverlays = makeLineOverlays(geojson.features);
  const polygonOverlays = makePolygonOverlays(geojson.features);
  return (
    <React.Fragment>
      {pointOverlays.map((overlay, index) => {
        const markerColor = getColor(color, overlay, 'marker-color');
        const pointOverlayTracksViewChanges =
          overlay.feature.properties?.tracksViewChanges || tracksViewChanges;
        return (
          <Marker
            key={index}
            coordinate={overlay.coordinates}
            tracksViewChanges={pointOverlayTracksViewChanges}
            image={image}
            title={title}
            pinColor={markerColor}
            zIndex={zIndex}
            anchor={anchor}
            centerOffset={centerOffset}
            onPress={() => onPress && onPress(overlay)}>
            {markerComponent}
          </Marker>
        );
      })}
      {lineOverlays.map((overlay, index) => {
        const lineStrokeColor = getColor(strokeColor, overlay, 'stroke');
        const lineStrokeWidth = getStrokeWidth(strokeWidth, overlay);

        return (
          <Polyline
            key={index}
            coordinates={overlay.coordinates}
            strokeColor={lineStrokeColor}
            strokeWidth={lineStrokeWidth}
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
      })}
      {polygonOverlays.map((overlay, index) => {
        const polygonFillColor = getColor(fillColor, overlay, 'fill');
        const lineStrokeColor = getColor(strokeColor, overlay, 'stroke');
        const lineStrokeWidth = getStrokeWidth(strokeWidth, overlay);

        return (
          <MapPolygon
            key={index}
            coordinates={overlay.coordinates}
            holes={overlay.holes}
            strokeColor={lineStrokeColor}
            fillColor={polygonFillColor}
            strokeWidth={lineStrokeWidth}
            lineDashPhase={lineDashPhase}
            lineDashPattern={lineDashPattern}
            lineCap={lineCap}
            lineJoin={lineJoin}
            miterLimit={miterLimit}
            tappable={tappable}
            onPress={() => onPress && onPress(overlay)}
            zIndex={zIndex}
          />
        );
      })}
    </React.Fragment>
  );
};

export default Geojson;

const makePointOverlays = (features: Feature[]): AnyPointOverlay[] => {
  return features
    .filter(isAnyPointFeature)
    .map(feature =>
      makeCoordinatesForAnyPoint(feature.geometry).map(coordinates =>
        makeOverlayForAnyPoint(coordinates, feature),
      ),
    )
    .reduce((prev, curr) => prev.concat(curr), [])
    .map(overlay => ({...overlay, type: 'point'}));
};

const makeLineOverlays = (features: Feature[]): AnyLineStringOverlay[] => {
  return features
    .filter(isAnyLineStringFeature)
    .map(feature =>
      makeCoordinatesForAnyLine(feature.geometry).map(coordinates =>
        makeOverlayForAnyLine(coordinates, feature),
      ),
    )
    .reduce((prev, curr) => prev.concat(curr), [])
    .map(overlay => ({...overlay, type: 'polyline'}));
};

const makePolygonOverlays = (features: Feature[]): AnyPolygonOverlay[] => {
  const multipolygons: AnyPolygonOverlay[] = features
    .filter(isMultiPolygonFeature)
    .map(feature =>
      makeCoordinatesForMultiPolygon(feature.geometry).map(coordinates =>
        makeOverlayForAnyPolygon(coordinates, feature),
      ),
    )
    .reduce((prev, curr) => prev.concat(curr), [])
    .map(overlay => ({...overlay, type: 'polygon'}));

  const polygons: AnyPolygonOverlay[] = features
    .filter(isPolygonFeature)
    .map(feature =>
      makeOverlayForAnyPolygon(
        makeCoordinatesForPolygon(feature.geometry),
        feature,
      ),
    )
    .reduce<Omit<AnyPolygonOverlay, 'type'>[]>(
      (prev, curr) => prev.concat(curr),
      [],
    )
    .map(overlay => ({...overlay, type: 'polygon'}));

  return polygons.concat(multipolygons);
};

const makeOverlayForAnyPoint = (
  coordinates: LatLng,
  feature: Feature<Point | MultiPoint>,
): Omit<AnyPointOverlay, 'type'> => {
  return {feature, coordinates};
};

const makeOverlayForAnyLine = (
  coordinates: LatLng[],
  feature: Feature<LineString | MultiLineString>,
): Omit<AnyLineStringOverlay, 'type'> => {
  return {feature, coordinates};
};

const makeOverlayForAnyPolygon = (
  coordinates: LatLng[][],
  feature: Feature<Polygon | MultiPolygon>,
): Omit<AnyPolygonOverlay, 'type'> => {
  return {
    feature,
    coordinates: coordinates[0],
    holes: coordinates.length > 1 ? coordinates.slice(1) : undefined,
  };
};

const makePoint = (c: Position): LatLng => ({
  latitude: c[1],
  longitude: c[0],
});

const makeLine = (l: Position[]) => l.map(makePoint);

const makeCoordinatesForAnyPoint = (geometry: Point | MultiPoint) => {
  if (geometry.type === 'Point') {
    return [makePoint(geometry.coordinates)];
  }
  return geometry.coordinates.map(makePoint);
};

const makeCoordinatesForAnyLine = (geometry: LineString | MultiLineString) => {
  if (geometry.type === 'LineString') {
    return [makeLine(geometry.coordinates)];
  }
  return geometry.coordinates.map(makeLine);
};

const makeCoordinatesForPolygon = (geometry: Polygon) => {
  return geometry.coordinates.map(makeLine);
};

const makeCoordinatesForMultiPolygon = (geometry: MultiPolygon) => {
  return geometry.coordinates.map(p => p.map(makeLine));
};

const getRgbaFromHex = (hex: string, alpha: number = 1) => {
  const matchArray = hex.match(/\w\w/g);
  if (!matchArray || matchArray.length < 3) {
    throw new Error('Invalid hex string');
  }
  const [r, g, b] = matchArray.map(x => {
    const subColor = parseInt(x, 16);
    if (Number.isNaN(subColor)) {
      throw new Error('Invalid hex string');
    }
    return subColor;
  });
  return `rgba(${r},${g},${b},${alpha})`;
};

const getColor = (
  prop: string | undefined,
  overlay: Overlay,
  colorType: string,
) => {
  if (prop) {
    return prop;
  }
  let color = overlay.feature.properties?.[colorType];
  if (color) {
    const opacityProperty = colorType + '-opacity';
    const alpha = overlay.feature.properties?.[opacityProperty];
    if (alpha && alpha !== '0' && color[0] === '#') {
      color = getRgbaFromHex(color, alpha);
    }
    return color;
  }
  return undefined;
};

const getStrokeWidth = (
  prop: GeojsonProps['strokeWidth'],
  overlay: Overlay,
) => {
  if (prop) {
    return prop;
  }
  return overlay.feature.properties?.['stroke-width'];
};

// GeoJSON.Feature type-guards
const isPointFeature = (feature: Feature): feature is Feature<Point> =>
  feature.geometry.type === 'Point';

const isMultiPointFeature = (
  feature: Feature,
): feature is Feature<MultiPoint> => feature.geometry.type === 'MultiPoint';

const isAnyPointFeature = (
  feature: Feature,
): feature is Feature<Point> | Feature<MultiPoint> =>
  isPointFeature(feature) || isMultiPointFeature(feature);

const isLineStringFeature = (
  feature: Feature,
): feature is Feature<LineString> => feature.geometry.type === 'LineString';

const isMultiLineStringFeature = (
  feature: Feature,
): feature is Feature<MultiLineString> =>
  feature.geometry.type === 'MultiLineString';

const isAnyLineStringFeature = (
  feature: Feature,
): feature is Feature<LineString> | Feature<MultiLineString> =>
  isLineStringFeature(feature) || isMultiLineStringFeature(feature);

const isPolygonFeature = (feature: Feature): feature is Feature<Polygon> =>
  feature.geometry.type === 'Polygon';

const isMultiPolygonFeature = (
  feature: Feature,
): feature is Feature<MultiPolygon> => feature.geometry.type === 'MultiPolygon';

type OverlayPressEvent = {
  type:
    | AnyPointOverlay['type']
    | AnyLineStringOverlay['type']
    | AnyPolygonOverlay['type'];
  feature:
    | AnyPointOverlay['feature']
    | AnyLineStringOverlay['feature']
    | AnyPolygonOverlay['feature'];
  coordinates:
    | AnyPointOverlay['coordinates']
    | AnyLineStringOverlay['coordinates']
    | AnyPolygonOverlay['coordinates'];
  holes?: AnyPolygonOverlay['holes'];
};

type AnyPointOverlay = {
  type: 'point';
  feature: Feature<Point | MultiPoint>;
  coordinates: LatLng;
};

type AnyLineStringOverlay = {
  type: 'polyline';
  feature: Feature<LineString | MultiLineString>;
  coordinates: LatLng[];
};

type AnyPolygonOverlay = {
  type: 'polygon';
  feature: Feature<Polygon | MultiPolygon>;
  coordinates: LatLng[];
  holes?: LatLng[][];
};

type Overlay = {
  type: 'point' | 'polyline' | 'polygon';
  feature: Feature;
  coordinates: LatLng | LatLng[];
  holes?: LatLng[][];
};
