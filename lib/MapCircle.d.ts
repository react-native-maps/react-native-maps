import * as React from 'react';
import { View, ViewProps } from 'react-native';
import { ProviderContext, NativeComponent, MapManagerCommand, UIManagerCommand } from './decorateMapComponent';
import { LatLng, LineCapType, LineJoinType } from './sharedTypes';
export declare type MapCircleProps = ViewProps & {
    /**
     * The coordinates of the center of the circle.
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    center: LatLng;
    /**
     * The fill color to use for the path.
     *
     * @default `#000`, `rgba(r,g,b,0.5)`
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    fillColor?: string;
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
     * @platform Android: Not supported
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
     * The radius of the circle to be drawn (in meters)
     *
     * @platform iOS: Supported
     * @platform Android: Supported
     */
    radius: number;
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
     * The order in which this tile overlay is drawn with respect to other overlays.
     * An overlay with a larger z-index is drawn over overlays with smaller z-indices.
     * The order of overlays with the same z-index is arbitrary.
     *
     * @default 0
     * @platform iOS: Google Maps only
     * @platform Android: Supported
     */
    zIndex?: number;
};
declare type NativeProps = MapCircleProps & {
    ref: React.RefObject<View>;
};
export declare class MapCircle extends React.Component<MapCircleProps> {
    context: React.ContextType<typeof ProviderContext>;
    getNativeComponent: () => NativeComponent<NativeProps>;
    getMapManagerCommand: (name: string) => MapManagerCommand;
    getUIManagerCommand: (name: string) => UIManagerCommand;
    private circle;
    constructor(props: MapCircleProps);
    setNativeProps(props: Partial<NativeProps>): void;
    render(): JSX.Element;
}
declare const _default: typeof MapCircle;
export default _default;
