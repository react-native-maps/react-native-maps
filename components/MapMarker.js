
var React = require('react-native');
var {
  View,
  NativeMethodsMixin,
  requireNativeComponent,
  StyleSheet,
  PropTypes,
  Platform,
  NativeModules,
} = React;

var resolveAssetSource = require('resolveAssetSource');

var MapMarker = React.createClass({
  mixins: [NativeMethodsMixin],

  propTypes: {
    ...View.propTypes,

    // TODO(lmr): get rid of these?
    identifier: PropTypes.string,
    reuseIdentifier: PropTypes.string,

    /**
     * The title of the marker. This is only used if the <Marker /> component has no children that
     * are an `<MapView.Callout />`, in which case the default callout behavior will be used, which
     * will show both the `title` and the `description`, if provided.
     */
    title: PropTypes.string,

    /**
     * The description of the marker. This is only used if the <Marker /> component has no children
     * that are an `<MapView.Callout />`, in which case the default callout behavior will be used,
     * which will show both the `title` and the `description`, if provided.
     */
    description: PropTypes.string,

    /**
     * A custom image to be used as the marker's icon. Only local image resources are allowed to be
     * used.
     */
    image: PropTypes.any,

    /**
     * If no custom marker view or custom image is provided, the platform default pin will be used,
     * which can be customized by this color. Ignored if a custom marker is being used.
     */
    pinColor: PropTypes.string,

    /**
     * The coordinate for the marker.
     */
    coordinate: PropTypes.shape({
      /**
       * Coordinates for the anchor point of the marker.
       */
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }).isRequired,

    /**
     * The offset (in points) at which to display the view.
     *
     * By default, the center point of an annotation view is placed at the coordinate point of the
     * associated annotation. You can use this property to reposition the annotation view as
     * needed. This x and y offset values are measured in points. Positive offset values move the
     * annotation view down and to the right, while negative values move it up and to the left.
     *
     * For android, see the `anchor` prop.
     *
     * @platform ios
     */
    centerOffset: PropTypes.shape({
      /**
       * Offset from the anchor point
       */
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),

    /**
     * The offset (in points) at which to place the callout bubble.
     *
     * This property determines the additional distance by which to move the callout bubble. When
     * this property is set to (0, 0), the anchor point of the callout bubble is placed on the
     * top-center point of the marker view’s frame. Specifying positive offset values moves the
     * callout bubble down and to the right, while specifying negative values moves it up and to
     * the left.
     *
     * For android, see the `calloutAnchor` prop.
     *
     * @platform ios
     */
    calloutOffset: PropTypes.shape({
      /**
       * Offset to the callout
       */
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),

    /**
     * Sets the anchor point for the marker.
     *
     * The anchor specifies the point in the icon image that is anchored to the marker's position
     * on the Earth's surface.
     *
     * The anchor point is specified in the continuous space [0.0, 1.0] x [0.0, 1.0], where (0, 0)
     * is the top-left corner of the image, and (1, 1) is the bottom-right corner. The anchoring
     * point in a W x H image is the nearest discrete grid point in a (W + 1) x (H + 1) grid,
     * obtained by scaling the then rounding. For example, in a 4 x 2 image, the anchor point
     * (0.7, 0.6) resolves to the grid point at (3, 1).
     *
     * For ios, see the `centerOffset` prop.
     *
     * @platform android
     */
    anchor: PropTypes.shape({
      /**
       * Offset to the callout
       */
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),

    /**
     * Specifies the point in the marker image at which to anchor the callout when it is displayed.
     * This is specified in the same coordinate system as the anchor. See the `andor` prop for more
     * details.
     *
     * The default is the top middle of the image.
     *
     * For ios, see the `calloutOffset` prop.
     *
     * @platform android
     */
    calloutAnchor: PropTypes.shape({
      /**
       * Offset to the callout
       */
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),

    /**
     * Sets whether this marker should be flat against the map true or a billboard facing the
     * camera false.
     *
     * @platform android
     */
    flat: PropTypes.bool,

    /**
     * Callback that is called when the user presses on the marker
     */
    onPress: PropTypes.func,

    /**
     * Callback that is called when the user selects the marker, before the callout is shown.
     *
     * @platform ios
     */
    onSelect: PropTypes.func,

    /**
     * Callback that is called when the marker is deselected, before the callout is hidden.
     */
    onDeselect: PropTypes.func,

    /**
     * Callback that is called when the user taps the callout view.
     */
    onCalloutPress: PropTypes.func,

  },

  showCallout: function() {
    this._runCommand('showCallout', []);
  },

  hideCallout: function() {
    this._runCommand('hideCallout', []);
  },

  _getHandle: function() {
    return React.findNodeHandle(this.refs.marker);
  },

  _runCommand: function (name, args) {
    switch (Platform.OS) {
      case 'android':
        NativeModules.UIManager.dispatchViewManagerCommand(
          this._getHandle(),
          NativeModules.UIManager.AIRMapMarker.Commands[name],
          args
        );
        break;

      case 'ios':
        NativeModules.AIRMapMarkerManager[name].apply(
          NativeModules.AIRMapMarkerManager[name],
          [this._getHandle(), ...args]
        );
        break;
    }
  },

  _onPress: function(e) {
    this.props.onPress && this.props.onPress(e);
  },

  render: function() {
    var image = null;
    if (this.props.image) {
      image = resolveAssetSource(this.props.image) || {};
      image = image.uri;
    }

    return (
      <AIRMapMarker
        ref="marker"
        {...this.props}
        image={image}
        style={[styles.marker, this.props.style]}
        onPress={this._onPress}
      />
    );
  },
});

var styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});

var AIRMapMarker = requireNativeComponent('AIRMapMarker', MapMarker);

module.exports = MapMarker;
