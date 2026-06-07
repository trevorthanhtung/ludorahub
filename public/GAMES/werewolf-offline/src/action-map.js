import { ACTION_TYPES } from "./action-types.js";

export const UI_ACTION_MAP = {
  // Navigation & Setup
  "home-new": ACTION_TYPES.GO_SETUP,
  "nav-setup": ACTION_TYPES.GO_SETUP,
  "home-continue": ACTION_TYPES.LOAD_SAVED_GAME,
  "home-howto": ACTION_TYPES.GO_HOW_TO,
  "nav-home": ACTION_TYPES.GO_HOME,
  "home-new-host": ACTION_TYPES.HOME_NEW_HOST,
  "home-join-client": ACTION_TYPES.HOME_JOIN_CLIENT,
  "client-join-submit": ACTION_TYPES.CLIENT_JOIN_SUBMIT,
  "host-lobby-start": ACTION_TYPES.HOST_LOBBY_START,
  "client-disconnect": ACTION_TYPES.CLIENT_DISCONNECT,
  
  "setup-decrease": ACTION_TYPES.SETUP_DECREASE_PLAYER,
  "setup-increase": ACTION_TYPES.SETUP_INCREASE_PLAYER,
  "setup-apply-preset": ACTION_TYPES.SETUP_APPLY_PRESET,
  "setup-load-preset": ACTION_TYPES.SETUP_LOAD_PRESET,
  "setup-assign": ACTION_TYPES.SETUP_ASSIGN_ROLES,

  // Reveal Phase
  "reveal-ready": ACTION_TYPES.REVEAL_READY,
  "reveal-show": ACTION_TYPES.REVEAL_SHOW,
  "reveal-next": ACTION_TYPES.REVEAL_NEXT,

  // GM Dashboard
  "gm-toggle-roles": ACTION_TYPES.GM_TOGGLE_ROLES,
  "gm-filter-change": ACTION_TYPES.GM_FILTER_CHANGE,
  "gm-vote-add": ACTION_TYPES.GM_VOTE_ADD,
  "gm-vote-sub": ACTION_TYPES.GM_VOTE_SUB,
  "gm-vote-reset": ACTION_TYPES.GM_VOTE_RESET,
  "gm-vote-execute": ACTION_TYPES.GM_VOTE_EXECUTE,
  "gm-next-phase": ACTION_TYPES.GM_NEXT_PHASE,
  "gm-toggle-life": ACTION_TYPES.GM_TOGGLE_LIFE,
  "gm-add-note": ACTION_TYPES.GM_ADD_NOTE,
  "gm-clear-note": ACTION_TYPES.GM_CLEAR_NOTE,
  "gm-end-game": ACTION_TYPES.GM_END_GAME,
  "gm-clear-note-draft": ACTION_TYPES.GM_CLEAR_NOTE_DRAFT,
  "gm-set-cupid-link": ACTION_TYPES.GM_SET_CUPID_LINK,
  "gm-toggle-fox-power": ACTION_TYPES.GM_TOGGLE_FOX_POWER,
  "GM_FORCE_BROADCAST": ACTION_TYPES.GM_FORCE_BROADCAST,

  // Night Actions
  "gm-set-wolf-target": ACTION_TYPES.GM_SET_WOLF_TARGET,
  "gm-set-guard-target": ACTION_TYPES.GM_SET_GUARD_TARGET,
  "gm-witch-heal": ACTION_TYPES.GM_WITCH_HEAL,
  "gm-witch-poison": ACTION_TYPES.GM_WITCH_POISON,
  "gm-hunter-shoot": ACTION_TYPES.GM_HUNTER_SHOOT,

  // Summary
  "summary-replay": ACTION_TYPES.SUMMARY_REPLAY,
};
