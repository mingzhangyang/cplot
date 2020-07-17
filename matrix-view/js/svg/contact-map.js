import config from "../utils/config.js";
import getColor from "../utils/colors.js";

const xmlns = "http://www.w3.org/2000/svg";

export default function contactMapSVG(id, data={x: [], y: [], data: {}}, setting={}, options={}) {
  let opt = Object.assign({}, config, options);
  let svg = document.getElementById(id);
  while (svg.lastChild) {
    svg.removeChild(svg.lastChild);
  }

  svg.setAttribute('width', setting.outerWidth + '');
  svg.setAttribute('height', setting.outerHeight + '');

  let bg = svg.appendChild(document.createElementNS(xmlns, 'rect'));
  bg.setAttributeNS(null, 'x', 0);
  bg.setAttributeNS(null, 'y', 0);
  bg.setAttributeNS(null, 'width', setting.outerWidth + '');
  bg.setAttributeNS(null, 'height', setting.outerHeight + '');
  bg.setAttributeNS(null, 'fill', opt.backgroundColor);

  let g = svg.appendChild(document.createElementNS(xmlns, 'g'));
  g.setAttributeNS(null,'transform', `translate(${opt.margin.left - opt.lineWidth / 2}, ${opt.margin.top - opt.lineWidth / 2})`);
  g.setAttributeNS(null, 'font-family', opt.font.split(' ')[1]);
  g.setAttributeNS(null, 'font-size', opt.font.split(' ')[0]);
  g.setAttributeNS(null, 'stroke-width', opt.lineWidth);

  let w = setting.innerWidth;
  let h = setting.innerHeight;
  let rect = g.appendChild(document.createElementNS(xmlns, 'rect'));
  rect.setAttributeNS(null, 'x', 0);
  rect.setAttributeNS(null, 'y', 0);
  rect.setAttributeNS(null, 'width', w);
  rect.setAttributeNS(null, 'height', h);
  rect.setAttributeNS(null, 'stroke', opt.lineColor);
  rect.setAttributeNS(null, 'fill', opt.backgroundColor);

  let gridWidth = opt.gridWidth;
  for (let i = 0; i < data.x.length; i++) {
    let line = g.appendChild(document.createElementNS(xmlns, 'line'));
    line.setAttributeNS(null, 'x1', `${(i + 1) * gridWidth}`);
    line.setAttributeNS(null, 'y1', '0');
    line.setAttributeNS(null, 'x2', `${(i + 1) * gridWidth}`);
    line.setAttributeNS(null, 'y2', `${h}`);
    line.setAttributeNS(null, 'stroke', opt.lineColor);
    line.setAttributeNS(null, 'stroke-dasharray', opt.lineDash.join(' '));
    let text = g.appendChild(document.createElementNS(xmlns, 'text'));
    text.setAttributeNS(null, 'x', `${(i + 1) * gridWidth}`);
    text.setAttributeNS(null, 'y', `${-opt.textMargin}`);
    text.setAttributeNS(null, 'fill', opt.textColor);
    text.setAttributeNS(null, 'alignment-baseline', 'middle');
    text.setAttributeNS(null, 'text-anchor', 'start');
    text.setAttributeNS(null,'transform', `rotate(-90, ${(i+1) * gridWidth}, ${-opt.textMargin})`);
    text.appendChild(document.createTextNode(data.x[i]));
  }

  for (let i = 0; i < data.y.length; i++) {
    let line = g.appendChild(document.createElementNS(xmlns, 'line'));
    line.setAttributeNS(null, 'y1', `${(i + 1) * gridWidth}`);
    line.setAttributeNS(null, 'x1', '0');
    line.setAttributeNS(null, 'y2', `${(i + 1) * gridWidth}`);
    line.setAttributeNS(null, 'x2', `${w}`);
    line.setAttributeNS(null, 'stroke', opt.lineColor);
    line.setAttributeNS(null, 'stroke-dasharray', opt.lineDash.join(' '));
    let text = g.appendChild(document.createElementNS(xmlns, 'text'));
    text.setAttributeNS(null, 'y', `${(i + 1) * gridWidth}`);
    text.setAttributeNS(null, 'x', `${-opt.textMargin}`);
    text.setAttributeNS(null, 'fill', opt.textColor);
    text.setAttributeNS(null, 'alignment-baseline', 'middle');
    text.setAttributeNS(null, 'text-anchor', 'end');
    text.appendChild(document.createTextNode(data.y[i]));
  }

  for (let i = 0; i < data.x.length; i++) {
    for (let j = 0; j < data.y.length; j++) {
      let o = data.data[`${data.x[i]}-${data.y[j]}`];
      if (setting.selectedTypes.includes(o.type) && o.value) {
        let circle = g.appendChild(document.createElementNS(xmlns, 'circle'));
        circle.setAttributeNS(null, 'cx', (i + 1) * gridWidth + '');
        circle.setAttributeNS(null, 'cy', (j + 1) * gridWidth + '');
        circle.setAttributeNS(null, 'r', opt.circleRadius);
        circle.setAttributeNS(null, 'fill', getColor(o.type));
      }
    }
  }
}