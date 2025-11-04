import * as React from 'react';
import decorateMapComponent, { USES_DEFAULT_IMPLEMENTATION, SUPPORTED, ProviderContext, } from './decorateMapComponent';
export class MapWMSTile extends React.Component {
    // declaration only, as they are set through decorateMap
    /// @ts-ignore
    context;
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    render() {
        const AIRMapWMSTile = this.getNativeComponent();
        return <AIRMapWMSTile {...this.props}/>;
    }
}
export default decorateMapComponent(MapWMSTile, 'WMSTile', {
    google: {
        ios: SUPPORTED,
        android: USES_DEFAULT_IMPLEMENTATION,
    },
});
