import {Platform} from 'react-native';
import MapView from '../src/MapView';

jest.mock('../src/specs/NativeAirMapsModule', () => ({}));

describe.each([
  ['ios', undefined],
  ['ios', 'google'],
  ['android', 'google'],
])('user tracking on %s (%s)', (os, provider) => {
  const originalOS = Platform.OS;
  beforeEach(() => {
    Platform.OS = os;
  });
  afterEach(() => {
    Platform.OS = originalOS;
  });

  it('forwards the legacy flag and explicit heading mode to the native map', () => {
    const map = new MapView({
      provider,
      followsUserLocation: true,
      userTrackingMode: 'followWithHeading',
    });
    const nativeMap = map.render().props.children;
    expect(nativeMap.props.followsUserLocation).toBe(true);
    expect(nativeMap.props.userTrackingMode).toBe('followWithHeading');
  });

  it('delivers a native gesture cancellation to the caller', () => {
    const onUserTrackingModeChange = jest.fn();
    const map = new MapView({provider, onUserTrackingModeChange});
    const event = {
      nativeEvent: {userTrackingMode: 'none', reason: 'userInteraction'},
    };
    map.render().props.children.props.onUserTrackingModeChange(event);
    expect(onUserTrackingModeChange).toHaveBeenCalledWith(event);
    expect(onUserTrackingModeChange).toHaveBeenCalledTimes(1);
  });
});
