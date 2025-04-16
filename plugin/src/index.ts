import {withMapsIOS} from './ios';
import withMapsAndroid from './android';

import {ConfigPlugin} from '@expo/config-plugins';
import {ConfigPluginProps} from './types';

const withMaps: ConfigPlugin<ConfigPluginProps> = (config, props) => {
  config = withMapsIOS(config, props);
  config = withMapsAndroid(config, props);

  return config;
};

export default withMaps;
