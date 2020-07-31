import {randomInt} from "../../../utils/misc.js";

export default function createTypeOptions(ctx, id, cb) {
  const types = ctx.selectedTypes.filter(d => d);
  const ts = document.getElementById(id);
  while (ts.lastChild) {
    ts.removeChild(ts.lastChild);
  }
  for (let type of types) {
    const span = ts.appendChild(document.createElement('span'));
    span.classList.add('type-option');
    const inp = span.appendChild(document.createElement('input'));
    inp.type = 'checkbox';
    inp.checked = true;
    inp.setAttribute('id', `type-${type}-${randomInt()}`);
    inp.value = type;
    inp.addEventListener('change', () => {
      const arr = [];
      const opts = ts.getElementsByClassName('type-option');
      for (const opt of opts) {
        if (opt.firstChild.checked) {
          arr.push(opt.firstChild.value);
        }
      }
      ctx.selectedTypes = arr;
      requestAnimationFrame(() => {
        cb(ctx, {x: 0, y: 0}, true);
      });
    });
    const label = span.appendChild(document.createElement('label'));
    label.setAttribute('for', inp.id);
    label.innerText = type;
  }
}