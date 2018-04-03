import React, { Component } from 'react';
import { AppRegistry, NativeModules, Text, View } from 'react-native';

import tests from './tests/';

const { TestModule } = NativeModules;

class Tests extends Component {
  render() {
    return (
      <View>
        <Text>TestModule loaded: {!!TestModule}</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('Tests', () => Tests);

Object.entries(tests).forEach(([name, component]) => {
  AppRegistry.registerComponent(name, () => component);
});
