/// <reference types="react" />
import { HostComponent } from 'react-native';
import { Provider } from './sharedTypes';
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
export declare const SUPPORTED: ImplementationStatus;
export declare const USES_DEFAULT_IMPLEMENTATION: ImplementationStatus;
export declare const NOT_SUPPORTED: ImplementationStatus;
export declare const ProviderContext: import("react").Context<Provider>;
export declare function getNativeMapName(provider: Provider): "AIRMap" | "AIRGoogleMap";
export declare const createNotSupportedComponent: (message: string) => () => null;
export declare const googleMapIsInstalled: boolean;
export default function decorateMapComponent<Type extends Component>(Component: Type, componentName: ComponentName, providers: Providers): Type;
type ImplementationStatus = 'SUPPORTED' | 'USES_DEFAULT_IMPLEMENTATION' | 'NOT_SUPPORTED';
type Providers = {
    google: {
        ios: ImplementationStatus;
        android: ImplementationStatus;
    };
};
export type UIManagerCommand = number;
export type MapManagerCommand = keyof typeof Commands;
export type NativeComponent<H = unknown> = HostComponent<H> | ReturnType<typeof createNotSupportedComponent>;
type Component = typeof MapCallout | typeof MapCalloutSubview | typeof MapCircle | typeof MapHeatmap | typeof MapLocalTile | typeof MapMarker | typeof MapOverlay | typeof MapPolygon | typeof MapPolyline | typeof MapUrlTile | typeof MapWMSTile;
type ComponentName = 'Callout' | 'CalloutSubview' | 'Circle' | 'Heatmap' | 'LocalTile' | 'Marker' | 'Overlay' | 'Polygon' | 'Polyline' | 'UrlTile' | 'WMSTile';
export {};
