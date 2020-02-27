import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapView, { Callout, Marker, ProviderPropType } from 'react-native-maps';
import PriceMarker from './PriceMarker';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class ViewsAsMarkers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      coordinate: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },
      amount: 99,
    };
  }

  increment() {
    this.setState({ amount: this.state.amount + 1 });
  }

  decrement() {
    this.setState({ amount: this.state.amount - 1 });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
        >
          <Marker coordinate={this.state.coordinate}>
            <PriceMarker amount={this.state.amount} />
          </Marker>

          <Marker
            coordinate={{
              latitude: LATITUDE,
              longitude: LONGITUDE + 0.01,
            }}
            tracksViewChanges={true}
            tracksInfoWindowChanges={true}
          >
            <Image
              style={styles.image}
              source={{
                uri:
                  'https://media.tenor.com/images/c674ba98c40f6793eaf10a1356c1c36a/tenor.gif',
              }}
            />
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text>this is callout</Text>
                <Image
                  style={styles.image}
                  source={{
                    uri:
                      'https://media.tenor.com/images/c674ba98c40f6793eaf10a1356c1c36a/tenor.gif',
                  }}
                />
              </View>
              <View style={styles.arrow} />
            </Callout>
          </Marker>
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.decrement()}
            style={[styles.bubble, styles.button]}
          >
            <Text style={styles.ammountButton}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.increment()}
            style={[styles.bubble, styles.button]}
          >
            <Text style={styles.ammountButton}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

ViewsAsMarkers.propTypes = {
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
  ammountButton: { fontSize: 20, fontWeight: 'bold' },
  image: { width: 50, height: 50 },
  calloutContainer: {
    width: 120,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: 'red',
    alignSelf: 'center',
  },
});

export default ViewsAsMarkers;
