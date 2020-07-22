import {initializeCanvas} from "./setup.js";
import {colors} from "../../../utils/colors.js";
import createTypeOptions from "./create-type-options.js";

const minHeight = 200;

function computePositions(data, width, height, radius=20, padding=10) {
  let expected_width_1 = data.x.length * (radius * 2 + padding) + padding;
  let expected_width_2 = data.y.length * (radius * 2 + padding) + padding;

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
        x: start1 + (i + 1) * (radius * 2 + padding) - radius,
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
        x: start2 + (i + 1) * (radius * 2 + padding) - radius,
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
  let computed = computePositions(data, 800, 600);
  let ctx = initializeCanvas(canvas, {width: computed.width, height: computed.height});
  ctx.elements = computed.elements;
  ctx.selectedTypes = [... computed.elements.types].sort();
  ctx.w = computed.width;
  ctx.h = computed.height;

  requestAnimationFrame(() => {
    updateNetworkGraph(ctx);
    if (typeFilterId) {
      requestAnimationFrame(() => {
        createTypeOptions(ctx, typeFilterId, updateNetworkGraph);
      });
    }
  })
}

function updateNetworkGraph(ctx, pos={x: 0, y: 0}, required=false) {
  ctx.clearRect(0, 0, ctx.w, ctx.h);
  let elements = ctx.elements;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let key of elements.upper.keys) {
    let c = elements.upper.elems[key];
    for (let p of c.connections) {
      if (ctx.selectedTypes.includes(p.type)) {
        ctx.save();
        ctx.strokeStyle = colors.getColor(p.type, .8);
        ctx.beginPath();
        ctx.moveTo(c.coordinates.x, c.coordinates.y);
        ctx.lineTo(elements.lower.elems[p.name].coordinates.x, elements.lower.elems[p.name].coordinates.y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
  ctx.fillStyle = colors.getColor('upper');
  _drawCircles(ctx, elements.upper);
  ctx.fillStyle = colors.getColor('lower');
  _drawCircles(ctx, elements.lower);
}

function _drawCircles(ctx, obj) {
  for (let key of obj.keys) {
    let c = obj.elems[key];
    ctx.beginPath();
    ctx.arc(c.coordinates.x, c.coordinates.y, c.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillText(c.name, c.coordinates.x, c.coordinates.y);
    ctx.restore();
  }
}