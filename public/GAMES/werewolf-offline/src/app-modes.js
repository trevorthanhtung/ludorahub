export const APP_MODES = {
  OFFLINE: "offline",
  HOST: "host",
  CLIENT: "client",
};

let currentMode = APP_MODES.OFFLINE;

export function getAppMode() {
  return currentMode;
}

export function setAppMode(mode) {
  if (Object.values(APP_MODES).includes(mode)) {
    currentMode = mode;
  }
}
