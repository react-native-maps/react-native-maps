import React from 'react';
import {StyleSheet, View, Dimensions, ScrollView, Button} from 'react-native';
import MapView, {Marker, type MapViewProps} from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class ThemeMap extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      userInterfaceStyle: 'system' as MapViewProps['userInterfaceStyle'],
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollview}>
          <View style={styles.buttonContainer}>
            {(['system', 'light', 'dark'] as const).map(userInterfaceStyle => (
              <Button
                key={userInterfaceStyle + this.state.userInterfaceStyle}
                title={userInterfaceStyle}
                onPress={() => this.setState({userInterfaceStyle})}
                color={
                  this.state.userInterfaceStyle === userInterfaceStyle
                    ? 'blue'
                    : undefined
                }
              />
            ))}
          </View>

          <MapView
            provider={this.props.provider}
            style={styles.map}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            initialRegion={this.state.region}
            userInterfaceStyle={this.state.userInterfaceStyle}>
            <Marker
              title="This is a title"
              description="This is a description"
              coordinate={this.state.region}
            />
          </MapView>
        </ScrollView>
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
  scrollview: {
    alignItems: 'center',
    paddingVertical: 70,
  },
  map: {
    width: width - 40,
    height: width - 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10,
  },
});

export default ThemeMap;
