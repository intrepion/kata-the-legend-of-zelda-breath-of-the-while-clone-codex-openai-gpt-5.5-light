import { describe, expect, it } from "vitest";
import { PLATEAU_LANDMARKS, revealedLandmarks } from "../src/landmarks";

describe("Plateau Slice landmarks", () => {
  it("contains the agreed bowl upland destinations", () => {
    expect(PLATEAU_LANDMARKS.map((landmark) => landmark.id)).toEqual([
      "tower",
      "shrine",
      "camp",
      "cliffRoute",
      "safeRoute",
      "ruin",
      "vista"
    ]);
  });

  it("reveals every landmark after tower activation", () => {
    expect(revealedLandmarks(true).every((landmark) => landmark.discovered)).toBe(true);
  });
});
