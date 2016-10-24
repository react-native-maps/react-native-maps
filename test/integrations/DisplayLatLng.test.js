import 'babel-polyfill';
import { expect } from 'chai';
import integration from '../helpers/integration';

const { it } = integration;

describe('DiplayLatLng', () => {
  it('should Track the position', async (driver) => {
    await driver.clickElementByReactNativeName('Tracking Position');

    let coordinatesValues;
    let previousCoordinatesValues;

    previousCoordinatesValues = await driver.elementByName('coordinates').text();

    for (let i = 0; i <= 3; i++) {
      await driver.clickElementByReactNativeName('Jump');

      coordinatesValues = await driver.elementByName('coordinates').text();
      expect(coordinatesValues).to.not.equal(previousCoordinatesValues);
      previousCoordinatesValues = coordinatesValues;

      // check the values that are different
      await driver.sleep(2000);
    }

    for (let i = 0; i <= 3; i++) {
      await driver.clickElementByReactNativeName('Animate');

      coordinatesValues = await driver.elementByName('coordinates').text();
      expect(coordinatesValues).to.not.equal(previousCoordinatesValues);
      previousCoordinatesValues = coordinatesValues;

      // check the values that are different
      await driver.sleep(2000);
    }
  });
});
