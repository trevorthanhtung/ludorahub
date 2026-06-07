import {
  ROLE_ORDER,
  countRoles,
  expandRolePool,
  getRoleDefinition,
  normalizeRoleConfig,
} from "./role-config.js";
import { applyPreset, sanitizePlayerCount } from "./preset-builder.js";
import { createInitialPhase, getNextPhaseTransition, getCurrentPhase } from "./phase-manager.js";
import { StorageAdapter } from "./storage-adapter.js";

function createDefaultPlayers(playerCount) {
  return Array.from({ length: playerCount }, (_, index) => ({
    id: `setup-${index + 1}`,
    order: index + 1,
    name: `Người chơi ${index + 1}`,
  }));
}

function createValidation(playerCount, roleConfig) {
  const totalRoles = countRoles(roleConfig);
  return {
    totalRoles,
    expected: playerCount,
    isValid: totalRoles === playerCount,
    message:
      totalRoles === playerCount
        ? "Tổng role hợp lệ, sẵn sàng chia vai."
        : `Tổng role hiện tại là ${totalRoles}/${playerCount}.`,
  };
}

export function createSetupDraft(baseState, playerCount = 8, forcePreset = false, mode = "basic") {
  const safeCount = sanitizePlayerCount(playerCount);
  const previousPlayers = baseState?.setup?.players ?? [];
  const previousRoles = baseState?.setup?.roleConfig ?? {};
  const players = Array.from({ length: safeCount }, (_, index) => ({
    id: `setup-${index + 1}`,
    order: index + 1,
    name: previousPlayers[index]?.name?.trim() || `Người chơi ${index + 1}`,
  }));
  const roleConfig =
    forcePreset || !baseState?.setup
      ? applyPreset(safeCount, mode)
      : normalizeRoleConfig({
          ...applyPreset(safeCount, mode),
          ...previousRoles,
        });

  return {
    ...baseState,
    screen: "setup",
    setup: {
      playerCount: safeCount,
      players,
      roleConfig,
      validation: createValidation(safeCount, roleConfig),
    },
  };
}

export function createBaseState() {
  const playerCount = 8;
  const roleConfig = applyPreset(playerCount);

  return {
    version: 1,
    screen: "home",
    status: "idle",
    createdAt: null,
    updatedAt: Date.now(),
    players: [],
    setup: {
      playerCount,
      players: createDefaultPlayers(playerCount),
      roleConfig,
      validation: createValidation(playerCount, roleConfig),
    },
    reveal: {
      currentIndex: 0,
      stage: "handoff",
    },
    phase: createInitialPhase(),
    gm: {
      showRoles: false,
      filter: "all",
      noteDraft: "",
      history: [],
      votes: {},
      effects: {
        cupidLinks: [],
        foxLostPower: [],
      },
      nightActions: {
        wolfTarget: null,
        seerTarget: null,
        guardTarget: null,
        witchHeal: false,
        witchPoisonTarget: null,
        foxTargets: [],
      },
      nightResults: [],
      roleStates: {
        witch: { hasHealPotion: true, hasPoisonPotion: true },
        hunter: { hasShot: false, pendingShot: null },
      },
    },
    summary: {
      winnerTeam: null,
      winnerLabel: "",
      reason: "",
      finishedAt: null,
    },
    previousSetup: null,
    stats: {
      nightsPlayed: 0,
      daysPlayed: 0,
      phaseTransitions: 0,
    },
    storage: {
      hasSavedGame: StorageAdapter.hasSave(),
      lastSavedAt: null,
    },
  };
}

export function shuffleRoles(rolePool) {
  const cloned = [...rolePool];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

export function assignRoles(gameState) {
  const rolePool = expandRolePool(gameState.roleConfig);
  const shuffled = shuffleRoles(rolePool);

  return {
    ...gameState,
    players: gameState.players.map((player, index) => ({
      ...player,
      roleId: shuffled[index],
      alive: true,
    })),
  };
}

export function createGame({ baseState, playerCount, playerNames, roleConfig }) {
  const safeCount = sanitizePlayerCount(playerCount);
  const normalizedConfig = normalizeRoleConfig(roleConfig);
  const previousPlayers = baseState?.setup?.players || [];
  
  const players = Array.from({ length: safeCount }, (_, index) => {
    const prev = previousPlayers[index] || {};
    return {
      id: prev.id || `player-${Date.now()}-${index + 1}`,
      sessionId: prev.sessionId || null,
      order: index + 1,
      name: playerNames[index]?.trim() || `Người chơi ${index + 1}`,
      alive: true,
    };
  });

  const seededState = {
    ...baseState,
    screen: "reveal",
    status: "active",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    players,
    roleConfig: normalizedConfig,
    reveal: {
      currentIndex: 0,
      stage: "handoff",
    },
    phase: createInitialPhase(),
    gm: {
      showRoles: false,
      filter: "all",
      noteDraft: "",
      history: [],
      votes: {},
      effects: {
        cupidLinks: [],
        foxLostPower: [],
      },
      nightActions: {
        wolfTarget: null,
        seerTarget: null,
        guardTarget: null,
        witchHeal: false,
        witchPoisonTarget: null,
        foxTargets: [],
      },
      nightResults: [],
      roleStates: {
        witch: { hasHealPotion: true, hasPoisonPotion: true },
        hunter: { hasShot: false, pendingShot: null },
      },
    },
    summary: {
      winnerTeam: null,
      winnerLabel: "",
      reason: "",
      finishedAt: null,
    },
    previousSetup: {
      playerCount: safeCount,
      playerNames: players.map((player) => player.name),
      roleConfig: normalizedConfig,
    },
    stats: {
      nightsPlayed: 1,
      daysPlayed: 0,
      phaseTransitions: 0,
    },
  };

  const withRoles = assignRoles(seededState);
  return addHistoryEntry(withRoles, "Khởi tạo", "system", "Ván mới đã được tạo và chia vai thành công.");
}

export function getCycleLabel(gameState) {
  const isNight = ["night", "wolf", "seer", "guard", "witch"].includes(gameState.phase.key);
  const number = isNight ? gameState.stats.nightsPlayed : gameState.stats.daysPlayed;
  return `${isNight ? "Đêm" : "Ngày"} ${number || 1}`;
}

export function addHistoryEntry(gameState, action, type = "system", message = "", targetName = "") {
  return {
    ...gameState,
    gm: {
      ...gameState.gm,
      history: [
        {
          id: `history-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
          type,
          cycleLabel: getCycleLabel(gameState),
          phaseLabel: getCurrentPhase(gameState.phase).label,
          action,
          targetName,
          message,
          timestamp: Date.now(),
        },
        ...gameState.gm.history,
      ],
    },
  };
}

export function nextPhase(gameState) {
  if (gameState.status === "finished") {
    return gameState;
  }

  const transition = getNextPhaseTransition(gameState.phase);
  const nextPhaseLabel = transition.phase.label;
  const nextPhaseKey = transition.phase.key;

  let nextState = {
    ...gameState,
    phase: transition.phase,
    stats: {
      ...gameState.stats,
      phaseTransitions: gameState.stats.phaseTransitions + 1,
      nightsPlayed:
        gameState.stats.nightsPlayed + (nextPhaseKey === "night" ? 1 : 0),
      daysPlayed:
        gameState.stats.daysPlayed + (nextPhaseKey === "morning" ? 1 : 0),
    },
  };

  if (nextPhaseKey === "morning") {
    nextState = resolveNightActions(nextState);
  }

  nextState = addHistoryEntry(nextState, "Chuyển phase", "phase", `Sang phase "${nextPhaseLabel}".`);
  return checkWinCondition(nextState);
}

export function resolveNightActions(gameState) {
  let nextState = { ...gameState };
  const actions = nextState.gm.nightActions;
  let results = [];

  const { wolfTarget, witchHeal, guardTarget, witchPoisonTarget } = actions;

  // 1. Resolve Wolf kill
  if (wolfTarget) {
    if (witchHeal) {
      results.push("Một người bị cắn nhưng đã được Phù thủy cứu.");
    } else if (guardTarget === wolfTarget) {
      results.push("Một người bị cắn nhưng đã được Bảo vệ cứu.");
    } else {
      const p = nextState.players.find(x => x.id === wolfTarget);
      if (p && p.alive) {
        nextState = killPlayer(nextState, wolfTarget, "Bị sói cắn chết");
        results.push(`${p.name} đã chết trong đêm.`);
      }
    }
  } else {
    results.push("Đêm qua Sói không cắn ai.");
  }

  // 2. Resolve Witch poison
  if (witchPoisonTarget) {
    const p = nextState.players.find(x => x.id === witchPoisonTarget);
    if (p && p.alive) {
      nextState = killPlayer(nextState, witchPoisonTarget, "Bị Phù thủy đầu độc");
      results.push(`${p.name} đã chết trong đêm (bị độc).`);
    }
  }

  // Clear night actions
  nextState.gm = {
    ...nextState.gm,
    nightActions: {
      wolfTarget: null,
      seerTarget: null,
      guardTarget: null,
      witchHeal: false,
      witchPoisonTarget: null,
      foxTargets: [],
    },
    nightResults: results.length === 1 && results[0].includes("không cắn ai") && !witchPoisonTarget 
      ? ["Đêm qua là một đêm bình yên, không có ai chết."] 
      : results
  };

  return nextState;
}

export function killPlayer(gameState, playerId, reason = "Đánh dấu chết") {
  if (gameState.status === "finished") {
    return gameState;
  }

  const player = gameState.players.find((entry) => entry.id === playerId);
  if (!player || !player.alive) {
    return gameState;
  }

  let nextState = {
    ...gameState,
    players: gameState.players.map((entry) =>
      entry.id === playerId ? { ...entry, alive: false } : entry,
    ),
  };

  if (player.roleId === "hunter" && !nextState.gm.roleStates?.hunter?.hasShot) {
    nextState.gm = {
      ...nextState.gm,
      roleStates: {
        ...nextState.gm.roleStates,
        hunter: {
          ...nextState.gm.roleStates?.hunter,
          pendingShot: player.id
        }
      }
    };
  }

  nextState = addHistoryEntry(nextState, reason, "player", "", player.name);

  // Cupid chain kill
  const links = nextState.gm.effects?.cupidLinks || [];
  if (links.includes(playerId)) {
    const partnerId = links.find(id => id !== playerId);
    const partner = nextState.players.find(p => p.id === partnerId);
    if (partner && partner.alive) {
      nextState = killPlayer(nextState, partnerId, "Chết theo người yêu");
    }
  }

  return nextState;
}

export function revivePlayer(gameState, playerId) {
  if (gameState.status === "finished") {
    return gameState;
  }

  const player = gameState.players.find((entry) => entry.id === playerId);
  if (!player || player.alive) {
    return gameState;
  }

  const nextState = {
    ...gameState,
    players: gameState.players.map((entry) =>
      entry.id === playerId ? { ...entry, alive: true } : entry,
    ),
  };

  return addHistoryEntry(nextState, "Hồi sinh", "player", "", player.name);
}

export function checkWinCondition(gameState) {
  if (gameState.status === "finished") {
    return gameState;
  }

  const alivePlayers = gameState.players.filter((player) => player.alive);
  const aliveWolves = alivePlayers.filter(
    (player) => getRoleDefinition(player.roleId).team === "wolf",
  ).length;
  const aliveVillage = alivePlayers.filter(
    (player) => getRoleDefinition(player.roleId).team === "village",
  ).length;

  if (aliveWolves === 0) {
    return {
      ...addHistoryEntry(gameState, "Kết thúc", "win", "Phe dân chiến thắng vì không còn Ma Sói sống."),
      screen: "summary",
      status: "finished",
      summary: {
        winnerTeam: "village",
        winnerLabel: "Phe dân thắng",
        reason: "Không còn Ma Sói sống.",
        finishedAt: Date.now(),
      },
    };
  }

  if (aliveWolves >= aliveVillage) {
    return {
      ...addHistoryEntry(gameState, "Kết thúc", "win", "Phe sói chiến thắng vì quân số đã áp đảo phe dân."),
      screen: "summary",
      status: "finished",
      summary: {
        winnerTeam: "wolf",
        winnerLabel: "Phe sói thắng",
        reason: "Số Sói còn sống đã lớn hơn hoặc bằng phe dân còn sống.",
        finishedAt: Date.now(),
      },
    };
  }

  return gameState;
}

export function saveGame(gameState) {
  const nextState = {
    ...gameState,
    updatedAt: Date.now(),
    storage: {
      hasSavedGame: true,
      lastSavedAt: Date.now(),
    },
  };

  StorageAdapter.save(nextState);
  return nextState;
}

export function loadGame() {
  const saved = StorageAdapter.load();
  if (!saved) {
    return null;
  }

  const base = createBaseState();
  const mergedGm = {
    ...base.gm,
    ...(saved.gm || {}),
    effects: {
      ...base.gm.effects,
      ...(saved.gm?.effects || {})
    },
    nightActions: {
      ...base.gm.nightActions,
      ...(saved.gm?.nightActions || {})
    },
    roleStates: {
      witch: {
        ...base.gm.roleStates.witch,
        ...(saved.gm?.roleStates?.witch || {})
      },
      hunter: {
        ...base.gm.roleStates.hunter,
        ...(saved.gm?.roleStates?.hunter || {})
      }
    }
  };

  return {
    ...base,
    ...saved,
    gm: mergedGm,
    storage: {
      hasSavedGame: true,
      lastSavedAt: saved.updatedAt ?? Date.now(),
    },
  };
}

export function loadSavedGame() {
  return loadGame();
}

export function loadSavedGameIntoState() {
  return loadSavedGame() ?? createBaseState();
}

export function updateSetupPlayerCount(gameState, playerCount) {
  return createSetupDraft(gameState, playerCount, true);
}

export function updateSetupPlayerName(gameState, playerIndex, name) {
  const players = gameState.setup.players.map((player, index) =>
    index === playerIndex ? { ...player, name } : player,
  );

  return {
    ...gameState,
    setup: {
      ...gameState.setup,
      players,
    },
  };
}

export function updateSetupRoleCount(gameState, roleId, value) {
  if (!ROLE_ORDER.includes(roleId)) {
    return gameState;
  }

  const safeValue = Math.max(0, Math.floor(Number(value) || 0));
  const roleConfig = {
    ...gameState.setup.roleConfig,
    [roleId]: safeValue,
  };

  return {
    ...gameState,
    setup: {
      ...gameState.setup,
      roleConfig,
      validation: createValidation(gameState.setup.playerCount, roleConfig),
    },
  };
}

export function applyCustomPreset(gameState, presetId) {
  const customPresets = StorageAdapter.getCustomPresets();
  const preset = customPresets.find(p => p.id === presetId);
  if (!preset) return gameState;
  
  const roleConfig = normalizeRoleConfig(preset.roleConfig);
  return {
    ...gameState,
    setup: {
      ...gameState.setup,
      playerCount: preset.playerCount,
      roleConfig,
      validation: createValidation(preset.playerCount, roleConfig),
    }
  }
}

export function updateRevealStage(gameState, stage) {
  return {
    ...gameState,
    reveal: {
      ...gameState.reveal,
      stage,
    },
  };
}

export function updateNoteDraft(gameState, noteDraft) {
  return {
    ...gameState,
    gm: {
      ...gameState.gm,
      noteDraft,
    },
  };
}

export function clearNoteDraft(gameState) {
  return {
    ...gameState,
    gm: {
      ...gameState.gm,
      noteDraft: "",
    },
  };
}

export function appendCurrentNoteToHistory(gameState) {
  const note = gameState.gm.noteDraft.trim();
  if (!note) {
    return gameState;
  }

  const withNote = addHistoryEntry(gameState, "Ghi chú", "note", note);

  return clearNoteDraft(withNote);
}

export function toggleShowRoles(gameState) {
  return {
    ...gameState,
    gm: {
      ...gameState.gm,
      showRoles: !gameState.gm.showRoles,
    },
  };
}

export function updateGmFilter(gameState, filter) {
  return {
    ...gameState,
    gm: {
      ...gameState.gm,
      filter,
    },
  };
}

export function addVote(gameState, playerId, amount) {
  const currentVote = gameState.gm.votes[playerId] || 0;
  const newVote = Math.max(0, currentVote + amount);
  return {
    ...gameState,
    gm: {
      ...gameState.gm,
      votes: {
        ...gameState.gm.votes,
        [playerId]: newVote,
      },
    },
  };
}

export function resetVotes(gameState) {
  return {
    ...gameState,
    gm: {
      ...gameState.gm,
      votes: {},
    },
  };
}

export function executeVoteHanging(gameState) {
  const votes = gameState.gm.votes;
  const playerIds = Object.keys(votes);
  if (playerIds.length === 0) return gameState;

  let maxVotes = 0;
  let targetId = null;
  let isTie = false;

  playerIds.forEach((id) => {
    const v = votes[id];
    if (v > maxVotes) {
      maxVotes = v;
      targetId = id;
      isTie = false;
    } else if (v === maxVotes && v > 0) {
      isTie = true;
    }
  });

  if (!targetId || maxVotes === 0 || isTie) {
    // Cannot hang on tie or no votes
    return addHistoryEntry(gameState, "Treo cổ", "vote", "Không có ai bị treo cổ (hòa phiếu hoặc không có phiếu).");
  }

  let nextState = killPlayer(gameState, targetId, "Bị treo cổ");
  const player = gameState.players.find(p => p.id === targetId);
  
  nextState = addHistoryEntry(nextState, "Treo cổ", "vote", `Bị treo cổ với ${maxVotes} phiếu.`, player ? player.name : "");
  nextState = resetVotes(nextState);
  
  // Check Jester win
  if (player && player.roleId === "jester") {
    return {
      ...addHistoryEntry(nextState, "Kết thúc", "win", "Kẻ ngốc (Jester) chiến thắng vì bị treo cổ."),
      screen: "summary",
      status: "finished",
      summary: {
        winnerTeam: "jester",
        winnerLabel: "Kẻ ngốc thắng",
        reason: "Kẻ ngốc đã lừa được làng treo cổ mình.",
        finishedAt: Date.now(),
      },
    };
  }
  
  return checkWinCondition(nextState);
}

export function finishGame(gameState) {
  if (gameState.status === "finished") {
    return gameState;
  }

  const nextState = addHistoryEntry(
    gameState,
    "Kết thúc thủ công",
    "system",
    "Quản trò đã chủ động kết thúc ván."
  );

  return {
    ...nextState,
    screen: "summary",
    status: "finished",
    summary: {
      winnerTeam: "manual",
      winnerLabel: "Kết thúc thủ công",
      reason: "Quản trò đã chủ động kết thúc ván.",
      finishedAt: Date.now(),
    },
  };
}

export function restartWithSameSetup(gameState) {
  const setup = gameState.previousSetup ?? {
    playerCount: gameState.players.length || 8,
    playerNames: gameState.players.map((player) => player.name),
    roleConfig: gameState.roleConfig ?? applyPreset(gameState.players.length || 8),
  };

  return createGame({
    baseState: createBaseState(),
    playerCount: setup.playerCount,
    playerNames: setup.playerNames,
    roleConfig: setup.roleConfig,
  });
}

export function goHome(gameState) {
  return {
    ...gameState,
    screen: "home",
    storage: {
      ...gameState.storage,
      hasSavedGame: StorageAdapter.hasSave(),
    },
  };
}

export function goSetup(gameState) {
  return {
    ...createSetupDraft(gameState, gameState.setup.playerCount, false),
    screen: "setup",
  };
}

export function goHowTo(gameState) {
  return {
    ...gameState,
    screen: "howto",
  };
}

/**
 * Creates a sanitized version of the game state safe to send over the network to a client.
 */
export function createPlayerViewState(gameState, playerId) {
  if (!gameState || !gameState.players) return null;

  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return null;

  const currentPhaseDef = getCurrentPhase(gameState.phase);
  
  let publicAnnouncement = "";
  // Check if we have history to show announcement
  if (gameState.gm?.history?.length > 0) {
    const lastHistory = gameState.gm.history[gameState.gm.history.length - 1];
    if (lastHistory.type === "system" || lastHistory.type === "night_summary") {
      publicAnnouncement = lastHistory.content;
    }
  }

  const roleDef = getRoleDefinition(player.roleId);

  return {
    playerId: player.id,
    playerName: player.name,
    alive: player.alive,
    role: {
      id: roleDef.id,
      name: roleDef.name,
      teamLabel: roleDef.teamLabel,
      icon: roleDef.icon,
      summary: roleDef.summary
    },
    publicPhase: currentPhaseDef.description,
    dayNightCounter: `Đêm ${gameState.phase.nightCount} / Ngày ${gameState.phase.dayCount}`,
    announcement: publicAnnouncement,
    winState: gameState.winState ? {
      winner: gameState.winState.winner,
      reason: gameState.winState.reason,
      revealedRoles: gameState.players.map(p => ({
        name: p.name,
        roleName: getRoleDefinition(p.roleId).name,
        icon: getRoleDefinition(p.roleId).icon
      }))
    } : null
  };
}
