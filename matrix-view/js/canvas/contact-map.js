import {initializeCanvas, setupScale} from "./setup.js";
import config from "../utils/config.js";
import {colors} from "../../../utils/colors.js";
import createTypeOptions from "./create-type-options.js";

/**
 * draw contact map
 * @param canvas
 * @param data : object, i.e. {
 *   x: ['a', 'b', 'c'],
 *   y: ['d', 'e', 'f'],
 *   data: {
 *     'a-d': {type: '', value: 1},
 *     'a-e': {type: '', value: 1},
 *     'a-f': {type: '', value: 1},
 *     ...
 *   }
 * }
 * @param infoPanelId : string : of the info panel
 * @param typeFilterId : string : of the type selector
 * @param options : object : for custom configuration of the canvas
 */
export default function drawContactMap(canvas, data = {x: [], y: [], data: {}}, infoPanelId, typeFilterId, options={}) {
  const opt = Object.assign({}, config, options);
  canvas.config = opt;
  const gridWidth = opt.gridWidth;
  canvas.innerWidth = gridWidth * (data.x.length + 1); // the width of the grids
  canvas.innerHeight = gridWidth * (data.y.length + 1); // the height of the grids
  // the size of the grids plus margins, practically it will be the size of the canvas element
  const w = canvas.innerWidth + opt.margin.left + opt.margin.right;
  const h = canvas.innerHeight + opt.margin.top + opt.margin.bottom;
  const ctx = initializeCanvas(canvas, {width: w, height: h});

  ctx.data = data;
  ctx.selectedTypes = [...(new Set(Object.values(data.data).map(d => d.type)))].filter(d => d).sort();
  // the status to indicate whether the pointer is over a circle and the indexes of the circle
  // [-1, -1] represents not hovering on a circle, [m, n] tells which circle is highlighted
  ctx.highlighted = [-1, -1];

  if (infoPanelId) {
    canvas.infoPanel = document.getElementById(infoPanelId);
  }

  requestAnimationFrame(() => {
    updateContactMap(ctx, {x: 0, y: 0}, true);
    if (typeFilterId) {
      requestAnimationFrame(() => {
        createTypeOptions(ctx, typeFilterId, updateContactMap);
      });
    }
  });

  canvas.addEventListener('contextmenu', evt => {
    evt.preventDefault();
  });

  canvas.addEventListener('click', evt => {
    const rect = canvas.getBoundingClientRect();
    const data = ctx.data;
    const [m, n] = getIndexes(canvas.config, canvas.innerWidth, canvas.innerHeight, {x: evt.x - rect.left, y: evt.y - rect.top});
    const obj = data.data[`${data.x[m]}-${data.y[n]}`];
    if (obj && obj.value && ctx.selectedTypes.includes(obj.type)) {
      requestAnimationFrame(() => {
        updateContactMap(ctx, {
          x: evt.clientX,
          y: evt.clientY,
        });
        ctx.canvas.infoPanel.classList.add('live');
        if (canvas.infoPanel) {
          updateInfoPanel(ctx.canvas.infoPanel, obj, {left: evt.x, top: evt.y});
        }
      });
    }
  });

  canvas.addEventListener('mousemove', evt => {
    requestAnimationFrame(() => {
      updateContactMap(ctx, {
        x: evt.clientX,
        y: evt.clientY,
      });
      if (canvas.infoPanel) {
        ctx.canvas.infoPanel.classList.remove('live');
      }
    })
  });

  canvas.addEventListener('mouseleave', () => {
    requestAnimationFrame(() => {
      updateContactMap(ctx);
      if (canvas.infoPanel) {
        canvas.infoPanel.classList.remove('live');
      }
    });
  });

  window.addEventListener('scroll', () => {
    if (window.devicePixelRatio !== ctx.devicePixelRatio) {
      if (canvas.infoPanel) {
        ctx.canvas.infoPanel.classList.remove('live');
      }
      requestAnimationFrame(() => {
        setupScale(ctx);
        updateContactMap(ctx);
      });
    }
  });
}

/**
 * update canvas
 * @param ctx
 * @param pos: the position of event in client coordinates system, namely, evt.x and evt.y
 * @param required: if true, update the canvas even if highlighted status not change
 */
function updateContactMap(ctx, pos = {x: 0, y: 0}, required = false) {
  const w = ctx.canvas.innerWidth;
  const h = ctx.canvas.innerHeight;
  const rect = ctx.canvas.getBoundingClientRect();

  const [p, q] = ctx.highlighted;
  const [m, n] = getIndexes(ctx.canvas.config, w, h, {x: pos.x - rect.left, y: pos.y - rect.top});
  ctx.highlighted = [m, n];

  if (p === m && q === n && !required) {
    return;
  }

  const data = ctx.data;
  const opt = ctx.canvas.config;
  const gridWidth = opt.gridWidth;
  const obj = data.data[`${data.x[m]}-${data.y[n]}`]; // if m or n is -1 or both are -1 then obj will be undefined
  // flag determines whether to light up a circle
  // the first conditional is obj itself, true only if both m and n are valid indexes and that x[m] and y[n] interacts
  const flag = obj && obj.value && ctx.selectedTypes.includes(obj.type);

  ctx.save();
  // ctx.clearRect(0, 0, ctx.w, ctx.h);
  ctx.fillStyle = opt.backgroundColor;
  ctx.lineWidth = opt.lineWidth;
  ctx.fillRect(0, 0, ctx.w, ctx.h);

  ctx.strokeStyle = opt.lineColor;
  ctx.translate(opt.margin.left, opt.margin.top);
  ctx.strokeRect(0, 0, w, h);

  ctx.setLineDash(opt.lineDash);
  ctx.lineDashOffset = [0, 0];
  ctx.lineCap = 'butt';
  ctx.textBaseline = 'middle';
  ctx.font = opt.font;
  ctx.fillStyle = opt.textColor;

  // ctx.save();
  for (let i = 0; i < data.x.length; i++) {
    ctx.save();
    if (flag && i === m) {
      ctx.fillStyle = opt.textHighlightColor;
      ctx.strokeStyle = opt.lineHighlightColor;
    } else {
      ctx.fillStyle = opt.textColor;
      ctx.strokeStyle = opt.lineColor;
    }
    ctx.translate((i + 1) * gridWidth, 0);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.stroke();
    ctx.rotate(-(Math.PI / 2));
    ctx.textAlign = 'left';
    ctx.fillText(data.x[i], opt.textMargin, 0);
    ctx.restore();
  }
  for (let i = 0; i < data.y.length; i++) {
    if (flag && i === n) {
      ctx.fillStyle = opt.textHighlightColor;
      ctx.strokeStyle = opt.lineHighlightColor;
    } else {
      ctx.fillStyle = opt.textColor;
      ctx.strokeStyle = opt.lineColor;
    }
    ctx.beginPath();
    ctx.moveTo(0, (i + 1) * gridWidth);
    ctx.lineTo(w, (i + 1) * gridWidth);
    ctx.closePath();
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(data.y[i], -opt.textMargin, (i + 1) * gridWidth);
  }
  ctx.fillStyle = opt.circleColor;
  for (let i = 0; i < data.x.length; i++) {
    for (let j = 0; j < data.y.length; j++) {
      // we need to consider the current object, not the one used to determine whether to light up
      const o = data.data[`${data.x[i]}-${data.y[j]}`];
      if (ctx.selectedTypes.includes(o.type) && o.value) {
        if (flag && i === m && j === n) {
          ctx.fillStyle = colors.getColor(o.type, 1);
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = colors.getColor(o.type, .72);
        }
        ctx.beginPath();
        ctx.arc((i + 1) * gridWidth, (j + 1) * gridWidth, opt.circleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  ctx.restore();
}

/**
 * get the x and y index of the highlighted circle, if no highlighted, then [-1, -1]
 * @param opt: canvas configurations
 * @param w: the width of the content area (grids)
 * @param h: the height of the content area (grids)
 * @param pos
 * @returns {(number|*)[]}
 */
function getIndexes(opt, w, h, pos) {
  const x = pos.x - opt.margin.left;
  const y = pos.y - opt.margin.top;
  const m = getIndex(x, w, opt.gridWidth, opt.circleRadius);
  const n = getIndex(y, h, opt.gridWidth, opt.circleRadius);

  return [m, n];
}

function getIndex(d, max, unit, r) {
  if (d < (unit - r) || d > (max - unit + r)) {
    return -1;
  }
  const x1 = d - d % unit;
  const x2 = x1 + unit;
  if (d - x1 < r) {
    return x1 / unit - 1;
  }
  if (x2 - d < r) {
    return x2 / unit - 1;
  }
  return -1;
}

function updateInfoPanel(panel, obj, pos = {top: 0, left: 0}) {
  panel.style.top = `${pos.top}px`;
  panel.style.left = `${pos.left}px`;
  const spans = panel.getElementsByClassName('value');
  const values = [obj.x, obj.y, obj.type, obj.value];
  let i = 0;
  for (let span of spans) {
    span.innerText = `${values[i++]}`;
  }
}
