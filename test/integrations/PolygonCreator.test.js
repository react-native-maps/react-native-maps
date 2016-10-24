import 'babel-polyfill';
import { TouchAction } from 'wd';
import integration from '../helpers/integration';

const { it } = integration;

describe('Polygon Creator', () => {
  it('should allow creating a polygon', async (driver) => {
    await driver.clickElementByReactNativeName('Polygon Creator');

    await [
      { x: 200.0, y: 200.0 },
      { x: 200.0, y: 100.0 },
      { x: 150.0, y: 50.0 },
      { x: 100.0, y: 50.0 },
    ].forEach(async (coordinates) => {
      await (
        (new TouchAction(driver)).press(coordinates).wait(3000).release()
        .perform()
      );
      await driver.sleep(1000);
    });

    await driver.clickElementByReactNativeName('Finish');
    //
  });
});
