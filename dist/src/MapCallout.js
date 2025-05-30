import * as React from 'react';
import { StyleSheet } from 'react-native';
import decorateMapComponent, { ProviderContext, SUPPORTED, USES_DEFAULT_IMPLEMENTATION, } from './decorateMapComponent';
export class MapCallout extends React.Component {
    // declaration only, as they are set through decorateMap
    /// @ts-ignore
    context;
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    render() {
        const { tooltip = false, alphaHitTest = false } = this.props;
        const AIRMapCallout = this.getNativeComponent();
        return (<AIRMapCallout {...this.props} tooltip={tooltip} alphaHitTest={alphaHitTest} style={[styles.callout, this.props.style]}/>);
    }
}
const styles = StyleSheet.create({
    callout: {
        position: 'absolute',
    },
});
export default decorateMapComponent(MapCallout, 'Callout', {
    google: {
        ios: SUPPORTED,
        android: USES_DEFAULT_IMPLEMENTATION,
    },
});
