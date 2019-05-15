import PropTypes from 'prop-types';
import React from 'react';
import { ColorPropType, ViewPropTypes, View } from 'react-native';
import decorateMapComponent, {
  USES_DEFAULT_IMPLEMENTATION,
  SUPPORTED,
} from './decorateMapComponent';

// if ViewPropTypes is not defined fall back to View.propType (to support RN < 0.44)
const viewPropTypes = ViewPropTypes || View.propTypes;

const propTypes = {
  ...viewPropTypes,

  /**
   * The coordinate of the center of the circle
   */
  center: PropTypes.shape({
    /**
     * Coordinates for the center of the circle.
     */
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,

  /**
   * The radius of the circle to be drawn (in meters)
   */
  radius: PropTypes.number.isRequired,

  /**
   * Callback that is called when the user presses on the circle
   */
  onPress: PropTypes.func,

  /**
   * The stroke width to use for the path.
   */
  strokeWidth: PropTypes.number,

  /**
   * The stroke color to use for the path.
   */
  strokeColor: ColorPropType,

  /**
   * The fill color to use for the path.
   */
  fillColor: ColorPropType,

  /**
   * The order in which this tile overlay is drawn with respect to other overlays. An overlay
   * with a larger z-index is drawn over overlays with smaller z-indices. The order of overlays
   * with the same z-index is arbitrary. The default zIndex is 0.
   *
   * @platform android
   */
  zIndex: PropTypes.number,

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
};

const defaultProps = {
  strokeColor: '#000',
  strokeWidth: 1,
};

class MapCircle extends React.Component {
  setNativeProps(props) {
    this.circle.setNativeProps(props);
  }

  render() {
    const AIRMapCircle = this.getAirComponent();
    return (
      <AIRMapCircle
        {...this.props}
        ref={ref => {
          this.circle = ref;
        }}
      />
    );
  }
}

MapCircle.propTypes = propTypes;
MapCircle.defaultProps = defaultProps;

export default decorateMapComponent(MapCircle, {
  componentType: 'Circle',
  providers: {
    google: {
      ios: SUPPORTED,
      android: USES_DEFAULT_IMPLEMENTATION,
    },
  },
});
