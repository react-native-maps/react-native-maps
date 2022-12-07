import { NativeSyntheticEvent } from 'react-native';
export declare type Provider = 'google' | undefined;
export declare type LatLng = {
    latitude: number;
    longitude: number;
};
export declare type Point = {
    x: number;
    y: number;
};
export declare type Region = LatLng & {
    latitudeDelta: number;
    longitudeDelta: number;
};
export declare type Frame = Point & {
    height: number;
    width: number;
};
export declare type CalloutPressEvent = NativeSyntheticEvent<{
    action: 'callout-press';
    /**
     * @platform iOS
     */
    frame?: Frame;
    /**
     * @platform iOS
     */
    id?: string;
    /**
     * @platform iOS
     */
    point?: Point;
    /**
     * @platform Android
     */
    coordinate?: LatLng;
    /**
     * @platform Android
     */
    position?: Point;
}>;
export declare type LineCapType = 'butt' | 'round' | 'square';
export declare type LineJoinType = 'miter' | 'round' | 'bevel';
export declare type ClickEvent<T = {}> = NativeSyntheticEvent<{
    coordinate: LatLng;
    position: Point;
} & T>;
export declare type MarkerDeselectEvent = Omit<ClickEvent<{
    action: 'marker-deselect';
    id: string;
}>, 'position'>;
export declare type MarkerSelectEvent = Omit<ClickEvent<{
    id: string;
    action: 'marker-select';
}>, 'position'>;
export declare type MarkerDragEvent = ClickEvent<{
    /**
     * @platform iOS
     */
    id?: string;
}>;
export declare type MarkerDragStartEndEvent = NativeSyntheticEvent<{
    coordinate: LatLng;
    /**
     * @platform iOS
     */
    id?: string;
    /**
     * @platform Android
     */
    position?: Point;
}>;
export declare type MarkerPressEvent = NativeSyntheticEvent<{
    id: string;
    action: 'marker-press';
    coordinate: LatLng;
    /**
     * @platform Android
     */
    position?: Point;
}>;
