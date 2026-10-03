import type { WorldPosition } from "./domain";
import { distance } from "./shrine";

export type CampState = {
  scoutHealth: number;
  alert: boolean;
  defeated: boolean;
  weaponPickupAvailable: boolean;
};

export const initialCampState: CampState = {
  scoutHealth: 3,
  alert: false,
  defeated: false,
  weaponPickupAvailable: false
};

export function updateCamp(state: CampState, adventurer: WorldPosition, attacking: boolean): CampState {
  if (state.defeated) return state;
  const nearCamp = distance(adventurer, { x: -22, y: 0, z: -3 }) < 5;
  if (!nearCamp) return state;
  const nextHealth = attacking ? Math.max(0, state.scoutHealth - 1) : state.scoutHealth;
  return {
    scoutHealth: nextHealth,
    alert: true,
    defeated: nextHealth === 0,
    weaponPickupAvailable: nextHealth === 0
  };
}
