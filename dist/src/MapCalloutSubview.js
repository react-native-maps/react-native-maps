import * as React from 'react';
import { StyleSheet, } from 'react-native';
import decorateMapComponent, { SUPPORTED, NOT_SUPPORTED, ProviderContext, } from './decorateMapComponent';
export class MapCalloutSubview extends React.Component {
    // declaration only, as they are set through decorateMap
    /// @ts-ignore
    context;
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    render() {
        const AIRMapCalloutSubview = this.getNativeComponent();
        return (<AIRMapCalloutSubview {...this.props} style={[styles.calloutSubview, this.props.style]}/>);
    }
}
const styles = StyleSheet.create({
    calloutSubview: {},
});
export default decorateMapComponent(MapCalloutSubview, 'CalloutSubview', {
    google: {
        ios: SUPPORTED,
        android: NOT_SUPPORTED,
    },
});
