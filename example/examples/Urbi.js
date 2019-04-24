import React from 'react';
import { StyleSheet, View, Platform, Text, UIManager, ToastAndroid, Image } from 'react-native';

import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import berlinVehicleList from './assets/vehicles.json';
import hamburgVehicleList from './assets/vehicles-hamburg.json';
import cityList from './assets/cities.json';
import pins, { cityIcons } from './UrbiImages';

const LATITUDE = 52.520873;
const LONGITUDE = 13.409419;

if (Platform.OS !== 'ios' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const vehicleLists = {
  berlin: berlinVehicleList,
  hamburg: hamburgVehicleList,
};

const SWITCH_TO_PINS_LAT_LON_DELTA = 0.04;
export const DEFAULT_ZOOMED_IN_LAT_LON_DELTA = 0.0075;
export const SHOW_BICYCLES_LAT_LON_DELTA = 0.025;
const DEFAULT_ZOOMED_OUT_LAT_LON_DELTA = 20;

const cityPins = cityList.cities.map(c => ({
  id: c.id,
  pos: { latitude: c.center.lat, longitude: c.center.lon },
  image: Image.resolveAssetSource(cityIcons[c.id]).uri,
  bounds: { topLeft: c.topLeft, bottomRight: c.bottomRight },
}));

class Urbi extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: DEFAULT_ZOOMED_IN_LAT_LON_DELTA,
        longitudeDelta: DEFAULT_ZOOMED_IN_LAT_LON_DELTA,
      },
      markers: [],
      selected: null,
    };

    this.onMapPress = this.onMapPress.bind(this);
    this.onMapReady = this.onMapReady.bind(this);
    this.onMarkerPress = this.onMarkerPress.bind(this);
    this.generateMarkers = this.generateMarkers.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onCityChange = this.onCityChange.bind(this);
  }

  onMapReady() {
  }

  generateMarkers(city) {
    return vehicleLists[city].vehicles.map(v => (
      <Marker
        key={`${v.provider}-${v.id}`}
        centerOffset={{ x: 0, y: -19.5 }}
        coordinate={{ latitude: v.location.lat, longitude: v.location.lon }}
        image={pins[`ic_pin_${v.provider}`]}
        onPress={this.onMarkerPress(`${v.provider} - ${v.id}`)}
        tracksViewChanges={false}
      />
    ));
  }

  onMapPress() {
    this.setState({ selected: null });
  }

  onMarkerPress(key) {
    return () => this.setState({ selected: key });
  }

  onCityPress(e) {
    ToastAndroid.show(`pressed ${e.nativeEvent.id}`, ToastAndroid.SHORT);
  }

  onCityChange(e) {
    const city = e.nativeEvent.city;
    ToastAndroid.show(`changed city to ${city}`, ToastAndroid.SHORT);
    if (city !== 'unset') {
      this.setState({ markers: this.generateMarkers(city) });
    }
  }

  onRegionChange(region) {
    const maxDelta = Math.max(region.latitudeDelta, region.longitudeDelta);
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
          onPress={this.onMapPress}
          onMapReady={this.onMapReady}
          moveOnMarkerPress={false}
          centerOffsetY={200}
          switchToCityPinsDelta={SWITCH_TO_PINS_LAT_LON_DELTA}
          onRegionChangeComplete={this.onRegionChange}
          cityPins={cityPins}
          onCityPress={this.onCityPress}
          onCityChange={this.onCityChange}
        >
          {this.state.markers}
        </MapView>
        {this.state.selected && (
          <View style={styles.bottomPanel}>
            <Text style={styles.text}>Selected: {this.state.selected}</Text>
          </View>
        )}
      </View>
    );
  }
}

Urbi.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomPanel: {
    backgroundColor: '#ffffff',
    height: 200,
    alignSelf: 'stretch',
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  spinner: {
    position: 'absolute',
    top: 50,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 8,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    backgroundColor: '#ae016d',
  },
});

export default Urbi;
