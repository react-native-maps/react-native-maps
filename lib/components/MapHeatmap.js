import PropTypes from 'prop-types';
import React from 'react';
import {
  ViewPropTypes,
  View,
} from 'react-native';
import decorateMapComponent, {
  USES_DEFAULT_IMPLEMENTATION,
  SUPPORTED,
} from './decorateMapComponent';

// if ViewPropTypes is not defined fall back to View.propType (to support RN < 0.44)
const viewPropTypes = ViewPropTypes || View.propTypes;

const propTypes = {
  ...viewPropTypes,

  /**
   * Array of heatmap entries to apply towards density.
   */
  points: PropTypes.arrayOf(PropTypes.shape({
    /**
     * Latitude/Longitude coordinates
     */
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  })),

  /**
   * The radius of the heatmap points (in meters)
   */
  radius: PropTypes.number,

  /**
   * The opacity of the heatmap.
   */
  opacity: PropTypes.number,
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
    const AIRGoogleMapHeatmap = this.getAirComponent();
    return (
      <AIRGoogleMapHeatmap {...this.props} ref={ref => { this.heatmap = ref; }} />
    );
  }
}

MapCircle.propTypes = propTypes;
MapCircle.defaultProps = defaultProps;

export default decorateMapComponent(MapHeatmap, {
  componentType: 'Heatmap',
  providers: {
    google: {
      ios: SUPPORTED,
      android: USES_DEFAULT_IMPLEMENTATION,
    },
  },
});
