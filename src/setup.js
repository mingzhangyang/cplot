import BoxModel from './boxModel';

const defaults = {
  width: 1000,
  height: 600,
};

export default function setupCanvas(canvas, opts={}) {
  let ctx = null;
  try {
    ctx = canvas.getContext("2d");
  } catch (err) {
    throw err;
  }
  if (!ctx) {
    throw "canvas is not supported in the browser";
  }
  ctx.opts = Object.assign({}, defaults, opts);
  canvas.style.width = opts.width + 'px';
  canvas.style.height = opts.height + 'px';
  ctx.w = opts.width;
  ctx.h = opts.height;

  ctx.devicePixelRatio = window.devicePixelRatio;
  if (ctx.devicePixelRatio < 1) {
    ctx.devicePixelRatio = 1;
  }
  canvas.width = ctx.devicePixelRatio * opts.width;
  canvas.height = ctx.devicePixelRatio * opts.height;

  ctx.drawingBox = BoxModel(ctx.w, ctx.h, opts);

  return ctx;
}