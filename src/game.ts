import * as THREE from "three";
import { FollowCamera } from "./camera";
import { initialCampState, updateCamp, type CampState } from "./camp";
import { InputState } from "./input";
import { revealedLandmarks } from "./landmarks";
import { clearProgress, loadProgress, saveProgress, type SliceProgress } from "./persistence";
import {
  claimSpiritToken,
  initialShrineState,
  shoveBlockToPlate,
  type ShrineState
} from "./shrine";
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
  private progress: SliceProgress = loadProgress();
  private shrine: ShrineState = { ...initialShrineState };
  private camp: CampState = { ...initialCampState };
  private paused = false;
  private caption = "";
  private pauseWasDown = false;
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
    this.attachPauseMenu();
    this.resize();
    this.exposeTestHook();
  }

  start(): void {
    this.running = true;
    window.__wildreachBooted = true;
    this.lastTime = performance.now();
    requestAnimationFrame((time) => this.tick(time));
  }

  private tick(time: number): void {
    if (!this.running) return;
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    const before = this.player.snapshot();
    this.updatePause();
    if (this.paused) {
      this.hud.update(before, revealedLandmarks(this.progress.towerActivated), false, this.progress, true, this.caption);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame((next) => this.tick(next));
      return;
    }
    const canClimb = Math.hypot(before.position.x - 15, before.position.z + 22) < 5;
    const snapshot = this.player.update(this.input, dt, {
      canClimb,
      hasGlider: this.progress.gliderUnlocked
    });
    if (this.input.active("interact") && Math.hypot(snapshot.position.x, snapshot.position.z + 18) < 5) {
      this.activateTower();
    }
    if (this.input.active("interact")) {
      this.updateShrine(snapshot.position);
      this.updateVista(snapshot.position);
    }
    this.camp = updateCamp(this.camp, snapshot.position, this.input.primary);
    this.followCamera.update(snapshot);
    this.hud.update(
      snapshot,
      revealedLandmarks(this.progress.towerActivated),
      this.input.active("map") && this.progress.towerActivated,
      this.progress,
      this.paused,
      this.caption
    );
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
      player: () => this.player.snapshot(),
      progress: () => ({ ...this.progress }),
      shrine: () => ({ ...this.shrine, block: { ...this.shrine.block } }),
      camp: () => ({ ...this.camp }),
      landmarks: () => revealedLandmarks(this.progress.towerActivated),
      activateTower: () => {
        this.activateTower();
      },
      unlockGlider: () => {
        this.progress.gliderUnlocked = true;
        saveProgress(this.progress);
      },
      movePlayer: (x: number, y: number, z: number) => {
        this.player.setPosition(x, y, z);
      },
      clearProgress: () => {
        clearProgress();
        this.progress = loadProgress();
      }
    };
  }

  private activateTower(): void {
    if (this.progress.towerActivated) return;
    this.progress = {
      ...this.progress,
      towerActivated: true,
      gliderUnlocked: true,
      recoveryPoint: "tower"
    };
    this.caption = "Tower activated. Glider earned.";
    saveProgress(this.progress);
  }

  private updateShrine(position: { x: number; y: number; z: number }): void {
    const shoved = shoveBlockToPlate(this.shrine, position);
    const claimed = claimSpiritToken(shoved, position);
    this.shrine = claimed;
    if (claimed.completed && !this.progress.shrineCompleted) {
      this.progress = {
        ...this.progress,
        shrineCompleted: true,
        spiritTokens: this.progress.spiritTokens + 1,
        recoveryPoint: "shrine"
      };
      this.caption = "Shrine complete. Spirit token earned.";
      saveProgress(this.progress);
    }
  }

  private updateVista(position: { x: number; y: number; z: number }): void {
    if (!this.progress.shrineCompleted || this.progress.plateauComplete) return;
    if (Math.hypot(position.x - 34, position.z + 48) > 4) return;
    this.progress = {
      ...this.progress,
      plateauComplete: true
    };
    this.caption = "Plateau Complete.";
    saveProgress(this.progress);
  }

  private updatePause(): void {
    const pauseDown = this.input.active("pause");
    if (pauseDown && !this.pauseWasDown) {
      this.paused = !this.paused;
    }
    this.pauseWasDown = pauseDown;
  }

  private attachPauseMenu(): void {
    document.querySelector<HTMLButtonElement>("[data-action='resume']")?.addEventListener("click", () => {
      this.paused = false;
    });
    document.querySelector<HTMLButtonElement>("[data-action='restart']")?.addEventListener("click", () => {
      this.player.setPosition(-8, 0, 8);
      this.paused = false;
      this.caption = "Slice restarted.";
    });
    document.querySelector<HTMLButtonElement>("[data-action='audio']")?.addEventListener("click", () => {
      this.caption = this.caption === "Audio muted." ? "Audio enabled." : "Audio muted.";
    });
    document.querySelector<HTMLButtonElement>("[data-action='clear']")?.addEventListener("click", () => {
      clearProgress();
      this.progress = loadProgress();
      this.caption = "Saved progress cleared.";
    });
    document.querySelector<HTMLInputElement>("#reduced-motion")?.addEventListener("change", (event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLInputElement)) return;
      const reduced = target.checked;
      document.body.classList.toggle("reduced-motion", reduced);
      this.caption = reduced ? "Reduced motion enabled." : "Reduced motion disabled.";
    });
  }
}

declare global {
  interface Window {
    __wildreachTest?: {
      player: () => ReturnType<PlayerController["snapshot"]>;
      progress: () => SliceProgress;
      shrine: () => ShrineState;
      camp: () => CampState;
      landmarks: () => ReturnType<typeof revealedLandmarks>;
      activateTower: () => void;
      unlockGlider: () => void;
      movePlayer: (x: number, y: number, z: number) => void;
      clearProgress: () => void;
    };
    __wildreachBooted?: boolean;
  }
}
