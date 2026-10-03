import { describe, expect, it } from "vitest";
import { clearProgress, loadProgress, saveProgress } from "../src/persistence";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length(): number {
    return this.values.size;
  }
  clear(): void {
    this.values.clear();
  }
  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }
  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.values.delete(key);
  }
  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe("Slice Progress persistence", () => {
  it("round-trips tower and glider progress", () => {
    const storage = new MemoryStorage();

    saveProgress(
      {
        towerActivated: true,
        gliderUnlocked: true,
        shrineCompleted: false,
        spiritTokens: 0,
        recoveryPoint: "tower"
      },
      storage
    );

    expect(loadProgress(storage)).toMatchObject({
      towerActivated: true,
      gliderUnlocked: true,
      recoveryPoint: "tower"
    });
    clearProgress(storage);
    expect(loadProgress(storage).towerActivated).toBe(false);
  });
});
