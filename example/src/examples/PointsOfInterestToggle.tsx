import React, {useState} from 'react';
import {StyleSheet, View, Text, Dimensions, Switch} from 'react-native';
import MapView from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function PointsOfInterestToggle() {
  const [showsPointsOfInterest, setShowsPointsOfInterest] = useState(false);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        showsPointsOfInterest={showsPointsOfInterest}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.control}>
          <Text style={styles.label}>Shows Points of Interest:</Text>
          <Switch
            value={showsPointsOfInterest}
            onValueChange={setShowsPointsOfInterest}
          />
        </View>
        <Text style={styles.description}>
          Toggle to show/hide points of interest (restaurants, shops, etc.) on
          the map.
          {'\n'}This only works on Apple Maps (iOS).
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    margin: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
