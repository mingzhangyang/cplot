export function setupScale(ctx) {
  ctx.w = ctx.canvas.clientWidth;
  ctx.h = ctx.canvas.clientHeight;
  ctx.devicePixelRatio = window.devicePixelRatio;
  ctx.canvas.width = ctx.w * ctx.devicePixelRatio;
  ctx.canvas.height = ctx.h * ctx.devicePixelRatio;
  ctx.scale(ctx.devicePixelRatio, ctx.devicePixelRatio);
}

export function updateScale(ctx) {
  let r = window.devicePixelRatio;
  if (ctx.devicePixelRatio < r) {
    ctx.devicePixelRatio = r;
    ctx.canvas.width = ctx.w * r;
    ctx.canvas.height = ctx.h * r;
    ctx.scale(r, r,);
  }
}