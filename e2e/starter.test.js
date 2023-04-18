import {by, device, element} from 'detox';

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show static map', async () => {
    await element(by.id('StaticMapButton')).tap();
  });
});
