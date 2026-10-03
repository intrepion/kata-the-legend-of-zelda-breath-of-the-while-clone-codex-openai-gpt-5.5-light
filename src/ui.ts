import type { PlayerSnapshot } from "./domain";

export class Hud {
  private readonly status = document.querySelector<HTMLDivElement>("#status-line");
  private readonly stamina = document.querySelector<HTMLDivElement>("#stamina");
  private readonly prompt = document.querySelector<HTMLDivElement>("#prompt");

  update(player: PlayerSnapshot): void {
    if (this.stamina) this.stamina.textContent = `STA ${Math.round(player.stamina)}`;
    if (this.status) {
      const distanceToTower = Math.hypot(player.position.x, player.position.z + 18);
      this.status.textContent = distanceToTower < 5 ? "Press E at the tower." : "Find the tower.";
    }
    if (this.prompt) {
      const nearTower = Math.hypot(player.position.x, player.position.z + 18) < 5;
      this.prompt.textContent = nearTower ? "E: activate tower" : "";
      this.prompt.classList.toggle("visible", nearTower);
    }
  }
}
