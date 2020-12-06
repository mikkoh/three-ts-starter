import { IcosahedronBufferGeometry, Mesh, MeshMatcapMaterial } from "three";
import Stats from "stats.js";

import { App, AppTimeParams } from "./App";
import { textureLoader } from "./loaders/textures";

const app = new App();
const stats = new Stats();

async function initAndStart() {
  let mesh: Mesh;

  await app.initialize({
    canvas: document.querySelector("#appCanvas"),
    async onInitialize(app: App) {
      app.renderer.domElement.parentElement.appendChild(stats.dom);

      const scene = app.scene;
      const geometry = new IcosahedronBufferGeometry();
      const matcap = await textureLoader("./resources/matcap.jpg");
      const material = new MeshMatcapMaterial({
        matcap,
      });
      mesh = new Mesh(geometry, material);
      scene.add(mesh);
    },
    onBeforeRender(time: AppTimeParams) {
      stats.begin();
      mesh.rotateY(time.deltaTimeSeconds * Math.PI * 0.5);
    },
    onAfterRender() {
      stats.end();
    },
    onResize(params) {
      console.log(params);
    },
  });

  app.start();
  console.log("start");
}

initAndStart();
