import { createBaseState, loadSavedGame, saveGame } from "./src/game-state.js";
import { ROLE_ORDER, getRoleDefinition } from "./src/role-config.js";
import { PHASES, getCurrentPhase } from "./src/phase-manager.js";
import { render } from "./src/ui-renderer.js";
import { StorageAdapter } from "./src/storage-adapter.js";
import { getAppMode, setAppMode, APP_MODES } from "./src/app-modes.js";
import { dispatchAction } from "./src/action-dispatcher.js";
import { ACTION_TYPES } from "./src/action-types.js";
import { UI_ACTION_MAP } from "./src/action-map.js";
import { networkAdapter } from "./src/network-adapter.js";
import { NETWORK_MESSAGES } from "./src/network-message-types.js";
import { createPlayerViewState } from "./src/game-state.js";

const app = document.getElementById("app");
const savedGame = loadSavedGame();
let gameState = savedGame ?? createBaseState();

persistAndRender(Boolean(savedGame));

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) {
    return;
  }

  const { action, playerId, filter, presetId, p1Id, p2Id, presetMode } = target.dataset;
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
    } else if (action === "client-reconnect-submit") {
      doClientJoin(true);
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
  if (p1Id) payload.p1Id = p1Id;
  if (p2Id) payload.p2Id = p2Id;
  if (presetMode) payload.presetMode = presetMode;

  // Dispatch Action
  gameState = dispatchAction(gameState, { type: mappedActionType, payload, source });

  // Network integration side-effects
  if (mappedActionType === ACTION_TYPES.HOME_NEW_HOST) {
    setAppMode(APP_MODES.HOST);
    networkAdapter.initHost({
      onReady: (roomCode) => {
        gameState.hostLobby.roomCode = roomCode;
        persistAndRender(false);
      },
      onClientJoin: (peerId, name, sessionId, isReconnect) => {
        if (isReconnect && gameState.status === "active") {
          const player = gameState.players?.find(p => p.sessionId === sessionId);
          if (player) {
            player.id = peerId;
            networkAdapter.sendToClient(peerId, { type: NETWORK_MESSAGES.RECONNECT_SUCCESS });
            broadcastGameState();
          } else {
            networkAdapter.sendToClient(peerId, { type: NETWORK_MESSAGES.JOIN_REJECTED, payload: { reason: "Phiên kết nối không hợp lệ." } });
          }
        } else if (!isReconnect && gameState.screen === "host-lobby") {
          gameState.hostLobby.players.push({ id: peerId, name: name, sessionId: sessionId });
          networkAdapter.sendToClient(peerId, { type: NETWORK_MESSAGES.JOIN_ACCEPTED, payload: { playerId: peerId } });
        } else {
          networkAdapter.sendToClient(peerId, { type: NETWORK_MESSAGES.JOIN_REJECTED, payload: { reason: "Phòng đang chơi hoặc không cho phép tham gia lúc này." } });
        }
        persistAndRender(false);
      },
      onClientLeave: (peerId) => {
        if (gameState.screen === "host-lobby") {
          gameState.hostLobby.players = gameState.hostLobby.players.filter(p => p.id !== peerId);
          persistAndRender(false);
        }
      }
    });
  } else if (mappedActionType === ACTION_TYPES.HOME_JOIN_CLIENT) {
    setAppMode(APP_MODES.CLIENT);
  } else if (mappedActionType === ACTION_TYPES.GO_HOME || mappedActionType === ACTION_TYPES.CLIENT_DISCONNECT) {
    setAppMode(APP_MODES.OFFLINE);
    networkAdapter.disconnect();
  }

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
    ACTION_TYPES.HOME_NEW_HOST,
    ACTION_TYPES.HOME_JOIN_CLIENT,
    ACTION_TYPES.CLIENT_JOIN_SUBMIT,
    ACTION_TYPES.HOST_LOBBY_START,
    ACTION_TYPES.CLIENT_DISCONNECT,
    "GM_FORCE_BROADCAST",
  ];

  persistAndRender(!noSaveActions.includes(mappedActionType));
  
  if (getAppMode() === APP_MODES.HOST && gameState.screen === "gm") {
    // Also broadcast on manual force action
    if (mappedActionType !== "GM_FORCE_BROADCAST" && noSaveActions.includes(mappedActionType)) {
      // do nothing if it's a UI-only action except force broadcast
    } else {
      broadcastGameState();
    }
  }
});

function doClientJoin(isReconnect, form = null) {
  const roomCode = isReconnect ? (gameState.clientStatus?.roomCode || localStorage.getItem('ludora:werewolf:lastRoomCode')) : form.elements.roomCode.value.trim().toUpperCase();
  const playerName = isReconnect ? (gameState.clientStatus?.playerName || localStorage.getItem('ludora:werewolf:lastPlayerName')) : form.elements.playerName.value.trim();
  
  let sessionId = localStorage.getItem('ludora:werewolf:clientSessionId');
  if (!sessionId) {
    sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substring(2);
    localStorage.setItem('ludora:werewolf:clientSessionId', sessionId);
  }

  if (!isReconnect) {
    localStorage.setItem('ludora:werewolf:lastRoomCode', roomCode);
    localStorage.setItem('ludora:werewolf:lastPlayerName', playerName);
  }
  
  gameState = dispatchAction(gameState, { 
    type: ACTION_TYPES.CLIENT_JOIN_SUBMIT, 
    payload: { roomCode, playerName }, 
    source: getAppMode() 
  });
  
  if (isReconnect) {
    gameState.clientStatus = { ...gameState.clientStatus, error: "Đang kết nối lại...", isReconnecting: true };
  }
  
  persistAndRender(false);
  
  networkAdapter.initClient(roomCode, playerName, sessionId, isReconnect, {
    onConnected: () => {
      if (!isReconnect) {
        gameState = { ...gameState, screen: "client-wait", clientStatus: { roomCode, playerName } };
      } else {
        gameState.clientStatus.error = "";
        gameState.clientStatus.isReconnecting = false;
      }
      persistAndRender(false);
    },
    onRejected: (reason) => {
      alert("Kết nối thất bại: " + (reason || "Lỗi không xác định"));
      gameState = dispatchAction(gameState, { type: ACTION_TYPES.CLIENT_DISCONNECT });
      persistAndRender(false);
    },
    onData: (data) => {
      if (data.type === NETWORK_MESSAGES.PLAYER_VIEW_STATE) {
        gameState = { ...gameState, screen: "client-play", clientStatus: { ...gameState.clientStatus, ...data.payload } };
        persistAndRender(false);
      }
    },
    onDisconnected: () => {
      gameState.clientStatus = { ...gameState.clientStatus, error: "Đã mất kết nối với quản trò." };
      persistAndRender(false);
    },
    onError: (err) => {
      gameState.clientStatus = { ...gameState.clientStatus, error: "Lỗi kết nối. Vui lòng kiểm tra lại mã phòng.", isReconnecting: false };
      if (!isReconnect) gameState.screen = "client-join";
      persistAndRender(false);
    }
  });
}

app.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const action = form.dataset.action;
  
  if (action === "client-join-submit") {
    doClientJoin(false, form);
  }
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
  if (shouldSave && getAppMode() !== APP_MODES.CLIENT) {
    gameState = saveGame(gameState);
  }

  render(app, {
    gameState,
    roleOrder: ROLE_ORDER,
    getRoleDefinition,
    phases: PHASES,
    currentPhase: getCurrentPhase(gameState.phase),
    networkAdapter,
  });
}

function saveOnly() {
  if (getAppMode() !== APP_MODES.CLIENT) {
    gameState = saveGame(gameState);
  }
}

function broadcastGameState() {
  if (!networkAdapter.isHost() || !gameState.players) return;
  
  gameState.players.forEach(player => {
    if (player.id.startsWith("setup-") || player.id.startsWith("p-")) return; 
    
    const playerView = createPlayerViewState(gameState, player.id);
    if (playerView) {
      networkAdapter.sendToClient(player.id, {
        type: NETWORK_MESSAGES.PLAYER_VIEW_STATE,
        payload: playerView
      });
    }
  });
}
