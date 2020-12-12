import bind from 'bind-decorator';
import {Clock, PerspectiveCamera, Scene, WebGLRenderer} from 'three';

export interface AppTimeParams {
  deltaTime: number;
  deltaTimeSeconds: number;
  elapsedTime: number;
  elapsedTimeSeconds: number;
}

interface OptionalAppParams {
  onResize?: (resizeParams: {width: number; height: number}) => void;
  onBeforeRender?: (updateParams: AppTimeParams) => void;
  onAfterRender?: () => void;
}

interface AppParams extends OptionalAppParams {
  canvas: HTMLCanvasElement;
  onInitialize(app: App): Promise<void>;
}

const DEFAULT_APP_PARAMS: OptionalAppParams = {
  onResize() {},
  onBeforeRender() {},
  onAfterRender() {},
};

export class App {
  get renderer(): WebGLRenderer {
    return this._renderer;
  }

  get scene(): Scene {
    return this._scene;
  }

  get camera(): PerspectiveCamera {
    return this._camera;
  }

  private params: AppParams;
  private running: boolean;
  private clock: Clock;
  private _renderer: WebGLRenderer;
  private _scene: Scene;
  private _camera: PerspectiveCamera;

  public async initialize(params: AppParams): Promise<App> {
    this.params = {
      ...DEFAULT_APP_PARAMS,
      ...params,
    };
    const {canvas} = params;

    const renderer = new WebGLRenderer({canvas});
    this._renderer = renderer;

    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;
    renderer.autoClearColor = false;
    renderer.autoClearDepth = false;

    this._scene = new Scene();
    this._camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this._camera.position.z = 5;

    this.onResize();
    window.addEventListener('resize', this.onResize);

    this.clock = new Clock(false);

    await this.params.onInitialize(this);

    return this;
  }

  public start() {
    this.running = true;
    this.clock.start();
    this.onAimationFrame();
  }

  public stop() {
    this.running = false;
    this.clock.stop();
  }

  public dispose() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    this._renderer.dispose();
  }

  @bind
  private onAimationFrame() {
    if (!this.running) {
      return;
    }

    requestAnimationFrame(this.onAimationFrame);

    const deltaTimeSeconds = this.clock.getDelta();
    const elapsedTimeSeconds = this.clock.elapsedTime;

    this.params.onBeforeRender({
      deltaTime: deltaTimeSeconds * 1000,
      elapsedTime: elapsedTimeSeconds * 1000,
      deltaTimeSeconds,
      elapsedTimeSeconds,
    });

    this.renderer.clearDepth();
    this.renderer.clearColor();
    this.renderer.render(this.scene, this.camera);

    this.params.onAfterRender();
  }

  @bind
  private onResize() {
    const width = this._renderer.domElement.offsetWidth;
    const height = this._renderer.domElement.offsetHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height, false);
    this.params.onResize({width, height});
  }
}
