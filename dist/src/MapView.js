import * as React from 'react';
import { Animated as RNAnimated, Animated, findNodeHandle, Platform, requireNativeComponent, } from 'react-native';
import { createNotSupportedComponent, ProviderContext, } from './decorateMapComponent';
import { Commands, } from './MapViewNativeComponent';
import FabricMapView, { Commands as FabricCommands, } from './specs/NativeComponentMapView';
import GoogleMapView, { Commands as GoogleCommands, } from './specs/NativeComponentGoogleMapView';
import createFabricMap, {} from './createFabricMap';
const FabricMap = createFabricMap(FabricMapView, FabricCommands);
var FabricGoogleMap = null;
if (Platform.OS === 'ios') {
    FabricGoogleMap = createFabricMap(GoogleMapView, GoogleCommands);
}
import AnimatedRegion from './AnimatedRegion';
export const MAP_TYPES = {
    STANDARD: 'standard',
    SATELLITE: 'satellite',
    HYBRID: 'hybrid',
    TERRAIN: 'terrain',
    NONE: 'none',
    MUTEDSTANDARD: 'mutedStandard',
    SATELLITE_FLYOVER: 'satelliteFlyover',
    HYBRID_FLYOVER: 'hybridFlyover',
};
class MapView extends React.Component {
    static Animated;
    map;
    fabricMap = React.createRef();
    constructor(props) {
        super(props);
        this.map = React.createRef();
        this.state = {
            isReady: false,
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
        if (this.fabricMap.current) {
            return this.fabricMap.current.getCamera();
        }
        return Promise.reject('getCamera not supported on this platform');
    }
    setCamera(camera) {
        if (this.fabricMap.current) {
            this.fabricMap.current.setCamera(camera);
        }
        else if (this.map.current) {
            Commands.setCamera(this.map.current, camera);
        }
    }
    animateCamera(camera, opts) {
        if (this.fabricMap.current) {
            this.fabricMap.current.animateCamera(camera, opts?.duration ? opts.duration : 500);
        }
        else if (this.map.current) {
            Commands.animateCamera(this.map.current, camera, opts?.duration ? opts.duration : 500);
        }
    }
    animateToRegion(region, duration = 500) {
        if (this.fabricMap.current) {
            this.fabricMap.current.animateToRegion(region, duration);
        }
        else if (this.map.current) {
            Commands.animateToRegion(this.map.current, region, duration);
        }
    }
    setRegion(region) {
        if (this.fabricMap.current) {
            this.fabricMap.current.animateToRegion(region, 0);
        }
        //TODO fix for android
    }
    fitToElements(options = {}) {
        const { edgePadding = { top: 0, right: 0, bottom: 0, left: 0 }, animated = true, } = options;
        if (this.fabricMap.current) {
            this.fabricMap.current.fitToElements(edgePadding, animated);
        }
        else if (this.map.current) {
            Commands.fitToElements(this.map.current, edgePadding, animated);
        }
    }
    fitToSuppliedMarkers(markers, options = {}) {
        const { edgePadding = { top: 0, right: 0, bottom: 0, left: 0 }, animated = true, } = options;
        if (this.fabricMap.current) {
            this.fabricMap.current.fitToSuppliedMarkers(markers, edgePadding, animated);
        }
        else if (this.map.current) {
            Commands.fitToSuppliedMarkers(this.map.current, markers, edgePadding, animated);
        }
    }
    fitToCoordinates(coordinates = [], options = {}) {
        const { edgePadding = { top: 0, right: 0, bottom: 0, left: 0 }, animated = true, } = options;
        if (this.fabricMap.current) {
            this.fabricMap.current.fitToCoordinates(coordinates, edgePadding, animated);
        }
        else if (this.map.current) {
            Commands.fitToCoordinates(this.map.current, coordinates, edgePadding, animated);
        }
    }
    /**
     * Get visible boudaries
     *
     * @return Promise Promise with the bounding box ({ northEast: <LatLng>, southWest: <LatLng> })
     */
    async getMapBoundaries() {
        if (this.fabricMap.current) {
            return this.fabricMap.current.getMapBoundaries();
        }
        return Promise.reject('getMapBoundaries not supported on this platform');
    }
    setMapBoundaries(northEast, southWest) {
        if (this.map.current) {
            Commands.setMapBoundaries(this.map.current, northEast, southWest);
        }
    }
    setIndoorActiveLevelIndex(activeLevelIndex) {
        if (this.fabricMap.current) {
            return this.fabricMap.current.setIndoorActiveLevelIndex(activeLevelIndex);
        }
        return Promise.reject('getMapBoundaries not supported on this platform');
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
        if (this.fabricMap.current) {
            // @ts-ignore
            return this.fabricMap.current.takeSnapshot(config);
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
        if (this.fabricMap.current) {
            return this.fabricMap.current.getAddressFromCoordinates(coordinate);
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
        if (this.fabricMap.current) {
            return this.fabricMap.current.getPointForCoordinate(coordinate);
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
        if (this.fabricMap.current) {
            return this.fabricMap.current.getCoordinateForPoint(point);
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
        if (this.fabricMap.current) {
            // @ts-ignore
            return this.fabricMap.current.getMarkersFrames(onlyVisible);
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
    // @ts-ignore
    _getHandle() {
        return findNodeHandle(this.map.current);
    }
    handleMapPress = (event) => {
        if (this.props.onPress) {
            this.props.onPress(event);
        }
    };
    handleMarkerPress = (event) => {
        if (this.props.onMarkerPress) {
            this.props.onMarkerPress(event);
        }
    };
    handleMarkerSelect = (event) => {
        if (this.props.onMarkerSelect) {
            this.props.onMarkerSelect(event);
        }
    };
    handleKmlReady = (event) => {
        if (this.props.onKmlReady) {
            this.props.onKmlReady(event);
        }
    };
    handleMarkerDeselect = (event) => {
        if (this.props.onMarkerDeselect) {
            this.props.onMarkerDeselect(event);
        }
    };
    handleRegionChange = (event) => {
        const isGesture = event.nativeEvent.isGesture;
        const details = { isGesture };
        if (event.nativeEvent.continuous) {
            if (this.props.onRegionChange) {
                this.props.onRegionChange(event.nativeEvent.region, details);
            }
        }
        else if (this.props.onRegionChangeComplete) {
            this.props.onRegionChangeComplete(event.nativeEvent.region, details);
        }
    };
    handleRegionChangeStarted = (event) => {
        if (this.props.onRegionChangeStart) {
            this.props.onRegionChangeStart(event);
        }
    };
    handleIndoorBuildingFocused = (event) => {
        if (this.props.onIndoorBuildingFocused) {
            if (typeof event.nativeEvent.levels === 'string') {
                event.nativeEvent.levels = JSON.parse(event.nativeEvent.levels);
            }
            this.props.onIndoorBuildingFocused(event);
        }
    };
    handleIndoorLevelActivated = (event) => {
        if (this.props.onIndoorLevelActivated) {
            this.props.onIndoorLevelActivated(event);
        }
    };
    handleRegionChangeComplete = (event) => {
        const isGesture = event.nativeEvent.isGesture;
        const details = { isGesture };
        if (this.props.onRegionChangeComplete) {
            this.props.onRegionChangeComplete(event.nativeEvent.region, details);
        }
    };
    handleLongPress = (event) => {
        if (this.props.onLongPress) {
            this.props.onLongPress(event);
        }
    };
    render() {
        // Define props specifically for MapFabricNativeProps
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const { onCalloutPress, onIndoorBuildingFocused, onKmlReady, onLongPress, onMarkerDeselect, onMarkerPress, onMarkerSelect, onRegionChangeStart, onRegionChange, onRegionChangeComplete, onPress, onMapReady, minZoomLevel, maxZoomLevel, region, provider, children, customMapStyle, kmlSrc, ...restProps } = this.props;
        /* eslint-enable @typescript-eslint/no-unused-vars */
        const userInterfaceStyle = this.props.userInterfaceStyle || 'system';
        const customMapStyleString = customMapStyle
            ? JSON.stringify(this.props.customMapStyle)
            : undefined;
        const props = {
            onMapReady: this._onMapReady,
            liteMode: this.props.liteMode,
            googleMapId: this.props.googleMapId,
            googleRenderer: this.props.googleRenderer,
            onPress: this.handleMapPress,
            onMarkerPress: this.handleMarkerPress,
            onMarkerSelect: this.handleMarkerSelect,
            onMarkerDeselect: this.handleMarkerDeselect,
            onKmlReady: this.handleKmlReady,
            userInterfaceStyle: userInterfaceStyle,
            customMapStyleString,
            minZoom: minZoomLevel,
            maxZoom: maxZoomLevel,
            onRegionChange: this.handleRegionChange,
            onRegionChangeStart: this.handleRegionChangeStarted,
            onRegionChangeComplete: this.handleRegionChangeComplete,
            onIndoorBuildingFocused: this.handleIndoorBuildingFocused,
            // @ts-ignore
            onIndoorLevelActivated: this.handleIndoorLevelActivated,
            onLongPress: this.handleLongPress,
            kmlSrc: typeof kmlSrc === 'string' ? [kmlSrc] : kmlSrc,
            ...restProps,
        };
        if (this.props.region) {
            props.region = {
                latitude: this.props.region.latitude,
                longitude: this.props.region.longitude,
                latitudeDelta: this.props.region.latitudeDelta,
                longitudeDelta: this.props.region.longitudeDelta,
            };
        }
        if (this.state.isReady) {
            if (props.onPanDrag) {
                props.handlePanDrag = !!props.onPanDrag;
            }
        }
        else {
            props.style = this.props.style;
            props.initialCamera = this.props.initialCamera;
            props.onLayout = this.props.onLayout;
        }
        const childrenNodes = this.state.isReady ? children : null;
        if (provider === 'google' && Platform.OS === 'ios') {
            return (<ProviderContext.Provider value={this.props.provider}>
          <FabricGoogleMap {...props} ref={this.fabricMap}>
            {childrenNodes}
          </FabricGoogleMap>
        </ProviderContext.Provider>);
        }
        else {
            return (<ProviderContext.Provider value={this.props.provider}>
          <FabricMap {...props} ref={this.fabricMap}>
            {childrenNodes}
          </FabricMap>
        </ProviderContext.Provider>);
        }
    }
}
const airMaps = {
    default: requireNativeComponent('AIRMap'),
    google: () => null,
};
if (Platform.OS === 'android') {
    airMaps.google = airMaps.default;
}
else {
    airMaps.google = createNotSupportedComponent('react-native-maps: AirGoogleMaps dir must be added to your xCode project to support GoogleMaps on iOS.');
}
export const AnimatedMapView = RNAnimated.createAnimatedComponent(MapView);
MapView.Animated = AnimatedMapView;
export default MapView;
