import React, {useState, useRef, useMemo} from 'react';
import {StyleSheet, View, Dimensions, ScrollView, Button} from 'react-native';
import MapView, {MapViewProps, Marker} from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const LATITUDE = 46.2276;
const LONGITUDE = 2.2137;
const LATITUDE_DELTA = 10;

type KmlEntry = {
  label: string;
  file: string;
};

const kmlFiles = [
  {
    label: 'Remote kmz',
    file: 'https://www.google.com/maps/d/u/0/kml?mid=12u1KMaAe02f5iDEMEYeIcXGaUJd_54Y&cid=mp&cv=czMHwAlgGtA.fr.',
  },
  {
    label: 'Remote kml',
    file: 'https://pastebin.com/raw/5XcSeT0b',
  },
  {
    label: 'Remote kml 2',
    file: 'https://pastebin.com/raw/qwZn8dRU',
  },
] satisfies Array<KmlEntry>;

type MapKmlProps = Pick<MapViewProps, 'provider'>;

const MapKml = ({provider}: MapKmlProps) => {
  const mapRef = useRef<MapView>(null);

  const [selectedKmls, setSelectedKmls] = useState(new Set<KmlEntry>());

  const selectedKmlStr = useMemo<Array<string>>(() => {
    return [...selectedKmls.values()].map(entry => entry.file);
  }, [selectedKmls]);

  const [region] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LATITUDE_DELTA,
  });

  const handleKmlSelection = (kmlFile: KmlEntry) => {
    setSelectedKmls(oldSet => {
      if (oldSet.has(kmlFile)) {
        oldSet.delete(kmlFile);
      } else {
        oldSet.add(kmlFile);
      }
      return new Set([...oldSet]);
    });
  };

  const handleOnKmlReady = () => {
    console.log('onKmlReady called');
    mapRef.current?.animateToRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LATITUDE_DELTA,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={provider}
        style={styles.map}
        kmlSrc={selectedKmlStr}
        onKmlReady={handleOnKmlReady}>
        <Marker coordinate={region} title="Test" description="Test" />
      </MapView>
      <View style={styles.simpleKmlSelectionSheet}>
        <ScrollView>
          {kmlFiles.map(kmlEntry => (
            <Button
              key={kmlEntry.label}
              title={`${kmlEntry.label} ${
                selectedKmls.has(kmlEntry) ? '(selected)' : ''
              }`}
              onPress={() => handleKmlSelection(kmlEntry)}
            />
          ))}
        </ScrollView>
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
  scrollview: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  map: {
    width,
    height,
  },
  simpleKmlSelectionSheet: {
    height: '20%',
  },
});

export default MapKml;
