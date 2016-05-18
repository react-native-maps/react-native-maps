var React = require('react');
var { PropTypes } = React;

var ReactNative = require('react-native');

var {
  View,
  NativeMethodsMixin,
  requireNativeComponent,
  StyleSheet,
} = ReactNative;

var MapHeatmap = React.createClass({
  mixins: [NativeMethodsMixin],

  propTypes: {
    ...View.propTypes,

    /**
     * An array of points for the heatmap
     */
    points: PropTypes.arrayOf(PropTypes.shape({
      /**
       * Latitude/Longitude coordinates with optional weight
       */
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      weight: PropTypes.number,
    })),
  },

  getDefaultProps: function() {
    return {
      points: [],
    };
  },

  getSanitizedPoints: function() {
    return this.props.points.map(function(point) {
      return {weight: 1, ...point};
    });
  },

  render: function() {
    return (
      <AIRMapHeatmap
        points={this.getSanitizedPoints()}
      />
    );
  },
});

var AIRMapHeatmap = requireNativeComponent('AIRMapHeatmap', MapHeatmap);

module.exports = MapHeatmap;
