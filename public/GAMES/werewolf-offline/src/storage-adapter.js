const STORAGE_KEY = "ludora:werewolf-offline:save";
const STORAGE_VERSION = 1;

export const StorageAdapter = {
  save(gameState) {
    try {
      const payload = JSON.stringify({
        version: STORAGE_VERSION,
        data: gameState,
      });
      localStorage.setItem(STORAGE_KEY, payload);
      return true;
    } catch (error) {
      console.warn("[Werewolf Offline] Save failed:", error);
      return false;
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const payload = JSON.parse(raw);
      if (!payload?.data) {
        return null;
      }

      return payload.data;
    } catch (error) {
      console.warn("[Werewolf Offline] Load failed:", error);
      return null;
    }
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.warn("[Werewolf Offline] Clear failed:", error);
      return false;
    }
  },

  hasSave() {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      return false;
    }
  },
};
