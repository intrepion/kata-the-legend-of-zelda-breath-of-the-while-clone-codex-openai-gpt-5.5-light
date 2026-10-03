import * as THREE from "three";

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
    new THREE.CircleGeometry(55, 80),
    new THREE.MeshStandardMaterial({ color: 0x7fac59, roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.7, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0x6e8191, roughness: 0.72 })
  );
  tower.position.set(0, 6, -18);
  tower.castShadow = true;
  tower.name = "Central Tower";
  scene.add(tower);

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
