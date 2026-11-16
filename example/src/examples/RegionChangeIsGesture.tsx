import React, {useCallback, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {
  type Details,
  type MapViewProps,
  type Region,
} from 'react-native-maps';

const SAN_FRANCISCO: Region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const OAKLAND: Region = {
  latitude: 37.8044,
  longitude: -122.2712,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const BAY_AREA_POINTS = [
  {latitude: 37.7749, longitude: -122.4194},
  {latitude: 37.8716, longitude: -122.2727},
  {latitude: 37.5485, longitude: -121.9886},
];

type EventName = 'Start' | 'Change' | 'Complete';

type LogEntry = {
  id: number;
  event: EventName;
  isGesture: boolean;
  count: number;
};

let nextId = 0;

const RegionChangeIsGesture = ({provider}: Pick<MapViewProps, 'provider'>) => {
  const mapRef = useRef<MapView>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [controlledRegion, setControlledRegion] = useState<Region>();

  const record = useCallback((event: EventName, details: Details) => {
    const isGesture = !!details.isGesture;
    setLog(prev => {
      const [last, ...rest] = prev;
      // Collapse consecutive identical events so a gesture fits on screen.
      if (last && last.event === event && last.isGesture === isGesture) {
        return [{...last, count: last.count + 1}, ...rest];
      }
      return [{id: nextId++, event, isGesture, count: 1}, ...prev].slice(0, 50);
    });
  }, []);

  const toggleRegionProp = () =>
    setControlledRegion(current =>
      current === OAKLAND ? SAN_FRANCISCO : OAKLAND,
    );

  const buttons: Array<[string, () => void]> = [
    ['animateToRegion 500', () => mapRef.current?.animateToRegion(OAKLAND)],
    [
      'animateToRegion 0',
      () => mapRef.current?.animateToRegion(SAN_FRANCISCO, 0),
    ],
    ['Toggle region prop', toggleRegionProp],
    [
      'fitToCoordinates',
      () =>
        mapRef.current?.fitToCoordinates(BAY_AREA_POINTS, {
          edgePadding: {top: 40, right: 40, bottom: 40, left: 40},
          animated: true,
        }),
    ],
    ['Clear log', () => setLog([])],
  ];

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={provider}
        style={styles.map}
        initialRegion={SAN_FRANCISCO}
        region={controlledRegion}
        onRegionChangeStart={(_, details) => record('Start', details)}
        onRegionChange={(_, details) => record('Change', details)}
        onRegionChangeComplete={(_, details) => record('Complete', details)}
      />
      <View style={styles.buttons}>
        {buttons.map(([label, onPress]) => (
          <TouchableOpacity key={label} style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        style={styles.log}
        data={log}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <Text style={item.isGesture ? styles.gesture : styles.programmatic}>
            {item.event} isGesture={String(item.isGesture)}
            {item.count > 1 ? ` x${item.count}` : ''}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    flex: 3,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
    backgroundColor: '#eee',
  },
  button: {
    margin: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 12,
  },
  log: {
    flex: 2,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  gesture: {
    fontFamily: 'Courier',
    color: '#0a7d32',
  },
  programmatic: {
    fontFamily: 'Courier',
    color: '#555',
  },
});

export default RegionChangeIsGesture;
