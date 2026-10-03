import type { WorldPosition } from "./domain";

export type LandmarkKind = "tower" | "shrine" | "camp" | "cliffRoute" | "safeRoute" | "ruin" | "vista";

export type Landmark = {
  id: LandmarkKind;
  name: string;
  position: WorldPosition;
  discovered: boolean;
};

export const PLATEAU_LANDMARKS: Landmark[] = [
  {
    id: "tower",
    name: "Central Tower",
    position: { x: 0, y: 0, z: -18 },
    discovered: true
  },
  {
    id: "shrine",
    name: "Ruin Chamber Shrine",
    position: { x: 24, y: 0, z: -34 },
    discovered: false
  },
  {
    id: "camp",
    name: "Lower Meadow Camp",
    position: { x: -22, y: 0, z: -3 },
    discovered: false
  },
  {
    id: "cliffRoute",
    name: "High Cliff Route",
    position: { x: 15, y: 0, z: -22 },
    discovered: false
  },
  {
    id: "safeRoute",
    name: "Winding Safe Path",
    position: { x: -10, y: 0, z: -26 },
    discovered: false
  },
  {
    id: "ruin",
    name: "Sheltered Ruin",
    position: { x: -7, y: 0, z: -38 },
    discovered: false
  },
  {
    id: "vista",
    name: "Final Vista",
    position: { x: 34, y: 0, z: -48 },
    discovered: false
  }
];

export function revealedLandmarks(towerActivated: boolean): Landmark[] {
  return PLATEAU_LANDMARKS.map((landmark) => ({
    ...landmark,
    discovered: landmark.discovered || towerActivated
  }));
}
