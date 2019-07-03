export const DEFAULT_CENTER = [37.449811, -122.15745];

export const convertCoordinate = coordinate => {
  if (!coordinate) return DEFAULT_CENTER;
  if (Array.isArray(coordinate)) {
    if (coordinate.length !== 2) {
      throw new Error('Coordinate should be an array with length of 2: [lat, lng]');
    }
    return coordinate;
  }
  return [coordinate.latitude || coordinate.lat || 0, coordinate.longitude || coordinate.lng || 0];
};
