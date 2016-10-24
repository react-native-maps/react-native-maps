import childProcess from 'child_process';
import Packager from './servers/Packager';
import Appium from './servers/Appium';

class TestEnvironment {
  constructor({ caps, appiumServerConfig, platform }) {
    this.started = false;

    this.packager = new Packager();
    this.appium = new Appium({ caps, appiumServerConfig });
    this.platform = platform;
  }

  async start() {
    if (this.started) return;

    await Promise.all([
      this.packager.start().then(
        new Promise((resolve) => (
          childProcess.exec(`curl http://localhost:8081/index.ios.bundle?platform=${this.platform}&dev=true`, resolve)
        ))
      ),
      this.appium.start(),
    ]);
    this.started = true;
  }

  async stop() {
    if (!this.started) return;

    await Promise.all([
      this.appium.stop(),
      this.packager.stop(),
    ]);
  }

  driver() {
    return this.appium.getDriver();
  }
}

export default TestEnvironment;
