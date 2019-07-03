import * as React from 'react';
import { Marker } from 'react-google-maps';

export default function AIRMapMarker() {
  const { description, title, coordinate } = this.props;
  const markerTitle = description ? `${title}\n${description}` : title;
  const position = { lat: coordinate.latitude, lng: coordinate.longitude };
  return <Marker title={markerTitle} position={position} />;
}
