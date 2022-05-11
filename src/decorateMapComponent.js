import PropTypes from 'prop-types';
import {requireNativeComponent, NativeModules, Platform} from 'react-native';
import {PROVIDER_DEFAULT, PROVIDER_GOOGLE} from './ProviderConstants';

export const SUPPORTED = 'SUPPORTED';
export const USES_DEFAULT_IMPLEMENTATION = 'USES_DEFAULT_IMPLEMENTATION';
export const NOT_SUPPORTED = 'NOT_SUPPORTED';

export function getAirMapName(provider) {
  if (Platform.OS === 'android') {
    return 'AIRMap';
  }
  if (provider === PROVIDER_GOOGLE) {
    return 'AIRGoogleMap';
  }
  return 'AIRMap';
}

function getAirComponentName(provider, component) {
  return `${getAirMapName(provider)}${component}`;
}

export const contextTypes = {
  provider: PropTypes.string,
};

export const createNotSupportedComponent = message => () => {
  console.error(message);
  return null;
};

function getViewManagerConfig(viewManagerName) {
  const UIManager = NativeModules.UIManager;
  if (!UIManager.getViewManagerConfig) {
    // RN < 0.58
    return UIManager[viewManagerName];
  }
  // RN >= 0.58
  return UIManager.getViewManagerConfig(viewManagerName);
}

export const googleMapIsInstalled = !!getViewManagerConfig(
  getAirMapName(PROVIDER_GOOGLE),
);

export default function decorateMapComponent(
  Component,
  {componentType, providers},
) {
  const components = {};

  const getDefaultComponent = () =>
    requireNativeComponent(getAirComponentName(null, componentType), Component);

  Component.contextTypes = contextTypes;

  Component.prototype.getAirComponent = function getAirComponent() {
    const provider = this.context.provider || PROVIDER_DEFAULT;
    if (components[provider]) {
      return components[provider];
    }

    if (provider === PROVIDER_DEFAULT) {
      components[PROVIDER_DEFAULT] = getDefaultComponent();
      return components[PROVIDER_DEFAULT];
    }

    const providerInfo = providers[provider];
    const platformSupport = providerInfo[Platform.OS];
    const componentName = getAirComponentName(provider, componentType);
    if (platformSupport === NOT_SUPPORTED) {
      components[provider] = createNotSupportedComponent(
        `react-native-maps: ${componentName} is not supported on ${Platform.OS}`,
      );
    } else if (platformSupport === SUPPORTED) {
      if (
        provider !== PROVIDER_GOOGLE ||
        (Platform.OS === 'ios' && googleMapIsInstalled)
      ) {
        components[provider] = requireNativeComponent(componentName, Component);
      }
    } else {
      // (platformSupport === USES_DEFAULT_IMPLEMENTATION)
      if (!components[PROVIDER_DEFAULT]) {
        components[PROVIDER_DEFAULT] = getDefaultComponent();
      }
      components[provider] = components[PROVIDER_DEFAULT];
    }

    return components[provider];
  };

  Component.prototype.getUIManagerCommand = function getUIManagerCommand(name) {
    const componentName = getAirComponentName(
      this.context.provider,
      componentType,
    );
    return getViewManagerConfig(componentName).Commands[name];
  };

  Component.prototype.getMapManagerCommand = function getMapManagerCommand(
    name,
  ) {
    const airComponentName = `${getAirComponentName(
      this.context.provider,
      componentType,
    )}Manager`;
    return NativeModules[airComponentName][name];
  };

  return Component;
}
