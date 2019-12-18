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