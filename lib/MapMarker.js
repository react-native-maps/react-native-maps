"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapMarker = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const decorateMapComponent_1 = __importStar(require("./decorateMapComponent"));
const MapMarkerNativeComponent_1 = require("./MapMarkerNativeComponent");
class MapMarker extends React.Component {
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    static Animated;
    marker;
    constructor(props) {
        super(props);
        this.marker = React.createRef();
        this.showCallout = this.showCallout.bind(this);
        this.hideCallout = this.hideCallout.bind(this);
        this.redrawCallout = this.redrawCallout.bind(this);
        this.animateMarkerToCoordinate = this.animateMarkerToCoordinate.bind(this);
    }
    /**
     * @deprecated Will be removed in v2.0.0, as setNativeProps is not a thing in fabric.
     * See https://reactnative.dev/docs/new-architecture-library-intro#migrating-off-setnativeprops
     */
    setNativeProps(props) {
        console.warn('setNativeProps is deprecated and will be removed in next major release');
        // @ts-ignore
        this.marker.current?.setNativeProps(props);
    }
    showCallout() {
        if (this.marker.current) {
            MapMarkerNativeComponent_1.Commands.showCallout(this.marker.current);
        }
    }
    hideCallout() {
        if (this.marker.current) {
            MapMarkerNativeComponent_1.Commands.hideCallout(this.marker.current);
        }
    }
    redrawCallout() {
        if (this.marker.current) {
            MapMarkerNativeComponent_1.Commands.redrawCallout(this.marker.current);
        }
    }
    animateMarkerToCoordinate(coordinate, duration = 500) {
        if (this.marker.current) {
            MapMarkerNativeComponent_1.Commands.animateMarkerToCoordinate(this.marker.current, coordinate, duration);
        }
    }
    redraw() {
        if (this.marker.current) {
            MapMarkerNativeComponent_1.Commands.redraw(this.marker.current);
        }
    }
    render() {
        const { stopPropagation = false } = this.props;
        let image;
        if (this.props.image) {
            image = react_native_1.Image.resolveAssetSource(this.props.image) || {};
            image = image.uri || this.props.image;
        }
        let icon;
        if (this.props.icon) {
            icon = react_native_1.Image.resolveAssetSource(this.props.icon) || {};
            icon = icon.uri;
        }
        const AIRMapMarker = this.getNativeComponent();
        return (<AIRMapMarker {...this.props} ref={this.marker} image={image} icon={icon} style={[styles.marker, this.props.style]} onPress={event => {
                if (stopPropagation) {
                    event.stopPropagation();
                }
                if (this.props.onPress) {
                    this.props.onPress(event);
                }
            }}/>);
    }
}
exports.MapMarker = MapMarker;
const styles = react_native_1.StyleSheet.create({
    marker: {
        position: 'absolute',
        backgroundColor: 'transparent',
    },
});
MapMarker.Animated = react_native_1.Animated.createAnimatedComponent(MapMarker);
exports.default = (0, decorateMapComponent_1.default)(MapMarker, 'Marker', {
    google: {
        ios: decorateMapComponent_1.SUPPORTED,
        android: decorateMapComponent_1.USES_DEFAULT_IMPLEMENTATION,
    },
});
