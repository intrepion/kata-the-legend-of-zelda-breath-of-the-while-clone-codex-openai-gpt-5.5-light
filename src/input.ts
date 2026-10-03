import type { ControlAction } from "./domain";

const keyBindings = new Map<string, ControlAction>([
  ["KeyW", "forward"],
  ["KeyS", "back"],
  ["KeyA", "left"],
  ["KeyD", "right"],
  ["Space", "jump"],
  ["ShiftLeft", "sprint"],
  ["ShiftRight", "sprint"],
  ["KeyE", "interact"],
  ["KeyM", "map"],
  ["Escape", "pause"]
]);

export class InputState {
  readonly actions = new Set<ControlAction>();
  pointerDeltaX = 0;
  primary = false;
  secondary = false;

  attach(target: HTMLElement, windowTarget: Window): void {
    windowTarget.addEventListener("keydown", (event) => {
      const action = keyBindings.get(event.code);
      if (action) {
        event.preventDefault();
        this.actions.add(action);
      }
    });
    windowTarget.addEventListener("keyup", (event) => {
      const action = keyBindings.get(event.code);
      if (action) {
        event.preventDefault();
        this.actions.delete(action);
      }
    });
    target.addEventListener("pointerdown", (event) => {
      target.setPointerCapture(event.pointerId);
      if (event.button === 0) this.primary = true;
      if (event.button === 2) this.secondary = true;
    });
    target.addEventListener("pointerup", (event) => {
      if (event.button === 0) this.primary = false;
      if (event.button === 2) this.secondary = false;
    });
    target.addEventListener("pointermove", (event) => {
      this.pointerDeltaX += event.movementX;
    });
    target.addEventListener("contextmenu", (event) => event.preventDefault());
  }

  consumePointerDeltaX(): number {
    const delta = this.pointerDeltaX;
    this.pointerDeltaX = 0;
    return delta;
  }

  active(action: ControlAction): boolean {
    return this.actions.has(action);
  }
}
