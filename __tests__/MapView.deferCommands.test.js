import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import MapView from '../src/MapView';

// The TurboModule spec calls getEnforcing at import; Jest has no native side.
jest.mock('../src/specs/NativeAirMapsModule', () => ({
  __esModule: true,
  default: {},
}));

import {Commands} from '../src/specs/NativeComponentMapView';

// Every imperative command ends in the codegen Commands of the Fabric map
// (createFabricMap holds a reference to this very object). Keep the real
// component; record what reaches native.
const COMMAND_NAMES = [
  'setCamera',
  'animateCamera',
  'animateToRegion',
  'fitToElements',
  'fitToSuppliedMarkers',
  'fitToCoordinates',
];
const mockCommands = {};

beforeEach(() => {
  jest.restoreAllMocks();
  COMMAND_NAMES.forEach(name => {
    mockCommands[name] = jest
      .spyOn(Commands, name)
      .mockImplementation(() => {});
  });
});

const REGION = {
  latitude: 55.68,
  longitude: 12.57,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};
const COORDS = [
  {latitude: 55.68, longitude: 12.57},
  {latitude: 55.4, longitude: 10.39},
];

function render(props = {}) {
  const handle = mockCommands;
  const mapRef = React.createRef();
  let renderer;
  act(() => {
    renderer = TestRenderer.create(<MapView ref={mapRef} {...props} />, {
      createNodeMock: () => ({}),
    });
  });
  // The host element MapView renders (FabricMap on iOS in the RN preset).
  const host = () =>
    renderer.root.find(
      node => typeof node.type === 'string' && node.props.onMapReady,
    );
  const ready = () =>
    act(() => {
      host().props.onMapReady();
    });
  const layout = (width, height) =>
    act(() => {
      host().props.onLayout({
        nativeEvent: {layout: {x: 0, y: 0, width, height}},
      });
    });
  return {map: mapRef.current, handle, renderer, host, ready, layout};
}

describe('MapView deferCommandsUntilReady', () => {
  describe('off (default) — upstream behaviour unchanged', () => {
    it('runs a command immediately, before the map is ready', () => {
      const {map, handle} = render();
      map.fitToCoordinates(COORDS);
      expect(handle.fitToCoordinates).toHaveBeenCalledTimes(1);
    });

    it('passes the caller onLayout straight through', () => {
      const onLayout = jest.fn();
      const {host} = render({onLayout});
      expect(host().props.onLayout).toBe(onLayout);
    });
  });

  describe('on', () => {
    it('holds a command issued before ready, runs it once ready and sized', () => {
      const {map, handle, ready, layout} = render({
        deferCommandsUntilReady: true,
      });
      map.fitToCoordinates(COORDS, {animated: false});
      expect(handle.fitToCoordinates).not.toHaveBeenCalled();

      layout(390, 240);
      expect(handle.fitToCoordinates).not.toHaveBeenCalled();

      ready();
      expect(handle.fitToCoordinates).toHaveBeenCalledTimes(1);
      expect(handle.fitToCoordinates).toHaveBeenCalledWith(
        expect.anything(),
        JSON.stringify(COORDS),
        JSON.stringify({top: 0, right: 0, bottom: 0, left: 0}),
        false,
      );
    });

    it('holds a command while ready but unsized (the Android #4531 case)', () => {
      const {map, handle, ready, layout} = render({
        deferCommandsUntilReady: true,
      });
      ready();
      map.animateToRegion(REGION, 0);
      expect(handle.animateToRegion).not.toHaveBeenCalled();

      layout(0, 0);
      expect(handle.animateToRegion).not.toHaveBeenCalled();

      layout(390, 240);
      expect(handle.animateToRegion).toHaveBeenCalledWith(
        expect.anything(),
        JSON.stringify(REGION),
        0,
      );
    });

    it('replays queued commands in call order, each exactly once', () => {
      const {map, handle, ready, layout} = render({
        deferCommandsUntilReady: true,
      });
      const order = [];
      handle.animateToRegion.mockImplementation(() => order.push('region'));
      handle.fitToCoordinates.mockImplementation(() => order.push('fit'));
      handle.setCamera.mockImplementation(() => order.push('camera'));

      map.animateToRegion(REGION);
      map.fitToCoordinates(COORDS);
      map.setCamera({heading: 90});
      layout(390, 240);
      expect(order).toEqual([]); // nothing runs before the map is ready
      ready();
      layout(390, 240); // a later layout must not replay anything

      expect(order).toEqual(['region', 'fit', 'camera']);
    });

    it('runs commands directly once ready and sized', () => {
      const {map, handle, ready, layout} = render({
        deferCommandsUntilReady: true,
      });
      layout(390, 240);
      ready();
      map.fitToElements({animated: true});
      expect(handle.fitToElements).toHaveBeenCalledTimes(1);
    });

    it('queues again if the view collapses to zero size', () => {
      const {map, handle, ready, layout} = render({
        deferCommandsUntilReady: true,
      });
      layout(390, 240);
      ready();
      layout(390, 0);
      map.fitToSuppliedMarkers(['a', 'b']);
      expect(handle.fitToSuppliedMarkers).not.toHaveBeenCalled();
      layout(390, 240);
      expect(handle.fitToSuppliedMarkers).toHaveBeenCalledTimes(1);
    });

    it('flushes queued commands before calling the caller onMapReady', () => {
      const calls = [];
      const {map, handle, ready, layout} = render({
        deferCommandsUntilReady: true,
        onMapReady: () => calls.push('onMapReady'),
      });
      handle.animateCamera.mockImplementation(() => calls.push('command'));
      map.animateCamera({zoom: 10});
      layout(390, 240);
      expect(calls).toEqual([]); // held until ready
      ready();
      expect(calls).toEqual(['command', 'onMapReady']);
    });

    it('still calls the caller onLayout', () => {
      const onLayout = jest.fn();
      const {layout} = render({deferCommandsUntilReady: true, onLayout});
      layout(390, 240);
      expect(onLayout).toHaveBeenCalledTimes(1);
      expect(onLayout.mock.calls[0][0].nativeEvent.layout.width).toBe(390);
    });

    it('discards pending commands on unmount', () => {
      const {map, handle, renderer, host} = render({
        deferCommandsUntilReady: true,
      });
      const onLayout = host().props.onLayout;
      const onMapReady = host().props.onMapReady;
      map.fitToCoordinates(COORDS);
      act(() => renderer.unmount());
      // Late native events after unmount must not run the stale command.
      onLayout({nativeEvent: {layout: {x: 0, y: 0, width: 390, height: 240}}});
      onMapReady();
      expect(handle.fitToCoordinates).not.toHaveBeenCalled();
    });
  });
});
