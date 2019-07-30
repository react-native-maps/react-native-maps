import { latLngBounds, latLng, Marker } from 'leaflet';

export const DEFAULT_ZOOM = 8;
export const DEFAULT_CENTER = [37.449811, -122.15745];

export function getCoordinatesForElements(markers) {
  let output = [];

  if (Array.isArray(markers)) {
    for (const marker of markers) {
      if (marker == null) continue;
      const coordinate = coordinateFromElement(marker);
      output.push(coordinate);
    }
  } else {
    output.push(coordinateFromElement(markers));
  }

  return output;
}

export const coordinateFromElement = element => {
  if (element == null) return null;
  else if (Array.isArray(element)) return convertCoordinate(element);
  else if (element instanceof Marker) {
    return convertCoordinate(element.getLatLng());
  } else if (element.coordinate) {
    return convertCoordinate(element.coordinate);
  }
  throw new Error(`Leaflet: couldn't infer coordinate from element: ${element}`);
};

function getCoord(latitude, longitude) {
  return {
    latitude,
    longitude,
  };
}

export const convertCoordinateToObject = coordinate => {
  if (!coordinate) return getCoord(...DEFAULT_CENTER);
  if (Array.isArray(coordinate)) {
    if (coordinate.length !== 2) {
      throw new Error('Coordinate should be an array with length of 2: [lat, lng]');
    }
    return getCoord(...coordinate);
  }
  return getCoord(
    coordinate.latitude || coordinate.lat || 0,
    coordinate.longitude || coordinate.lng || coordinate.lon || 0
  );
};
export const convertCoordinate = coordinate => {
  if (!coordinate) return DEFAULT_CENTER;
  if (Array.isArray(coordinate)) {
    if (coordinate.length !== 2) {
      throw new Error('Coordinate should be an array with length of 2: [lat, lng]');
    }
    return coordinate;
  }
  return [
    coordinate.latitude || coordinate.lat || 0,
    coordinate.longitude || coordinate.lng || coordinate.lon || 0,
  ];
};

export const convertRegion = region => {
  const [lat, lon] = convertCoordinate(region);
  return latLngBounds(
    latLng(lat - region.latitudeDelta / 2, lon, -(region.longitudeDelta / 2)),
    latLng(lat + region.latitudeDelta / 2, lon, +(region.longitudeDelta / 2))
  );
};

export const boundsToRegion = bounds => {
  const { lat: latitude, lng: longitude } = bounds.getCenter();
  const longitudeDelta = bounds.getEast() - bounds.getWest();
  const latitudeDelta = bounds.getNorth() - bounds.getSouth();

  return { latitude, longitude, latitudeDelta, longitudeDelta };
};
