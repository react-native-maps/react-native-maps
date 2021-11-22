import MapView, { Animated, MAP_TYPES } from './lib/components/MapView';
import Marker, { Animated as MarkerAnimated } from './lib/components/MapMarker';
import Overlay, {
  Animated as OverlayAnimated,
} from './lib/components/MapOverlay';
export { default as Polyline } from './lib/components/MapPolyline';
export { default as Heatmap } from './lib/components/MapHeatmap';
export { default as Polygon } from './lib/components/MapPolygon';
export { default as Circle } from './lib/components/MapCircle';
export { default as UrlTile } from './lib/components/MapUrlTile';
export { default as WMSTile } from './lib/components/MapWMSTile';
export { default as LocalTile } from './lib/components/MapLocalTile';
export { default as Callout } from './lib/components/MapCallout';
export { default as CalloutSubview } from './lib/components/MapCalloutSubview';
export { default as AnimatedRegion } from './lib/components/AnimatedRegion';
export { default as Geojson } from './lib/components/Geojson';

export { Marker, Overlay };
export { Animated, MAP_TYPES };

export { PROVIDER_GOOGLE } from './lib/components/ProviderConstants';
export { PROVIDER_DEFAULT } from './lib/components/ProviderConstants';

export { MarkerAnimated };
export { OverlayAnimated };

export default MapView;
