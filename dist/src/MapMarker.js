import * as React from 'react';
import { StyleSheet, Animated, Platform, } from 'react-native';
import decorateMapComponent, { ProviderContext, SUPPORTED, USES_DEFAULT_IMPLEMENTATION, } from './decorateMapComponent';
import { Commands, } from './MapMarkerNativeComponent';
import { Commands as FabricCommands } from './specs/NativeComponentMarker';
import { PROVIDER_GOOGLE } from './ProviderConstants';
import { fixImageProp } from './fixImageProp';
export class MapMarker extends React.Component {
    // declaration only, as they are set through decorateMap
    /// @ts-ignore
    context;
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    static Animated;
    marker;
    fabricMarker = undefined;
    constructor(props) {
        super(props);
        this.marker = React.createRef();
        this.showCallout = this.showCallout.bind(this);
        this.hideCallout = this.hideCallout.bind(this);
        this.setCoordinates = this.setCoordinates.bind(this);
        this.redrawCallout = this.redrawCallout.bind(this);
        this.animateMarkerToCoordinate = this.animateMarkerToCoordinate.bind(this);
    }
    setNativeProps(props) {
        // @ts-ignore
        this.marker.current?.setNativeProps(props);
    }
    showCallout() {
        if (this.marker.current) {
            if (this.fabricMarker) {
                // @ts-ignore
                FabricCommands.showCallout(this.marker.current);
            }
            else {
                Commands.showCallout(this.marker.current);
            }
        }
    }
    hideCallout() {
        if (this.marker.current) {
            if (this.fabricMarker) {
                // @ts-ignore
                FabricCommands.hideCallout(this.marker.current);
            }
            else {
                Commands.hideCallout(this.marker.current);
            }
        }
    }
    setCoordinates(coordinate) {
        if (this.marker.current) {
            if (this.fabricMarker) {
                FabricCommands.setCoordinates(
                // @ts-ignore
                this.marker.current, coordinate.latitude, coordinate.longitude);
            }
            else {
                Commands.setCoordinates(this.marker.current, coordinate);
            }
        }
    }
    redrawCallout() {
        if (this.marker.current) {
            if (this.fabricMarker) {
                // @ts-ignore
                FabricCommands.redrawCallout(this.marker.current);
            }
            else {
                Commands.redrawCallout(this.marker.current);
            }
        }
    }
    animateMarkerToCoordinate(coordinate, duration = 500) {
        if (this.marker.current) {
            if (this.fabricMarker) {
                FabricCommands.animateToCoordinates(
                // @ts-ignore
                this.marker.current, coordinate.latitude, coordinate.longitude, duration);
            }
            else {
                Commands.animateMarkerToCoordinate(this.marker.current, coordinate, duration);
            }
        }
    }
    redraw() {
        if (this.marker.current) {
            Commands.redraw(this.marker.current);
        }
    }
    render() {
        const { stopPropagation = false } = this.props;
        if (this.fabricMarker === undefined) {
            const provider = this.context;
            this.fabricMarker = !(Platform.OS === 'ios' && provider === PROVIDER_GOOGLE);
        }
        let icon;
        if (this.props.icon && this.fabricMarker) {
            icon = fixImageProp(this.props.icon);
        }
        let image;
        if (this.props.image && this.fabricMarker) {
            image = fixImageProp(this.props.image);
        }
        const AIRMapMarker = this.getNativeComponent();
        return (<AIRMapMarker {...this.props} ref={this.marker} 
        // @ts-ignore
        image={image} 
        // @ts-ignore
        icon={icon} style={[styles.marker, this.props.style]} onPress={event => {
                if (stopPropagation) {
                    event.stopPropagation();
                }
                if (this.props.onPress) {
                    this.props.onPress(event);
                }
            }}/>);
    }
}
const styles = StyleSheet.create({
    marker: {
        position: 'absolute',
        backgroundColor: 'transparent',
    },
});
MapMarker.Animated = Animated.createAnimatedComponent(MapMarker);
export default decorateMapComponent(MapMarker, 'Marker', {
    google: {
        ios: SUPPORTED,
        android: USES_DEFAULT_IMPLEMENTATION,
    },
});
