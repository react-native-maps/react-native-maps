import { Descriptor, ViewBaseProps, ViewRawProps } from 'rnoh/ts';
import { Camera, EdgePadding, LatLng, MapStyleElement, MapType, Region, Point, GeoJSON } from '../sharedTypes';

export interface AIRMapState {}
export interface AIRMapProps extends ViewRawProps {
  cacheEnabled?: boolean;
  camera?: Camera;
  customMapStyle?: MapStyleElement[];
  followsUserLocation?: boolean;
  initialCamera?: Camera;
  region?: Region;
  initialRegion?: Region;
  kmlSrc?: string;
  legalLabelInsets?: EdgePadding;
  liteMode?: boolean;
  googleMapId?: string;
  loadingBackgroundColor?: string;
  loadingEnabled?: boolean;
  loadingIndicatorColor?: string;
  mapPadding?: EdgePadding;
  mapType?: MapType;
  maxDelta?: number;
  minDelta?: number;
  moveOnMarkerPress?: boolean;
  rotateEnabled: boolean;
  scrollEnabled: boolean;
  zoomEnabled: boolean;
  zoomControlEnabled: boolean;
  zoomTapEnabled: boolean;
  maxZoomLevel?: number;
  minZoomLevel?: number;
  showsCompass: boolean,
  compassOffset?: Point;
  showsScale: boolean,
  showsUserLocation: boolean;
  showsMyLocationButton: boolean,
  provider: string;
  userLocationAnnotationTitle: string;
}
// export type AIRMapDescriptor = Descriptor<"AIRMap", AIRMapProps>
export type AIRMapDescriptor = Descriptor<"AIRMap", ViewBaseProps, AIRMapState, AIRMapProps>

export interface AIRMapMarkerState {}
export interface AIRMapMarkerRawProps extends ViewRawProps {
  title: string
  description: string;
  coordinate: Region;
  rotation: number;
  draggable: boolean;
  flat: boolean;
  image: string;
  calloutAnchor: Point;
  anchor: Point;
  tappable: boolean;
  opacity: number;
}
export type AIRMapMarkerDescriptor = Descriptor<"AIRMapMarker", ViewBaseProps, AIRMapMarkerState, AIRMapMarkerRawProps>

export interface AIRMapPolylineState {}
export interface AIRMapPolylineRawProps extends ViewRawProps {
  coordinates: LatLng[];
  strokeColor: string;
  strokeColors: string[];
  strokeWidth: number;
  lineDashPattern: number[];
  geodesic: boolean;
  tappable: boolean;
  lineJoin: string;
  lineCap: string;
}
export type AIRMapPolylineDescriptor = Descriptor<"AIRMapPolyline", ViewBaseProps, AIRMapPolylineState, AIRMapPolylineRawProps>

export interface AIRMapPolygonState {}
export interface AIRMapPolygonRawProps extends ViewRawProps {
  coordinates: LatLng[];
  fillColor: string
  strokeColor: string;
  strokeWidth: number;
  geodesic: boolean;
  lineDashPattern: number[];
  holes: Array<Array<LatLng>>;
  zIndex: number;
  tappable: boolean;
  lineJoin: string;
  lineCap: string;//华为地图不支持
}
export type AIRMapPolygonDescriptor = Descriptor<"AIRMapPolygon", ViewBaseProps, AIRMapPolygonState, AIRMapPolygonRawProps>

export interface AIRMapCircleState {}
export interface AIRMapCircleRawProps extends ViewRawProps {
  center: LatLng;
  radius: number;
  fillColor: string
  strokeColor: string;
  zIndex: number;
  strokeWidth: number;
  lineDashPattern: number[];
}
export type AIRMapCircleDescriptor = Descriptor<"AIRMapCircle", ViewBaseProps, AIRMapCircleState, AIRMapCircleRawProps>

export interface AIRMapCalloutState {}
export interface AIRMapCalloutRawProps extends ViewRawProps {
  tooltip: boolean;
  alphaHitTest: boolean;
}
export type AIRMapCalloutDescriptor = Descriptor<"AIRMapCallout", ViewBaseProps, AIRMapCalloutState, AIRMapCalloutRawProps>

export interface AIRMapCalloutSubviewState {}
export interface AIRMapCalloutSubviewRawProps extends ViewRawProps {
  tooltip: boolean;
  alphaHitTest: boolean;
}
export type AIRMapCalloutSubviewDescriptor = Descriptor<"AIRMapCalloutSubview", ViewBaseProps, AIRMapCalloutSubviewState, AIRMapCalloutSubviewRawProps>

export interface GeojsonState {}
export interface GeojsonRawProps extends ViewRawProps {
  geojson: GeoJSON;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  color: string;
  lineDashPhase: number;
  lineDashPattern: number[];
  lineCap: 'butt' | 'round' | 'square';
  lineJoin: 'miter' | 'round' | 'bevel';
  miterLimit: number;
  zIndex: number;
  onPress: Function;
  markerComponent: ESObject;
  title: string;
  tracksViewChanges: boolean;
}
export type GeojsonDescriptor = Descriptor<"Geojson", ViewBaseProps, GeojsonState, GeojsonRawProps>

export interface AIRMapUrlTileState {}
export interface AIRMapUrlTileRawProps extends ViewRawProps {
  urlTemplate: string;
  minimumZ: number;
  maximumZ: number;
  maximumNativeZ: number;
  zIndex: number;
  tileSize: number;
  doubleTileSize: boolean;
  shouldReplaceMapContent: boolean;
  flipY: boolean;
  tileCachePath: string;
  tileCacheMaxAge: number;
  offlineMode: boolean;
  opacity: number;
}
export type AIRMapUrlTileDescriptor = Descriptor<"AIRMapUrlTile", ViewBaseProps, AIRMapUrlTileState, AIRMapUrlTileRawProps>

export interface AIRMapWMSTileState {}
export interface AIRMapWMSTileRawProps extends ViewRawProps {
  urlTemplate: string;
  minimumZ: number;
  maximumZ: number;
  maximumNativeZ: number;
  zIndex: number;
  tileSize: number;
  doubleTileSize: boolean;
  shouldReplaceMapContent: boolean;
  flipY: boolean;
  tileCachePath: string;
  tileCacheMaxAge: number;
  offlineMode: boolean;
  opacity: number;
}
export type AIRMapWMSTileDescriptor = Descriptor<"AIRMapWMSTile", ViewBaseProps, AIRMapWMSTileState, AIRMapWMSTileRawProps>

export interface AIRMapOverlayState {}
export interface AIRMapOverlayRawProps extends ViewRawProps {
  image: string;
  bounds: LatLng[];
  bearing: number;
  tappable: boolean;
  opacity: number;
}
export type AIRMapOverlayDescriptor = Descriptor<"AIRMapOverlay", ViewBaseProps, AIRMapOverlayState, AIRMapOverlayRawProps>