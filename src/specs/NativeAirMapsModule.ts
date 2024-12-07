import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { Double, Int32, Float } from 'react-native/Libraries/Types/CodegenTypes';
import type {Camera} from './NativeComponentMapView';
import {Address} from 'react-native-maps';

type LatLng = {
    latitude: Double;
    longitude: Double;
};

type Point = Readonly<{
    x: Double; // Non-nullable Double for x
    y: Double; // Non-nullable Double for y
}>;

export type Region = Readonly<LatLng & {
    latitudeDelta: Double; // Non-nullable Double for latitudeDelta
    longitudeDelta: Double; // Non-nullable Double for longitudeDelta
}>;

export type SnapshotOptions = {
    /** optional, when omitted the view-width is used */
    width?: Int32;
    /** optional, when omitted the view-height is used */
    height?: Int32;
    /** __iOS only__, optional region to render */
    region?: Region;
    /** image formats, defaults to 'png' */
    format?: string;
    /** image quality: 0..1 (only relevant for jpg, default: 1) */
    quality?: Float;
    /** result types, defaults to 'file' */
    result?: string;
};

export type MapBoundaries = {northEast: LatLng; southWest: LatLng}

export interface Spec extends TurboModule {
    getCamera(tag: Double): Promise<Camera>;
    getMarkersFrames(tag: Double, onlyVisible: boolean): Promise<unknown>;
    getMapBoundaries(tag: Double): Promise<MapBoundaries>;
    takeSnapshot(tag: Double, config: SnapshotOptions): Promise<string>;
    getAddressFromCoordinates(tag: Double, coordinate: LatLng): Promise<Address>;
    getPointForCoordinate(tag: Double, coordinate: LatLng): Promise<Point>;
    getCoordinateForPoint(tag: Double, point: Point): Promise<LatLng>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNMapsAirModule');
