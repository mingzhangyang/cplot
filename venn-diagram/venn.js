import {initializeCanvas} from '../utils/setup.js';
import {calcD} from './utils.js';

const example = {
  A: {
    name: "A",
    value: 100,
  },
  B: {
    name: "B",
    value: 200,
  },
  shared: 60
};

class Circle {
  constructor(cx, cy, radius) {
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
  }
  contain(x, y) {
    let a = this.cx - x;
    let b = this.cy - y;
    return a * a + b * b <= this.radius * this.radius
  }
}

export function draw_2(canvasID, data=example, opts={}) {
  let canvas = document.getElementById(canvasID);
  let ctx = initializeCanvas(canvas, opts);

  let area_L = data.A.value;
  let area_s = data.B.value;

  if (area_L < area_s) {
    [area_L, area_s] = [area_s, area_L];
  }

  let percentage = data.shared / area_s;

  let w = ctx.drawingBox.innerBoxWidth;
  let h = ctx.drawingBox.innerBoxHeight;
  let s = w > h ? h : w;

  let m = Math.sqrt(area_L);
  let n = Math.sqrt(area_s);
  let R = s * .5 * (m / (m + n));
  let r = s * .5 * (n / (m + n));

  let d = calcD(R, r, percentage);
  let offset = (R + r - d) / 2;

  let cx_1, cy_1, cx_2, radius_1, radius_2;

  if (data.A.value > data.B.value) {
    cx_1 = ctx.drawingBox.innerBoxOrigin.x + offset + R;
    cy_1 = ctx.drawingBox.innerBoxOrigin.y - ctx.drawingBox.innerBoxHeight / 2;
    cx_2 = ctx.drawingBox.innerBoxOrigin.x + ctx.drawingBox.innerBoxWidth - offset - r;
    radius_1 = R;
    radius_2 = r;
  } else {
    cx_1 = ctx.drawingBox.innerBoxOrigin.x + offset + r;
    cy_1 = ctx.drawingBox.innerBoxOrigin.y - ctx.drawingBox.innerBoxHeight / 2;
    cx_2 = ctx.drawingBox.innerBoxOrigin.x + ctx.drawingBox.innerBoxWidth - offset - R;
    radius_1 = r;
    radius_2 = R;
  }

  let c1 = new Circle(cx_1, cy_1, radius_1);
  let c2 = new Circle(cx_2, cy_1, radius_2);
  ctx.data = data;
  ctx.circles = {
    A: c1,
    B: c2
  };

  _draw(ctx);

  canvas.addEventListener("mousemove", evt => {
    let rect = canvas.getBoundingClientRect();
    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;

    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.font = "24px Arial";

    _draw(ctx);

    if (ctx.circles.A.contain(x, y) && ctx.circles.B.contain(x, y)) {
      ctx.fillStyle = "#f66";
      ctx.fillText(`shared: ${ctx.data.shared}`, x, y - 20);
      return;
    }
    if (ctx.circles.A.contain(x, y)) {
      ctx.fillStyle = "#f66";
      ctx.fillText(`${ctx.data.A.name}: ${ctx.data.A.value}`, x, y - 20);
      return;
    }
    if (ctx.circles.B.contain(x, y)) {
      ctx.fillStyle = "#f66";
      ctx.fillText(`${ctx.data.B.name}: ${ctx.data.B.value}`, x, y - 20);
    }
  });
}

function _draw(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();
  ctx.fillStyle = "rgba(105, 201, 129, .6)";
  ctx.arc(ctx.circles.A.cx, ctx.circles.A.cy, ctx.circles.A.radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "rgba(0, 122, 189, .6)";
  ctx.arc(ctx.circles.B.cx, ctx.circles.B.cy, ctx.circles.B.radius, 0, 2 * Math.PI);
  ctx.fill();
}
