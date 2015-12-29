class AnimatedRegion extends AnimatedWithChildren {
  //latitude: AnimatedValue;
  //longitude: AnimatedValue;
  //latitudeDelta: AnimatedValue;
  //longitudeDelta: AnimatedValue;
  //_listeners: {[key: string]: {
  //  latitude: string,
  //  longitude: string,
  //  latitudeDelta: string;
  //  longitudeDelta: string,
  //}};

  constructor(valueIn) {
    super();
    var value = valueIn || { // probably want to come up with better defaults
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    };
    this.latitude = value.latitude instanceof Animated
      ? value.latitude
      : new AnimatedValue(value.latitude);
    this.longitude = value.longitude instanceof Animated
      ? value.longitude
      : new AnimatedValue(value.longitude);
    this.latitudeDelta = value.latitudeDelta instanceof Animated
      ? value.latitudeDelta
      : new AnimatedValue(value.latitudeDelta);
    this.longitudeDelta = value.longitudeDelta instanceof Animated
      ? value.longitudeDelta
      : new AnimatedValue(value.longitudeDelta);
    this._listeners = {};
  }

  setValue(value) {
    //this.latitude.setValue(value.latitude);
    //this.longitude.setValue(value.longitude);
    //this.latitudeDelta.setValue(value.latitudeDelta);
    //this.longitudeDelta.setValue(value.longitudeDelta);
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
    var id = String(_uniqueId++);
    var jointCallback = ({value: number}) => {
      callback(this.__getValue());
    };
    this._listeners[id] = {
      latitude: this.latitude.addListener(jointCallback),
      longitude: this.longitude.addListener(jointCallback),
      latitudeDelta: this.latitudeDelta.addListener(jointCallback),
      longitudeDelta: this.longitudeDelta.addListener(jointCallback),
    };
    return id;
  }

  removeListener(id) {
    this.latitude.removeListener(this._listeners[id].latitude);
    this.longitude.removeListener(this._listeners[id].longitude);
    this.latitudeDelta.removeListener(this._listeners[id].latitudeDelta);
    this.longitudeDelta.removeListener(this._listeners[id].longitudeDelta);
    delete this._listeners[id];
  }

  spring(config) {
    var animations = [];
    config.hasOwnProperty('latitude') &&
    animations.push(timing(this.latitude, {
      ...config,
      toValue: config.latitude,
    }));

    config.hasOwnProperty('longitude') &&
    animations.push(timing(this.longitude, {
      ...config,
      toValue: config.longitude,
    }));

    config.hasOwnProperty('latitudeDelta') &&
    animations.push(timing(this.latitudeDelta, {
      ...config,
      toValue: config.latitudeDelta,
    }));

    config.hasOwnProperty('longitudeDelta') &&
    animations.push(timing(this.longitudeDelta, {
      ...config,
      toValue: config.longitudeDelta,
    }));

    return parallel(animations);
  }

  timing(config) {
    var animations = [];
    config.hasOwnProperty('latitude') &&
    animations.push(timing(this.latitude, {
      ...config,
      toValue: config.latitude,
    }));

    config.hasOwnProperty('longitude') &&
    animations.push(timing(this.longitude, {
      ...config,
      toValue: config.longitude,
    }));

    config.hasOwnProperty('latitudeDelta') &&
    animations.push(timing(this.latitudeDelta, {
      ...config,
      toValue: config.latitudeDelta,
    }));

    config.hasOwnProperty('longitudeDelta') &&
    animations.push(timing(this.longitudeDelta, {
      ...config,
      toValue: config.longitudeDelta,
    }));

    return parallel(animations);
  }
}
