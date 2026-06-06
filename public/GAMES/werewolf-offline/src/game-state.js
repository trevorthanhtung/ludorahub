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

export function createSetupDraft(baseState, playerCount = 8, forcePreset = false) {
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
      ? applyPreset(safeCount)
      : normalizeRoleConfig({
          ...applyPreset(safeCount),
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
      noteDraft: "",
      history: [],
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
  const players = Array.from({ length: safeCount }, (_, index) => ({
    id: `player-${Date.now()}-${index + 1}`,
    order: index + 1,
    name: playerNames[index]?.trim() || `Người chơi ${index + 1}`,
    alive: true,
  }));

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
      noteDraft: "",
      history: [],
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
  return addHistoryEntry(withRoles, "Ván mới đã được tạo và chia vai thành công.", "system");
}

export function addHistoryEntry(gameState, message, type = "system") {
  return {
    ...gameState,
    gm: {
      ...gameState.gm,
      history: [
        {
          id: `history-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
          type,
          message,
          timestamp: Date.now(),
          phaseLabel: getCurrentPhase(gameState.phase).label,
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

  nextState = addHistoryEntry(nextState, `Chuyển phase sang "${nextPhaseLabel}".`, "phase");
  return checkWinCondition(nextState);
}

export function killPlayer(gameState, playerId) {
  if (gameState.status === "finished") {
    return gameState;
  }

  const player = gameState.players.find((entry) => entry.id === playerId);
  if (!player || !player.alive) {
    return gameState;
  }

  const nextState = {
    ...gameState,
    players: gameState.players.map((entry) =>
      entry.id === playerId ? { ...entry, alive: false } : entry,
    ),
  };

  return addHistoryEntry(nextState, `${player.name} đã bị đánh dấu là chết.`, "player");
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

  return addHistoryEntry(nextState, `${player.name} đã được hồi lại trạng thái sống.`, "player");
}

export function checkWinCondition(gameState) {
  if (gameState.status === "finished") {
    return gameState;
  }

  const alivePlayers = gameState.players.filter((player) => player.alive);
  const aliveWolves = alivePlayers.filter(
    (player) => getRoleDefinition(player.roleId).team === "wolf",
  ).length;
  const aliveVillage = alivePlayers.length - aliveWolves;

  if (aliveWolves === 0) {
    return {
      ...addHistoryEntry(gameState, "Phe dân chiến thắng vì không còn Ma Sói sống.", "win"),
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
      ...addHistoryEntry(gameState, "Phe sói chiến thắng vì quân số đã áp đảo phe dân.", "win"),
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

  return {
    ...createBaseState(),
    ...saved,
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

export function appendCurrentNoteToHistory(gameState) {
  const note = gameState.gm.noteDraft.trim();
  if (!note) {
    return gameState;
  }

  const withNote = addHistoryEntry(gameState, `Ghi chú quản trò: ${note}`, "note");

  return {
    ...withNote,
    gm: {
      ...withNote.gm,
      noteDraft: "",
    },
  };
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

export function finishGame(gameState) {
  if (gameState.status === "finished") {
    return gameState;
  }

  const nextState = addHistoryEntry(
    gameState,
    "Ván chơi được quản trò kết thúc thủ công.",
    "system",
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
