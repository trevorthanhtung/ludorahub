import {
  createEmptyRoleConfig,
  normalizeRoleConfig,
  countRoles,
} from "./role-config.js";

export function sanitizePlayerCount(playerCount) {
  const parsed = Number(playerCount);
  if (!Number.isFinite(parsed)) {
    return 5;
  }

  return Math.min(15, Math.max(5, Math.floor(parsed)));
}

export function applyPreset(playerCount) {
  const safeCount = sanitizePlayerCount(playerCount);
  const config = createEmptyRoleConfig();

  if (safeCount === 5) {
    config.werewolf = 1;
    config.seer = 1;
    config.guard = 1;
  } else if (safeCount === 6) {
    config.werewolf = 1;
    config.seer = 1;
    config.guard = 1;
    config.hunter = 1;
  } else if (safeCount === 7) {
    config.werewolf = 2;
    config.seer = 1;
    config.guard = 1;
  } else if (safeCount === 8) {
    config.werewolf = 2;
    config.seer = 1;
    config.guard = 1;
    config.witch = 1;
  } else if (safeCount <= 10) {
    config.werewolf = 2;
    config.seer = 1;
    config.guard = 1;
    config.witch = 1;
    config.hunter = 1;
  } else {
    config.werewolf = 3;
    config.seer = 1;
    config.guard = 1;
    config.witch = 1;
    config.hunter = 1;
  }

  config.villager = safeCount - countRoles(config);
  return normalizeRoleConfig(config);
}
