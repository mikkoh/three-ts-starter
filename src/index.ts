import Stats from 'stats.js';

import {App, AppTimeParams} from './App';
import {textureLoader} from './loaders/textures';
import {Sphere} from './object3d/Sphere';

const app = new App();
const stats = new Stats();

async function initAndStart() {
  let sphere: Sphere;

  await app.initialize({
    canvas: document.querySelector('#appCanvas'),
    async onInitialize(app: App) {
      app.renderer.domElement.parentElement.appendChild(stats.dom);

      const scene = app.scene;
      const matcap = await textureLoader('./resources/matcap.jpg');
      sphere = new Sphere(matcap);
      scene.add(sphere);
    },
    onBeforeRender(time: AppTimeParams) {
      stats.begin();
      sphere.time = time.elapsedTimeSeconds;
      sphere.rotateY(time.deltaTimeSeconds * Math.PI * 0.5);
    },
    onAfterRender() {
      stats.end();
    },
    onResize(params) {
      console.log(params);
    },
  });

  app.start();
  console.log('start');
}

window.addEventListener('DOMContentLoaded', initAndStart);
