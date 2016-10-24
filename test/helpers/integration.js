import TestEnvironment from './TestEnvironment';

/* eslint-disable */
const configureDriver = (driver) => {
  driver.elementByMatchingText = async function (text) {
    let element;
    try {
      element = await driver.elementByXPath(`//*[contains(@name, '${text}')][not(*)]`);
    } catch (e) {
      element = await driver.elementByName(text);
    }
    return element;
  };
  driver.elementByReactNativeName = async function (text) {
    let element;
    try {
      element = await driver.elementByName(` ${text}`);
    } catch (e) {
      element = await driver.elementByName(text);
    }
    return element;
  };
  driver.clickElementByReactNativeName = async function (text) {
    const el = await this.elementByReactNativeName(text);
    await el.click();
    return el;
  };
};
/* eslint-enable */

// Wait that the simulator is ready meaning that we are on the homepage
async function simulatorReady(driver) {
  const i = 0;
  while (i < 10) {
    try {
      // if there is a back button press it to go to the home screen.
      await driver.clickElementByReactNativeName('←');
    // eslint-disable-next-line no-empty
    } catch (e) { }
    try {
      await driver.elementByReactNativeName('Tracking Position');
      break;
    } catch (e) {
      await driver.sleep(1000);
    }
  }
}

let testEnvironment;

async function startTestEnvironment() {
  const appiumServerConfig = {
    host: 'localhost',
    port: 4734,
  };

  const platform = process.env.PLATFORM;

  let filePath;
  let platformCaps;
  if (platform === 'ios') {
    filePath = `${process.cwd()}/example/testbuild/ios.zip`;
    platformCaps = {
      platformName: 'iOS',
      platformVersion: '9.3',
      deviceName: 'iPhone 6',
    };
  } else {
    filePath = `${process.cwd()}/example/testbuild/android.apk`;
    platformCaps = {
      platformName: 'Android',
      platformVersion: '4.3',
      deviceName: 'Android Emulator',
    };
  }

  const caps = {
    browserName: '',
    'appium-version': '1.4.16',
    autoLaunch: 'true',
    newCommandTimeout: TIMEOUT_TIME,
    app: filePath,
    deviceOrientation: 'portrait',
    ...platformCaps,
  };

  testEnvironment = new TestEnvironment({ appiumServerConfig, caps, platform });
  await testEnvironment.start();

  return testEnvironment;
}

const TIMEOUT_TIME = 300000;

before(async function cb() {
  this.timeout(TIMEOUT_TIME);
  console.log('[APPIUM] Before suite');
  await startTestEnvironment();
  configureDriver(testEnvironment.driver());
});

after(async function cb() {
  this.timeout(TIMEOUT_TIME);
  await testEnvironment.stop();
});

beforeEach(async function cb() {
  this.timeout(TIMEOUT_TIME);
  await simulatorReady(testEnvironment.driver());
});

async function reactNativeIt(callback) {
  try {
    await callback(testEnvironment.driver());
  } catch (e) {
    // Log the source so you can see what is the source
    console.log(await testEnvironment.driver().source());
    throw e;
  }
}


const itWithTimeout = (name, callback) => (
  it(name, async function cb() {
    this.timeout(TIMEOUT_TIME);
    await reactNativeIt(callback);
  })
);

itWithTimeout.only = (name, callback) => (
  it.only(name, async function cb() {
    this.timeout(TIMEOUT_TIME);
    await reactNativeIt(callback);
  })
);

export default {
  isIOS: process.env.PLATFORM === 'ios',
  isAndroid: process.env.PLATFORM === 'android',
  it: itWithTimeout,
};
