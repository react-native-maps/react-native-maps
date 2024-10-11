"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const AnimatedWithChildren = Object.getPrototypeOf(react_native_1.Animated.ValueXY);
if (__DEV__) {
    if (AnimatedWithChildren.name !== 'AnimatedWithChildren') {
        console.error('AnimatedRegion could not obtain AnimatedWithChildren base class');
    }
}
const configTypes = [
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
const getAnimatedValue = (valueIn, fallback) => {
    if (valueIn instanceof react_native_1.Animated.Value) {
        return valueIn;
    }
    else if (typeof valueIn === 'number') {
        return new react_native_1.Animated.Value(valueIn);
    }
    return new react_native_1.Animated.Value(fallback);
};
class AnimatedMapRegion extends AnimatedWithChildren {
    constructor(valueIn = {}) {
        super();
        this.latitude = getAnimatedValue(valueIn.latitude, defaultValues.latitude);
        this.longitude = getAnimatedValue(valueIn.longitude, defaultValues.longitude);
        this.latitudeDelta = getAnimatedValue(valueIn.latitudeDelta, defaultValues.latitudeDelta);
        this.longitudeDelta = getAnimatedValue(valueIn.longitudeDelta, defaultValues.longitudeDelta);
        this._regionListeners = {};
    }
    setValue(value) {
        this.latitude._value = value.latitude;
        this.longitude._value = value.longitude;
        this.latitudeDelta._value = value.latitudeDelta;
        this.longitudeDelta._value = value.longitudeDelta;
    }
    setOffset(offset) {
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
    __getValue() {
        return {
            latitude: this.latitude.__getValue(),
            longitude: this.longitude.__getValue(),
            latitudeDelta: this.latitudeDelta.__getValue(),
            longitudeDelta: this.longitudeDelta.__getValue(),
        };
    }
    __attach() {
        this.latitude.__addChild(this);
        this.longitude.__addChild(this);
        this.latitudeDelta.__addChild(this);
        this.longitudeDelta.__addChild(this);
    }
    __detach() {
        this.latitude.__removeChild(this);
        this.longitude.__removeChild(this);
        this.latitudeDelta.__removeChild(this);
        this.longitudeDelta.__removeChild(this);
    }
    stopAnimation(callback) {
        this.latitude.stopAnimation();
        this.longitude.stopAnimation();
        this.latitudeDelta.stopAnimation();
        this.longitudeDelta.stopAnimation();
        callback && callback(this.__getValue());
    }
    addListener(callback) {
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
    removeListener(id) {
        this.latitude.removeListener(this._regionListeners[id].latitude);
        this.longitude.removeListener(this._regionListeners[id].longitude);
        this.latitudeDelta.removeListener(this._regionListeners[id].latitudeDelta);
        this.longitudeDelta.removeListener(this._regionListeners[id].longitudeDelta);
        delete this._regionListeners[id];
    }
    spring(config) {
        const animations = [];
        for (const type of configTypes) {
            if (config.hasOwnProperty(type)) {
                animations.push(react_native_1.Animated.spring(this[type], {
                    ...config,
                    toValue: config[type],
                    // may help to eliminate some dev warnings and perf issues
                    useNativeDriver: !!config?.useNativeDriver,
                }));
            }
        }
        return react_native_1.Animated.parallel(animations);
    }
    timing(config) {
        const animations = [];
        for (const type of configTypes) {
            if (config.hasOwnProperty(type)) {
                animations.push(react_native_1.Animated.timing(this[type], {
                    ...config,
                    toValue: config[type],
                    // may help to eliminate some dev warnings and perf issues
                    useNativeDriver: !!config?.useNativeDriver,
                }));
            }
        }
        return react_native_1.Animated.parallel(animations);
    }
}
exports.default = AnimatedMapRegion;
