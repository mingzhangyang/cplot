import setupDownload from "./utils/download.js";
import setupImgSliding from "./utils/image-sliding.js";
import load from "./utils/select-data-to-show.js";
import drawNetwork from "./canvas/network-graph.js";
import sampleData from "./utils/sample-data.js";

window.onload = () => {
  show();
  handleModeSwitch();
  handleTabSwitch();
  setupDownload();
  setupImgSliding();
};

function show() {
  load();
  document.getElementById('data').addEventListener('change', function () {
    load();
  });
  requestAnimationFrame(() => {
    drawNetwork(document.getElementById('canvas-2'), sampleData, 'type-options-2');
  });
}

function handleTabSwitch() {
  let sw = document.getElementsByClassName('switch-controller')[0];
  for (let ctrl of document.getElementsByClassName('switcher')) {
    ctrl.addEventListener('click', function () {
      sw.classList.toggle('contact');
      sw.classList.toggle('network');
    });
  }
}

function handleModeSwitch() {
  let main = document.getElementsByClassName('main')[0];
  let live = document.getElementById('live');
  let gallery = document.getElementById('gallery');
  live.addEventListener('click', () => {
    main.classList.add('live');
    main.classList.remove('gallery');
  });
  gallery.addEventListener('click', () => {
    main.classList.remove('live');
    main.classList.add('gallery');
  });
}