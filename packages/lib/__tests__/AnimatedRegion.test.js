import {Animated} from 'react-native';
import AnimatedRegion from '../src/AnimatedRegion';

const VALUES = {
  latitude: 5,
  longitude: 5,
  latitudeDelta: 0,
  longitudeDelta: 0,
};

describe('AnimatedRegion', () => {
  it('converts numbers to instances of Animated.Value', () => {
    const animatedRegion = new AnimatedRegion(VALUES);

    expect(animatedRegion.latitude instanceof Animated.Value).toBe(true);
    expect(animatedRegion.longitude instanceof Animated.Value).toBe(true);
    expect(animatedRegion.latitudeDelta instanceof Animated.Value).toBe(true);
    expect(animatedRegion.longitudeDelta instanceof Animated.Value).toBe(true);

    const values = animatedRegion.__getValue();

    expect(values.latitude).toEqual(VALUES.latitude);
    expect(values.longitude).toEqual(VALUES.longitude);
    expect(values.longitudeDelta).toEqual(VALUES.longitudeDelta);
    expect(values.latitudeDelta).toEqual(VALUES.latitudeDelta);
  });

  it('uses Animated.Value instances', () => {
    const animatedRegion = new AnimatedRegion({
      latitude: new Animated.Value(VALUES.latitude),
      longitude: new Animated.Value(VALUES.longitude),
    });

    expect(animatedRegion.latitude instanceof Animated.Value).toBe(true);
    expect(animatedRegion.longitude instanceof Animated.Value).toBe(true);
    expect(animatedRegion.latitudeDelta instanceof Animated.Value).toBe(true);
    expect(animatedRegion.longitudeDelta instanceof Animated.Value).toBe(true);

    const values = animatedRegion.__getValue();

    expect(values.latitude).toEqual(VALUES.latitude);
    expect(values.longitude).toEqual(VALUES.longitude);
    expect(values.longitudeDelta).toEqual(VALUES.longitudeDelta);
    expect(values.latitudeDelta).toEqual(VALUES.latitudeDelta);
  });

  it('uses defaults converted to Animated.Value instances when none are supplied', () => {
    const animatedRegion = new AnimatedRegion({});

    expect(animatedRegion.latitude instanceof Animated.Value).toBe(true);
    expect(animatedRegion.longitude instanceof Animated.Value).toBe(true);
    expect(animatedRegion.latitudeDelta instanceof Animated.Value).toBe(true);
    expect(animatedRegion.longitudeDelta instanceof Animated.Value).toBe(true);

    const values = animatedRegion.__getValue();

    expect(values.latitude).toEqual(0);
    expect(values.longitude).toEqual(0);
    expect(values.longitudeDelta).toEqual(VALUES.longitudeDelta);
    expect(values.latitudeDelta).toEqual(VALUES.latitudeDelta);
  });
});
