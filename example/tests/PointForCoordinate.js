import React, { Component } from 'react';
import { NativeModules } from 'react-native';

const { TestModule } = NativeModules;

export default class PointForCoordinateTest extends Component {
  componentDidMount() {
    if (TestModule == null) {
      throw new Error('TestModule not registered');
    }
    TestModule.markTestCompleted();
  }

  render() {
    return null;
  }
}
