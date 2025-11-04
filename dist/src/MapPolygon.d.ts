import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { ProviderContext, type NativeComponent, type MapManagerCommand, type UIManagerCommand } from './decorateMapComponent';
import type { PolygonPressEvent } from './MapPolygon.types';
import type { LatLng, LineCapType, LineJoinType } from './sharedTypes';
export type MapPolygonProps = ViewProps & {
    /**
     * An array of coordinates to describe the polygon
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    coordinates: LatLng[];
    /**
     * The fill color to use for the path.
     *
     * @default `#000`, `rgba(r,g,b,0.5)`
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    fillColor?: string;
    /**
     * Boolean to indicate whether to draw each segment of the line as a geodesic as opposed to straight lines on the Mercator projection.
     * A geodesic is the shortest path between two points on the Earth's surface.
     * The geodesic curve is constructed assuming the Earth is a sphere.
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    geodesic?: boolean;
    /**
     * A 2d array of coordinates to describe holes of the polygon where each hole has at least 3 points.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    holes?: LatLng[][];
    /**
     * The line cap style to apply to the open ends of the path
     *
     * @default `round`
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    lineCap?: LineCapType;
    /**
     * An array of numbers specifying the dash pattern to use for the path.
     * The array contains one or more numbers that indicate the lengths (measured in points)
     * of the line segments and gaps in the pattern.
     * The values in the array alternate, starting with the first line segment length,
     * followed by the first gap length, followed by the second line segment length, and so on.
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Supported
     */
    lineDashPattern?: number[];
    /**
     * The offset (in points) at which to start drawing the dash pattern.
     * Use this property to start drawing a dashed line partway through a segment or gap.
     * For example, a phase value of 6 for the patter 5-2-3-2 would cause drawing to begin in the middle of the first gap.
     *
     * @default 0
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    lineDashPhase?: number;
    /**
     * The line join style to apply to corners of the path.
     *
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    lineJoin?: LineJoinType;
    /**
     * The limiting value that helps avoid spikes at junctions between connected line segments.
     * The miter limit helps you avoid spikes in paths that use the `miter` `lineJoin` style.
     * If the ratio of the miter length—that is, the diagonal length of the miter join—to the line thickness exceeds the miter limit,
     * the joint is converted to a bevel join.
     * The default miter limit is 10, which results in the conversion of miters whose angle at the joint is less than 11 degrees.
     *
     * @default 10
     * @platform iOS: Apple Maps only
     * @platform Android: Not supported
     */
    miterLimit?: number;
    /**
     * Callback that is called when the user presses on the polygon
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    onPress?: (event: PolygonPressEvent) => void;
    /**
     * The stroke color to use for the path.
     *
     * @default `#000`, `rgba(r,g,b,0.5)`
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    strokeColor?: string;
    /**
     * The stroke width to use for the path.
     *
     * @default 1
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    strokeWidth?: number;
    /**
     * Boolean to allow a polygon to be tappable and use the onPress function.
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    tappable?: boolean;
    /**
     * The order in which this tile overlay is drawn with respect to other overlays.
     * An overlay with a larger z-index is drawn over overlays with smaller z-indices.
     * The order of overlays with the same z-index is arbitrary.
     *
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    zIndex?: number;
};
type NativeProps = MapPolygonProps & {
    ref: React.RefObject<View | null>;
};
export declare class MapPolygon extends React.Component<MapPolygonProps> {
    context: React.ContextType<typeof ProviderContext>;
    getNativeComponent: () => NativeComponent<NativeProps>;
    getMapManagerCommand: (name: string) => MapManagerCommand;
    getUIManagerCommand: (name: string) => UIManagerCommand;
    private polygon;
    constructor(props: MapPolygonProps);
    setNativeProps(props: Partial<MapPolygonProps>): void;
    render(): React.JSX.Element;
}
declare const _default: typeof MapPolygon;
export default _default;
