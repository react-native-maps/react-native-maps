import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import MapMarker from './MapMarker';

const GoogleMapContainer = withGoogleMap(props => <GoogleMap {...props} ref={props.handleMapMounted} />);

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = { center: { lat: props.region.latitude, lng: props.region.longitude } };
  }

  handleMapMounted = map => (this.map = map);

  onDragEnd = () => {
    const center = this.map.getCenter();
    !!this.props.onRegionChangeComplete &&
      this.props.onRegionChangeComplete({ latitude: center.lat(), longitude: center.lng() });
  };

  render() {
    if (!this.state.center)
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    return (
      <View style={styles.container}>
        <GoogleMapContainer
          handleMapMounted={this.handleMapMounted}
          containerElement={<div style={{ height: '100%' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          center={this.state.center}
          onDragStart={!!this.props.onRegionChange && this.props.onRegionChange}
          onDragEnd={this.onDragEnd}
          defaultZoom={15}
          onClick={this.props.onPress}
        >
          {this.props.children}
        </GoogleMapContainer>
      </View>
    );
  }
}

MapView.Marker = MapMarker;

const styles = StyleSheet.create({
  container: {
    height: '100vh',
  },
});

export default MapView;

