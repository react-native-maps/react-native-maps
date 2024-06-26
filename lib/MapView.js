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
exports.AnimatedMapView = exports.MAP_TYPES = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const decorateMapComponent_1 = require("./decorateMapComponent");
const ProviderConstants = __importStar(require("./ProviderConstants"));
const MapViewNativeComponent_1 = require("./MapViewNativeComponent");
exports.MAP_TYPES = {
    STANDARD: 'standard',
    SATELLITE: 'satellite',
    HYBRID: 'hybrid',
    TERRAIN: 'terrain',
    NONE: 'none',
    MUTEDSTANDARD: 'mutedStandard',
    SATELLITE_FLYOVER: 'satelliteFlyover',
    HYBRID_FLYOVER: 'hybridFlyover',
};
const GOOGLE_MAPS_ONLY_TYPES = [exports.MAP_TYPES.TERRAIN, exports.MAP_TYPES.NONE];
class MapView extends React.Component {
    static Animated;
    map;
    constructor(props) {
        super(props);
        this.map = React.createRef();
        this.state = {
            isReady: react_native_1.Platform.OS === 'ios',
        };
        this._onMapReady = this._onMapReady.bind(this);
        this._onChange = this._onChange.bind(this);
    }
    setNativeProps(props) {
        // @ts-ignore
        this.map.current?.setNativeProps(props);
    }
    _onMapReady() {
        const { onMapReady } = this.props;
        this.setState({ isReady: true }, () => {
            if (onMapReady) {
                onMapReady();
            }
        });
    }
    _onChange({ nativeEvent }) {
        const isGesture = nativeEvent.isGesture;
        const details = { isGesture };
        if (nativeEvent.continuous) {
            if (this.props.onRegionChange) {
                this.props.onRegionChange(nativeEvent.region, details);
            }
        }
        else if (this.props.onRegionChangeComplete) {
            this.props.onRegionChangeComplete(nativeEvent.region, details);
        }
    }
    getCamera() {
        if (react_native_1.Platform.OS === 'android') {
            return react_native_1.NativeModules.AirMapModule.getCamera(this._getHandle());
        }
        else if (react_native_1.Platform.OS === 'ios') {
            return this._runCommand('getCamera', []);
        }
        return Promise.reject('getCamera not supported on this platform');
    }
    setCamera(camera) {
        if (this.map.current) {
            MapViewNativeComponent_1.Commands.setCamera(this.map.current, camera);
        }
    }
    animateCamera(camera, opts) {
        if (this.map.current) {
            MapViewNativeComponent_1.Commands.animateCamera(this.map.current, camera, opts?.duration ? opts.duration : 500);
        }
    }
    animateToRegion(region, duration = 500) {
        if (this.map.current) {
            MapViewNativeComponent_1.Commands.animateToRegion(this.map.current, region, duration);
        }
    }
    fitToElements(options = {}) {
        if (this.map.current) {
            const { edgePadding = { top: 0, right: 0, bottom: 0, left: 0 }, animated = true, } = options;
            MapViewNativeComponent_1.Commands.fitToElements(this.map.current, edgePadding, animated);
        }
    }
    fitToSuppliedMarkers(markers, options = {}) {
        if (this.map.current) {
            const { edgePadding = { top: 0, right: 0, bottom: 0, left: 0 }, animated = true, } = options;
            MapViewNativeComponent_1.Commands.fitToSuppliedMarkers(this.map.current, markers, edgePadding, animated);
        }
    }
    fitToCoordinates(coordinates = [], options = {}) {
        if (this.map.current) {
            const { edgePadding = { top: 0, right: 0, bottom: 0, left: 0 }, animated = true, } = options;
            MapViewNativeComponent_1.Commands.fitToCoordinates(this.map.current, coordinates, edgePadding, animated);
        }
    }
    /**
     * Get visible boudaries
     *
     * @return Promise Promise with the bounding box ({ northEast: <LatLng>, southWest: <LatLng> })
     */
    async getMapBoundaries() {
        if (react_native_1.Platform.OS === 'android') {
            return await react_native_1.NativeModules.AirMapModule.getMapBoundaries(this._getHandle());
        }
        else if (react_native_1.Platform.OS === 'ios') {
            return await this._runCommand('getMapBoundaries', []);
        }
        return Promise.reject('getMapBoundaries not supported on this platform');
    }
    setMapBoundaries(northEast, southWest) {
        if (this.map.current) {
            MapViewNativeComponent_1.Commands.setMapBoundaries(this.map.current, northEast, southWest);
        }
    }
    setIndoorActiveLevelIndex(activeLevelIndex) {
        if (this.map.current) {
            MapViewNativeComponent_1.Commands.setIndoorActiveLevelIndex(this.map.current, activeLevelIndex);
        }
    }
    /**
     * Takes a snapshot of the map and saves it to a picture
     * file or returns the image as a base64 encoded string.
     *
     * @param args Configuration options
     * @param [args.width] Width of the rendered map-view (when omitted actual view width is used).
     * @param [args.height] Height of the rendered map-view (when omitted actual height is used).
     * @param [args.region] Region to render (Only supported on iOS).
     * @param [args.format] Encoding format ('png', 'jpg') (default: 'png').
     * @param [args.quality] Compression quality (only used for jpg) (default: 1.0).
     * @param [args.result] Result format ('file', 'base64') (default: 'file').
     *
     * @return Promise Promise with either the file-uri or base64 encoded string
     */
    takeSnapshot(args) {
        // Sanitize inputs
        const config = {
            width: args.width || 0,
            height: args.height || 0,
            region: args.region || {},
            format: args.format || 'png',
            quality: args.quality || 1.0,
            result: args.result || 'file',
        };
        if (config.format !== 'png' && config.format !== 'jpg') {
            throw new Error('Invalid format specified');
        }
        if (config.result !== 'file' && config.result !== 'base64') {
            throw new Error('Invalid result specified');
        }
        // Call native function
        if (react_native_1.Platform.OS === 'android') {
            return react_native_1.NativeModules.AirMapModule.takeSnapshot(this._getHandle(), config);
        }
        else if (react_native_1.Platform.OS === 'ios') {
            return new Promise((resolve, reject) => {
                this._runCommand('takeSnapshot', [
                    config.width,
                    config.height,
                    config.region,
                    config.format,
                    config.quality,
                    config.result,
                    (err, snapshot) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(snapshot);
                        }
                    },
                ]);
            });
        }
        return Promise.reject('takeSnapshot not supported on this platform');
    }
    /**
     * Convert a coordinate to address by using default Geocoder
     *
     * @param coordinate Coordinate
     * @param [coordinate.latitude] Latitude
     * @param [coordinate.longitude] Longitude
     *
     * @return Promise with return type Address
     */
    addressForCoordinate(coordinate) {
        if (react_native_1.Platform.OS === 'android') {
            return react_native_1.NativeModules.AirMapModule.getAddressFromCoordinates(this._getHandle(), coordinate);
        }
        else if (react_native_1.Platform.OS === 'ios') {
            return this._runCommand('getAddressFromCoordinates', [coordinate]);
        }
        return Promise.reject('getAddress not supported on this platform');
    }
    /**
     * Convert a map coordinate to user-space point
     *
     * @param coordinate Coordinate
     * @param [coordinate.latitude] Latitude
     * @param [coordinate.longitude] Longitude
     *
     * @return Promise Promise with the point ({ x: Number, y: Number })
     */
    pointForCoordinate(coordinate) {
        if (react_native_1.Platform.OS === 'android') {
            return react_native_1.NativeModules.AirMapModule.pointForCoordinate(this._getHandle(), coordinate);
        }
        else if (react_native_1.Platform.OS === 'ios') {
            return this._runCommand('pointForCoordinate', [coordinate]);
        }
        return Promise.reject('pointForCoordinate not supported on this platform');
    }
    /**
     * Convert a user-space point to a map coordinate
     *
     * @param point Point
     * @param [point.x] X
     * @param [point.x] Y
     *
     * @return Promise Promise with the coordinate ({ latitude: Number, longitude: Number })
     */
    coordinateForPoint(point) {
        if (react_native_1.Platform.OS === 'android') {
            return react_native_1.NativeModules.AirMapModule.coordinateForPoint(this._getHandle(), point);
        }
        else if (react_native_1.Platform.OS === 'ios') {
            return this._runCommand('coordinateForPoint', [point]);
        }
        return Promise.reject('coordinateForPoint not supported on this platform');
    }
    /**
     * Get markers' centers and frames in user-space coordinates
     *
     * @param onlyVisible boolean true to include only visible markers, false to include all
     *
     * @return Promise Promise with { <identifier>: { point: Point, frame: Frame } }
     */
    getMarkersFrames(onlyVisible = false) {
        if (react_native_1.Platform.OS === 'ios') {
            return this._runCommand('getMarkersFrames', [onlyVisible]);
        }
        return Promise.reject('getMarkersFrames not supported on this platform');
    }
    /**
     * Get bounding box from region
     *
     * @param region Region
     *
     * @return Object Object bounding box ({ northEast: <LatLng>, southWest: <LatLng> })
     */
    boundingBoxForRegion(region) {
        return {
            northEast: {
                latitude: region.latitude + region.latitudeDelta / 2,
                longitude: region.longitude + region.longitudeDelta / 2,
            },
            southWest: {
                latitude: region.latitude - region.latitudeDelta / 2,
                longitude: region.longitude - region.longitudeDelta / 2,
            },
        };
    }
    _mapManagerCommand(name) {
        return react_native_1.NativeModules[`${(0, decorateMapComponent_1.getNativeMapName)(this.props.provider)}Manager`][name];
    }
    _getHandle() {
        return (0, react_native_1.findNodeHandle)(this.map.current);
    }
    _runCommand(name, args) {
        if (react_native_1.Platform.OS === 'ios') {
            return this._mapManagerCommand(name)(this._getHandle(), ...args);
        }
        else {
            return Promise.reject(`Invalid platform was passed: ${react_native_1.Platform.OS}`);
        }
    }
    render() {
        let props;
        if (this.state.isReady) {
            props = {
                region: null,
                initialRegion: null,
                onChange: this._onChange,
                onMapReady: this._onMapReady,
                liteMode: this.props.liteMode,
                googleMapId: this.props.googleMapId,
                googleRenderer: this.props.googleRenderer,
                ref: this.map,
                customMapStyleString: this.props.customMapStyle
                    ? JSON.stringify(this.props.customMapStyle)
                    : undefined,
                ...this.props,
            };
            if (react_native_1.Platform.OS === 'ios' &&
                props.provider === ProviderConstants.PROVIDER_DEFAULT &&
                props.mapType &&
                GOOGLE_MAPS_ONLY_TYPES.includes(props.mapType)) {
                props.mapType = exports.MAP_TYPES.STANDARD;
            }
            if (props.onPanDrag) {
                props.handlePanDrag = !!props.onPanDrag;
            }
        }
        else {
            props = {
                style: this.props.style,
                region: null,
                liteMode: this.props.liteMode,
                googleMapId: this.props.googleMapId,
                googleRenderer: this.props.googleRenderer,
                initialRegion: this.props.initialRegion || null,
                initialCamera: this.props.initialCamera,
                ref: this.map,
                onChange: this._onChange,
                onMapReady: this._onMapReady,
                onLayout: this.props.onLayout,
                customMapStyleString: this.props.customMapStyle
                    ? JSON.stringify(this.props.customMapStyle)
                    : undefined,
            };
        }
        const AIRMap = getNativeMapComponent(this.props.provider);
        return (<decorateMapComponent_1.ProviderContext.Provider value={this.props.provider}>
        <AIRMap {...props}/>
      </decorateMapComponent_1.ProviderContext.Provider>);
    }
}
const airMaps = {
    default: (0, react_native_1.requireNativeComponent)('AIRMap'),
    google: () => null,
};
if (react_native_1.Platform.OS === 'android') {
    airMaps.google = airMaps.default;
}
else {
    airMaps.google = decorateMapComponent_1.googleMapIsInstalled
        ? (0, react_native_1.requireNativeComponent)('AIRGoogleMap')
        : (0, decorateMapComponent_1.createNotSupportedComponent)('react-native-maps: AirGoogleMaps dir must be added to your xCode project to support GoogleMaps on iOS.');
}
const getNativeMapComponent = (provider) => airMaps[provider || 'default'];
exports.AnimatedMapView = react_native_1.Animated.createAnimatedComponent(MapView);
MapView.Animated = exports.AnimatedMapView;
exports.default = MapView;
