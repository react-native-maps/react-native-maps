import {ConfigPlugin} from '@expo/config-plugins/build/Plugin.types';
import {
  withAppDelegate,
  withInfoPlist,
  withPodfile,
} from '@expo/config-plugins/build/plugins/ios-plugins';

import {
  mergeContents,
  MergeResults,
  removeContents,
} from '@expo/config-plugins/build/utils/generateCode';
import {ConfigPluginProps} from './types';

const debug = require('debug')(
  'expo:config-plugins:ios:maps',
) as typeof console.log;

export const MATCH_INIT =
  /\bsuper\.application\(\w+?, didFinishLaunchingWithOptions: \w+?\)/g;

export const withMapsIOS: ConfigPlugin<ConfigPluginProps> = (config, props) => {
  // Set in Info.plist
  if (props?.iosGoogleMapsApiKey) {
    config = withInfoPlist(config, async config => {
      config.ios.infoPlist.GMSApiKey = props?.iosGoogleMapsApiKey;
      return config;
    });
  }

  // Technically adds react-native-maps (Apple maps) and google maps.
  debug('Google Maps API Key:', props?.iosGoogleMapsApiKey);
  config = withMapsCocoaPods(config, {
    useGoogleMaps: !!props?.iosGoogleMapsApiKey,
  });

  // Adds/Removes AppDelegate setup for Google Maps API on iOS
  config = withGoogleMapsAppDelegate(config, {
    apiKey: props?.iosGoogleMapsApiKey,
  });

  return config;
};

export function addGoogleMapsAppDelegateImport(src: string): MergeResults {
  const newSrc = ['#if canImport(GoogleMaps)', 'import GoogleMaps', '#endif'];

  return mergeContents({
    tag: 'react-native-maps-import',
    src,
    newSrc: newSrc.join('\n'),
    anchor: /@UIApplicationMain/,
    offset: 0,
    comment: '//',
  });
}

export function removeGoogleMapsAppDelegateImport(src: string): MergeResults {
  return removeContents({
    tag: 'react-native-maps-import',
    src,
  });
}

export function addGoogleMapsAppDelegateInit(
  src: string,
  apiKey: string,
): MergeResults {
  const newSrc = [
    '#if canImport(GoogleMaps)',
    `GMSServices.provideAPIKey("${apiKey}")`,
    '#endif',
  ];

  return mergeContents({
    tag: 'react-native-maps-init',
    src,
    newSrc: newSrc.join('\n'),
    anchor: MATCH_INIT,
    offset: 0,
    comment: '//',
  });
}

export function removeGoogleMapsAppDelegateInit(src: string): MergeResults {
  return removeContents({
    tag: 'react-native-maps-init',
    src,
  });
}

/**
 * @param src The contents of the Podfile.
 * @returns Podfile with react-native-maps integration configured.
 */
export function addMapsCocoapods(
  src: string,
  useGoogleMaps: boolean,
): MergeResults {
  let newSrc = `  rn_maps_path = File.dirname(\`node --print "require.resolve('react-native-maps/package.json')"\`) \n`;

  if (useGoogleMaps) {
    newSrc += `  pod 'react-native-google-maps', :path => rn_maps_path \n`;
  }

  newSrc += `  pod 'react-native-maps-generated', :path => rn_maps_path \n`;

  return mergeContents({
    tag: 'react-native-maps',
    src,
    newSrc,
    anchor: /use_native_modules/,
    offset: 0,
    comment: '#',
  });
}

const withMapsCocoaPods: ConfigPlugin<{useGoogleMaps: boolean}> = (
  config,
  {useGoogleMaps},
) => {
  return withPodfile(config, async config => {
    let results: MergeResults;

    try {
      results = addMapsCocoapods(config.modResults.contents, useGoogleMaps);
    } catch (error: any) {
      if (error.code === 'ERR_NO_MATCH') {
        throw new Error(
          `Cannot add react-native-maps to the project's ios/Podfile because it's malformed. Please report this with a copy of your project Podfile.`,
        );
      }
      throw error;
    }

    if (results.didMerge || results.didClear) {
      config.modResults.contents = results.contents;
    }

    return config;
  });
};

const withGoogleMapsAppDelegate: ConfigPlugin<{apiKey: string | null}> = (
  config,
  {apiKey},
) => {
  return withAppDelegate(config, config => {
    if (!apiKey) {
      config.modResults.contents = removeGoogleMapsAppDelegateImport(
        config.modResults.contents,
      ).contents;
      config.modResults.contents = removeGoogleMapsAppDelegateInit(
        config.modResults.contents,
      ).contents;
      return config;
    }

    if (config.modResults.language !== 'swift') {
      throw new Error(
        `Cannot setup Google Maps because the project AppDelegate is not a supported language: ${config.modResults.language}`,
      );
    }

    try {
      config.modResults.contents = addGoogleMapsAppDelegateImport(
        config.modResults.contents,
      ).contents;
      config.modResults.contents = addGoogleMapsAppDelegateInit(
        config.modResults.contents,
        apiKey,
      ).contents;
    } catch (error: any) {
      if (error.code === 'ERR_NO_MATCH') {
        throw new Error(
          `Cannot add Google Maps to the project's AppDelegate because it's malformed. Please report this with a copy of your project AppDelegate.`,
        );
      }
      throw error;
    }
    return config;
  });
};
