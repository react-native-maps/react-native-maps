import { NativeSyntheticEvent } from 'react-native';

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type Region = LatLng & {
  latitudeDelta: number;
  longitudeDelta: number;
};

export type Provider = 'google' | undefined;

export type Point = {
  x: number;
  y: number;
};

export type Modify<T, R> = Omit<T, keyof R> & R;

export type Action =
  | 'marker-press'
  | 'polygon-press'
  | 'polyline-press'
  | 'callout-press'
  | 'press'
  | 'long-press'
  | 'overlay-press';

export type LineCapType = 'butt' | 'round' | 'square';
export type LineJoinType = 'miter' | 'round' | 'bevel';

export type ClickEvent<T = {}> = NativeSyntheticEvent<
  { coordinate: LatLng; position: Point } & T
>;

export type Frame = Point & { height: number; width: number };

export type CalloutPressEvent = NativeSyntheticEvent<{
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

export type MarkerDeselectEvent = Omit<
  ClickEvent<{
    action: 'marker-deselect';
    id: string;
  }>,
  'position'
>;

export type MarkerSelectEvent = Omit<
  ClickEvent<{ id: string; action: 'marker-select' }>,
  'position'
>;

export type MarkerDragEvent = ClickEvent<{
  /**
   * @platform iOS
   */
  id?: string;
}>;

export type MarkerDragStartEndEvent = NativeSyntheticEvent<{
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

export type MarkerPressEvent = NativeSyntheticEvent<{
  id: string;
  action: 'marker-press';
  coordinate: LatLng;

  /**
   * @platform Android
   */
  position?: Point;
}>;
