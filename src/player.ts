import * as THREE from "three";
import { MAX_STAMINA, clamp, type PlayerSnapshot } from "./domain";
import type { InputState } from "./input";

const WALK_SPEED = 7.5;
const SPRINT_SPEED = 11.5;
const CLIMB_SPEED = 4.2;
const GLIDE_FALL_SPEED = 2.5;
const GLIDE_FORWARD_SPEED = 8.2;
const TURN_SENSITIVITY = 0.0045;
const JUMP_VELOCITY = 8.5;
const GRAVITY = 24;

export type TraversalOptions = {
  canClimb: boolean;
  hasGlider: boolean;
};

export class PlayerController {
  readonly group = new THREE.Group();
  private readonly body: THREE.Mesh;
  private velocityY = 0;
  private yaw = 0;
  private grounded = true;
  private stamina = MAX_STAMINA;
  private mode: PlayerSnapshot["mode"] = "walking";

  constructor() {
    const cloak = new THREE.ConeGeometry(0.55, 1.4, 6);
    const material = new THREE.MeshStandardMaterial({ color: 0x2f6f73, roughness: 0.8 });
    this.body = new THREE.Mesh(cloak, material);
    this.body.position.y = 0.9;
    this.body.castShadow = true;
    this.group.add(this.body);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0xf2c18d, roughness: 0.75 })
    );
    head.position.y = 1.78;
    head.castShadow = true;
    this.group.add(head);

    this.group.position.set(-8, 0, 8);
  }

  update(input: InputState, dt: number, traversal: TraversalOptions = { canClimb: false, hasGlider: false }): PlayerSnapshot {
    this.yaw -= input.consumePointerDeltaX() * TURN_SENSITIVITY;
    const forward = Number(input.active("forward")) - Number(input.active("back"));
    const strafe = Number(input.active("right")) - Number(input.active("left"));

    if (this.mode === "walking" && traversal.canClimb && input.active("interact") && this.stamina > 0) {
      this.mode = "climbing";
      this.grounded = false;
      this.velocityY = 0;
    }

    if (this.mode === "climbing") {
      this.updateClimbing(input, dt, forward, strafe);
      return this.snapshot();
    }

    if (!this.grounded && traversal.hasGlider && input.active("jump") && this.stamina > 0 && this.velocityY <= 0) {
      this.mode = "gliding";
    }

    if (this.mode === "gliding") {
      this.updateGliding(input, dt, forward, strafe);
      return this.snapshot();
    }

    const sprinting = input.active("sprint") && this.stamina > 0 && (forward !== 0 || strafe !== 0);
    const speed = sprinting ? SPRINT_SPEED : WALK_SPEED;

    const move = new THREE.Vector3(strafe, 0, -forward);
    if (move.lengthSq() > 0) {
      move.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
      this.group.position.addScaledVector(move, speed * dt);
      this.body.rotation.y = Math.atan2(move.x, move.z);
    }

    if (this.grounded && input.active("jump")) {
      this.velocityY = JUMP_VELOCITY;
      this.grounded = false;
    }

    this.velocityY -= GRAVITY * dt;
    this.group.position.y += this.velocityY * dt;
    if (this.group.position.y <= 0) {
      this.group.position.y = 0;
      this.velocityY = 0;
      this.grounded = true;
      this.mode = "walking";
    }

    if (sprinting) {
      this.stamina = clamp(this.stamina - 24 * dt, 0, MAX_STAMINA);
    } else {
      this.stamina = clamp(this.stamina + 18 * dt, 0, MAX_STAMINA);
    }

    return this.snapshot();
  }

  private updateClimbing(input: InputState, dt: number, forward: number, strafe: number): void {
    this.group.position.y += forward * CLIMB_SPEED * dt;
    this.group.position.x += strafe * CLIMB_SPEED * 0.45 * dt;
    this.group.position.y = clamp(this.group.position.y, 0, 8.8);
    this.stamina = clamp(this.stamina - 18 * dt, 0, MAX_STAMINA);
    if (!input.active("interact") || this.stamina <= 0 || this.group.position.y <= 0) {
      this.mode = "walking";
      this.grounded = this.group.position.y <= 0;
    }
  }

  private updateGliding(input: InputState, dt: number, forward: number, strafe: number): void {
    const move = new THREE.Vector3(strafe, 0, -Math.max(0.35, forward));
    move.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
    this.group.position.addScaledVector(move, GLIDE_FORWARD_SPEED * dt);
    this.group.position.y -= GLIDE_FALL_SPEED * dt;
    this.stamina = clamp(this.stamina - 14 * dt, 0, MAX_STAMINA);
    if (!input.active("jump") || this.stamina <= 0 || this.group.position.y <= 0) {
      this.mode = "walking";
      this.grounded = this.group.position.y <= 0;
      if (this.group.position.y <= 0) {
        this.group.position.y = 0;
        this.velocityY = 0;
      }
    }
  }

  snapshot(): PlayerSnapshot {
    return {
      position: {
        x: this.group.position.x,
        y: this.group.position.y,
        z: this.group.position.z
      },
      yaw: this.yaw,
      grounded: this.grounded,
      stamina: this.stamina,
      mode: this.mode
    };
  }

  setPosition(x: number, y: number, z: number): void {
    this.group.position.set(x, y, z);
    this.grounded = y <= 0;
    this.velocityY = 0;
    this.mode = "walking";
  }
}
