import * as React from 'react';
import { View } from 'react-native';
import decorateMapComponent, { USES_DEFAULT_IMPLEMENTATION, SUPPORTED, ProviderContext, } from './decorateMapComponent';
export class MapCircle extends React.Component {
    // declaration only, as they are set through decorateMap
    /// @ts-ignore
    context;
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    circle;
    constructor(props) {
        super(props);
        this.circle = React.createRef();
    }
    setNativeProps(props) {
        this.circle.current?.setNativeProps(props);
    }
    render() {
        const { strokeColor = '#000', strokeWidth = 1 } = this.props;
        const AIRMapCircle = this.getNativeComponent();
        return (<AIRMapCircle {...this.props} strokeColor={strokeColor} strokeWidth={strokeWidth} ref={this.circle}/>);
    }
}
export default decorateMapComponent(MapCircle, 'Circle', {
    google: {
        ios: SUPPORTED,
        android: USES_DEFAULT_IMPLEMENTATION,
    },
});
