import { describe, expect, it } from "vitest";
import { InputState } from "../src/input";
import { PlayerController } from "../src/player";

describe("Adventurer movement", () => {
  it("moves forward through the public controller update", () => {
    const input = new InputState();
    const player = new PlayerController();
    const before = player.snapshot().position.z;
    input.actions.add("forward");

    player.update(input, 0.5);

    expect(player.snapshot().position.z).toBeLessThan(before);
  });

  it("spends stamina while sprinting", () => {
    const input = new InputState();
    const player = new PlayerController();
    input.actions.add("forward");
    input.actions.add("sprint");

    player.update(input, 0.5);

    expect(player.snapshot().stamina).toBeLessThan(100);
  });
});
