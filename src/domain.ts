export type ControlAction =
  | "forward"
  | "back"
  | "left"
  | "right"
  | "jump"
  | "sprint"
  | "interact"
  | "attack"
  | "block"
  | "map"
  | "pause";

export type WorldPosition = {
  x: number;
  y: number;
  z: number;
};

export type PlayerSnapshot = {
  position: WorldPosition;
  yaw: number;
  grounded: boolean;
  stamina: number;
};

export const MAX_STAMINA = 100;

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
