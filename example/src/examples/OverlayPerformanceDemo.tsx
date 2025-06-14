import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';

import MapView, {Marker, Polyline, Polygon, Circle} from 'react-native-maps';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

type OverlayType = 'polyline' | 'polygon' | 'circle';

interface State {
  draggableMarkerPosition: {
    latitude: number;
    longitude: number;
  };
  dragCount: number;
  startTime: number | null;
  activeOverlay: OverlayType;
}

class OverlayPerformanceDemo extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      draggableMarkerPosition: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },
      dragCount: 0,
      startTime: null,
      activeOverlay: 'polyline',
    };
  }

  // Static points for overlays
  staticPoint1 = {
    latitude: LATITUDE - 0.002,
    longitude: LONGITUDE - 0.002,
  };

  staticPoint2 = {
    latitude: LATITUDE + 0.002,
    longitude: LONGITUDE + 0.002,
  };

  staticPoint3 = {
    latitude: LATITUDE + 0.002,
    longitude: LONGITUDE - 0.002,
  };

  staticPoint4 = {
    latitude: LATITUDE - 0.002,
    longitude: LONGITUDE + 0.002,
  };

  handleMarkerDragStart = () => {
    this.setState({
      startTime: Date.now(),
      dragCount: 0,
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
      `${this.state.activeOverlay.toUpperCase()} Performance Results`,
      `Duration: ${duration}ms\nUpdates: ${this.state.dragCount}\nEffective FPS: ${fps}\n\nNative iOS optimizations (60fps batching) should provide smooth rendering without stuttering.`,
    );
  };

  switchOverlay = (overlayType: OverlayType) => {
    this.setState({activeOverlay: overlayType});
  };

  renderPolylines() {
    const {draggableMarkerPosition} = this.state;

    return (
      <>
        {/* Main polyline */}
        <Polyline
          coordinates={[
            this.staticPoint1,
            draggableMarkerPosition,
            this.staticPoint2,
          ]}
          strokeColor="#0000FF"
          strokeWidth={4}
          geodesic={false}
          lineCap="round"
          lineJoin="round"
        />

        {/* Additional polylines for stress testing */}
        <Polyline
          coordinates={[
            {
              ...this.staticPoint1,
              latitude: this.staticPoint1.latitude + 0.001,
            },
            {
              ...draggableMarkerPosition,
              latitude: draggableMarkerPosition.latitude + 0.001,
            },
            {
              ...this.staticPoint2,
              latitude: this.staticPoint2.latitude + 0.001,
            },
          ]}
          strokeColor="#FF0000"
          strokeWidth={3}
          geodesic={false}
        />

        <Polyline
          coordinates={[
            {
              ...this.staticPoint1,
              latitude: this.staticPoint1.latitude - 0.001,
            },
            {
              ...draggableMarkerPosition,
              latitude: draggableMarkerPosition.latitude - 0.001,
            },
            {
              ...this.staticPoint2,
              latitude: this.staticPoint2.latitude - 0.001,
            },
          ]}
          strokeColor="#00FF00"
          strokeWidth={3}
          geodesic={false}
        />
      </>
    );
  }

  renderPolygons() {
    const {draggableMarkerPosition} = this.state;

    return (
      <>
        {/* Main polygon */}
        <Polygon
          coordinates={[
            this.staticPoint1,
            draggableMarkerPosition,
            this.staticPoint2,
            this.staticPoint3,
          ]}
          fillColor="rgba(0, 0, 255, 0.3)"
          strokeColor="#0000FF"
          strokeWidth={3}
        />

        {/* Additional polygons for stress testing */}
        <Polygon
          coordinates={[
            {
              ...this.staticPoint1,
              latitude: this.staticPoint1.latitude + 0.0015,
            },
            {
              ...draggableMarkerPosition,
              latitude: draggableMarkerPosition.latitude + 0.0015,
            },
            {
              ...this.staticPoint2,
              latitude: this.staticPoint2.latitude + 0.0015,
            },
            {
              ...this.staticPoint3,
              latitude: this.staticPoint3.latitude + 0.0015,
            },
          ]}
          fillColor="rgba(255, 0, 0, 0.2)"
          strokeColor="#FF0000"
          strokeWidth={2}
        />

        <Polygon
          coordinates={[
            {
              ...this.staticPoint1,
              latitude: this.staticPoint1.latitude - 0.0015,
            },
            {
              ...draggableMarkerPosition,
              latitude: draggableMarkerPosition.latitude - 0.0015,
            },
            {
              ...this.staticPoint2,
              latitude: this.staticPoint2.latitude - 0.0015,
            },
            {
              ...this.staticPoint3,
              latitude: this.staticPoint3.latitude - 0.0015,
            },
          ]}
          fillColor="rgba(0, 255, 0, 0.2)"
          strokeColor="#00FF00"
          strokeWidth={2}
        />
      </>
    );
  }

  renderCircles() {
    const {draggableMarkerPosition} = this.state;

    // Calculate distance from draggable marker to static point for dynamic radius
    const distance =
      Math.sqrt(
        Math.pow(
          draggableMarkerPosition.latitude - this.staticPoint1.latitude,
          2,
        ) +
          Math.pow(
            draggableMarkerPosition.longitude - this.staticPoint1.longitude,
            2,
          ),
      ) * 111000; // Convert to meters (approximate)

    return (
      <>
        {/* Main circle with dynamic radius */}
        <Circle
          center={draggableMarkerPosition}
          radius={Math.max(100, distance)}
          fillColor="rgba(0, 0, 255, 0.3)"
          strokeColor="#0000FF"
          strokeWidth={3}
        />

        {/* Additional circles for stress testing */}
        <Circle
          center={this.staticPoint1}
          radius={200}
          fillColor="rgba(255, 0, 0, 0.2)"
          strokeColor="#FF0000"
          strokeWidth={2}
        />

        <Circle
          center={this.staticPoint2}
          radius={150}
          fillColor="rgba(0, 255, 0, 0.2)"
          strokeColor="#00FF00"
          strokeWidth={2}
        />

        <Circle
          center={{
            latitude:
              (this.staticPoint1.latitude + this.staticPoint2.latitude) / 2,
            longitude:
              (this.staticPoint1.longitude + this.staticPoint2.longitude) / 2,
          }}
          radius={Math.max(50, distance / 2)}
          fillColor="rgba(255, 255, 0, 0.2)"
          strokeColor="#FFFF00"
          strokeWidth={2}
        />
      </>
    );
  }

  render() {
    const {draggableMarkerPosition, activeOverlay} = this.state;

    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={false}
          showsIndoors={false}
          showsIndoorLevelPicker={false}>
          {/* Static markers */}
          <Marker
            coordinate={this.staticPoint1}
            pinColor="green"
            title="Static Point 1"
            tracksViewChanges={false}
          />
          <Marker
            coordinate={this.staticPoint2}
            pinColor="red"
            title="Static Point 2"
            tracksViewChanges={false}
          />

          {/* Draggable marker */}
          <Marker
            draggable
            coordinate={draggableMarkerPosition}
            onDragStart={this.handleMarkerDragStart}
            onDrag={this.handleMarkerDrag}
            onDragEnd={this.handleMarkerDragEnd}
            pinColor="blue"
            title="Drag me!"
            description={`Test ${activeOverlay} performance`}
            tracksViewChanges={false}
          />

          {/* Render active overlay type */}
          {activeOverlay === 'polyline' && this.renderPolylines()}
          {activeOverlay === 'polygon' && this.renderPolygons()}
          {activeOverlay === 'circle' && this.renderCircles()}
        </MapView>

        {/* Overlay type selector */}
        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={[
              styles.selectorButton,
              activeOverlay === 'polyline' && styles.activeButton,
            ]}
            onPress={() => this.switchOverlay('polyline')}>
            <Text
              style={[
                styles.selectorText,
                activeOverlay === 'polyline' && styles.activeText,
              ]}>
              Polyline
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectorButton,
              activeOverlay === 'polygon' && styles.activeButton,
            ]}
            onPress={() => this.switchOverlay('polygon')}>
            <Text
              style={[
                styles.selectorText,
                activeOverlay === 'polygon' && styles.activeText,
              ]}>
              Polygon
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectorButton,
              activeOverlay === 'circle' && styles.activeButton,
            ]}
            onPress={() => this.switchOverlay('circle')}>
            <Text
              style={[
                styles.selectorText,
                activeOverlay === 'circle' && styles.activeText,
              ]}>
              Circle
            </Text>
          </TouchableOpacity>
        </View>

        {/* Performance info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            {activeOverlay.toUpperCase()} Performance Test
          </Text>
          <Text style={styles.infoText}>
            🔵 Drag the blue marker to test performance
          </Text>
          <Text style={styles.infoText}>
            📊 Results will show after dragging
          </Text>
          <Text style={styles.infoText}>
            ⚡ Native iOS optimizations (60fps batching)
          </Text>
          <Text style={styles.dragText}>Updates: {this.state.dragCount}</Text>
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
  selectorContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 5,
  },
  selectorButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeText: {
    color: 'white',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dragText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 8,
    textAlign: 'center',
  },
});

OverlayPerformanceDemo.title = 'Overlay Performance Demo';

export default OverlayPerformanceDemo;
