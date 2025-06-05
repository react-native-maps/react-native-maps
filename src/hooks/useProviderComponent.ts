import {useMemo, useContext} from 'react';
import {requireNativeComponent, Platform} from 'react-native';
import {ProviderContext} from '../context/ProviderContext';
import {PROVIDER_GOOGLE} from '../ProviderConstants';

type ImplementationStatus =
  | 'SUPPORTED'
  | 'USES_DEFAULT_IMPLEMENTATION'
  | 'NOT_SUPPORTED';

type ProviderConfig = {
  google: {
    ios: ImplementationStatus;
    android: ImplementationStatus;
  };
};

function getNativeMapName(provider?: string) {
  if (Platform.OS === 'android') {
    return 'AIRMap';
  }
  if (provider === PROVIDER_GOOGLE) {
    return 'AIRGoogleMap';
  }
  return 'AIRMap';
}

function getNativeComponentName(
  provider: string | undefined,
  componentName: string,
) {
  return `${getNativeMapName(provider)}${componentName}`;
}

const createNotSupportedComponent = (message: string) => {
  return () => {
    console.error(message);
    return null;
  };
};

type ComponentOverride = (provider: string | undefined) => any | null;

export function useProviderComponent(
  componentName: string,
  providerConfig: ProviderConfig,
  customOverride?: ComponentOverride,
) {
  const provider = useContext(ProviderContext);

  return useMemo(() => {
    // Check for custom override first
    if (customOverride) {
      const overrideComponent = customOverride(provider);
      if (overrideComponent) {
        return overrideComponent;
      }
    }

    // Default component fallback
    const getDefaultComponent = () =>
      requireNativeComponent(getNativeComponentName(undefined, componentName));

    // If no provider, use default
    if (!provider) {
      return getDefaultComponent();
    }

    // Get provider configuration
    const providerInfo = providerConfig[provider as keyof ProviderConfig];
    if (!providerInfo) {
      return getDefaultComponent();
    }

    // Check platform support
    const platformSupport =
      providerInfo[Platform.OS as keyof typeof providerInfo];
    const nativeComponentName = getNativeComponentName(provider, componentName);

    if (platformSupport === 'NOT_SUPPORTED') {
      return createNotSupportedComponent(
        `react-native-maps: ${nativeComponentName} is not supported on ${Platform.OS}`,
      );
    } else if (platformSupport === 'SUPPORTED') {
      return requireNativeComponent(nativeComponentName);
    } else {
      // USES_DEFAULT_IMPLEMENTATION
      return getDefaultComponent();
    }
  }, [provider, componentName, providerConfig, customOverride]);
}
