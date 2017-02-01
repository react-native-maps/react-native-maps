import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import MapView from 'react-native-maps';

import darthImg from './assets/Darth.jpg';
import ersoJImg from './assets/ErsoJ.jpg';
import ersoEImg from './assets/ErsoE.jpg';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      boundsImg1: [
        [LATITUDE - SPACE, LONGITUDE + SPACE],
        [LATITUDE + SPACE, LONGITUDE - SPACE],
      ],
      boundsImg2: [
        [LATITUDE - SPACE, LONGITUDE - (SPACE / 2)],
        [LATITUDE + SPACE, LONGITUDE - (SPACE * 2)],
      ],
      boundsImg3: [
        [LATITUDE - SPACE, LONGITUDE - SPACE],
        [LATITUDE + SPACE, LONGITUDE + SPACE],
      ],
    };
  }

  render() {
    const { region, boundsImg1, boundsImg2, boundsImg3 } = this.state;

    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={region}
          zoomEnabled={false}
        >
          <MapView.Overlay
            name="Darth"
            image={darthImg}
            bounds={boundsImg1}
            rotation={0}
            transparency={0.7}
            zIndex={0}
            region={region}
          />
          <MapView.Overlay
            name="Erso J."
            image={ersoJImg}
            bounds={boundsImg2}
            rotation={-10}
            transparency={0}
            zIndex={1}
            region={region}
          />
          <MapView.Overlay
            name="Erso E."
            image={ersoEImg}
            bounds={boundsImg3}
            rotation={10}
            transparency={0.3}
            zIndex={10}
            region={region}
          />
        </MapView>
      </View>
    );
  }
}

App.propTypes = {
  provider: MapView.ProviderPropType,
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
});

module.exports = App;
