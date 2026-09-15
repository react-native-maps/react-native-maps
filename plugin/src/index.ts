import {name, version} from '../../package.json';
import {withMapsIOS} from './ios';
import withMapsAndroid from './android';

import {type ConfigPlugin, createRunOncePlugin} from '@expo/config-plugins';
import type {ConfigPluginProps} from './types';

const withMaps: ConfigPlugin<ConfigPluginProps> = (config, props) => {
  config = withMapsIOS(config, props);
  config = withMapsAndroid(config, props);

  return config;
};

export default createRunOncePlugin(withMaps, name, version);
