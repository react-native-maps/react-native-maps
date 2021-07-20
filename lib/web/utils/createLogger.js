export default (...tags) => {
  if (__DEV__) {
    const tag = `${tags.join(' -> ')} ->`;
    const warn = console.warn.bind(this, tag);
    return {
      log: console.log.bind(this, tag),
      warn,
      error: console.error.bind(this, tag),
      unsupported: props => {
        const keys = Object.entries(props)
          .filter(([, value]) => value != null)
          .map(([key]) => key);
        for (const key of keys) warn(`Prop \`${key}\` is not supported`);
      },
    };
  }

  return {
    log() {},
    warn() {},
    error() {},
    unsupported() {},
  };
};
