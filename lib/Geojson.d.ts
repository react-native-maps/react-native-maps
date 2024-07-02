import * as React from 'react';
import { Feature, FeatureCollection, Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon } from 'geojson';
import { MapMarkerProps as MarkerProps } from './MapMarker';
import { MapPolygonProps as PolygonProps } from './MapPolygon';
import { MapPolylineProps as PolylineProps } from './MapPolyline';
import { LatLng } from './sharedTypes';
export type GeojsonProps = {
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
    lineDashPattern?: PolylineProps['lineDashPattern'];
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
    zIndex?: MarkerProps['zIndex'] | PolygonProps['zIndex'] | PolylineProps['zIndex'];
};
declare const Geojson: (props: GeojsonProps) => React.JSX.Element;
export default Geojson;
type OverlayPressEvent = {
    type: AnyPointOverlay['type'] | AnyLineStringOverlay['type'] | AnyPolygonOverlay['type'];
    feature: AnyPointOverlay['feature'] | AnyLineStringOverlay['feature'] | AnyPolygonOverlay['feature'];
    coordinates: AnyPointOverlay['coordinates'] | AnyLineStringOverlay['coordinates'] | AnyPolygonOverlay['coordinates'];
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
