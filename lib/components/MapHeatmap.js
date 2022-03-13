import PropTypes from 'prop-types';
import React from 'react';
import { processColor } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import decorateMapComponent, {
  SUPPORTED,
  USES_DEFAULT_IMPLEMENTATION,
} from './decorateMapComponent';

const propTypes = {
  ...ViewPropTypes,

  /**
   * Array of heatmap entries to apply towards density.
   */
  points: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Latitude/Longitude coordinates
       */
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      weight: PropTypes.number,
    })
  ),

  /**
   * The radius of the heatmap points in pixels, between 10 and 50
   * (default 20).
   */
  radius: PropTypes.number,

  /**
   * The opacity of the heatmap (default 0.7).
   */
  opacity: PropTypes.number,

  /**
   * Heatmap gradient configuration.
   */
  gradient: PropTypes.shape({
    /**
     * Colors (one or more) to use for gradient.
     */
    colors: PropTypes.arrayOf(PropTypes.string),
    /**
     * Array of floating point values from 0 to 1 representing
     * where each color starts.
     */
    startPoints: PropTypes.arrayOf(PropTypes.number),
    /**
     * Resolution of color map -- number corresponding to the
     * number of steps colors are interpolated into (default 256).
     */
    colorMapSize: PropTypes.number,
  }),
};

const defaultProps = {
  strokeColor: '#000',
  strokeWidth: 1,
};

class MapHeatmap extends React.Component {
  setNativeProps(props) {
    this.heatmap.setNativeProps(props);
  }

  render() {
    const AIRMapHeatmap = this.getAirComponent();
    let gradient;
    if (this.props.gradient) {
      gradient = Object.assign({}, this.props.gradient);
      gradient.colors = gradient.colors.map((c) => processColor(c));
    }
    return (
      <AIRMapHeatmap
        {...this.props}
        gradient={gradient}
        ref={(ref) => {
          this.heatmap = ref;
        }}
      />
    );
  }
}

MapHeatmap.propTypes = propTypes;
MapHeatmap.defaultProps = defaultProps;

export default decorateMapComponent(MapHeatmap, {
  componentType: 'Heatmap',
  providers: {
    google: {
      ios: SUPPORTED,
      android: USES_DEFAULT_IMPLEMENTATION,
    },
  },
});
