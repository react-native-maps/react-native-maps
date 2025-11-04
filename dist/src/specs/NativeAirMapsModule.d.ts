import type { TurboModule } from 'react-native';
import type { Double } from 'react-native/Libraries/Types/CodegenTypes';
import type { Camera } from './NativeComponentMapView';
import type { Address } from '../MapView.types';
type LatLng = {
    latitude: Double;
    longitude: Double;
};
type Point = Readonly<{
    x: Double;
    y: Double;
}>;
export type Region = Readonly<LatLng & {
    latitudeDelta: Double;
    longitudeDelta: Double;
}>;
export type MapBoundaries = {
    northEast: LatLng;
    southWest: LatLng;
};
export interface Spec extends TurboModule {
    getCamera(tag: Double): Promise<Camera>;
    getMarkersFrames(tag: Double, onlyVisible: boolean): Promise<unknown>;
    getMapBoundaries(tag: Double): Promise<MapBoundaries>;
    takeSnapshot(tag: Double, config: string): Promise<string>;
    getAddressFromCoordinates(tag: Double, coordinate: LatLng): Promise<Address>;
    getPointForCoordinate(tag: Double, coordinate: LatLng): Promise<Point>;
    getCoordinateForPoint(tag: Double, point: Point): Promise<LatLng>;
}
declare const _default: Spec;
export default _default;
