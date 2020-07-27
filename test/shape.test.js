import {Point, Triangle} from "../utils/shape.js";

const p1 = new Point(1, 1);
const p2 = new Point(5, 5);
const p3 = new Point(5, 1);

const triangle = new Triangle(p1, p2, p3);

const cases = [
  {
    input: [1, 1],
    expected: true,
  },
  {
    input: [5, 5],
    expected: true,
  },
  {
    input: [5, 1],
    expected: true,
  },
  {
    input: [0, 0],
    expected: false,
  },
  {
    input: [8, 8],
    expected: false,
  },
  {
    input: [5, 0],
    expected: false,
  },
  {
    input: [10, 1],
    expected: false,
  },
  {
    input: [3, 6],
    expected: false,
  },
  {
    input: [-2, -1],
    expected: false,
  },
  {
    input: [-2, -2],
    expected: false,
  },
  {
    input: [-1, -2],
    expected: false,
  },
  {
    input: [0, -10],
    expected: false,
  },
  {
    input: [-1, 1],
    expected: false,
  },
  {
    input: [-5, 1],
    expected: false,
  }
];

function testPosition() {
  let i = 1;
  let zone = document.getElementById('position-test');
  for (let c of cases) {
    let r = triangle.contains(new Point(...c.input));
    c.pass = r === c.expected;
    let p = zone.appendChild(document.createElement('p'));
    p.classList.add(`test-pass-${c.pass}`);
    let span = p.appendChild(document.createElement('span'));
    span.classList.add('row-number');
    span.innerText = `#${i++}`;
    span = p.appendChild(document.createElement('span'));
    span.classList.add('row-content');
    span.innerText = `input: ${c.input}, expected: ${c.expected}, return: ${r}, pass: ${c.pass}`;
  }
}

testPosition();