import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'
import MapView from 'react-native-maps'
import pinImg from './assets/pin.png'

const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height
const LATITUDE = 37.78825
const LONGITUDE = -122.4324
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const SPACE = 0.01

class ClusterMarker extends React.Component {
  constructor(props) {
    super(props)
  }
  handleMapPress({ nativeEvent }) {
    if (!nativeEvent) return
    if (nativeEvent.action === 'marker-press') {
      const { coordinate, id, zoom } = nativeEvent
      if (nativeEvent.count === 1) {
        // single marker
        console.warn('single marker')
      } else {
        // cluster marker
        console.warn('cluster marker')
      }
    } else {
      // Tap on map maybe?
      console.warn('did you tap on map?')
    }
  }
  render() {
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
          onPress={e=>this.handleMapPress(e)}
        >
          <MapView.Marker
            cluster
            coordinate={{
              latitude: LATITUDE + SPACE,
              longitude: LONGITUDE + SPACE,
            }}
            image={pinImg}
          >
          </MapView.Marker>
          <MapView.Marker
            cluster
            coordinate={{
              latitude: LATITUDE - SPACE,
              longitude: LONGITUDE - SPACE,
            }}
            image={pinImg}
          />
          <MapView.Marker
            cluster
            coordinate={{
              latitude: LATITUDE + SPACE,
              longitude: LONGITUDE - SPACE,
            }}
            image={pinImg}
          />
        </MapView>
      </View>
    )
  }
}

ClusterMarker.propTypes = {
  provider: MapView.ProviderPropType,
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
})

module.exports = ClusterMarker
