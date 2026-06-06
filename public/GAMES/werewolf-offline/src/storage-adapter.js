const STORAGE_KEY = "ludora:werewolf-offline:save";
const PRESET_STORAGE_KEY = "ludora:werewolf-offline:presets";
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

  // --- Custom Presets ---
  getCustomPresets() {
    try {
      const raw = localStorage.getItem(PRESET_STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) || [];
    } catch (error) {
      return [];
    }
  },

  saveCustomPreset(preset) {
    try {
      const presets = this.getCustomPresets();
      const existingIndex = presets.findIndex(p => p.id === preset.id);
      if (existingIndex >= 0) {
        presets[existingIndex] = preset;
      } else {
        presets.push(preset);
      }
      localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));
      return true;
    } catch (error) {
      console.warn("[Werewolf Offline] Save preset failed:", error);
      return false;
    }
  },

  deleteCustomPreset(id) {
    try {
      const presets = this.getCustomPresets();
      const filtered = presets.filter(p => p.id !== id);
      localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.warn("[Werewolf Offline] Delete preset failed:", error);
      return false;
    }
  }
};
