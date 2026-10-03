import * as THREE from "three";
import { FollowCamera } from "./camera";
import { InputState } from "./input";
import { PlayerController } from "./player";
import { Hud } from "./ui";
import { createWorld } from "./world";

export class WildreachGame {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly input = new InputState();
  private readonly player = new PlayerController();
  private readonly followCamera: FollowCamera;
  private readonly hud = new Hud();
  private lastTime = 0;
  private running = false;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500);
    this.followCamera = new FollowCamera(this.camera);
    this.input.attach(canvas, window);
    createWorld(this.scene);
    this.scene.add(this.player.group);
    window.addEventListener("resize", () => this.resize());
    this.resize();
    this.exposeTestHook();
  }

  start(): void {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame((time) => this.tick(time));
  }

  private tick(time: number): void {
    if (!this.running) return;
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    const snapshot = this.player.update(this.input, dt);
    this.followCamera.update(snapshot);
    this.hud.update(snapshot);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame((next) => this.tick(next));
  }

  private resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private exposeTestHook(): void {
    if (!import.meta.env.DEV && !import.meta.env.MODE.includes("test")) return;
    window.__wildreachTest = {
      player: () => this.player.snapshot()
    };
  }
}

declare global {
  interface Window {
    __wildreachTest?: {
      player: () => ReturnType<PlayerController["snapshot"]>;
    };
  }
}
