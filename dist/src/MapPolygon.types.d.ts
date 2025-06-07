import type { NativeSyntheticEvent } from 'react-native';
import type { LatLng, Point } from './sharedTypes';
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
