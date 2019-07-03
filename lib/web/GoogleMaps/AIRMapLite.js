import * as React from 'react';
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';
import { StyleSheet, View } from 'react-native';

class GoogleMapInnerContainer extends React.Component<any> {
  render() {
    const { onMapMount, ...props } = this.props;
    return <GoogleMap {...props} ref={onMapMount} />;
  }
}
const GoogleMapContainer = withScriptjs(withGoogleMap(GoogleMapInnerContainer));

type Props = {
  onRegionChangeComplete: Function | null,
  onPress: Function,
  onRegionChange: Function | null,
  initialRegion: { latitude: number, longitude: number },
  region: { latitude: number, longitude: number },
};

class MapView extends React.Component<Props> {
  googleMap: GoogleMap | null = null;

  onMapMount = (googleMap: GoogleMap | null) => {
    this.googleMap = googleMap;
  };

  setNativeProps(props) {
    
  }

  onDragEnd = () => {
    const { onRegionChangeComplete } = this.props;
    if (this.googleMap && onRegionChangeComplete) {
      const center = this.googleMap.getCenter();
      onRegionChangeComplete({
        latitude: center.lat(),
        longitude: center.lng(),
      });
    }
  };


  render() {
    const { region, initialRegion, onRegionChange, onPress, children, googleMapURL } = this.props;

    console.log('Native Web Lite: ', this.props, GoogleMapContainer);
    return (
      <View style={styles.container}>
        <GoogleMapContainer
          googleMapURL={googleMapURL}
          onMapMount={this.onMapMount}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: '100%' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          defaultCenter={convertCoordinate(initialRegion)}
          center={convertCoordinate(region)}
          onDragStart={onRegionChange}
          onDragEnd={this.onDragEnd}
          onClick={onPress}>
          {children}
        </GoogleMapContainer>
      </View>
    );
  }
}

const convertCoordinate = (coordinate) => {
  if (!coordinate) return null;
  return {
    lat: coordinate.latitude || coordinate.lat,
    lng: coordinate.longitude || coordinate.lng,
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100vh',
  },
  containerDiv: {
    height: '100%',
  },
});

export default MapView;
