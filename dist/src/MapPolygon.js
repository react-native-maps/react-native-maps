import * as React from 'react';
import { View } from 'react-native';
import decorateMapComponent, { USES_DEFAULT_IMPLEMENTATION, SUPPORTED, ProviderContext, } from './decorateMapComponent';
export class MapPolygon extends React.Component {
    // declaration only, as they are set through decorateMap
    /// @ts-ignore
    context;
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    polygon;
    constructor(props) {
        super(props);
        this.polygon = React.createRef();
    }
    setNativeProps(props) {
        this.polygon.current?.setNativeProps(props);
    }
    render() {
        const { strokeColor = '#000', strokeWidth = 1 } = this.props;
        const AIRMapPolygon = this.getNativeComponent();
        return (<AIRMapPolygon {...this.props} strokeColor={strokeColor} strokeWidth={strokeWidth} ref={this.polygon}/>);
    }
}
export default decorateMapComponent(MapPolygon, 'Polygon', {
    google: {
        ios: SUPPORTED,
        android: USES_DEFAULT_IMPLEMENTATION,
    },
});
