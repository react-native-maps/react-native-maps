import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapView, {MapMarker, Marker} from 'react-native-maps';
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const AnimatedMarkers = () => {
  const markerRef = useRef<MapMarker>(null);
  // Shared values for latitude and longitude
  const latitude = useSharedValue(LATITUDE);
  const longitude = useSharedValue(LONGITUDE);

  // Function to animate marker position
  const animateMarkerPosition = () => {
    const newLatitude = LATITUDE + (Math.random() - 0.5) * (LATITUDE_DELTA / 2);
    const newLongitude =
      LONGITUDE + (Math.random() - 0.5) * (LONGITUDE_DELTA / 2);

    latitude.value = withTiming(newLatitude, {duration: 1000});
    longitude.value = withTiming(newLongitude, {duration: 1000});
  };

  // Derived value to trigger marker updates
  const updateMarkerPosition = (lat: number, lng: number) => {
    if (markerRef && markerRef.current) {
      markerRef.current.setNativeProps({
        coordinate: {latitude: lat, longitude: lng},
      });
    }
  };

  // Use useDerivedValue to react to changes in latitude and longitude
  useDerivedValue(() => {
    const lat = latitude.value;
    const lng = longitude.value;
    // Use runOnJS to call updateMarkerPosition from the UI thread
    // runOnJS requires functions to be called with their arguments
    runOnJS(updateMarkerPosition)(lat, lng);
  }, [latitude, longitude]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}>
        <Marker
          ref={markerRef}
          coordinate={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
          }}
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={animateMarkerPosition}
          style={[styles.bubble, styles.button]}>
          <Text>Animate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
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
});

export default AnimatedMarkers;
