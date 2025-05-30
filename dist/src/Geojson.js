import * as React from 'react';
import Marker, {} from './MapMarker';
import Polyline from './MapPolyline';
import MapPolygon from './MapPolygon';
const Geojson = (props) => {
    const { anchor, centerOffset, geojson, strokeColor, fillColor, strokeWidth, color, title, image, zIndex, onPress, lineCap, lineJoin, tappable, tracksViewChanges, miterLimit, lineDashPhase, lineDashPattern, markerComponent, } = props;
    const pointOverlays = makePointOverlays(geojson.features);
    const lineOverlays = makeLineOverlays(geojson.features);
    const polygonOverlays = makePolygonOverlays(geojson.features);
    return (<React.Fragment>
      {pointOverlays.map((overlay, index) => {
            const markerColor = getColor(color, overlay, 'marker-color');
            const pointOverlayTracksViewChanges = overlay.feature.properties?.tracksViewChanges || tracksViewChanges;
            return (<Marker key={index} coordinate={overlay.coordinates} tracksViewChanges={pointOverlayTracksViewChanges} image={image} title={title} pinColor={markerColor} zIndex={zIndex} anchor={anchor} centerOffset={centerOffset} onPress={() => onPress && onPress(overlay)}>
            {markerComponent}
          </Marker>);
        })}
      {lineOverlays.map((overlay, index) => {
            const lineStrokeColor = getColor(strokeColor, overlay, 'stroke');
            const lineStrokeWidth = getStrokeWidth(strokeWidth, overlay);
            return (<Polyline key={index} coordinates={overlay.coordinates} strokeColor={lineStrokeColor} strokeWidth={lineStrokeWidth} lineDashPhase={lineDashPhase} lineDashPattern={lineDashPattern} lineCap={lineCap} lineJoin={lineJoin} miterLimit={miterLimit} zIndex={zIndex} tappable={tappable} onPress={() => onPress && onPress(overlay)}/>);
        })}
      {polygonOverlays.map((overlay, index) => {
            const polygonFillColor = getColor(fillColor, overlay, 'fill');
            const lineStrokeColor = getColor(strokeColor, overlay, 'stroke');
            const lineStrokeWidth = getStrokeWidth(strokeWidth, overlay);
            return (<MapPolygon key={index} coordinates={overlay.coordinates} holes={overlay.holes} strokeColor={lineStrokeColor} fillColor={polygonFillColor} strokeWidth={lineStrokeWidth} lineDashPhase={lineDashPhase} lineDashPattern={lineDashPattern} lineCap={lineCap} lineJoin={lineJoin} miterLimit={miterLimit} tappable={tappable} onPress={() => onPress && onPress(overlay)} zIndex={zIndex}/>);
        })}
    </React.Fragment>);
};
export default Geojson;
const makePointOverlays = (features) => {
    return features
        .filter(isAnyPointFeature)
        .map(feature => makeCoordinatesForAnyPoint(feature.geometry).map(coordinates => makeOverlayForAnyPoint(coordinates, feature)))
        .reduce((prev, curr) => prev.concat(curr), [])
        .map(overlay => ({ ...overlay, type: 'point' }));
};
const makeLineOverlays = (features) => {
    return features
        .filter(isAnyLineStringFeature)
        .map(feature => makeCoordinatesForAnyLine(feature.geometry).map(coordinates => makeOverlayForAnyLine(coordinates, feature)))
        .reduce((prev, curr) => prev.concat(curr), [])
        .map(overlay => ({ ...overlay, type: 'polyline' }));
};
const makePolygonOverlays = (features) => {
    const multipolygons = features
        .filter(isMultiPolygonFeature)
        .map(feature => makeCoordinatesForMultiPolygon(feature.geometry).map(coordinates => makeOverlayForAnyPolygon(coordinates, feature)))
        .reduce((prev, curr) => prev.concat(curr), [])
        .map(overlay => ({ ...overlay, type: 'polygon' }));
    const polygons = features
        .filter(isPolygonFeature)
        .map(feature => makeOverlayForAnyPolygon(makeCoordinatesForPolygon(feature.geometry), feature))
        .reduce((prev, curr) => prev.concat(curr), [])
        .map(overlay => ({ ...overlay, type: 'polygon' }));
    return polygons.concat(multipolygons);
};
const makeOverlayForAnyPoint = (coordinates, feature) => {
    return { feature, coordinates };
};
const makeOverlayForAnyLine = (coordinates, feature) => {
    return { feature, coordinates };
};
const makeOverlayForAnyPolygon = (coordinates, feature) => {
    return {
        feature,
        coordinates: coordinates[0],
        holes: coordinates.length > 1 ? coordinates.slice(1) : undefined,
    };
};
const makePoint = (c) => ({
    latitude: c[1],
    longitude: c[0],
});
const makeLine = (l) => l.map(makePoint);
const makeCoordinatesForAnyPoint = (geometry) => {
    if (geometry.type === 'Point') {
        return [makePoint(geometry.coordinates)];
    }
    return geometry.coordinates.map(makePoint);
};
const makeCoordinatesForAnyLine = (geometry) => {
    if (geometry.type === 'LineString') {
        return [makeLine(geometry.coordinates)];
    }
    return geometry.coordinates.map(makeLine);
};
const makeCoordinatesForPolygon = (geometry) => {
    return geometry.coordinates.map(makeLine);
};
const makeCoordinatesForMultiPolygon = (geometry) => {
    return geometry.coordinates.map(p => p.map(makeLine));
};
const getRgbaFromHex = (hex, alpha = 1) => {
    const matchArray = hex.match(/\w\w/g);
    if (!matchArray || matchArray.length < 3) {
        throw new Error('Invalid hex string');
    }
    const [r, g, b] = matchArray.map(x => {
        const subColor = parseInt(x, 16);
        if (Number.isNaN(subColor)) {
            throw new Error('Invalid hex string');
        }
        return subColor;
    });
    return `rgba(${r},${g},${b},${alpha})`;
};
const getColor = (prop, overlay, colorType) => {
    if (prop) {
        return prop;
    }
    let color = overlay.feature.properties?.[colorType];
    if (color) {
        const opacityProperty = colorType + '-opacity';
        const alpha = overlay.feature.properties?.[opacityProperty];
        if (alpha && alpha !== '0' && color[0] === '#') {
            color = getRgbaFromHex(color, alpha);
        }
        return color;
    }
    return undefined;
};
const getStrokeWidth = (prop, overlay) => {
    if (prop) {
        return prop;
    }
    return overlay.feature.properties?.['stroke-width'];
};
// GeoJSON.Feature type-guards
const isPointFeature = (feature) => feature.geometry.type === 'Point';
const isMultiPointFeature = (feature) => feature.geometry.type === 'MultiPoint';
const isAnyPointFeature = (feature) => isPointFeature(feature) || isMultiPointFeature(feature);
const isLineStringFeature = (feature) => feature.geometry.type === 'LineString';
const isMultiLineStringFeature = (feature) => feature.geometry.type === 'MultiLineString';
const isAnyLineStringFeature = (feature) => isLineStringFeature(feature) || isMultiLineStringFeature(feature);
const isPolygonFeature = (feature) => feature.geometry.type === 'Polygon';
const isMultiPolygonFeature = (feature) => feature.geometry.type === 'MultiPolygon';
