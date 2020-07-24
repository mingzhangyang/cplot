import {randomInt} from "../../../utils/misc.js";

export default function createTypeOptions(ctx, id, cb) {
  let types = ctx.selectedTypes.filter(d => d);
  let ts = document.getElementById(id);
  while (ts.lastChild) {
    ts.removeChild(ts.lastChild);
  }
  for (let type of types) {
    let span = ts.appendChild(document.createElement('span'));
    span.classList.add('type-option');
    let inp = span.appendChild(document.createElement('input'));
    inp.type = 'checkbox';
    inp.checked = true;
    inp.setAttribute('id', `type-${type}-${randomInt()}`);
    inp.value = type;
    inp.addEventListener('change', () => {
      let arr = [];
      let opts = ts.getElementsByClassName('type-option');
      for (let opt of opts) {
        if (opt.firstChild.checked) {
          arr.push(opt.firstChild.value);
        }
      }
      ctx.selectedTypes = arr;
      requestAnimationFrame(() => {
        cb(ctx, {x: 0, y: 0}, true);
      });
    });
    let label = span.appendChild(document.createElement('label'));
    label.setAttribute('for', inp.id);
    label.innerText = type;
  }
}