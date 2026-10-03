import * as THREE from "three";
import { PLATEAU_LANDMARKS, type Landmark, type LandmarkKind } from "./landmarks";

export function createWorld(scene: THREE.Scene): void {
  scene.background = new THREE.Color(0x8fc7e8);
  scene.fog = new THREE.Fog(0x8fc7e8, 45, 120);

  const hemi = new THREE.HemisphereLight(0xfff4d5, 0x447966, 2.2);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffe1a3, 3);
  sun.position.set(-14, 24, 10);
  sun.castShadow = true;
  scene.add(sun);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(62, 96),
    new THREE.MeshStandardMaterial({ color: 0x7fac59, roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  createBowlRidge(scene);
  PLATEAU_LANDMARKS.forEach((landmark) => createLandmark(scene, landmark));

  for (let i = 0; i < 26; i += 1) {
    const stone = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.6 + (i % 4) * 0.16),
      new THREE.MeshStandardMaterial({ color: 0x8c9a83, roughness: 0.95 })
    );
    stone.position.set(Math.sin(i * 2.4) * 24, 0.35, Math.cos(i * 1.7) * 24);
    stone.castShadow = true;
    scene.add(stone);
  }
}

function createBowlRidge(scene: THREE.Scene): void {
  for (let i = 0; i < 32; i += 1) {
    const angle = (i / 32) * Math.PI * 2;
    const radius = 42 + Math.sin(i * 1.7) * 5;
    const hill = new THREE.Mesh(
      new THREE.ConeGeometry(4 + (i % 3), 6 + (i % 4), 7),
      new THREE.MeshStandardMaterial({ color: 0x6f9050, roughness: 0.95 })
    );
    hill.position.set(Math.cos(angle) * radius, 1.8, Math.sin(angle) * radius - 12);
    hill.rotation.y = angle;
    hill.castShadow = true;
    hill.receiveShadow = true;
    scene.add(hill);
  }
}

function createLandmark(scene: THREE.Scene, landmark: Landmark): void {
  const group = new THREE.Group();
  group.position.set(landmark.position.x, landmark.position.y, landmark.position.z);
  group.name = landmark.name;
  const builders: Record<LandmarkKind, () => THREE.Object3D[]> = {
    tower: makeTower,
    shrine: makeShrine,
    camp: makeCamp,
    cliffRoute: makeCliffRoute,
    safeRoute: makeSafeRoute,
    ruin: makeRuin,
    vista: makeVista
  };
  builders[landmark.id]().forEach((object) => group.add(object));
  scene.add(group);
}

function makeTower(): THREE.Object3D[] {
  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.7, 13, 10),
    new THREE.MeshStandardMaterial({ color: 0x6e8191, roughness: 0.72 })
  );
  tower.position.y = 6.5;
  tower.castShadow = true;
  const light = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0x7be0ff, emissive: 0x1e96ff, emissiveIntensity: 1.4 })
  );
  light.position.y = 13.4;
  return [tower, light];
}

function makeShrine(): THREE.Object3D[] {
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(5, 2.5, 4),
    new THREE.MeshStandardMaterial({ color: 0x7c8d93, roughness: 0.68 })
  );
  base.position.y = 1.25;
  base.castShadow = true;
  const glow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.55, 4, 14),
    new THREE.MeshStandardMaterial({ color: 0x4cc9ff, emissive: 0x1595ff, emissiveIntensity: 1.6 })
  );
  glow.position.y = 3;
  const block = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 1.4),
    new THREE.MeshStandardMaterial({ color: 0xc1a36b, roughness: 0.85 })
  );
  block.position.set(-3, 0.7, 1);
  block.name = "Shrine Block";
  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.1, 0.12, 24),
    new THREE.MeshStandardMaterial({ color: 0x4cc9ff, emissive: 0x0e78b2, emissiveIntensity: 0.6 })
  );
  plate.position.set(1.5, 0.08, 0);
  const token = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.55),
    new THREE.MeshStandardMaterial({ color: 0xfff0a6, emissive: 0xffc857, emissiveIntensity: 1.2 })
  );
  token.position.set(4, 2.1, -2);
  return [base, glow, block, plate, token];
}

function makeCamp(): THREE.Object3D[] {
  const tent = new THREE.Mesh(
    new THREE.ConeGeometry(2.2, 3, 4),
    new THREE.MeshStandardMaterial({ color: 0xa44b32, roughness: 0.8 })
  );
  tent.position.y = 1.5;
  tent.rotation.y = Math.PI / 4;
  const smoke = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 12, 8),
    new THREE.MeshStandardMaterial({ color: 0xc9d0c4, transparent: true, opacity: 0.7 })
  );
  smoke.position.set(1.8, 4, -0.5);
  return [tent, smoke];
}

function makeCliffRoute(): THREE.Object3D[] {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(5, 8, 2),
    new THREE.MeshStandardMaterial({ color: 0x8a836d, roughness: 0.95 })
  );
  wall.position.y = 4;
  return [wall];
}

function makeSafeRoute(): THREE.Object3D[] {
  const path = new THREE.Mesh(
    new THREE.BoxGeometry(9, 0.08, 2.4),
    new THREE.MeshStandardMaterial({ color: 0xc5aa72, roughness: 0.9 })
  );
  path.position.y = 0.05;
  path.rotation.y = -0.45;
  return [path];
}

function makeRuin(): THREE.Object3D[] {
  const arch = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.22, 8, 18, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x8b928b, roughness: 0.8 })
  );
  arch.position.y = 2.2;
  arch.rotation.z = Math.PI;
  return [arch];
}

function makeVista(): THREE.Object3D[] {
  const flag = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0x33413f, roughness: 0.65 })
  );
  flag.position.y = 2;
  const cloth = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 1.1),
    new THREE.MeshStandardMaterial({ color: 0xffd166, side: THREE.DoubleSide, roughness: 0.7 })
  );
  cloth.position.set(1, 3.1, 0);
  return [flag, cloth];
}
