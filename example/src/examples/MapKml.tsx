import React, {useState, useRef, useMemo} from 'react';
import { StyleSheet, View, Dimensions, ScrollView, Button } from 'react-native';
import MapView, {MapViewProps, Marker} from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const LATITUDE = 46.2276;
const LONGITUDE = 2.2137;
const LATITUDE_DELTA = 10;

const kmlFiles = [
  'https://pastebin.com/raw/5XcSeT0b',
  'https://pastebin.com/raw/jAzGpq1F',
  'https://pastebin.com/raw/qwZn8dRU',
];

type MapKmlProps = Pick<MapViewProps, 'provider'>

const MapKml = ({ provider }: MapKmlProps) => {
  const mapRef = useRef<MapView>(null);

  const [selectedKmls, setSelectedKmls] = useState(new Set<string>());

  const selectedKmlStr = useMemo<Array<string>>(()=> {
    return [...selectedKmls.values()];
  }, [selectedKmls]);

  const [region] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LATITUDE_DELTA,
  });

  const handleKmlSelection = (kmlFile: string) => {
    setSelectedKmls(oldSet => {
      if (oldSet.has(kmlFile)) {
        oldSet.delete(kmlFile);
      }else{
        oldSet.add(kmlFile);
      }
        return new Set([...oldSet]);
    });
  };

  const handleOnKmlReady = () => {
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
        onKmlReady={handleOnKmlReady}
      >
        <Marker
          coordinate={region}
          title="Test"
          description="Test"
        />
      </MapView>
      <View style={styles.simpleKmlSelectionSheet}>
        <ScrollView>
          {kmlFiles.map((kmlFile, index) => (
            <Button
              key={kmlFile}
              title={`file ${index} ${selectedKmls.has(kmlFile) ? '(selected)' : ''}`}
              onPress={() => handleKmlSelection(kmlFile)}
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
