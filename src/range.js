export function getRangeByStep(min = 0, max = 100, step = 10) {
  let res = [];
  let v = min;
  while (v < max) {
    res.push(v);
    v += step;
  }
  res.push(v);
  return res;
}

