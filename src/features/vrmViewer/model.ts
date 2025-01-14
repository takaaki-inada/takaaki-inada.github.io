import { VRMLookAtSmootherLoaderPlugin } from "@/lib/VRMLookAtSmootherLoaderPlugin/VRMLookAtSmootherLoaderPlugin";
import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRMAnimation } from "../../lib/VRMAnimation/VRMAnimation";
import { EmoteController } from "../emoteController/emoteController";
import { LipSync } from "../lipSync/lipSync";
import { Screenplay } from "../messages/messages";
import slideStore from "../stores/slide";

/**
 * 3Dキャラクターを管理するクラス
 */
export class Model {
  public vrm?: VRM | null;
  public mixer?: THREE.AnimationMixer;
  public emoteController?: EmoteController;

  private _lookAtTargetParent: THREE.Object3D;
  private _lipSync?: LipSync;

  constructor(lookAtTargetParent: THREE.Object3D) {
    this._lookAtTargetParent = lookAtTargetParent;
    this._lipSync = new LipSync(new AudioContext());
  }

  public async loadVRM(url: string): Promise<void> {
    const loader = new GLTFLoader();
    loader.register(
      (parser) =>
        new VRMLoaderPlugin(parser, {
          lookAtPlugin: new VRMLookAtSmootherLoaderPlugin(parser),
        })
    );

    const gltf = await loader.loadAsync(url);

    const vrm = (this.vrm = gltf.userData.vrm);
    vrm.scene.name = "VRMRoot";

    VRMUtils.rotateVRM0(vrm);
    this.mixer = new THREE.AnimationMixer(vrm.scene);

    this.emoteController = new EmoteController(vrm, this._lookAtTargetParent);

    // debug
    // this.emoteController.playEmotion("happy");
    // this.emoteController.playEmotion("angry");
    // this.emoteController.playEmotion("sad");
    // this.emoteController.playEmotion("relaxed");
    this.emoteController.playEmotion("neutral");
  }

  public unLoadVrm() {
    if (this.vrm) {
      VRMUtils.deepDispose(this.vrm.scene);
      this.vrm = null;
    }
  }

  /**
   * VRMアニメーションを読み込む
   *
   * https://github.com/vrm-c/vrm-specification/blob/master/specification/VRMC_vrm_animation-1.0/README.ja.md
   */
  public async loadAnimation(vrmAnimation: VRMAnimation, repetitions: number): Promise<void> {
    if (this.vrm == null || this.mixer == null) {
      throw new Error("You have to load VRM first");
    }

    this.mixer = new THREE.AnimationMixer(this.vrm.scene); // reset animation mixer, otherwise funny merge

    const clip = vrmAnimation.createAnimationClip(this.vrm);
    const action = this.mixer.clipAction(clip);
    if (repetitions) {
      action.setLoop(THREE.LoopOnce, repetitions);
    }
    action.play();
  }

  public async loadFbxAnimation(clip: THREE.AnimationClip): Promise<void> {
    if (this.vrm == null || this.mixer == null) {
      throw new Error("You have to load VRM first");
    }

    this.mixer = new THREE.AnimationMixer(this.vrm.scene); // reset animation mixer, otherwise funny merge

    // const { vrm, mixer } = this;
    // const action = mixer.clipAction(clip);
    const action = this.mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce, 1);
    action.play()
  }

  /**
   * 音声を再生し、リップシンクを行う
   */
  public async speak(buffer: ArrayBuffer, screenplay: Screenplay) {
    // NOTE: ここで表情を変えている src/features/messages/speakCharacter.ts から呼ばれる
    this.emoteController?.playEmotion(screenplay.expression);
    // 音声強制停止を追加 (ここに入れないと次のセリフが再生されてしまう)
    const ss = slideStore.getState()
    if (ss.isStopping) {
      this._lipSync?.stop();
      return
    }
    await new Promise((resolve) => {
      this._lipSync?.playFromArrayBuffer(buffer, () => {
        resolve(true);
      });
    });
  }

  public update(delta: number): void {
    if (this._lipSync) {
      const { volume } = this._lipSync.update();
      this.emoteController?.lipSync("aa", volume);
    }

    this.emoteController?.update(delta);
    this.mixer?.update(delta);
    this.vrm?.update(delta);
  }

  public stop() {
    this._lipSync?.stop();
  }
}
