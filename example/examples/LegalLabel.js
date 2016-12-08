import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';

import MapView from 'react-native-maps';

const screen = Dimensions.get('window');

class LegalLabel extends React.Component {
  static propTypes = {
    provider: MapView.ProviderPropType,
  }

  render() {
    const latlng = {
      latitude: 37.78825,
      longitude: -122.4324,
    };

    const ASPECT_RATIO = screen.width / screen.height;
    const LATITUDE_DELTA = 0.0922;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    return (
      <View style={{ ...StyleSheet.absoluteFillObject }}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          legalLabelInsets={{ bottom: 10, right: 10 }}
          initialRegion={{
            ...latlng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <MapView.Marker coordinate={latlng} />
        </MapView>

        <View style={styles.username}>
          <Text style={styles.usernameText}>Username</Text>
        </View>

        <View style={styles.bio}>
          <Text style={styles.bioText}>
            Bio description lorem ipsum Ullamco exercitation
            aliqua ullamco nostrud dolor et aliquip fugiat do
            aute fugiat velit in aliqua sit.
          </Text>
        </View>

        <View style={styles.photo}>
          <View style={styles.photoInner}>
            <Text style={styles.photoText}>
              Profile Photo
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const padding = 10;
const photoSize = 80;
const mapHeight = screen.height - 130;
const styles = StyleSheet.create({
  bio: {
    marginHorizontal: padding,
    marginBottom: 0,
    paddingVertical: padding / 2,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 16 * 1.5,
  },
  username: {
    paddingLeft: photoSize + padding + padding,
    paddingTop: padding,
  },
  usernameText: {
    fontSize: 36,
    lineHeight: 36,
  },
  photo: {
    padding: 2,
    position: 'absolute',
    top: mapHeight - (photoSize / 2),
    left: padding,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
    width: photoSize,
    height: photoSize,
  },
  photoInner: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  photoText: {
    fontSize: 9,
    textAlign: 'center',
  },
  map: {
    height: mapHeight,
  },
});

module.exports = LegalLabel;
