import { getAppMode, APP_MODES } from "./app-modes.js";
import { ACTION_TYPES } from "./action-types.js";
import {
  goSetup,
  loadSavedGameIntoState,
  goHowTo,
  goHome,
  updateSetupPlayerCount,
  createSetupDraft,
  applyCustomPreset,
  createGame,
  updateRevealStage,
  toggleShowRoles,
  updateGmFilter,
  addVote,
  resetVotes,
  executeVoteHanging,
  nextPhase,
  appendCurrentNoteToHistory,
  clearNoteDraft,
  finishGame,
  restartWithSameSetup,
  updateSetupPlayerName,
  updateSetupRoleCount,
  updateNoteDraft,
  addHistoryEntry,
  killPlayer,
  revivePlayer,
  checkWinCondition
} from "./game-state.js";
import { 
  applyCupidLink, 
  toggleFoxPower,
  setNightAction,
  witchUsePotion,
  hunterShoot
} from "./role-effects.js";

// Helper functions moved from app.js to keep dispatcher pure
function advanceReveal(gameState) {
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
      "Bắt đầu game",
      "system",
      "Tất cả người chơi đã nhận vai. Quản trò bắt đầu điều phối."
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

function togglePlayerLife(gameState, playerId) {
  const player = gameState.players.find((entry) => entry.id === playerId);
  if (!player) {
    return gameState;
  }

  const updatedState = player.alive
    ? killPlayer(gameState, playerId)
    : revivePlayer(gameState, playerId);

  return checkWinCondition(updatedState);
}

/**
 * Dispatch an action to mutate the game state.
 * @param {Object} gameState - Current game state
 * @param {Object} action - { type, payload, source }
 * @returns {Object} nextGameState
 */
export function dispatchAction(gameState, action) {
  const { type, payload, source } = action;
  const mode = getAppMode();

  // Validate action type
  if (!Object.values(ACTION_TYPES).includes(type)) {
    console.warn(`[Action Dispatcher] Unknown action type: "${type}". State was not mutated.`);
    return gameState;
  }

  // Handle mode switches and network setup
  if (type === ACTION_TYPES.HOME_NEW_HOST) {
    return { ...gameState, screen: "host-lobby", hostLobby: { roomCode: null, players: [] } };
  }
  if (type === ACTION_TYPES.HOME_JOIN_CLIENT) {
    return { ...gameState, screen: "client-join", clientStatus: { error: "" } };
  }
  if (type === ACTION_TYPES.HOST_LOBBY_START) {
    // Go to setup with the players from the lobby
    const newState = createSetupDraft(gameState, gameState.hostLobby.players.length, true, "basic");
    newState.setup.players = gameState.hostLobby.players.map((p, i) => ({ id: p.id, name: p.name, sessionId: p.sessionId, order: i + 1 }));
    return newState;
  }
  if (type === ACTION_TYPES.CLIENT_JOIN_SUBMIT) {
    // Return loading state, app.js will handle the actual network connection
    return { ...gameState, screen: "client-wait", clientStatus: { roomCode: payload.roomCode, playerName: payload.playerName } };
  }
  if (type === ACTION_TYPES.CLIENT_DISCONNECT) {
    return goHome(gameState);
  }

  // If we are in offline mode, process everything locally
  if (mode === APP_MODES.OFFLINE || source === "offline") {
    return processOfflineAction(gameState, action);
  }
  
  if (mode === APP_MODES.HOST) {
    // Host processes actions normally like offline mode, but app.js will broadcast state changes
    return processOfflineAction(gameState, action);
  }

  return gameState;
}

function processOfflineAction(gameState, { type, payload }) {
  switch (type) {
    case ACTION_TYPES.GO_SETUP:
      return goSetup(gameState);
    case ACTION_TYPES.LOAD_SAVED_GAME:
      return loadSavedGameIntoState();
    case ACTION_TYPES.GO_HOW_TO:
      return goHowTo(gameState);
    case ACTION_TYPES.GO_HOME:
      return goHome(gameState);
    case ACTION_TYPES.SETUP_DECREASE_PLAYER:
      return updateSetupPlayerCount(gameState, gameState.setup.playerCount - 1);
    case ACTION_TYPES.SETUP_INCREASE_PLAYER:
      return updateSetupPlayerCount(gameState, gameState.setup.playerCount + 1);
    case ACTION_TYPES.SETUP_APPLY_PRESET:
      return createSetupDraft(gameState, gameState.setup.playerCount, true, payload.presetMode);
    case ACTION_TYPES.SETUP_LOAD_PRESET:
      return applyCustomPreset(gameState, payload.presetId);
    case ACTION_TYPES.SETUP_ASSIGN_ROLES: {
      let newState = createGame({
        baseState: gameState,
        playerCount: gameState.setup.playerCount,
        playerNames: gameState.setup.players.map((player) => player.name),
        roleConfig: gameState.setup.roleConfig,
      });
      // Skip reveal phase if we are host
      if (getAppMode() === APP_MODES.HOST) {
        newState = addHistoryEntry(
          {
            ...newState,
            screen: "gm",
            reveal: {
              ...newState.reveal,
              stage: "done",
            },
          },
          "Bắt đầu game",
          "system",
          "Tất cả người chơi đã nhận vai trên máy cá nhân. Quản trò bắt đầu điều phối."
        );
      }
      return newState;
    }
    case ACTION_TYPES.REVEAL_READY:
      return updateRevealStage(gameState, "ready");
    case ACTION_TYPES.REVEAL_SHOW:
      return updateRevealStage(gameState, "revealed");
    case ACTION_TYPES.REVEAL_NEXT:
      return advanceReveal(gameState);
    case ACTION_TYPES.GM_TOGGLE_ROLES:
      return toggleShowRoles(gameState);
    case ACTION_TYPES.GM_FILTER_CHANGE:
      return updateGmFilter(gameState, payload.filter);
    case ACTION_TYPES.GM_VOTE_ADD:
      return addVote(gameState, payload.playerId, 1);
    case ACTION_TYPES.GM_VOTE_SUB:
      return addVote(gameState, payload.playerId, -1);
    case ACTION_TYPES.GM_VOTE_RESET:
      return resetVotes(gameState);
    case ACTION_TYPES.GM_VOTE_EXECUTE:
      return executeVoteHanging(gameState);
    case ACTION_TYPES.GM_NEXT_PHASE:
      return nextPhase(gameState);
    case ACTION_TYPES.GM_TOGGLE_LIFE:
      return togglePlayerLife(gameState, payload.playerId);
    case ACTION_TYPES.GM_ADD_NOTE:
      return appendCurrentNoteToHistory(gameState);
    case ACTION_TYPES.GM_CLEAR_NOTE:
      return clearNoteDraft(gameState);
    case ACTION_TYPES.GM_END_GAME:
      return finishGame(gameState);
    case ACTION_TYPES.GM_SET_CUPID_LINK:
      return applyCupidLink(gameState, payload.p1Id, payload.p2Id);
    case ACTION_TYPES.GM_TOGGLE_FOX_POWER:
      return toggleFoxPower(gameState, payload.playerId);
      
    // Night Actions
    case ACTION_TYPES.GM_SET_WOLF_TARGET:
      return setNightAction(gameState, "wolfTarget", payload.playerId);
    case ACTION_TYPES.GM_SET_GUARD_TARGET:
      return setNightAction(gameState, "guardTarget", payload.playerId);
    case ACTION_TYPES.GM_WITCH_HEAL:
      return witchUsePotion(gameState, "heal");
    case ACTION_TYPES.GM_WITCH_POISON:
      return witchUsePotion(gameState, "poison", payload.playerId);
    case ACTION_TYPES.GM_HUNTER_SHOOT:
      return hunterShoot(gameState, payload.playerId);

    case ACTION_TYPES.SUMMARY_REPLAY:
      return restartWithSameSetup(gameState);
      
    // Input actions
    case ACTION_TYPES.SETUP_UPDATE_PLAYER_NAME:
      return updateSetupPlayerName(gameState, payload.playerIndex, payload.value);
    case ACTION_TYPES.SETUP_UPDATE_ROLE_COUNT:
      return updateSetupRoleCount(gameState, payload.roleId, payload.value);
    case ACTION_TYPES.SETUP_UPDATE_PLAYER_COUNT:
      return updateSetupPlayerCount(gameState, payload.value);
    case ACTION_TYPES.GM_UPDATE_NOTE_DRAFT:
      return updateNoteDraft(gameState, payload.value);
      
    default:
      console.warn(`[Action Dispatcher] Unhandled action type: "${type}" in processOfflineAction.`);
      return gameState;
  }
}
