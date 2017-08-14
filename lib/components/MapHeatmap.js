import PropTypes from 'prop-types';
import React from 'react';

import { ViewPropTypes } from 'react-native';

import decorateMapComponent, {
  SUPPORTED,
  NOT_SUPPORTED,
} from './decorateMapComponent';

const propTypes = {
  ...ViewPropTypes,

  /**
   * An array of points for the heatmap
   */
  points: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Latitude/Longitude coordinates with optional weight
       */
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      weight: PropTypes.number,
    })
  ),
};

const defaultProps = {
  points: [],
};

class MapHeatmap extends React.Component {
  getSanitizedPoints = () => this.props.points.map((point) => ({ weight: 1, ...point }));

  render() {
    const AIRMapHeatmap = this.getAirComponent();
    return <AIRMapHeatmap points={this.getSanitizedPoints()} />;
  }
}

MapHeatmap.propTypes = propTypes;
MapHeatmap.defaultProps = defaultProps;

module.exports = decorateMapComponent(MapHeatmap, {
  componentType: 'Heatmap',
  providers: {
    google: {
      ios: NOT_SUPPORTED,
      android: SUPPORTED,
    },
  },
});
