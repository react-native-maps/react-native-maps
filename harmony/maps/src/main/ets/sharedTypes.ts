export const TAG = '[liwang-native]';

export type Provider = 'google' | undefined;

export const DEFAULT_ZOOM = 12;

export type Address = {
  name: String,
  thoroughfare: String,
  subThoroughfare: String,
  locality: String,
  subLocality: String,
  administrativeArea: String,
  subAdministrativeArea: String,
  postalCode: String,
  countryCode: String,
  country: String,
}
export type MapStyleElement = {
  featureType?: string;
  elementType?: string;
  stylers: object[];
};
export type EdgePadding = {
  // constructor() {
  //   this.top = 0;
  //   this.right = 0;
  //   this.bottom = 0;
  //   this.left = 0;
  // }
  top: number;
  right: number;
  bottom: number;
  left: number;
};
export type MapType = 'hybrid' | 'mutedStandard' | 'none' | 'satellite' | 'standard' | 'terrain';
export type KmlMarker = {
  id: string;
  title: string;
  description: string;
  coordinate: LatLng;
  position: Point;
};
export type IndoorLevel = {
  index: number;
  name: string;
  shortName: string;
};
export type ActiveIndoorLevel = {
  activeLevelIndex: number;
  name: string;
  shortName: string;
};
export type IndoorBuilding = {
  underground: boolean;
  activeLevelIndex: number;
  levels: IndoorLevel[];
};

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type Point = {
  x: number;
  y: number;
};

export type Region = LatLng & {
  latitudeDelta?: number;
  longitudeDelta?: number;
};

export type ImageURISource = {
  uri: string;
  scale: number;
};

export type Frame = Point & {height: number; width: number};

export type Camera = {
  /**
   * Apple Maps
   */
  altitude?: number;
  center: LatLng;
  heading: number;
  pitch: number;
  /**
   * Google Maps
   */
  zoom: number;
};

export class ColorMap{
  private static instance: ColorMap;

  public static getInstance(): ColorMap {
    if (!ColorMap.instance) {
      ColorMap.instance = new ColorMap();
    }
    return ColorMap.instance;
  }

  public colorMap = new Map<string, string>();

  constructor() {
    //Color 鸿蒙color枚举值
    this.colorMap.set("white",  "#ffffffff")
    this.colorMap.set("black",  "#ff000000")
    this.colorMap.set("blue",  "#ff0000ff")
    this.colorMap.set("brown",  "#ffa52a2a")
    this.colorMap.set("gray",  "#ff808080")
    this.colorMap.set("green", "#ff008000")
    this.colorMap.set("grey", "#ffd3d3d3")
    this.colorMap.set("orange", "#ffffa500")
    this.colorMap.set("pink", "#ffffb6c1")
    this.colorMap.set("red",    "#ffff0000")
    this.colorMap.set("yellow", "#ffffff00")
    this.colorMap.set("transparent", "#00000000")
    this.colorMap.set("springgreen", "#ff00FF7F")
    this.colorMap.set("green", "#ff008000")
    this.colorMap.set("lime", "#ff00ff00")
    this.colorMap.set("aqua", "#ff00ffff")
    this.colorMap.set("cyan", "#ff00ffff")
    this.colorMap.set("cyan", "#ff00ffff")
  }
}
export type GeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [39.9, 118.9],
      }
    }
  ]
}



// export type CalloutPressEvent = NativeSyntheticEvent<{
//   action: 'callout-press';
//
//   /**
//    * @platform iOS
//    */
//   frame?: Frame;
//
//   /**
//    * @platform iOS
//    */
//   id?: string;
//
//   /**
//    * @platform iOS
//    */
//   point?: Point;
//
//   /**
//    * @platform Android
//    */
//   coordinate?: LatLng;
//
//   /**
//    * @platform Android
//    */
//   position?: Point;
// }>;
//
// export type LineCapType = 'butt' | 'round' | 'square';
// export type LineJoinType = 'miter' | 'round' | 'bevel';
//
// export type ClickEvent<T = {}> = NativeSyntheticEvent<
// {coordinate: LatLng; position: Point} & T
// >;
//
// export type MarkerDeselectEvent = Omit<
// ClickEvent<{
//   action: 'marker-deselect';
//   id: string;
// }>,
// 'position'
// >;
//
// export type MarkerSelectEvent = Omit<
// ClickEvent<{id: string; action: 'marker-select'}>,
// 'position'
// >;
//
// export type MarkerDragEvent = ClickEvent<{
//   /**
//    * @platform iOS
//    */
//   id?: string;
// }>;
//
// export type MarkerDragStartEndEvent = NativeSyntheticEvent<{
//   coordinate: LatLng;
//
//   /**
//    * @platform iOS
//    */
//   id?: string;
//
//   /**
//    * @platform Android
//    */
//   position?: Point;
// }>;
//
// export type MarkerPressEvent = NativeSyntheticEvent<{
//   id: string;
//   action: 'marker-press';
//   coordinate: LatLng;
//
//   /**
//    * @platform Android
//    */
//   position?: Point;
// }>;
