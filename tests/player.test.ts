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

  it("climbs authored surfaces while interact is held", () => {
    const input = new InputState();
    const player = new PlayerController();
    input.actions.add("interact");
    input.actions.add("forward");

    player.update(input, 0.5, { canClimb: true, hasGlider: false });

    expect(player.snapshot()).toMatchObject({
      mode: "climbing",
      grounded: false
    });
    expect(player.snapshot().position.y).toBeGreaterThan(0);
  });

  it("glides after the glider is available", () => {
    const input = new InputState();
    const player = new PlayerController();
    player.setPosition(0, 5, 0);
    input.actions.add("jump");

    player.update(input, 0.5, { canClimb: false, hasGlider: true });

    expect(player.snapshot().mode).toBe("gliding");
    expect(player.snapshot().position.y).toBeLessThan(5);
  });
});
