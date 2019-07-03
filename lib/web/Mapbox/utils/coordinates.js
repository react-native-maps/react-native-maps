import { latLngBounds, latLng } from 'leaflet';

export const DEFAULT_ZOOM = 8;
export const DEFAULT_CENTER = [37.449811, -122.15745];

export const convertCoordinate = coordinate => {
  if (!coordinate) return DEFAULT_CENTER;
  if (Array.isArray(coordinate)) {
    if (coordinate.length !== 2) {
      throw new Error('Coordinate should be an array with length of 2: [lng, lat]');
    }
    return coordinate;
  }
  return {
    lat: coordinate.latitude || coordinate.lat || 0,
    lng: coordinate.longitude || coordinate.lng || 0,
  };
};

export const convertRegion = region => {
  const { lat, lng } = convertCoordinate(region);
  return latLngBounds(
    latLng(lat - region.latitudeDelta / 2, lng, -(region.longitudeDelta / 2)),
    latLng(lat + region.latitudeDelta / 2, lng, +(region.longitudeDelta / 2))
  );
};

export const boundsToRegion = bounds => {
  const { lat: latitude, lng: longitude } = bounds.getCenter();
  const longitudeDelta = bounds.getEast() - bounds.getWest();
  const latitudeDelta = bounds.getNorth() - bounds.getSouth();

  return { latitude, longitude, latitudeDelta, longitudeDelta };
};
