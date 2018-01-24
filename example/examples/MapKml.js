import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import MapView from 'react-native-maps';
// import RNFS from 'react-native-fs';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = -18.9193508;
const LONGITUDE = -48.2830592;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class MapKml extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      kmlFile: './assets/ula.kml',
    };
  }

  componentWillMount() {
    // console.log(RNFS.DocumentDirectoryPath);
    // const formUrl = 'https://pastebin.com/raw/XftaUixU';
    // const downloadDest = `${RNFS.DocumentDirectoryPath}/ula.kml`;
    // const options = {
    //   fromUrl: formUrl,
    //   toFile: downloadDest,
    //   background: true,
    //   begin: (res) => {
    //     console.log(res);
    //   },
    //   progress: (res) => {
    //     console.log('progress', res);
    //   },
    // };

    // const ret = RNFS.downloadFile(options);
    // ret.promise.then(res => {
    //   console.log(res);
    //   this.setState({
    //     kmlFile: downloadDest,
    //   });
    // });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          scrollEnabled
          zoomEnabled
          pitchEnabled
          rotateEnabled
          initialRegion={this.state.region}
          kmlMap={this.state.kmlFile}
        />
      </View>
    );
  }
}

MapKml.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
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
});

module.exports = MapKml;
