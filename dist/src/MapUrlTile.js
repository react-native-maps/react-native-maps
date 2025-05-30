import * as React from 'react';
import decorateMapComponent, { USES_DEFAULT_IMPLEMENTATION, SUPPORTED, ProviderContext, } from './decorateMapComponent';
export class MapUrlTile extends React.Component {
    // declaration only, as they are set through decorateMap
    /// @ts-ignore
    context;
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    render() {
        const AIRMapUrlTile = this.getNativeComponent();
        return <AIRMapUrlTile {...this.props}/>;
    }
}
export default decorateMapComponent(MapUrlTile, 'UrlTile', {
    google: {
        ios: SUPPORTED,
        android: USES_DEFAULT_IMPLEMENTATION,
    },
});
