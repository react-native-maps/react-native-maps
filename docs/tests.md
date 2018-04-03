# Testing

## iOS integration tests

These tests exist to test the boundary between the JS & iOS native code.

We use `RCTTest`, which is part of React Native, and is also used to [test React Native](https://facebook.github.io/react-native/docs/testing.html#ios).

### Running the tests

1. Run `npm run build:ios`/`yarn build:ios` to install the native dependencies.
2. Open `example/ios/AirMapsExplorer.xcworkspace` in Xcode - _make sure to open the workspace, not the project!_
3. Make sure the packager is running, using `npm start`/`yarn start`.
4. Run the tests by pressing ⌘-U or clicking on _Product -> Test_.

You should then get a notifaction once the tests have passed or failed.

### Adding a new test

In this example, we will be writing a new test called `EverythingWorks`.

1. Register the test on the iOS side, in [`example/ios/AirMapsExplorerTests/AirMapsExplorerTests.m`](../example/ios/AirMapsExplorerTests/AirMapsExplorerTests.m):

    ```objective-c
    MAPS_TEST(EverythingWorks);
    ```

    `MAPS_TEST` is a macro which runs a test several times, once for every supported Maps API.

2. Add a new test component in the [`example/tests/`](../example/tests/) directory: `example/tests/EverythingWorks.js`

    ```js
    import React, { Component } from 'react';
    import PropTypes from 'prop-types';
    import { NativeModules } from 'react-native';
    import MapView from 'react-native-maps';

    const { TestModule } = NativeModules;

    export default class EverythingWorksTest extends Component {
      componentDidMount() {
        // To make your test fail, throw an exception.
        if (TestModule == null) {
          throw new Error('TestModule not registered');
        }
        // Call this method if your test has passed successfully.
        TestModule.markTestCompleted();
      }

      render() {
        // The test will be run once for every supported provider.
        // Make sure to pass the provider to MapView.
        const { provider } = this.props;
        return (
          <MapView
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

    EverythingWorksTest.propTypes = {
      provider: PropTypes.string,
    };
    ```

3. Export your test in [`example/tests/index.js`](../example/tests/index.js):

    ```js
    import EverythingWorks from './EverythingWorks';

    export default {
      // ...other tests
      EverythingWorks,
    };
    ```

    The exported name needs to match up to the name of the test on the native side, otherwise the test runner will not be able to run the test.
