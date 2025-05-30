import * as React from 'react';
import { View } from 'react-native';
import decorateMapComponent, { USES_DEFAULT_IMPLEMENTATION, SUPPORTED, ProviderContext, } from './decorateMapComponent';
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
    }
    setNativeProps(props) {
        this.polyline.current?.setNativeProps(props);
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
