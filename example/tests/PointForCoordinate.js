import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NativeModules } from 'react-native';
import MapView from 'react-native-maps';

const { TestModule } = NativeModules;

export default class PointForCoordinateTest extends Component {
  async componentDidMount() {
    if (TestModule == null) {
      throw new Error('TestModule not registered');
    }
    if (this.map == null) {
      throw new Error('MapView ref is null');
    }
    const point = await this.map.pointForCoordinate({
      latitude: 37.78825,
      longitude: -122.4324,
    });
    if (point != null) {
      TestModule.markTestCompleted();
    } else {
      throw new Error(point);
    }
  }

  render() {
    const { provider } = this.props;
    return (
      <MapView
        ref={map => {
          this.map = map;
        }}
        provider={provider}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    );
  }
}

PointForCoordinateTest.propTypes = {
  provider: PropTypes.string,
};
