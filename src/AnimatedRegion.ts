import {Animated} from 'react-native';
import {Region} from './sharedTypes';

const AnimatedWithChildren = Object.getPrototypeOf(Animated.ValueXY);
if (__DEV__) {
  if (AnimatedWithChildren.name !== 'AnimatedWithChildren') {
    console.error(
      'AnimatedRegion could not obtain AnimatedWithChildren base class',
    );
  }
}

const configTypes: (keyof Region)[] = [
  'latitude',
  'longitude',
  'latitudeDelta',
  'longitudeDelta',
];

const defaultValues = {
  // probably want to come up with better defaults
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0,
  longitudeDelta: 0,
};

let _uniqueId = 1;

type TValueIn = number | Animated.Value | undefined;

type Props = Partial<Region> | undefined;

type RegionListener = {
  latitude: string;
  longitude: string;
  latitudeDelta: string;
  longitudeDelta: string;
};

const getAnimatedValue = (valueIn: TValueIn, fallback: number) => {
  if (valueIn instanceof Animated.Value) {
    return valueIn;
  } else if (typeof valueIn === 'number') {
    return new Animated.Value(valueIn);
  }
  return new Animated.Value(fallback);
};

export default class AnimatedMapRegion extends AnimatedWithChildren {
  latitude: Animated.Value;
  longitude: Animated.Value;
  latitudeDelta: Animated.Value;
  longitudeDelta: Animated.Value;
  _regionListeners: Record<string, RegionListener>;

  constructor(valueIn: Props = {}) {
    super();
    this.latitude = getAnimatedValue(valueIn.latitude, defaultValues.latitude);
    this.longitude = getAnimatedValue(
      valueIn.longitude,
      defaultValues.longitude,
    );
    this.latitudeDelta = getAnimatedValue(
      valueIn.latitudeDelta,
      defaultValues.latitudeDelta,
    );
    this.longitudeDelta = getAnimatedValue(
      valueIn.longitudeDelta,
      defaultValues.longitudeDelta,
    );
    this._regionListeners = {};
  }

  setValue(value: Region) {
    this.latitude.setValue(value.latitude);
    this.longitude.setValue(value.latitude);
    this.latitudeDelta.setValue(value.latitudeDelta);
    this.longitudeDelta.setValue(value.longitudeDelta);
  }

  setOffset(offset: Region) {
    this.latitude.setOffset(offset.latitude);
    this.longitude.setOffset(offset.longitude);
    this.latitudeDelta.setOffset(offset.latitudeDelta);
    this.longitudeDelta.setOffset(offset.longitudeDelta);
  }

  flattenOffset() {
    this.latitude.flattenOffset();
    this.longitude.flattenOffset();
    this.latitudeDelta.flattenOffset();
    this.longitudeDelta.flattenOffset();
  }

  private __getValue() {
    return {
      latitude: (this.latitude as any)._value,
      longitude: (this.longitude as any)._value,
      latitudeDelta: (this.latitudeDelta as any)._value,
      longitudeDelta: (this.longitudeDelta as any)._value,
    };
  }

  stopAnimation(callback: (region: Region) => void) {
    this.latitude.stopAnimation();
    this.longitude.stopAnimation();
    this.latitudeDelta.stopAnimation();
    this.longitudeDelta.stopAnimation();
    callback && callback(this.__getValue());
  }

  addListener(callback: (region: Region) => void) {
    const id = String(_uniqueId++);
    const jointCallback = () => /*{value}*/ callback(this.__getValue());
    this._regionListeners[id] = {
      latitude: this.latitude.addListener(jointCallback),
      longitude: this.longitude.addListener(jointCallback),
      latitudeDelta: this.latitudeDelta.addListener(jointCallback),
      longitudeDelta: this.longitudeDelta.addListener(jointCallback),
    };
    return id;
  }

  removeListener(id: string) {
    this.latitude.removeListener(this._regionListeners[id].latitude);
    this.longitude.removeListener(this._regionListeners[id].longitude);
    this.latitudeDelta.removeListener(this._regionListeners[id].latitudeDelta);
    this.longitudeDelta.removeListener(
      this._regionListeners[id].longitudeDelta,
    );
    delete this._regionListeners[id];
  }

  spring(config: Animated.SpringAnimationConfig & Region) {
    const animations = [];
    for (const type of configTypes) {
      if (config.hasOwnProperty(type)) {
        animations.push(
          Animated.spring(this[type], {
            ...config,
            toValue: config[type],
            // may help to eliminate some dev warnings and perf issues
            useNativeDriver: !!config?.useNativeDriver,
          }),
        );
      }
    }
    return Animated.parallel(animations);
  }

  timing(config: Animated.TimingAnimationConfig & Region) {
    const animations = [];
    for (const type of configTypes) {
      if (config.hasOwnProperty(type)) {
        animations.push(
          Animated.timing(this[type], {
            ...config,
            toValue: config[type],
            // may help to eliminate some dev warnings and perf issues
            useNativeDriver: !!config?.useNativeDriver,
          }),
        );
      }
    }
    return Animated.parallel(animations);
  }
}
