import {withAndroidManifest, type ConfigPlugin} from '@expo/config-plugins';
import type {ConfigPluginProps} from './types';
import {
  addMetaDataItemToMainApplication,
  getMainApplicationOrThrow,
  removeMetaDataItemFromMainApplication,
} from '@expo/config-plugins/build/android/Manifest';

const withMapsAndroid: ConfigPlugin<ConfigPluginProps> = (config, props) => {
  config = withAndroidManifest(config, async conf => {
    const manifest = conf.modResults;

    const mainApplication = getMainApplicationOrThrow(manifest);

    if (props?.androidGoogleMapsApiKey) {
      addMetaDataItemToMainApplication(
        mainApplication,
        'com.google.android.geo.API_KEY',
        props?.androidGoogleMapsApiKey,
      );
    } else {
      removeMetaDataItemFromMainApplication(
        mainApplication,
        'com.google.android.geo.API_KEY',
      );
    }

    return conf;
  });

  return config;
};

export default withMapsAndroid;
