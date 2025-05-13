import MapView, {
  AnimatedMapView as Animated,
  MAP_TYPES,
  type MapViewProps,
} from './MapView';

import Marker from './MapMarker';
export {MapMarker} from './MapMarker';
export type {MapMarkerProps} from './MapMarker';

import Overlay from './MapOverlay';
export {MapOverlay} from './MapOverlay';
export type {MapOverlayProps} from './MapOverlay';

export {default as Polyline, MapPolyline} from './MapPolyline';
export type {MapPolylineProps} from './MapPolyline';
export {default as Heatmap, MapHeatmap} from './MapHeatmap';
export type {MapHeatmapProps} from './MapHeatmap';
export {default as Polygon, MapPolygon} from './MapPolygon';
export type {MapPolygonProps} from './MapPolygon';
export {default as Circle, MapCircle} from './MapCircle';
export type {MapCircleProps} from './MapCircle';
export {default as UrlTile, MapUrlTile} from './MapUrlTile';
export type {MapUrlTileProps} from './MapUrlTile';
export {default as WMSTile, MapWMSTile} from './MapWMSTile';
export type {MapWMSTileProps} from './MapWMSTile';
export {default as LocalTile, MapLocalTile} from './MapLocalTile';
export type {MapLocalTileProps} from './MapLocalTile';
export {default as Callout, MapCallout} from './MapCallout';
export type {MapCalloutProps} from './MapCallout';
export {
  default as CalloutSubview,
  MapCalloutSubview,
} from './MapCalloutSubview';
export type {MapCalloutSubviewProps} from './MapCalloutSubview';
export {default as AnimatedRegion} from './AnimatedRegion';
export {default as Geojson} from './Geojson';
export type {GeojsonProps} from './Geojson';

export {Marker, Overlay};
export type {MapViewProps};
export {Animated, MAP_TYPES};

export * from './ProviderConstants';
export * from './MapView.types';
export * from './MapPolygon.types';
export * from './sharedTypes';

export const MarkerAnimated = Marker.Animated;
export const OverlayAnimated = Overlay.Animated;

export default MapView;
