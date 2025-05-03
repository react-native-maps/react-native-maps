import {NativeSyntheticEvent} from 'react-native';
import {LatLng, Point} from './sharedTypes';

// All types in this file are directly exported with the package for external
// use.

export type PolygonPressEvent = NativeSyntheticEvent<{
  action: 'polygon-press';

  /**
   * @platform iOS: Google Maps
   */
  id?: string;

  /**
   * @platform iOS: Apple Maps
   * @platform Android
   */
  coordinate?: LatLng;

  /**
   * @platform Android
   */
  position?: Point;
}>;
