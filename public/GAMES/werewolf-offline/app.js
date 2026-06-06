import { createBaseState, loadSavedGame, saveGame } from "./src/game-state.js";
import { ROLE_ORDER, getRoleDefinition } from "./src/role-config.js";
import { PHASES, getCurrentPhase } from "./src/phase-manager.js";
import { render } from "./src/ui-renderer.js";
import { StorageAdapter } from "./src/storage-adapter.js";
import { getAppMode } from "./src/app-modes.js";
import { dispatchAction } from "./src/action-dispatcher.js";
import { ACTION_TYPES } from "./src/action-types.js";
import { UI_ACTION_MAP } from "./src/action-map.js";

const app = document.getElementById("app");
const savedGame = loadSavedGame();
let gameState = savedGame ?? createBaseState();

persistAndRender(Boolean(savedGame));

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) {
    return;
  }

  const { action, playerId, filter, presetId } = target.dataset;
  const source = getAppMode();

  const mappedActionType = UI_ACTION_MAP[action];

  // Handling UI-only or unmapped actions
  if (!mappedActionType) {
    if (action === "hub-back") {
      window.history.back();
    } else if (action === "setup-save-preset") {
      if (!gameState.setup.validation.isValid) return;
      const preset = {
        id: `preset-${gameState.setup.playerCount}`,
        playerCount: gameState.setup.playerCount,
        roleConfig: gameState.setup.roleConfig
      };
      StorageAdapter.saveCustomPreset(preset);
      persistAndRender(false);
    } else if (action === "setup-delete-preset") {
      if (presetId) {
        StorageAdapter.deleteCustomPreset(presetId);
        persistAndRender(false);
      }
    } else {
      console.warn(`[UI] Unknown or unmapped data-action: "${action}"`);
    }
    return;
  }

  // Pre-dispatch validation & side effects
  if (mappedActionType === ACTION_TYPES.GO_SETUP) {
    if (gameState.status === "active" || gameState.status === "finished") {
      if (!window.confirm("Bắt đầu setup ván mới sẽ ghi đè ván hiện tại. Tiếp tục?")) return;
    }
  } else if (mappedActionType === ACTION_TYPES.GM_VOTE_EXECUTE) {
    if (!window.confirm("Bạn có chắc chắn muốn treo cổ người nhiều phiếu nhất? Hành động này không thể hoàn tác.")) return;
  } else if (mappedActionType === ACTION_TYPES.GM_END_GAME) {
    if (!window.confirm("Bạn có chắc chắn muốn kết thúc ván ngay lập tức?")) return;
  } else if (mappedActionType === ACTION_TYPES.SETUP_ASSIGN_ROLES) {
    if (!gameState.setup.validation.isValid) return;
  } else if (mappedActionType === ACTION_TYPES.SETUP_LOAD_PRESET && !presetId) {
    return;
  } else if ((mappedActionType === ACTION_TYPES.GM_VOTE_ADD || mappedActionType === ACTION_TYPES.GM_VOTE_SUB || mappedActionType === ACTION_TYPES.GM_TOGGLE_LIFE) && !playerId) {
    return;
  } else if (mappedActionType === ACTION_TYPES.GM_FILTER_CHANGE && !filter) {
    return;
  }

  // Payload extraction
  const payload = {};
  if (playerId) payload.playerId = playerId;
  if (filter) payload.filter = filter;
  if (presetId) payload.presetId = presetId;

  // Dispatch Action
  gameState = dispatchAction(gameState, { type: mappedActionType, payload, source });

  // Post-dispatch rendering and persistence logic
  const noSaveActions = [
    ACTION_TYPES.GO_SETUP,
    ACTION_TYPES.LOAD_SAVED_GAME,
    ACTION_TYPES.GO_HOW_TO,
    ACTION_TYPES.GO_HOME,
    ACTION_TYPES.SETUP_DECREASE_PLAYER,
    ACTION_TYPES.SETUP_INCREASE_PLAYER,
    ACTION_TYPES.SETUP_APPLY_PRESET,
    ACTION_TYPES.SETUP_LOAD_PRESET,
    ACTION_TYPES.REVEAL_SHOW,
    ACTION_TYPES.GM_TOGGLE_ROLES,
    ACTION_TYPES.GM_FILTER_CHANGE,
  ];

  persistAndRender(!noSaveActions.includes(mappedActionType));
});

app.addEventListener("input", (event) => {
  const target = event.target;
  const source = getAppMode();

  if (target.matches("[data-player-name]")) {
    const playerIndex = Number(target.dataset.playerName);
    gameState = dispatchAction(gameState, { 
      type: ACTION_TYPES.SETUP_UPDATE_PLAYER_NAME, 
      payload: { playerIndex, value: target.value },
      source 
    });
    return;
  }

  if (target.matches("[data-role-count]")) {
    const roleId = target.dataset.roleCount;
    gameState = dispatchAction(gameState, { 
      type: ACTION_TYPES.SETUP_UPDATE_ROLE_COUNT, 
      payload: { roleId, value: target.value },
      source 
    });
    return persistAndRender(false);
  }

  if (target.matches("[data-player-count]")) {
    gameState = dispatchAction(gameState, { 
      type: ACTION_TYPES.SETUP_UPDATE_PLAYER_COUNT, 
      payload: { value: target.value },
      source 
    });
    return persistAndRender(false);
  }

  if (target.matches("[data-note-draft]")) {
    gameState = dispatchAction(gameState, { 
      type: ACTION_TYPES.GM_UPDATE_NOTE_DRAFT, 
      payload: { value: target.value },
      source 
    });
    return saveOnly();
  }
});

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
