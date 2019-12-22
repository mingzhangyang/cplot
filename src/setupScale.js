export function setupScale(ctx) {
  ctx.w = ctx.canvas.clientWidth;
  ctx.h = ctx.canvas.clientHeight;
  ctx.devicePixelRatio = window.devicePixelRatio;
  ctx.canvas.width = ctx.w * ctx.devicePixelRatio;
  ctx.canvas.height = ctx.h * ctx.devicePixelRatio;
  ctx.scale(ctx.devicePixelRatio, ctx.devicePixelRatio);
}