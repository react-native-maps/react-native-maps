import { createContext } from 'react';
import { requireNativeComponent, NativeModules, Platform, UIManager, } from 'react-native';
import { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from './ProviderConstants';
import { MapCallout } from './MapCallout';
import { MapOverlay } from './MapOverlay';
import { MapCalloutSubview } from './MapCalloutSubview';
import { MapCircle } from './MapCircle';
import { MapHeatmap } from './MapHeatmap';
import { MapLocalTile } from './MapLocalTile';
import { MapMarker } from './MapMarker';
import { MapPolygon } from './MapPolygon';
import { MapPolyline } from './MapPolyline';
import { MapUrlTile } from './MapUrlTile';
import { MapWMSTile } from './MapWMSTile';
import { Commands } from './MapViewNativeComponent';
import GooglePolygon from './specs/NativeComponentGooglePolygon';
import FabricMarker from './specs/NativeComponentMarker';
import FabricUrlTile from './specs/NativeComponentUrlTile';
import FabricWMSTile from './specs/NativeComponentWMSTile';
import FabricCallout from './specs/NativeComponentCallout';
import FabricPolyline from './specs/NativeComponentPolyline';
import FabricCircle from './specs/NativeComponentCircle';
import FabricOverlay from './specs/NativeComponentOverlay';
export const SUPPORTED = 'SUPPORTED';
export const USES_DEFAULT_IMPLEMENTATION = 'USES_DEFAULT_IMPLEMENTATION';
export const NOT_SUPPORTED = 'NOT_SUPPORTED';
export const ProviderContext = createContext(undefined);
export function getNativeMapName(provider) {
    if (Platform.OS === 'android') {
        return 'AIRMap';
    }
    if (provider === PROVIDER_GOOGLE) {
        return 'AIRGoogleMap';
    }
    return 'AIRMap';
}
function getNativeComponentName(provider, component) {
    return `${getNativeMapName(provider)}${component}`;
}
export const createNotSupportedComponent = (message) => {
    return () => {
        console.error(message);
        return null;
    };
};
export const googleMapIsInstalled = !!UIManager.hasViewManagerConfig(getNativeMapName(PROVIDER_GOOGLE));
export default function decorateMapComponent(Component, componentName, providers) {
    const components = {};
    const getDefaultComponent = () => requireNativeComponent(getNativeComponentName(undefined, componentName));
    Component.contextType = ProviderContext;
    Component.prototype.getNativeComponent =
        function getNativeComponent() {
            const provider = this.context;
            if (componentName === 'Marker' &&
                (Platform.OS !== 'ios' || provider !== PROVIDER_GOOGLE)) {
                // @ts-ignore
                return FabricMarker;
            }
            if (componentName === 'Polygon' &&
                ((provider === PROVIDER_GOOGLE &&
                    Platform.OS === 'ios' &&
                    googleMapIsInstalled) ||
                    Platform.OS === 'android')) {
                // @ts-ignore
                return GooglePolygon;
            }
            if (Platform.OS === 'android') {
                if (componentName === 'Callout') {
                    // @ts-ignore
                    return FabricCallout;
                }
                else if (componentName === 'Polyline') {
                    // @ts-ignore
                    return FabricPolyline;
                }
                else if (componentName === 'Circle') {
                    // @ts-ignore
                    return FabricCircle;
                }
                else if (componentName === 'Overlay') {
                    // @ts-ignore
                    return FabricOverlay;
                }
                else if (componentName === 'UrlTile') {
                    // @ts-ignore
                    return FabricUrlTile;
                }
                else if (componentName === 'WMSTile') {
                    // @ts-ignore
                    return FabricWMSTile;
                }
            }
            const key = provider || 'default';
            if (components[key]) {
                return components[key];
            }
            if (provider === PROVIDER_DEFAULT) {
                components[key] = getDefaultComponent();
                return components[key];
            }
            if (!provider) {
                throw new Error('react-native-maps: provider is not set');
            }
            const providerInfo = providers[provider];
            // quick fix. Previous code assumed android | ios
            if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
                throw new Error(`react-native-maps doesn't support ${Platform.OS}`);
            }
            const platformSupport = providerInfo[Platform.OS];
            const nativeComponentName = getNativeComponentName(provider, componentName);
            if (platformSupport === NOT_SUPPORTED) {
                components[key] = createNotSupportedComponent(`react-native-maps: ${nativeComponentName} is not supported on ${Platform.OS}`);
            }
            else if (platformSupport === SUPPORTED) {
                if (provider !== PROVIDER_GOOGLE ||
                    (Platform.OS === 'ios' && googleMapIsInstalled)) {
                    components[key] = requireNativeComponent(nativeComponentName);
                }
            }
            else {
                // (platformSupport === USES_DEFAULT_IMPLEMENTATION)
                if (!components.default) {
                    components.default = getDefaultComponent();
                }
                components[key] = components.default;
            }
            return components[key];
        };
    Component.prototype.getUIManagerCommand = function getUIManagerCommand(name) {
        const nativeComponentName = getNativeComponentName(this.context, componentName);
        return UIManager.getViewManagerConfig(nativeComponentName).Commands[name];
    };
    Component.prototype.getMapManagerCommand = function getMapManagerCommand(name) {
        const nativeComponentName = `${getNativeComponentName(this.context, componentName)}Manager`;
        return NativeModules[nativeComponentName][name];
    };
    return Component;
}
