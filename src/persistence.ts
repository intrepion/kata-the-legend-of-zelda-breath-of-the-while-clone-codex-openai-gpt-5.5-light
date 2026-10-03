export type SliceProgress = {
  towerActivated: boolean;
  gliderUnlocked: boolean;
  shrineCompleted: boolean;
  spiritTokens: number;
  recoveryPoint: "start" | "tower" | "shrine";
};

export const initialProgress: SliceProgress = {
  towerActivated: false,
  gliderUnlocked: false,
  shrineCompleted: false,
  spiritTokens: 0,
  recoveryPoint: "start"
};

const STORAGE_KEY = "wildreach.sliceProgress";

export function loadProgress(storage: Storage = window.localStorage): SliceProgress {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return { ...initialProgress };
  try {
    return { ...initialProgress, ...JSON.parse(raw) };
  } catch {
    return { ...initialProgress };
  }
}

export function saveProgress(progress: SliceProgress, storage: Storage = window.localStorage): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function clearProgress(storage: Storage = window.localStorage): void {
  storage.removeItem(STORAGE_KEY);
}
