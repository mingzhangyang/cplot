export function getPosition(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

export function getMinMax(arr) {
  let max = -Infinity;
  let min = Infinity;
  for (let a of arr) {
    if (a > max) {
      max = a;
    }
    if (a < min) {
      min = a;
    }
  }
  return [min, max];
}

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