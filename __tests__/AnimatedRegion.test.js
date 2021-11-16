import { Animated } from 'react-native';
import AnimatedRegion from '../lib/components/AnimatedRegion';

describe('AnimatedRegion', () => {
  it('converts numbers to instances of Animated.Value', () => {
    const animatedRegion = new AnimatedRegion({
      latitude: 5,
      longitude: 5,
    });
    const { latitude, longitude, latitudeDelta, longitudeDelta } = animatedRegion;

    expect(latitude instanceof Animated.Value).toBe(true);
    expect(longitude instanceof Animated.Value).toBe(true);
    expect(latitudeDelta instanceof Animated.Value).toBe(true);
    expect(longitudeDelta instanceof Animated.Value).toBe(true);
  });

  it('uses Animated.Value instances', () => {
    const animatedRegion = new AnimatedRegion({
      latitude: new Animated.Value(5),
      longitude: new Animated.Value(5),
    });
    const { latitude, longitude, latitudeDelta, longitudeDelta } = animatedRegion;

    expect(latitude instanceof Animated.Value).toBe(true);
    expect(longitude instanceof Animated.Value).toBe(true);
    expect(latitudeDelta instanceof Animated.Value).toBe(true);
    expect(longitudeDelta instanceof Animated.Value).toBe(true);
  });

  it('uses defaults converted to Animated.Value instances when none are supplied', () => {
    const animatedRegion = new AnimatedRegion({});
    const { latitude, longitude, latitudeDelta, longitudeDelta } = animatedRegion;

    expect(latitude instanceof Animated.Value).toBe(true);
    expect(longitude instanceof Animated.Value).toBe(true);
    expect(latitudeDelta instanceof Animated.Value).toBe(true);
    expect(longitudeDelta instanceof Animated.Value).toBe(true);
  })
});
