import * as React from 'react';
import decorateMapComponent, { USES_DEFAULT_IMPLEMENTATION, SUPPORTED, ProviderContext, } from './decorateMapComponent';
export class MapLocalTile extends React.Component {
    // declaration only, as they are set through decorateMap
    /// @ts-ignore
    context;
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    render() {
        const AIRMapLocalTile = this.getNativeComponent();
        return <AIRMapLocalTile {...this.props}/>;
    }
}
export default decorateMapComponent(MapLocalTile, 'LocalTile', {
    google: {
        ios: SUPPORTED,
        android: USES_DEFAULT_IMPLEMENTATION,
    },
});
