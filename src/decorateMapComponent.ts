import {createContext} from 'react';
import {
  requireNativeComponent,
  NativeModules,
  Platform,
  UIManager,
  HostComponent,
} from 'react-native';
import {PROVIDER_DEFAULT, PROVIDER_GOOGLE} from './ProviderConstants';
import {Provider} from './sharedTypes';
import {MapCallout} from './MapCallout';
import {MapOverlay} from './MapOverlay';
import {MapCalloutSubview} from './MapCalloutSubview';
import {MapCircle} from './MapCircle';
import {MapHeatmap} from './MapHeatmap';
import {MapLocalTile} from './MapLocalTile';
import {MapMarker} from './MapMarker';
import {MapPolygon} from './MapPolygon';
import {MapPolyline} from './MapPolyline';
import {MapUrlTile} from './MapUrlTile';
import {MapWMSTile} from './MapWMSTile';
import {Commands} from './MapViewNativeComponent';

export const SUPPORTED: ImplementationStatus = 'SUPPORTED';
export const USES_DEFAULT_IMPLEMENTATION: ImplementationStatus =
  'USES_DEFAULT_IMPLEMENTATION';
export const NOT_SUPPORTED: ImplementationStatus = 'NOT_SUPPORTED';

export const ProviderContext = createContext<Provider>(undefined);

export function getNativeMapName(provider: Provider) {
  if (Platform.OS === 'android') {
    return 'AIRMap';
  }
  if (provider === PROVIDER_GOOGLE) {
    return 'AIRGoogleMap';
  }
  return 'AIRMap';
}

function getNativeComponentName(provider: Provider, component: ComponentName) {
  return `${getNativeMapName(provider)}${component}`;
}

export const createNotSupportedComponent = (message: string) => () => {
  console.error(message);
  return null;
};

export const googleMapIsInstalled = !!UIManager.getViewManagerConfig(
  getNativeMapName(PROVIDER_GOOGLE),
);

export default function decorateMapComponent<Type extends Component>(
  Component: Type,
  componentName: ComponentName,
  providers: Providers,
): Type {
  const components: {
    [key: string]: NativeComponent;
  } = {};

  const getDefaultComponent = () =>
    requireNativeComponent(getNativeComponentName(undefined, componentName));

  Component.contextType = ProviderContext;

  Component.prototype.getNativeComponent =
    function getNativeComponent(): NativeComponent {
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
      const nativeComponentName = getNativeComponentName(
        provider,
        componentName,
      );
      if (platformSupport === NOT_SUPPORTED) {
        components[key] = createNotSupportedComponent(
          `react-native-maps: ${nativeComponentName} is not supported on ${Platform.OS}`,
        );
      } else if (platformSupport === SUPPORTED) {
        if (
          provider !== PROVIDER_GOOGLE ||
          (Platform.OS === 'ios' && googleMapIsInstalled)
        ) {
          components[key] = requireNativeComponent(nativeComponentName);
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
    name: string,
  ): UIManagerCommand {
    const nativeComponentName = getNativeComponentName(
      this.context,
      componentName,
    );
    return UIManager.getViewManagerConfig(nativeComponentName).Commands[name];
  };

  Component.prototype.getMapManagerCommand = function getMapManagerCommand(
    name: string,
  ): MapManagerCommand {
    const nativeComponentName = `${getNativeComponentName(
      this.context,
      componentName,
    )}Manager`;
    return NativeModules[nativeComponentName][name];
  };

  return Component;
}

type ImplementationStatus =
  | 'SUPPORTED'
  | 'USES_DEFAULT_IMPLEMENTATION'
  | 'NOT_SUPPORTED';

type Providers = {
  google: {
    ios: ImplementationStatus;
    android: ImplementationStatus;
  };
};

export type UIManagerCommand = number;

export type MapManagerCommand = keyof typeof Commands;

export type NativeComponent<H = unknown> =
  | HostComponent<H>
  | ReturnType<typeof createNotSupportedComponent>;

type Component =
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

type ComponentName =
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
