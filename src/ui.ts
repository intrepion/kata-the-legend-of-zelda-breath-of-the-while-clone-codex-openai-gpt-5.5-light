import type { PlayerSnapshot } from "./domain";
import type { Landmark } from "./landmarks";

export class Hud {
  private readonly status = document.querySelector<HTMLDivElement>("#status-line");
  private readonly stamina = document.querySelector<HTMLDivElement>("#stamina");
  private readonly prompt = document.querySelector<HTMLDivElement>("#prompt");
  private readonly landmarks = document.querySelector<HTMLUListElement>("#landmarks");
  private readonly mapSketch = document.querySelector<HTMLDivElement>("#map-sketch");

  update(player: PlayerSnapshot, landmarks: Landmark[], mapVisible: boolean, gliderUnlocked: boolean): void {
    if (this.stamina) this.stamina.textContent = `STA ${Math.round(player.stamina)} · ${player.mode}`;
    if (this.status) {
      const distanceToTower = Math.hypot(player.position.x, player.position.z + 18);
      this.status.textContent = gliderUnlocked
        ? "Glider earned. Seek the shrine."
        : distanceToTower < 5
          ? "Press E at the tower."
          : "Find the tower.";
    }
    if (this.prompt) {
      const nearTower = Math.hypot(player.position.x, player.position.z + 18) < 5;
      this.prompt.textContent = nearTower ? "E: activate tower" : "";
      this.prompt.classList.toggle("visible", nearTower);
    }
    if (this.landmarks) {
      this.landmarks.replaceChildren(
        ...landmarks
          .filter((landmark) => landmark.discovered)
          .map((landmark) => {
            const item = document.createElement("li");
            item.textContent = landmark.name;
            item.dataset.landmark = landmark.id;
            return item;
          })
      );
    }
    this.mapSketch?.classList.toggle("visible", mapVisible);
  }
}
