
var React = require('react-native');
var {
  View,
  NativeMethodsMixin,
  requireNativeComponent,
  StyleSheet,
  PropTypes,
} = React;

var MapUrlTile = React.createClass({
  mixins: [NativeMethodsMixin],

  propTypes: {
    ...View.propTypes,

    /**
     * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
     * For example, http://c.tile.openstreetmap.org/{z}/{x}/{y}.png
     */
    urlTemplate: PropTypes.string.isRequired,

    /**
     * The order in which this tile overlay is drawn with respect to other overlays. An overlay
     * with a larger z-index is drawn over overlays with smaller z-indices. The order of overlays
     * with the same z-index is arbitrary. The default zIndex is -1.
     *
     * @platform android
     */
    zIndex: PropTypes.number,
  },

  render: function() {
    return (
      <AIRMapUrlTile
        {...this.props}
      />
    );
  },
});

var AIRMapUrlTile = requireNativeComponent('AIRMapUrlTile', MapUrlTile);

module.exports = MapUrlTile;
