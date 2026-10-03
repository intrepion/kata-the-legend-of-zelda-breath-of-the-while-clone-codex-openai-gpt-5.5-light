import { describe, expect, it } from "vitest";
import { initialCampState, updateCamp } from "../src/camp";

describe("Enemy Camp", () => {
  it("alerts and drops a weapon pickup after three nearby attacks", () => {
    let state = initialCampState;
    state = updateCamp(state, { x: -22, y: 0, z: -3 }, true);
    state = updateCamp(state, { x: -22, y: 0, z: -3 }, true);
    state = updateCamp(state, { x: -22, y: 0, z: -3 }, true);

    expect(state).toMatchObject({
      alert: true,
      defeated: true,
      weaponPickupAvailable: true
    });
  });
});
