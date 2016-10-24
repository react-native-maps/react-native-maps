import 'colors';
import XCUITestDriver from 'appium-xcuitest-driver';
import wd from 'wd';
import childProcess from 'child_process';
import { server as baseServer, routeConfiguringFunction } from 'appium-base-driver';
import { getLogger } from 'appium-logger';

function startAppium({ appiumServerConfig }) {
  return new Promise((resolve) => {
    const appiumServer = childProcess.spawn('appium', ['-p', appiumServerConfig.port]);

    let loadedAppium = null;
    appiumServer.stdout.on('data', (data) => {
      if (loadedAppium) return;
      console.log(`[APPIUM]: ${data}`);
      if (data.indexOf('Appium REST http interface listener started') >= 0) {
        loadedAppium = true;
        resolve(appiumServer);
      }
    });
    appiumServer.stderr.on('data', (data) => {
      console.log(`[APPIUM]: Error ${data}`);
      appiumServer.kill();
    });
    process.on('exit', () => {
      appiumServer.kill();
    });
  });
}

async function startDriver({ caps, appiumServerConfig }) {
  const driver = await wd.promiseChainRemote(appiumServerConfig.host, appiumServerConfig.port);
  const xcuiTestDriver = new XCUITestDriver({
    port: appiumServerConfig.port,
    address: appiumServerConfig.host,
  });
  const router = routeConfiguringFunction(xcuiTestDriver);
  await baseServer(router, appiumServerConfig.port, appiumServerConfig.host);
  getLogger('XCUITest').level = 'info';
  getLogger('BaseDriver').level = 'info';

  driver.on('status', (info) => {
    console.log(info.cyan);
  });
  driver.on('command', (meth, path, data) => {
    console.log(` > ${meth.yellow}`, path.grey, data || '');
  });

  await driver.init(caps, (error) => {
    console.log('[DRIVER]: started');
    if (error) {
      console.log('[DRIVER]: error', error);
      process.exit(1);
    }
  });

  return driver;
}

class Appium {
  constructor({ caps, appiumServerConfig }) {
    this.driver = null;
    this.server = null;

    this.caps = caps;
    this.appiumServerConfig = appiumServerConfig;
  }

  getDriver() {
    return this.driver;
  }

  async start() {
    if (this.driver) { return this.driver; }

    this.server = await startAppium({
      appiumServerConfig: this.appiumServerConfig,
    });
    this.driver = await startDriver({
      caps: this.caps,
      appiumServerConfig: this.appiumServerConfig,
    });

    return this.driver;
  }

  async stop() {
    if (!this.driver) { return; }

    await this.driver.quit();
    await new Promise((resolve) => {
      this.server.on('close', resolve);
      this.server.kill();
    });
  }
}

export default Appium;
