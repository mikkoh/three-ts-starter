import {
  IcosahedronBufferGeometry,
  Mesh,
  Texture,
  MeshMatcapMaterial,
  UniformsUtils,
  ShaderLib,
  Uniform,
} from "three";

import { CustomMaterial } from "../materials/CustomMaterial";

import vertexShader from "./Sphere/sphere.vert";
import fragmentShader from "./Sphere/sphere.frag";

class SphereMaterial extends CustomMaterial(MeshMatcapMaterial, {
  vertexShader,
  fragmentShader,
  uniforms: UniformsUtils.merge([
    ShaderLib.matcap,
    {
      time: new Uniform(0),
    },
  ]),
}) {
  get time(): number {
    return this.getCustomUniform("time");
  }

  set time(value: number) {
    this.setCustomUniform("time", value);
  }
}

export class Sphere extends Mesh {
  get time(): number {
    return this.material.time;
  }

  set time(value: number) {
    this.material.time = value;
  }

  material: SphereMaterial;

  constructor(matcap: Texture) {
    const geometry = new IcosahedronBufferGeometry();
    const material = new SphereMaterial();
    material.matcap = matcap;

    super(geometry, material);

    this.material = material;
  }
}
