import * as THREE from "three";
import type { PlayerSnapshot } from "./domain";

export class FollowCamera {
  private readonly offset = new THREE.Vector3(0, 5.2, 9);

  constructor(private readonly camera: THREE.PerspectiveCamera) {}

  update(player: PlayerSnapshot): void {
    const yaw = player.yaw;
    const desiredOffset = this.offset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    const target = new THREE.Vector3(player.position.x, player.position.y + 1.2, player.position.z);
    this.camera.position.lerp(target.clone().add(desiredOffset), 0.18);
    this.camera.lookAt(target);
  }
}
