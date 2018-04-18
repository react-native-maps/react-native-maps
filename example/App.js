import React from 'react';
import {
  Platform,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Switch,
} from 'react-native';
import { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import DisplayLatLng from './examples/DisplayLatLng';
import ViewsAsMarkers from './examples/ViewsAsMarkers';
import EventListener from './examples/EventListener';
import MarkerTypes from './examples/MarkerTypes';
import DraggableMarkers from './examples/DraggableMarkers';
import PolygonCreator from './examples/PolygonCreator';
import PolylineCreator from './examples/PolylineCreator';
import GradientPolylines from './examples/GradientPolylines';
import AnimatedViews from './examples/AnimatedViews';
import AnimatedMarkers from './examples/AnimatedMarkers';
import Callouts from './examples/Callouts';
import Overlays from './examples/Overlays';
import DefaultMarkers from './examples/DefaultMarkers';
import CustomMarkers from './examples/CustomMarkers';
import CachedMap from './examples/CachedMap';
import LoadingMap from './examples/LoadingMap';
import TakeSnapshot from './examples/TakeSnapshot';
import FitToSuppliedMarkers from './examples/FitToSuppliedMarkers';
import FitToCoordinates from './examples/FitToCoordinates';
import LiteMapView from './examples/LiteMapView';
import CustomTiles from './examples/CustomTiles';
import ZIndexMarkers from './examples/ZIndexMarkers';
import StaticMap from './examples/StaticMap';
import MapStyle from './examples/MapStyle';
import LegalLabel from './examples/LegalLabel';
import SetNativePropsOverlays from './examples/SetNativePropsOverlays';
import CustomOverlay from './examples/CustomOverlay';
import BugMarkerWontUpdate from './examples/BugMarkerWontUpdate';
import ImageOverlayWithAssets from './examples/ImageOverlayWithAssets';
import ImageOverlayWithURL from './examples/ImageOverlayWithURL';

const IOS = Platform.OS === 'ios';
const ANDROID = Platform.OS === 'android';

function makeExampleMapper(useGoogleMaps) {
  if (useGoogleMaps) {
    return example => [
      example[0],
      [example[1], example[3]].filter(Boolean).join(' '),
    ];
  }
  return example => example;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Component: null,
      useGoogleMaps: ANDROID,
    };
  }

  renderExample([Component, title]) {
    return (
      <TouchableOpacity
        key={title}
        style={styles.button}
        onPress={() => this.setState({ Component })}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
    );
  }

  renderBackButton() {
    return (
      <TouchableOpacity
        style={styles.back}
        onPress={() => this.setState({ Component: null })}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 30 }}>&larr;</Text>
      </TouchableOpacity>
    );
  }

  renderGoogleSwitch() {
    return (
      <View>
        <Text>Use GoogleMaps?</Text>
        <Switch
          onValueChange={(value) => this.setState({ useGoogleMaps: value })}
          style={{ marginBottom: 10 }}
          value={this.state.useGoogleMaps}
        />
      </View>
    );
  }

  renderExamples(examples) {
    const {
      Component,
      useGoogleMaps,
    } = this.state;

    return (
      <View style={styles.container}>
        {Component && <Component provider={useGoogleMaps ? PROVIDER_GOOGLE : PROVIDER_DEFAULT} />}
        {Component && this.renderBackButton()}
        {!Component &&
          <ScrollView
            style={StyleSheet.absoluteFill}
            contentContainerStyle={styles.scrollview}
            showsVerticalScrollIndicator={false}
          >
            {IOS && this.renderGoogleSwitch()}
            {examples.map(example => this.renderExample(example))}
          </ScrollView>
        }
      </View>
    );
  }

  render() {
    return this.renderExamples([
      // [<component>, <component description>, <Google compatible>, <Google add'l description>]
      [StaticMap, 'StaticMap', true],
      [DisplayLatLng, 'Tracking Position', true, '(incomplete)'],
      [ViewsAsMarkers, 'Arbitrary Views as Markers', true],
      [EventListener, 'Events', true, '(incomplete)'],
      [MarkerTypes, 'Image Based Markers', true],
      [DraggableMarkers, 'Draggable Markers', true],
      [PolygonCreator, 'Polygon Creator', true],
      [PolylineCreator, 'Polyline Creator', true],
      [GradientPolylines, 'Gradient Polylines', true],
      [AnimatedViews, 'Animating with MapViews'],
      [AnimatedMarkers, 'Animated Marker Position'],
      [Callouts, 'Custom Callouts', true],
      [Overlays, 'Circles, Polygons, and Polylines', true],
      [DefaultMarkers, 'Default Markers', true],
      [CustomMarkers, 'Custom Markers', true],
      [TakeSnapshot, 'Take Snapshot', true, '(incomplete)'],
      [CachedMap, 'Cached Map'],
      [LoadingMap, 'Map with loading'],
      [FitToSuppliedMarkers, 'Focus Map On Markers', true],
      [FitToCoordinates, 'Fit Map To Coordinates', true],
      [LiteMapView, 'Android Lite MapView'],
      [CustomTiles, 'Custom Tiles', true],
      [ZIndexMarkers, 'Position Markers with Z-index', true],
      [MapStyle, 'Customize the style of the map', true],
      [LegalLabel, 'Reposition the legal label', true],
      [SetNativePropsOverlays, 'Update native props', true],
      [CustomOverlay, 'Custom Overlay Component', true],
      [BugMarkerWontUpdate, 'BUG: Marker Won\'t Update (Android)', true],
      [ImageOverlayWithAssets, 'Image Overlay Component with Assets', true],
      [ImageOverlayWithURL, 'Image Overlay Component with URL', true],
    ]
    // Filter out examples that are not yet supported for Google Maps on iOS.
    .filter(example => ANDROID || (IOS && (example[2] || !this.state.useGoogleMaps)))
    .map(makeExampleMapper(IOS && this.state.useGoogleMaps))
    );
  }
}

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
  button: {
    flex: 1,
    marginTop: 10,
    backgroundColor: 'rgba(220,220,220,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    padding: 12,
    borderRadius: 20,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
