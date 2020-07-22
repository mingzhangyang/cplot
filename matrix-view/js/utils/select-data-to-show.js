import sampleData from "./sample-data.js";
import {labels, values} from "./real-data.js";
import drawContactMap from "../canvas/contact-map.js";
import drawNetwork from "../canvas/network-graph.js";

export default function load() {
  let d = document.getElementById('data');
  let selected = d.options[d.selectedIndex].value;
  let tabSwitch = document.getElementById('tab-switch');
  let canvas = document.getElementById('canvas');
  let canvas2 = document.getElementById('canvas-2');
  switch (selected) {
    case 'sample-data':
      if (tabSwitch.classList.contains('contact')) {
        drawContactMap(canvas, sampleData, 'info-panel', 'type-options');
        document.getElementById('type-selector').classList.remove('hidden');
      } else {
        drawNetwork(canvas2, sampleData, 'type-options-2');
      }
      break;
    case 'common-values':
      if (tabSwitch.classList.contains('contact')) {
        drawContactMap(canvas, values, 'info-panel', '');
        document.getElementById('type-selector').classList.add('hidden');
      } else {
        drawNetwork(canvas2, values, 'type-options-2');
      }

      break;
    case 'common-labels':
      if (tabSwitch.classList.contains('contact')) {
        drawContactMap(canvas, labels, 'info-panel', 'type-options');
        document.getElementById('type-selector').classList.remove('hidden');
      } else {
        drawNetwork(canvas2, labels, 'type-options-2');
      }
      break;
    default:
      alert("Hey, you shouldn't see this alert.");
  }
}