"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleMapIsInstalled = exports.createNotSupportedComponent = exports.getNativeMapName = exports.ProviderContext = exports.NOT_SUPPORTED = exports.USES_DEFAULT_IMPLEMENTATION = exports.SUPPORTED = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const ProviderConstants_1 = require("./ProviderConstants");
exports.SUPPORTED = 'SUPPORTED';
exports.USES_DEFAULT_IMPLEMENTATION = 'USES_DEFAULT_IMPLEMENTATION';
exports.NOT_SUPPORTED = 'NOT_SUPPORTED';
exports.ProviderContext = (0, react_1.createContext)(undefined);
function getNativeMapName(provider) {
    if (react_native_1.Platform.OS === 'android') {
        return 'AIRMap';
    }
    if (provider === ProviderConstants_1.PROVIDER_GOOGLE) {
        return 'AIRGoogleMap';
    }
    return 'AIRMap';
}
exports.getNativeMapName = getNativeMapName;
function getNativeComponentName(provider, component) {
    return `${getNativeMapName(provider)}${component}`;
}
const createNotSupportedComponent = (message) => () => {
    console.error(message);
    return null;
};
exports.createNotSupportedComponent = createNotSupportedComponent;
exports.googleMapIsInstalled = !!react_native_1.UIManager.getViewManagerConfig(getNativeMapName(ProviderConstants_1.PROVIDER_GOOGLE));
function decorateMapComponent(Component, componentName, providers) {
    const components = {};
    const getDefaultComponent = () => (0, react_native_1.requireNativeComponent)(getNativeComponentName(undefined, componentName));
    Component.contextType = exports.ProviderContext;
    Component.prototype.getNativeComponent =
        function getNativeComponent() {
            const provider = this.context;
            const key = provider || 'default';
            if (components[key]) {
                return components[key];
            }
            if (provider === ProviderConstants_1.PROVIDER_DEFAULT) {
                components[key] = getDefaultComponent();
                return components[key];
            }
            const providerInfo = providers[provider];
            // quick fix. Previous code assumed android | ios
            if (react_native_1.Platform.OS !== 'android' && react_native_1.Platform.OS !== 'ios') {
                throw new Error(`react-native-maps doesn't support ${react_native_1.Platform.OS}`);
            }
            const platformSupport = providerInfo[react_native_1.Platform.OS];
            const nativeComponentName = getNativeComponentName(provider, componentName);
            if (platformSupport === exports.NOT_SUPPORTED) {
                components[key] = (0, exports.createNotSupportedComponent)(`react-native-maps: ${nativeComponentName} is not supported on ${react_native_1.Platform.OS}`);
            }
            else if (platformSupport === exports.SUPPORTED) {
                if (provider !== ProviderConstants_1.PROVIDER_GOOGLE ||
                    (react_native_1.Platform.OS === 'ios' && exports.googleMapIsInstalled)) {
                    components[key] = (0, react_native_1.requireNativeComponent)(nativeComponentName);
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
        return react_native_1.UIManager.getViewManagerConfig(nativeComponentName).Commands[name];
    };
    Component.prototype.getMapManagerCommand = function getMapManagerCommand(name) {
        const nativeComponentName = `${getNativeComponentName(this.context, componentName)}Manager`;
        return react_native_1.NativeModules[nativeComponentName][name];
    };
    return Component;
}
exports.default = decorateMapComponent;
