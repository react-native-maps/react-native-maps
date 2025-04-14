import {ConfigPlugin, withAndroidManifest} from '@expo/config-plugins';
import {ConfigPluginProps} from './types';
import {
  addMetaDataItemToMainApplication,
  getMainApplicationOrThrow,
  removeMetaDataItemFromMainApplication,
} from '@expo/config-plugins/build/android/Manifest';

const withMapsAndroid: ConfigPlugin<ConfigPluginProps> = (config, props) => {
  config = withAndroidManifest(config, async config => {
    const manifest = config.modResults;

    const mainApplication = getMainApplicationOrThrow(manifest);

    if (props.androidGoogleMapsApiKey) {
      addMetaDataItemToMainApplication(
        mainApplication,
        'com.google.android.geo.API_KEY',
        props.androidGoogleMapsApiKey,
      );
    } else {
      removeMetaDataItemFromMainApplication(
        mainApplication,
        'com.google.android.geo.API_KEY',
      );
    }

    return config;
  });

  return config;
};

export default withMapsAndroid;
