const velocityAtBounds = (x0, vx, bounds, deceleration) => {
  let t = 0;
  let x1 = x0;
  let x = x1;
  let vf;
  let cont = true;
  while (cont) {
    t += 16;
    x =
      x0 + (vx / (1 - deceleration)) * (1 - Math.exp(-(1 - deceleration) * t));
    vf = (x - x1) / 16;
    if (x > bounds[0] && x < bounds[1]) {
      cont = false;
    }
    if (Math.abs(vf) < 0.1) {
      cont = false;
    }
    x1 = x;
  }
  return vf;
};

export default velocityAtBounds;
