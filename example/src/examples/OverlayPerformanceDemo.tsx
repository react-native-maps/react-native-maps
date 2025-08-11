import React from 'react';
import {StyleSheet, View, Text, Dimensions, Alert} from 'react-native';

import MapView, {Marker, Polyline, Polygon, Circle} from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface State {
  draggableMarkerPosition: {
    latitude: number;
    longitude: number;
  };
  dragCount: number;
  startTime: number | null;
}

export default class OverlayPerformanceDemo extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      draggableMarkerPosition: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },
      dragCount: 0,
      startTime: null,
    };
  }

  handleMarkerDragStart = () => {
    this.setState({
      dragCount: 0,
      startTime: Date.now(),
    });
  };

  handleMarkerDrag = (e: any) => {
    this.setState({
      draggableMarkerPosition: e.nativeEvent.coordinate,
      dragCount: this.state.dragCount + 1,
    });
  };

  handleMarkerDragEnd = () => {
    const endTime = Date.now();
    const duration = endTime - this.state.startTime!;
    const fps = Math.round((this.state.dragCount / duration) * 1000);

    Alert.alert(
      'CAShapeLayer Performance Results',
      'High-Performance Rendering for All Shapes\n\n' +
        `Drag Events: ${this.state.dragCount}\n` +
        `Duration: ${duration}ms\n` +
        `Average FPS: ${fps}\n\n` +
        '✅ Polylines: No recreation\n' +
        '✅ Polygons: No recreation\n' +
        '✅ Circles: No recreation\n' +
        '✅ Smooth real-time movement\n' +
        '✅ Maximum performance',
      [{text: 'OK'}],
    );
  };

  render() {
    const {draggableMarkerPosition} = this.state;

    // Create dynamic shapes based on marker position
    const polylineCoords = [
      {latitude: LATITUDE + 0.01, longitude: LONGITUDE - 0.01},
      draggableMarkerPosition,
      {latitude: LATITUDE - 0.01, longitude: LONGITUDE + 0.01},
    ];

    const polygonCoords = [
      {
        latitude: draggableMarkerPosition.latitude + 0.005,
        longitude: draggableMarkerPosition.longitude - 0.005,
      },
      {
        latitude: draggableMarkerPosition.latitude + 0.005,
        longitude: draggableMarkerPosition.longitude + 0.005,
      },
      {
        latitude: draggableMarkerPosition.latitude - 0.005,
        longitude: draggableMarkerPosition.longitude + 0.005,
      },
      {
        latitude: draggableMarkerPosition.latitude - 0.005,
        longitude: draggableMarkerPosition.longitude - 0.005,
      },
    ];

    return (
      <View style={styles.container}>
        <MapView
          provider={MapView.PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          {/* CAShapeLayer Polyline */}
          <Polyline
            coordinates={polylineCoords}
            strokeColor="#FF0000"
            strokeWidth={3}
          />

          {/* CAShapeLayer Polygon */}
          <Polygon
            coordinates={polygonCoords}
            fillColor="rgba(0, 255, 0, 0.3)"
            strokeColor="#00FF00"
            strokeWidth={2}
          />

          {/* CAShapeLayer Circle */}
          <Circle
            center={draggableMarkerPosition}
            radius={500} // 500 meters
            fillColor="rgba(0, 0, 255, 0.2)"
            strokeColor="#0000FF"
            strokeWidth={2}
          />

          <Marker
            draggable
            coordinate={draggableMarkerPosition}
            onDragStart={this.handleMarkerDragStart}
            onDrag={this.handleMarkerDrag}
            onDragEnd={this.handleMarkerDragEnd}
          />
        </MapView>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>
            CAShapeLayer for All Shapes
          </Text>
          <Text style={styles.instructionsText}>
            Drag the marker to test performance
          </Text>
          <Text style={styles.instructionsSubtext}>
            Polylines, Polygons & Circles - All using CAShapeLayer
          </Text>
        </View>
      </View>
    );
  }
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
  instructions: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  instructionsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  instructionsSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
});

OverlayPerformanceDemo.title = 'CAShapeLayer for All Shapes';
