import {
  createBaseState,
  createGame,
  createSetupDraft,
  loadSavedGame,
  saveGame,
  nextPhase,
  killPlayer,
  revivePlayer,
  checkWinCondition,
  restartWithSameSetup,
  finishGame,
  addHistoryEntry,
  updateSetupPlayerCount,
  updateSetupPlayerName,
  updateSetupRoleCount,
  updateRevealStage,
  updateNoteDraft,
  appendCurrentNoteToHistory,
  toggleShowRoles,
  goHome,
  goSetup,
  goHowTo,
  loadSavedGameIntoState,
} from "./src/game-state.js";
import { ROLE_ORDER, getRoleDefinition } from "./src/role-config.js";
import { PHASES, getCurrentPhase } from "./src/phase-manager.js";
import { render } from "./src/ui-renderer.js";

const app = document.getElementById("app");
const savedGame = loadSavedGame();
let gameState = savedGame ?? createBaseState();

persistAndRender(Boolean(savedGame));

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) {
    return;
  }

  const { action, playerId } = target.dataset;

  switch (action) {
    case "home-new":
      gameState = goSetup(gameState);
      return persistAndRender(false);
    case "home-continue":
      gameState = loadSavedGameIntoState();
      return persistAndRender(false);
    case "home-howto":
      gameState = goHowTo(gameState);
      return persistAndRender(false);
    case "hub-back":
      window.history.back();
      return;
    case "nav-home":
      gameState = goHome(gameState);
      return persistAndRender(false);
    case "nav-setup":
      gameState = goSetup(gameState);
      return persistAndRender(false);
    case "setup-decrease":
      gameState = updateSetupPlayerCount(gameState, gameState.setup.playerCount - 1);
      return persistAndRender(false);
    case "setup-increase":
      gameState = updateSetupPlayerCount(gameState, gameState.setup.playerCount + 1);
      return persistAndRender(false);
    case "setup-apply-preset":
      gameState = createSetupDraft(gameState, gameState.setup.playerCount, true);
      return persistAndRender(false);
    case "setup-assign":
      if (!gameState.setup.validation.isValid) {
        return;
      }
      gameState = createGame({
        baseState: gameState,
        playerCount: gameState.setup.playerCount,
        playerNames: gameState.setup.players.map((player) => player.name),
        roleConfig: gameState.setup.roleConfig,
      });
      return persistAndRender();
    case "reveal-ready":
      gameState = updateRevealStage(gameState, "ready");
      return persistAndRender();
    case "reveal-show":
      gameState = updateRevealStage(gameState, "revealed");
      return persistAndRender(false);
    case "reveal-next":
      gameState = advanceReveal();
      return persistAndRender();
    case "gm-toggle-roles":
      gameState = toggleShowRoles(gameState);
      return persistAndRender(false);
    case "gm-next-phase":
      gameState = nextPhase(gameState);
      return persistAndRender();
    case "gm-toggle-life":
      if (!playerId) return;
      gameState = togglePlayerLife(playerId);
      return persistAndRender();
    case "gm-add-note":
      gameState = appendCurrentNoteToHistory(gameState);
      return persistAndRender();
    case "gm-end-game":
      gameState = finishGame(gameState);
      return persistAndRender();
    case "summary-replay":
      gameState = restartWithSameSetup(gameState);
      return persistAndRender();
    default:
      return;
  }
});

app.addEventListener("input", (event) => {
  const target = event.target;

  if (target.matches("[data-player-name]")) {
    const playerIndex = Number(target.dataset.playerName);
    gameState = updateSetupPlayerName(gameState, playerIndex, target.value);
    return;
  }

  if (target.matches("[data-role-count]")) {
    const roleId = target.dataset.roleCount;
    gameState = updateSetupRoleCount(gameState, roleId, target.value);
    return persistAndRender(false);
  }

  if (target.matches("[data-player-count]")) {
    gameState = updateSetupPlayerCount(gameState, target.value);
    return persistAndRender(false);
  }

  if (target.matches("[data-note-draft]")) {
    gameState = updateNoteDraft(gameState, target.value);
    return saveOnly();
  }
});

function advanceReveal() {
  const nextIndex = gameState.reveal.currentIndex + 1;

  if (nextIndex >= gameState.players.length) {
    return addHistoryEntry(
      {
        ...gameState,
        screen: "gm",
        reveal: {
          ...gameState.reveal,
          currentIndex: gameState.players.length - 1,
          stage: "done",
        },
      },
      "Tất cả người chơi đã nhận vai. Quản trò bắt đầu điều phối.",
      "system",
    );
  }

  return {
    ...gameState,
    reveal: {
      currentIndex: nextIndex,
      stage: "handoff",
    },
  };
}

function togglePlayerLife(playerId) {
  const player = gameState.players.find((entry) => entry.id === playerId);
  if (!player) {
    return gameState;
  }

  const updatedState = player.alive
    ? killPlayer(gameState, playerId)
    : revivePlayer(gameState, playerId);

  return checkWinCondition(updatedState);
}

function persistAndRender(shouldSave = true) {
  if (shouldSave) {
    gameState = saveGame(gameState);
  }

  render(app, {
    gameState,
    roleOrder: ROLE_ORDER,
    getRoleDefinition,
    phases: PHASES,
    currentPhase: getCurrentPhase(gameState.phase),
  });
}

function saveOnly() {
  gameState = saveGame(gameState);
}
