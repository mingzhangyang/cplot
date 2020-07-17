import {getPosition} from './utils.js';
import {initializeCanvas, setupScale} from '../utils/setup.js';

export default function linePlot(id, data, opts={}) {
  let canvas = document.getElementById(id);
  if (!canvas) {
    throw "an id of a canvas element is expected";
  }

  let ctx = initializeCanvas(canvas, opts);

  if (!Array.isArray(data)) {
    throw "an array of number or objects expected"
  }
  if (typeof data[0] === 'number') {
    data = data.map((v, i) => {
      return {
        y: v,
        x: i,
      }
    });
  }
  if (data[0].x === undefined || data[0].y === undefined) {
    throw "bad format, an array of {x: v1, y: v2} expected";
  }

  ctx.data = data;


  draw(ctx);

  canvas.addEventListener('mouseenter', evt => {
    draw(ctx, getPosition(canvas, evt));
  });

  canvas.addEventListener('mouseleave', evt => {
    draw(ctx, getPosition(canvas, evt));
  });

  canvas.addEventListener('mousemove', evt => {
    draw(ctx, getPosition(canvas, evt));
  });
}

function draw(ctx, pos={x: 0, y: 0}) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  setupScale(ctx);

  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 16px Arial';
  ctx.save();

  ctx.translate(ctx.drawingBox.outerBoxOrigin.x, ctx.drawingBox.outerBoxOrigin.y);
  ctx.beginPath();
  ctx.moveTo(0, -ctx.drawingBox.outerBoxHeight);
  ctx.lineTo(0, 0);
  ctx.lineTo(ctx.drawingBox.outerBoxWidth, 0);
  ctx.lineTo(ctx.drawingBox.outerBoxWidth, -ctx.drawingBox.outerBoxHeight);
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
  ctx.save();

  // to be continued
}