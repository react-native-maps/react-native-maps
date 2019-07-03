export default (...tags) => {
  if (__DEV__) {
    const tag = `${tags.join(' -> ')} ->`;
    return {
      log: console.log.bind(this, tag),
      warn: console.warn.bind(this, tag),
      error: console.error.bind(this, tag),
    };
  }

  return {
    log: () => {},
    warn: () => {},
    error: () => {},
  };
};
