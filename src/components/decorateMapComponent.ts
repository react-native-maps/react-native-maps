import { createContext } from 'react';
import {
  requireNativeComponent,
  NativeModules,
  UIManager,
  Platform,
  HostComponent,
} from 'react-native';
import { Provider } from '../types';
import { MapCallout } from './MapCallout';
import { MapCalloutSubview } from './MapCalloutSubview';
import { MapCircle } from './MapCircle';
import { MapHeatmap } from './MapHeatmap';
import { MapLocalTile } from './MapLocalTile';
import { MapMarker } from './MapMarker';
import { MapOverlay } from './MapOverlay';
import { MapPolygon } from './MapPolygon';
import { MapPolyline } from './MapPolyline';
import { MapUrlTile } from './MapUrlTile';
import { MapWMSTile } from './MapWMSTile';
import { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from './ProviderConstants';

export const SUPPORTED = 'SUPPORTED';
export const USES_DEFAULT_IMPLEMENTATION = 'USES_DEFAULT_IMPLEMENTATION';
export const NOT_SUPPORTED = 'NOT_SUPPORTED';

export const ProviderContext = createContext<Provider>(undefined);

export function getAirMapName(provider: Provider) {
  if (Platform.OS === 'android') {
    return 'AIRMap';
  }
  if (provider === PROVIDER_GOOGLE) {
    return 'AIRGoogleMap';
  }
  return 'AIRMap';
}

function getAirComponentName(provider: Provider, component: ComponentType) {
  return `${getAirMapName(provider)}${component}`;
}

export const createNotSupportedComponent = (message: string) => () => {
  console.error(message);
  return null;
};

// Intellisenst says that this always return true
// I'm pretty sure that @types/react-native is wrong on this
// getViewManagerConfig can return null, thus this function is still valid
// see: https://github.com/facebook/react-native/blob/49b3b31d8e706338dac4ced1b372424d7d1d133f/Libraries/ReactNative/PaperUIManager.js
// TODO: Sanity check and submit pull request to @types/react-native
export const googleMapIsInstalled = !!UIManager.getViewManagerConfig(
  getAirMapName(PROVIDER_GOOGLE)
);

export default function decorateMapComponent<Type extends ComponentClass>(
  Component: Type,
  {
    componentType,
    providers,
  }: { componentType: ComponentType; providers: Providers }
): Type {
  const components: {
    [key: string]: AirComponent;
  } = {};

  const getDefaultComponent = () =>
    requireNativeComponent(getAirComponentName(undefined, componentType));

  Component.contextType = ProviderContext;

  Component.prototype.getAirComponent =
    function getAirComponent(): AirComponent {
      const provider = this.context;
      const key = provider || 'default';

      if (components[key]) {
        return components[key];
      }

      if (provider === PROVIDER_DEFAULT) {
        components[key] = getDefaultComponent();
        return components[key];
      }

      const providerInfo = providers[provider];
      // quick fix. Previous code assumed android | ios
      if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
        throw new Error(`react-native-maps doesn't support ${Platform.OS}`);
      }
      const platformSupport = providerInfo[Platform.OS];
      const componentName = getAirComponentName(provider, componentType);
      if (platformSupport === NOT_SUPPORTED) {
        components[key] = createNotSupportedComponent(
          `react-native-maps: ${componentName} is not supported on ${Platform.OS}`
        );
      } else if (platformSupport === SUPPORTED) {
        if (
          provider !== PROVIDER_GOOGLE ||
          (Platform.OS === 'ios' && googleMapIsInstalled)
        ) {
          components[key] = requireNativeComponent(componentName);
        }
      } else {
        // (platformSupport === USES_DEFAULT_IMPLEMENTATION)
        if (!components.default) {
          components.default = getDefaultComponent();
        }
        components[key] = components.default;
      }

      return components[key];
    };

  Component.prototype.getUIManagerCommand = function getUIManagerCommand(
    name: string
  ): UIManagerCommand {
    const componentName = getAirComponentName(this.context, componentType);
    return UIManager.getViewManagerConfig(componentName).Commands[name];
  };

  Component.prototype.getMapManagerCommand = function getMapManagerCommand(
    name: string
  ): MapManagerCommand {
    const airComponentName = `${getAirComponentName(
      this.context,
      componentType
    )}Manager`;
    return NativeModules[airComponentName][name];
  };

  return Component;
}

type Providers = {
  google: {
    ios: 'SUPPORTED' | 'USES_DEFAULT_IMPLEMENTATION' | 'NOT_SUPPORTED';
    android: 'SUPPORTED' | 'USES_DEFAULT_IMPLEMENTATION' | 'NOT_SUPPORTED';
  };
};

type ComponentClass =
  | typeof MapCallout
  | typeof MapCalloutSubview
  | typeof MapCircle
  | typeof MapHeatmap
  | typeof MapLocalTile
  | typeof MapMarker
  | typeof MapOverlay
  | typeof MapPolygon
  | typeof MapPolyline
  | typeof MapUrlTile
  | typeof MapWMSTile;

type ComponentType =
  | 'Callout'
  | 'CalloutSubview'
  | 'Circle'
  | 'Heatmap'
  | 'LocalTile'
  | 'Marker'
  | 'Overlay'
  | 'Polygon'
  | 'Polyline'
  | 'UrlTile'
  | 'WMSTile';

//todo: narrow down any
export type UIManagerCommand = any;
export type MapManagerCommand = any;

export type AirComponent<H = unknown> =
  | HostComponent<H>
  | ReturnType<typeof createNotSupportedComponent>;
