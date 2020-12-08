import { Shader, IUniform, WebGLRenderer, Material } from "three";

interface CustomUniforms {
  [uniform: string]: IUniform;
}

export interface CustomShader {
  uniforms?: CustomUniforms;
  vertexShader?: string;
  fragmentShader?: string;
}

type Constructor = new (...args: any[]) => {};

function CustomMaterial<TMaterial extends Constructor>(
  Base: TMaterial,
  customShader: CustomShader
) {
  return class CustomMeshStandardMaterial extends Base {
    private customUniforms: CustomUniforms;
    private customVertexShader: string;
    private customFragmentShader: string;

    constructor(...args: any[]) {
      super(...args);

      this.customVertexShader = customShader.vertexShader;
      this.customFragmentShader = customShader.fragmentShader;
      this.customUniforms = customShader.uniforms;
    }

    onBeforeCompile(shader: Shader, _renderer: WebGLRenderer): void {
      if (this.customUniforms) {
        for (const [key, value] of Object.entries(this.customUniforms)) {
          shader.uniforms[key] = value;
        }
      }

      shader.vertexShader = this.customVertexShader || shader.vertexShader;
      shader.fragmentShader =
        this.customFragmentShader || shader.fragmentShader;
    }

    protected setCustomUniform(key: string, value: any) {
      this.initializeCustomUniforms();
      this.customUniforms[key].value = value;
    }

    protected getCustomUniform(key: string): any {
      this.initializeCustomUniforms();
      return this.customUniforms[key] && this.customUniforms[key].value;
    }

    protected initializeCustomUniforms() {
      if (!this.customUniforms) {
        this.customUniforms = {};
      }
    }
  };
}

export { CustomMaterial };
