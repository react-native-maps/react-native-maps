import type {NativeSyntheticEvent} from 'react-native';

export type Provider = 'google' | undefined;

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type Point = {
  x: number;
  y: number;
};

export type Region = LatLng & {
  latitudeDelta: number;
  longitudeDelta: number;
};

export type Frame = Point & {height: number; width: number};

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

export type LineCapType = 'butt' | 'round' | 'square';
export type LineJoinType = 'miter' | 'round' | 'bevel';

export type ClickEvent<T = {}> = NativeSyntheticEvent<
  {coordinate: LatLng; position: Point} & T
>;

export type MarkerDeselectEvent = Omit<
  ClickEvent<{
    action: 'marker-deselect';
    id: string;
  }>,
  'position'
>;

export type MarkerSelectEvent = Omit<
  ClickEvent<{id: string; action: 'marker-select'}>,
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

/**
 * Represents the available categories for points of interest on the Apple Maps.
 * Use an array of these strings for the `pointsOfInterestFilter` prop.
 * More: https://developer.apple.com/documentation/mapkit/mkpointofinterestcategory
 */
export type MKPointOfInterestCategoryType =
  // Arts and culture
  | 'museum'
  | 'musicVenue'
  | 'theater'
  // Education
  | 'library'
  | 'planetarium'
  | 'school'
  | 'university'
  // Entertainment
  | 'movieTheater'
  | 'nightlife'
  // Health and safety
  | 'fireStation'
  | 'hospital'
  | 'pharmacy'
  | 'police'
  // Historical and cultural landmarks
  | 'castle'
  | 'fortress'
  | 'landmark'
  | 'nationalMonument'
  // Food and drink
  | 'bakery'
  | 'brewery'
  | 'cafe'
  | 'distillery'
  | 'foodMarket'
  | 'restaurant'
  | 'winery'
  // Personal services
  | 'animalService'
  | 'atm'
  | 'automotiveRepair'
  | 'bank'
  | 'beauty'
  | 'evCharger'
  | 'fitnessCenter'
  | 'laundry'
  | 'mailbox'
  | 'postOffice'
  | 'restroom'
  | 'spa'
  | 'store'
  // Parks and recreation
  | 'amusementPark'
  | 'aquarium'
  | 'beach'
  | 'campground'
  | 'fairground'
  | 'marina'
  | 'nationalPark'
  | 'park'
  | 'rvPark'
  | 'zoo'
  // Sports
  | 'baseball'
  | 'basketball'
  | 'bowling'
  | 'goKart'
  | 'golf'
  | 'hiking'
  | 'miniGolf'
  | 'rockClimbing'
  | 'skatePark'
  | 'skating'
  | 'skiing'
  | 'soccer'
  | 'stadium'
  | 'tennis'
  | 'volleyball'
  // Travel
  | 'airport'
  | 'carRental'
  | 'conventionCenter'
  | 'gasStation'
  | 'hotel'
  | 'parking'
  | 'publicTransport'
  // Water sports
  | 'fishing'
  | 'kayaking'
  | 'surfing'
  | 'swimming';
