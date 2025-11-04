import * as React from 'react';
import {} from 'react-native';
import decorateMapComponent, { USES_DEFAULT_IMPLEMENTATION, SUPPORTED, ProviderContext, } from './decorateMapComponent';
import { Commands, } from './MapPolylineNativeComponent';
export class MapPolyline extends React.Component {
    // declaration only, as they are set through decorateMap
    /// @ts-ignore
    context;
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    polyline;
    constructor(props) {
        super(props);
        this.polyline = React.createRef();
        this.startPolylineAnimation = this.startPolylineAnimation.bind(this);
        this.stopPolylineAnimation = this.stopPolylineAnimation.bind(this);
    }
    setNativeProps(props) {
        // @ts-ignore
        this.polyline.current?.setNativeProps(props);
    }
    startPolylineAnimation(staticColor, animationDuration, delay) {
        if (this.polyline.current) {
            Commands.startPolylineAnimation(this.polyline.current, staticColor, animationDuration, delay);
        }
    }
    stopPolylineAnimation() {
        if (this.polyline.current) {
            Commands.stopPolylineAnimation(this.polyline.current);
        }
    }
    render() {
        const { strokeColor = '#000', strokeWidth = 1, lineJoin = 'round', lineCap = 'round', } = this.props;
        const AIRMapPolyline = this.getNativeComponent();
        return (<AIRMapPolyline {...this.props} strokeColor={strokeColor} strokeWidth={strokeWidth} lineJoin={lineJoin} lineCap={lineCap} ref={this.polyline}/>);
    }
}
export default decorateMapComponent(MapPolyline, 'Polyline', {
    google: {
        ios: SUPPORTED,
        android: USES_DEFAULT_IMPLEMENTATION,
    },
});
