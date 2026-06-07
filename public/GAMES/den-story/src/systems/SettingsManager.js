export const DEFAULT_SETTINGS = {
  soundVol: 10,
  musicVol: 10,
  textSpeed: 1, // 0: Chậm, 1: Bình thường, 2: Nhanh
  autoAdvance: false
};

export default class SettingsManager {
  static load() {
    try {
      const saved = localStorage.getItem("den-story-settings");
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Failed to load settings", e);
    }
    return { ...DEFAULT_SETTINGS };
  }

  static save(settings) {
    try {
      localStorage.setItem("den-story-settings", JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to save settings", e);
    }
  }

  static applyToScene(scene, settings) {
    // SFX global volume
    // Note: If BGM is implemented later, it should be managed on a specific music sound object.
    scene.sound.volume = settings.soundVol / 10;
  }
}
