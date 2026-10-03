import type { WorldPosition } from "./domain";

export type ShrineState = {
  block: WorldPosition;
  plate: WorldPosition;
  gateOpen: boolean;
  completed: boolean;
};

export const initialShrineState: ShrineState = {
  block: { x: 21, y: 0, z: -33 },
  plate: { x: 25.5, y: 0, z: -34 },
  gateOpen: false,
  completed: false
};

export function distance(a: WorldPosition, b: WorldPosition): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

export function shoveBlockToPlate(state: ShrineState, adventurer: WorldPosition): ShrineState {
  if (state.completed || distance(adventurer, state.block) > 3.2) return state;
  return {
    ...state,
    block: { ...state.plate },
    gateOpen: true
  };
}

export function claimSpiritToken(state: ShrineState, adventurer: WorldPosition): ShrineState {
  const token = { x: 28, y: 0, z: -36 };
  if (!state.gateOpen || distance(adventurer, token) > 3) return state;
  return {
    ...state,
    completed: true
  };
}
