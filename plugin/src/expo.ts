import {name} from '../../package.json';
import type {ConfigPluginProps} from './types';

export default (
  props: ConfigPluginProps = {},
): [typeof name, ConfigPluginProps] => [name, props];
