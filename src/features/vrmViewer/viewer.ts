import { loadMixamoAnimation } from '@/lib/fbxAnimation/loadMixamoAnimation';
import { loadBVHAnimationUrl } from "@/lib/VRMAnimation/loadBVHAnimation";
import { loadVRMAnimation } from "@/lib/VRMAnimation/loadVRMAnimation";
import { buildUrl } from "@/utils/buildUrl";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Model } from "./model";

const defaultAnimationUrl = buildUrl("/idle_loop.vrma");

/**
 * three.jsを使った3Dビューワー
 *
 * setup()でcanvasを渡してから使う
 */
export class Viewer {
  public isReady: boolean;
  public model?: Model;

  private _renderer?: THREE.WebGLRenderer;
  private _clock: THREE.Clock;
  private _scene: THREE.Scene;
  private _camera?: THREE.PerspectiveCamera;
  private _cameraControls?: OrbitControls;

  private _currentAnimationUrl: string;
  private _currentAnimationType: string;

  constructor() {
    this.isReady = false;

    // scene
    const scene = new THREE.Scene();
    this._scene = scene;

    // light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight.position.set(1.0, 1.0, 1.0).normalize();
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // animate
    this._clock = new THREE.Clock();
    this._clock.start();

    // current animation
    this._currentAnimationUrl = defaultAnimationUrl;
    this._currentAnimationType = "vrma";
  }

  public loadVrm(url: string) {
    if (this.model?.vrm) {
      this.unloadVRM();
    }

    // gltf and vrm
    this.model = new Model(this._camera || new THREE.Object3D());
    this.model.loadVRM(url).then(async () => {
      if (!this.model?.vrm) return;

      // Disable frustum culling
      this.model.vrm.scene.traverse((obj) => {
        obj.frustumCulled = false;
      });

      this._scene.add(this.model.vrm.scene);

      // const vrma = await loadVRMAnimation(buildUrl("/idle_loop.vrma"));
      // if (vrma) this.model.loadAnimation(vrma, 0);

      if (this._currentAnimationUrl && this._currentAnimationType === "vrma") {
        const vrma = await loadVRMAnimation(this._currentAnimationUrl);
        if (vrma) this.model.loadAnimation(vrma, 0);
      } else if (this._currentAnimationUrl && this._currentAnimationType === "fbx") {
        this.loadFbx(this._currentAnimationUrl);
      }

      // HACK: アニメーションの原点がずれているので再生後にカメラ位置を調整する
      requestAnimationFrame(() => {
        this.resetCamera();
      });
    });
  }

  public unloadVRM(): void {
    if (this.model?.vrm) {
      this._scene.remove(this.model.vrm.scene);
      this.model?.unLoadVrm();
    }
  }

  public async loadVrma(url: string) {

    if (this.model?.vrm) {
      this._currentAnimationUrl = url;
      this._currentAnimationType = "vrma";

      const vrma = await loadVRMAnimation(this._currentAnimationUrl);
      if (vrma) {
        await this.model.loadAnimation(vrma, 1)
      }

      const id = requestAnimationFrame(() => {
        this.resetCamera();
      });
    }
  }

  public async loadBvh(url: string) {
    if (this.model?.vrm) {
      this._currentAnimationUrl = await loadBVHAnimationUrl(url);
      this._currentAnimationType = "vrma";

      const vrma = await loadVRMAnimation(this._currentAnimationUrl);
      if (vrma) {
        await this.model.loadAnimation(vrma, 1)
      }

      const id = requestAnimationFrame(() => {
        this.resetCamera();
      });
    }
  }

  public async loadFbx(url: string) {

    if (this.model?.vrm) {
      this._currentAnimationUrl = url;
      this._currentAnimationType = "fbx";

      // Load animation
      loadMixamoAnimation(this._currentAnimationUrl,
        this.model.vrm).then((clip: THREE.AnimationClip) => {
          this.model?.loadFbxAnimation(clip)
        }).then(() => {
          requestAnimationFrame(() => {
            this.resetCamera();
          });
        });
    } else {
      console.error("No VRM loaded yet, cannot load FBX animation.");
    }
  }

  /**
   * Reactで管理しているCanvasを後から設定する
   */
  public setup(canvas: HTMLCanvasElement) {
    const parentElement = canvas.parentElement;
    const width = parentElement?.clientWidth || canvas.width;
    const height = parentElement?.clientHeight || canvas.height;
    // renderer
    this._renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    // this._renderer.outputEncoding = THREE.sRGBEncoding;
    this._renderer.setSize(width, height);
    this._renderer.setPixelRatio(window.devicePixelRatio);

    // camera
    this._camera = new THREE.PerspectiveCamera(20.0, width / height, 0.1, 20.0);
    // リセット時の原点セット x: 少し横向き z: 少し離れる
    this._camera.position.set(2, 5.3, 4.5);
    // this._camera.position.set(0, 1.3, 1.5);
    this._cameraControls?.target.set(0, 1.3, 0);
    this._cameraControls?.update();
    // camera controls
    this._cameraControls = new OrbitControls(
      this._camera,
      this._renderer.domElement
    );
    this._cameraControls.screenSpacePanning = true;
    this._cameraControls.update();

    window.addEventListener("resize", () => {
      this.resize();
    });
    this.isReady = true;
    this.update();
  }

  /**
   * canvasの親要素を参照してサイズを変更する
   */
  public resize() {
    if (!this._renderer) return;

    const parentElement = this._renderer.domElement.parentElement;
    if (!parentElement) return;

    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(
      parentElement.clientWidth,
      parentElement.clientHeight
    );

    if (!this._camera) return;
    this._camera.aspect =
      parentElement.clientWidth / parentElement.clientHeight;
    this._camera.updateProjectionMatrix();
  }

  /**
   * VRMのheadノードを参照してカメラ位置を調整する
   */
  public resetCamera() {
    const headNode = this.model?.vrm?.humanoid.getNormalizedBoneNode("head");

    if (headNode) {
      const headWPos = headNode.getWorldPosition(new THREE.Vector3());
      this._camera?.position.set(
        this._camera.position.x,
        headWPos.y,
        this._camera.position.z
      );
      // ここでキャラの初期位置を調整する
      this._cameraControls?.target.set(headWPos.x - 1.8, headWPos.y, headWPos.z);
      // this._cameraControls?.target.set(headWPos.x, headWPos.y, headWPos.z);
      this._cameraControls?.update();
    }
  }

  public moveCamera(x: number, y: number, z: number) {
    const headNode = this.model?.vrm?.humanoid.getNormalizedBoneNode("head");

    if (headNode) {
      const headWPos = headNode.getWorldPosition(new THREE.Vector3());
      this._cameraControls?.target.set(headWPos.x - 0.5 + x, headWPos.y - 0.2 + y, headWPos.z + z);
      this._cameraControls?.update();
    }
  }

  public update = () => {
    requestAnimationFrame(this.update);
    const delta = this._clock.getDelta();
    // update vrm components
    if (this.model) {
      this.model.update(delta);
    }

    if (this._renderer && this._camera) {
      this._renderer.render(this._scene, this._camera);
    }
  };
}
