import {initializeCanvas} from "./setup.js";
import {colors} from "../../../utils/colors.js";
import createTypeOptions from "./create-type-options.js";
import {onLineOrNot} from "../../../utils/shape.js";

const minHeight = 200;

function computePositions(data, width, height, radius = 20, padding = 10, margin = 60) {
  let expected_width_1 = data.x.length * (radius * 2 + padding) + padding + margin * 2;
  let expected_width_2 = data.y.length * (radius * 2 + padding) + padding + margin * 2;

  let max = expected_width_1 > expected_width_2 ? expected_width_1 : expected_width_2;
  width = width > max ? width : max;
  height = height > minHeight ? height : minHeight;

  let start1 = Math.floor((width - expected_width_1) / 2);
  let start2 = Math.floor((width - expected_width_2) / 2);

  let res = {
    upper: {
      keys: data.x,
      elems: {},
    },
    lower: {
      keys: data.y,
      elems: {},
    },
    types: new Set(),
  };
  for (let i = 0; i < data.x.length; i++) {
    res.upper.elems[data.x[i]] = {
      name: data.x[i],
      coordinates: {
        x: start1 + (i + 1) * (radius * 2 + padding) - radius + margin,
        y: Math.floor(height / 4),
      },
      connections: [],
      radius: radius,
    };
  }

  for (let i = 0; i < data.y.length; i++) {
    res.lower.elems[data.y[i]] = {
      name: data.y[i],
      coordinates: {
        x: start2 + (i + 1) * (radius * 2 + padding) - radius + margin,
        y: Math.floor(height * 3 / 4),
      },
      connections: [],
      radius: radius,
    }
  }

  let keys = Object.keys(data.data);
  for (let key of keys) {
    if (data.data[key].value) {
      let [x, y] = key.split('-');
      res.upper.elems[x].connections.push({
        name: y,
        type: data.data[key].type,
      });
      res.lower.elems[y].connections.push({
        name: x,
        type: data.data[key].type,
      });
    }
    res.types.add(data.data[key].type);
  }

  return {
    elements: res,
    width: width,
    height: height,
  };
}

export default function drawNetwork(canvas, data, typeFilterId) {
  const computed = computePositions(data, 800, 600);
  const ctx = initializeCanvas(canvas, {width: computed.width, height: computed.height});
  ctx.elements = computed.elements;
  ctx.selectedTypes = [...computed.elements.types].filter(d => d !== '').sort();
  ctx.w = computed.width;
  ctx.h = computed.height;

  requestAnimationFrame(() => {
    updateNetworkGraph(ctx);
    if (typeFilterId) {
      requestAnimationFrame(() => {
        createTypeOptions(ctx, typeFilterId, updateNetworkGraph);
      });
    }
  });

  canvas.addEventListener('mousedown', evt => {
    const pos = getPositionOnCanvas(canvas, evt);
    const target = getDragged(ctx.elements, pos);
    if (target) {
      // ctx.pos = pos; // for verifying movementX
      ctx.draggedTarget = target;
      ctx.draggedTarget.offsetFromCenter = {
        offsetX: ctx.draggedTarget.coordinates.x - pos.x,
        offsetY: ctx.draggedTarget.coordinates.y - pos.y,
      }
    }
    requestAnimationFrame(() => {
      updateNetworkGraph(ctx, pos);
    });
  });

  canvas.addEventListener('mousemove', evt => {
    if (ctx.draggedTarget) {
      // ctx.draggedTarget.coordinates.x += evt.movementX  / ctx.devicePixelRatio;
      // ctx.draggedTarget.coordinates.y += evt.movementY / ctx.devicePixelRatio;
      // the following way to reset draggedTarget's coordinates is better than the above one
      // 1. no float coordinates introduced by dividing
      // 2. hard to understand why it is necessary to divide movementX and movementY by devicePixelRatio
      const pos = getPositionOnCanvas(canvas, evt);
      // console.log(pos.x - ctx.pos.x, evt.movementX); // for verifying whether the two are equal
      // ctx.pos = pos;
      ctx.draggedTarget.coordinates.x = pos.x + ctx.draggedTarget.offsetFromCenter.offsetX;
      ctx.draggedTarget.coordinates.y = pos.y + ctx.draggedTarget.offsetFromCenter.offsetY;
      requestAnimationFrame(() => {
        updateNetworkGraph(ctx, pos);
      });
    }
  })

  canvas.addEventListener('mouseup', () => {
    ctx.draggedTarget = null;
    removeHighlights(ctx.elements);
    requestAnimationFrame(() => {
      updateNetworkGraph(ctx);
    });
  });

  canvas.addEventListener('mouseout', () => {
    ctx.draggedTarget = null;
    removeHighlights(ctx.elements);
    requestAnimationFrame(() => {
      updateNetworkGraph(ctx);
    });
  });
}

function updateNetworkGraph(ctx, pos = {x: 0, y: 0}) {
  const elements = ctx.elements;
  ctx.clearRect(0, 0, ctx.w, ctx.h);
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // determine what to highlight
  if (ctx.draggedTarget) {
    ctx.draggedTarget.highlight = true;
    const group = ctx.draggedTarget.group === 'upper' ? 'lower' : 'upper';
    for (const c of ctx.draggedTarget.connections) {
      if (ctx.selectedTypes.includes(c.type)) {
        elements[group].elems[c.name].highlight = true;
      }
    }

    for (const key of elements.upper.keys) {
      const c = elements.upper.elems[key];
      for (let p of c.connections) {
        if (ctx.selectedTypes.includes(p.type)) {
          ctx.beginPath();
          ctx.strokeStyle = colors.getColor(p.type, .78);
          ctx.moveTo(c.coordinates.x, c.coordinates.y);
          if (c.highlight && elements.lower.elems[p.name].highlight) {
            ctx.save();
            ctx.strokeStyle = colors.getColor(p.type, .98);
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 6;
            ctx.lineTo(elements.lower.elems[p.name].coordinates.x, elements.lower.elems[p.name].coordinates.y);
            ctx.stroke();
            ctx.restore();
          } else {
            ctx.lineTo(elements.lower.elems[p.name].coordinates.x, elements.lower.elems[p.name].coordinates.y);
            ctx.stroke();
          }
        }
      }
    }
  } else {
    for (let key of elements.upper.keys) {
      const c = elements.upper.elems[key];
      for (const p of c.connections) {
        if (ctx.selectedTypes.includes(p.type)) {
          ctx.save();
          ctx.strokeStyle = colors.getColor(p.type, .78);
          ctx.beginPath();
          if (onLineOrNot([c.coordinates.x, c.coordinates.y],
            [elements.lower.elems[p.name].coordinates.x, elements.lower.elems[p.name].coordinates.y],
            [pos.x, pos.y])) {
            ctx.strokeStyle = colors.getColor(p.type);
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 6;
            c.highlight = true;
            elements.lower.elems[p.name].highlight = true;
          }
          ctx.moveTo(c.coordinates.x, c.coordinates.y);
          ctx.lineTo(elements.lower.elems[p.name].coordinates.x, elements.lower.elems[p.name].coordinates.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }


  _drawCircles(ctx, elements.upper, 'upper');
  _drawCircles(ctx, elements.lower, 'lower');
}

function _drawCircles(ctx, obj, group = "") {
  for (const key of obj.keys) {
    const c = obj.elems[key];
    ctx.beginPath();
    ctx.fillStyle = colors.getColor(group, .88);
    if (c.highlight) {
      ctx.save();
      ctx.fillStyle = colors.getColor(group, .99);
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      ctx.arc(c.coordinates.x, c.coordinates.y, c.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.arc(c.coordinates.x, c.coordinates.y, c.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillText(c.name, c.coordinates.x, c.coordinates.y);
    ctx.restore();
  }
}

function getPositionOnCanvas(canvas, evt) {
  const {top, left} = canvas.getBoundingClientRect();
  return {
    x: evt.x - left,
    y: evt.y - top,
  };
}

function getDragged(elements, pos) {
  for (const key of elements.upper.keys) {
    const c = elements.upper.elems[key];
    if (Math.sqrt((c.coordinates.x - pos.x) ** 2 + (c.coordinates.y - pos.y) ** 2) < c.radius) {
      c.group = 'upper';
      return c;
    }
  }
  for (const key of elements.lower.keys) {
    const c = elements.lower.elems[key];
    if (Math.sqrt((c.coordinates.x - pos.x) ** 2 + (c.coordinates.y - pos.y) ** 2) < c.radius) {
      c.group = 'lower';
      return c;
    }
  }
  return null;
}

function removeHighlights(elements) {
  for (const pos of ['upper', 'lower']) {
    for (const key of elements[pos].keys) {
      elements[pos].elems[key].highlight = false;
    }
  }
}