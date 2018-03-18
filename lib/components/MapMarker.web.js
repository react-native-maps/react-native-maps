import React, { Component } from 'react';
import { Marker } from 'react-google-maps';

class MapViewMarker extends Component {
  render() {
    return (
      <Marker
        title={this.props.description ? `${this.props.title}\n${this.props.description}` : this.props.title}
        position={{ lat: this.props.coordinate.latitude, lng: this.props.coordinate.longitude }}
      />
    );
  }
}

export default MapViewMarker;

