import closestCenter from './closestCenter';

const momentumCenter = (x0, vx, spacing, deceleration) => {
  let t = 0;
  let x1 = x0;
  let x = x1;
  let cont = true;
  while (cont) {
    t += 16;
    x =
      x0 + (vx / (1 - deceleration)) * (1 - Math.exp(-(1 - deceleration) * t));
    if (Math.abs(x - x1) < 0.1) {
      cont = false;
    }
    x1 = x;
  }
  return closestCenter(x1, spacing);
};

export default momentumCenter;
