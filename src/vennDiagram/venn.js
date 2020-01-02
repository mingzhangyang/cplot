import setupCanvas from '../setup';
import {calcD} from './utils';

const example = {
  A: {
    name: "A",
    value: 100,
  },
  B: {
    name: "B",
    value: 200,
  },
  shared: 50
};

function compute_2(data=example, canvasID, opts={}) {
  let canvas = document.getElementById(canvasID);
  let ctx = setupCanvas(canvas, opts);

  let area_L = data.A.value;
  let area_s = data.B.value;

  if (area_L < area_s) {
    [area_L, area_s] = [area_s, area_L];
  }

  let percentage = area_s / (area_L + area_s);

  let w = ctx.drawingBox.innerBoxWidth;
  let h = ctx.drawingBox.innerBoxHeight;
  let s = w > h ? h : w;

  let m = Math.sqrt(area_L);
  let n = Math.sqrt(area_s);
  let R = s * .5 * (m / (m + n));
  let r = s * .5 * (n / (m + n));

  let d = calcD(R, r, percentage);
  let offset = (R + r - d) / 2;

  let cx_1 = ctx.drawingBox.innerBoxOrigin.x + offset + R;
  let cy_1 = ctx.drawingBox.innerBoxOrigin.y + ctx.drawingBox.innerBoxHeight / 2;

  let cx_2 = ctx.drawingBox.innerBoxOrigin.x + ctx.drawingBox.innerBoxWidth - offset - r;

  return {
    A: {cx: cx_1, cy: cy_1, radius: R},
    B: {cx: cx_2, cy: cy_1, radius: r}
  };
}

