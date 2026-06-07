import { addHistoryEntry, killPlayer } from "./game-state.js";

/**
 * Ghép đôi 2 người chơi (Cupid)
 */
export function applyCupidLink(gameState, p1Id, p2Id) {
  if (!p1Id || !p2Id || p1Id === p2Id) return gameState;
  
  const p1 = gameState.players.find(p => p.id === p1Id);
  const p2 = gameState.players.find(p => p.id === p2Id);

  if (!p1 || !p2) return gameState;

  let nextState = {
    ...gameState,
    gm: {
      ...gameState.gm,
      effects: {
        ...gameState.gm.effects,
        cupidLinks: [p1Id, p2Id],
      }
    }
  };

  return addHistoryEntry(nextState, "Ghép đôi", "role_effect", `${p1.name} và ${p2.name} đã được ghép đôi.`);
}

/**
 * Xóa liên kết ghép đôi (trong trường hợp GM muốn undo)
 */
export function removeCupidLink(gameState) {
  let nextState = {
    ...gameState,
    gm: {
      ...gameState.gm,
      effects: {
        ...gameState.gm.effects,
        cupidLinks: [],
      }
    }
  };
  return addHistoryEntry(nextState, "Hủy ghép đôi", "role_effect", "Đã xóa liên kết tình yêu.");
}

/**
 * Bật/Tắt trạng thái mất năng lực của Cáo
 */
export function toggleFoxPower(gameState, foxId) {
  if (!foxId) return gameState;

  const currentLost = gameState.gm.effects?.foxLostPower || [];
  const hasLost = currentLost.includes(foxId);

  const nextLost = hasLost
    ? currentLost.filter(id => id !== foxId)
    : [...currentLost, foxId];

  let nextState = {
    ...gameState,
    gm: {
      ...gameState.gm,
      effects: {
        ...gameState.gm.effects,
        foxLostPower: nextLost,
      }
    }
  };

  const foxPlayer = gameState.players.find(p => p.id === foxId);
  const statusMsg = hasLost ? "phục hồi năng lực" : "mất năng lực";
  
  return addHistoryEntry(nextState, "Cáo thay đổi", "role_effect", `Cáo (${foxPlayer?.name || "???"}) đã ${statusMsg}.`);
}

export function setNightAction(gameState, actionKey, value) {
  return {
    ...gameState,
    gm: {
      ...gameState.gm,
      nightActions: {
        ...gameState.gm.nightActions,
        [actionKey]: value
      }
    }
  };
}

export function witchUsePotion(gameState, potionType, targetId) {
  let nextState = { ...gameState };
  if (potionType === "heal") {
    nextState.gm.roleStates.witch.hasHealPotion = false;
    nextState = setNightAction(nextState, "witchHeal", true);
  } else if (potionType === "poison") {
    nextState.gm.roleStates.witch.hasPoisonPotion = false;
    nextState = setNightAction(nextState, "witchPoisonTarget", targetId);
  }
  return nextState;
}

export function hunterShoot(gameState, targetId) {
  if (!targetId) return gameState;
  let nextState = { ...gameState };
  const target = nextState.players.find(p => p.id === targetId);
  if (!target || !target.alive) return gameState;

  // Mark hunter as shot
  nextState.gm.roleStates.hunter.hasShot = true;
  nextState.gm.roleStates.hunter.pendingShot = null;

  // Kill the target
  nextState = killPlayer(nextState, targetId, "Bị Thợ săn bắn");

  return addHistoryEntry(nextState, "Thợ săn bắn", "role_effect", `Thợ săn đã bắn chết ${target.name}.`);
}
