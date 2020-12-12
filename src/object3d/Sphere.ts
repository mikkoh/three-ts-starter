import {
  IcosahedronBufferGeometry,
  Mesh,
  MeshMatcapMaterial,
  ShaderLib,
  Texture,
  Uniform,
  UniformsUtils,
} from 'three';

import {CustomMaterial} from '../materials/CustomMaterial';

import fragmentShader from './Sphere/sphere.frag';
import vertexShader from './Sphere/sphere.vert';

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
    return this.getCustomUniform('time');
  }

  set time(value: number) {
    this.setCustomUniform('time', value);
  }
}

export class Sphere extends Mesh {
  get time(): number {
    return this.material.time;
  }

  set time(value: number) {
    this.material.time = value;
  }

  public material: SphereMaterial;

  constructor(matcap: Texture) {
    const geometry = new IcosahedronBufferGeometry();
    const material = new SphereMaterial();
    material.matcap = matcap;

    super(geometry, material);

    this.material = material;
  }
}
