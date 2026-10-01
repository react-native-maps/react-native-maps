import {name} from '../../package.json';
import type {ConfigPluginProps} from './types';

const reactNativeMapsExpoPlugin = (
  props: ConfigPluginProps = {},
): [typeof name, ConfigPluginProps] => [name, props];

export default reactNativeMapsExpoPlugin;
