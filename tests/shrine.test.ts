import { describe, expect, it } from "vitest";
import { claimSpiritToken, initialShrineState, shoveBlockToPlate } from "../src/shrine";

describe("Physics Shrine", () => {
  it("opens the gate when the block is shoved onto the pressure plate", () => {
    const state = shoveBlockToPlate(initialShrineState, { x: 21.5, y: 0, z: -33 });

    expect(state.gateOpen).toBe(true);
    expect(state.block).toEqual(state.plate);
  });

  it("awards completion only after the gate is open", () => {
    const open = shoveBlockToPlate(initialShrineState, { x: 21.5, y: 0, z: -33 });
    const completed = claimSpiritToken(open, { x: 28, y: 0, z: -36 });

    expect(completed.completed).toBe(true);
    expect(claimSpiritToken(initialShrineState, { x: 28, y: 0, z: -36 }).completed).toBe(false);
  });
});
