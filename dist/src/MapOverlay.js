import * as React from 'react';
import { StyleSheet, Animated, Platform, } from 'react-native';
import decorateMapComponent, { ProviderContext, SUPPORTED, USES_DEFAULT_IMPLEMENTATION, } from './decorateMapComponent';
import { fixImageProp } from './fixImageProp';
function normalizeBounds(bounds) {
    return {
        northEast: { latitude: bounds[0][0], longitude: bounds[0][1] },
        southWest: { latitude: bounds[1][0], longitude: bounds[1][1] },
    };
}
export class MapOverlay extends React.Component {
    // declaration only, as they are set through decorateMap
    /// @ts-ignore
    context;
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    static Animated;
    fabricOverlay = undefined;
    render() {
        const { opacity = 1.0, bounds } = this.props;
        if (this.fabricOverlay === undefined) {
            this.fabricOverlay = Platform.OS === 'android';
        }
        const AIRMapOverlay = this.getNativeComponent();
        let image = this.props.image;
        let boundsParam = bounds;
        if (this.fabricOverlay) {
            if (this.props.image) {
                image = fixImageProp(this.props.image);
            }
            if (bounds) {
                boundsParam = normalizeBounds(bounds);
            }
        }
        else {
            if (this.props.image) {
                image = fixImageProp(this.props.image);
                if (image.uri) {
                    image = image.uri;
                }
            }
        }
        return (<AIRMapOverlay 
        // @ts-ignore
        bounds={boundsParam} opacity={opacity} 
        // @ts-ignore
        image={image} style={[styles.overlay, this.props.style]}/>);
    }
}
const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        backgroundColor: 'transparent',
    },
});
MapOverlay.Animated = Animated.createAnimatedComponent(MapOverlay);
export default decorateMapComponent(MapOverlay, 'Overlay', {
    google: {
        ios: SUPPORTED,
        android: USES_DEFAULT_IMPLEMENTATION,
    },
});
