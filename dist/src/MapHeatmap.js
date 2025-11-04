import * as React from 'react';
import { processColor, View, } from 'react-native';
import decorateMapComponent, { ProviderContext, SUPPORTED, USES_DEFAULT_IMPLEMENTATION, } from './decorateMapComponent';
export class MapHeatmap extends React.Component {
    // declaration only, as they are set through decorateMap
    /// @ts-ignore
    context;
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    heatmap;
    constructor(props) {
        super(props);
        this.heatmap = React.createRef();
    }
    setNativeProps(props) {
        this.heatmap.current?.setNativeProps(props);
    }
    render() {
        const AIRMapHeatmap = this.getNativeComponent();
        const propGradient = this.props?.gradient;
        let gradient;
        if (propGradient) {
            const colors = propGradient.colors.map(c => processColor(c));
            gradient = { ...propGradient, colors };
        }
        return (<AIRMapHeatmap {...this.props} gradient={gradient} ref={this.heatmap}/>);
    }
}
export default decorateMapComponent(MapHeatmap, 'Heatmap', {
    google: {
        ios: SUPPORTED,
        android: USES_DEFAULT_IMPLEMENTATION,
    },
});
