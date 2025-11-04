import type { ConfigPlugin } from '@expo/config-plugins/build/Plugin.types';
import { type MergeResults } from '@expo/config-plugins/build/utils/generateCode';
import type { ConfigPluginProps } from './types';
export declare const MATCH_INIT: RegExp;
export declare const withMapsIOS: ConfigPlugin<ConfigPluginProps>;
export declare function addGoogleMapsAppDelegateImport(src: string): MergeResults;
export declare function removeGoogleMapsAppDelegateImport(src: string): MergeResults;
export declare function addGoogleMapsAppDelegateInit(src: string, apiKey: string): MergeResults;
export declare function removeGoogleMapsAppDelegateInit(src: string): MergeResults;
/**
 * @param src The contents of the Podfile.
 * @param useGoogleMaps if GoogleMaps for iOS is used
 * @returns Podfile with react-native-maps integration configured.
 */
export declare function addMapsCocoapods(src: string, useGoogleMaps: boolean): MergeResults;
