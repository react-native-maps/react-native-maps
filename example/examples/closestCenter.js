const closestCenter = (x, spacing) => {
  const plus = x % spacing < spacing / 2 ? 0 : spacing;
  return Math.floor(x / spacing) * spacing + plus;
};
export default closestCenter;
