import fs from 'node:fs';
import path from 'node:path';

const googleMapFabricSource = fs.readFileSync(
  path.resolve(__dirname, '../ios/AirGoogleMaps/RNMapsGoogleMapView.mm'),
  'utf8',
);

describe('Google Maps Fabric iOS props', () => {
  it.each(['showsIndoors', 'showsIndoorLevelPicker'])(
    'applies the initial %s value after creating AIRGoogleMap',
    prop => {
      expect(
        googleMapFabricSource.includes(`_view.${prop} = newViewProps.${prop};`),
      ).toBe(true);
    },
  );

  it.each(['showsIndoors', 'showsIndoorLevelPicker'])(
    'maps %s to AIRGoogleMap',
    prop => {
      expect(
        googleMapFabricSource.includes(`REMAP_MAPVIEW_PROP(${prop})`),
      ).toBe(true);
    },
  );
});
