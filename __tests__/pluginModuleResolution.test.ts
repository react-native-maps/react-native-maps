jest.mock(
  'expo/config-plugins',
  () => ({
    AndroidConfig: {
      Manifest: {
        addMetaDataItemToMainApplication: jest.fn(),
        getMainApplicationOrThrow: jest.fn(),
        removeMetaDataItemFromMainApplication: jest.fn(),
      },
    },
    withAndroidManifest: jest.fn(),
    withAppDelegate: jest.fn(),
    withInfoPlist: jest.fn(),
    withPodfile: jest.fn(),
  }),
  {virtual: true},
);

jest.mock('@expo/config-plugins/build/plugins/ios-plugins', () => {
  throw new Error('The plugin loaded a legacy @expo/config-plugins subpath');
});

jest.mock('@expo/config-plugins/build/utils/generateCode', () => {
  throw new Error('The plugin loaded a legacy @expo/config-plugins subpath');
});

jest.mock('@expo/config-plugins/build/android/Manifest', () => {
  throw new Error('The plugin loaded a legacy @expo/config-plugins subpath');
});

describe('Expo config plugin module resolution', () => {
  it('loads through the public expo/config-plugins entry point', () => {
    expect(() => jest.requireActual('../plugin/src')).not.toThrow();
  });
});
