import "./styles.css";
import { WildreachGame } from "./game";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");

if (!canvas) {
  throw new Error("Missing #game-canvas");
}

new WildreachGame(canvas).start();
