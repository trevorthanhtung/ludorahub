import { ACTION_TYPES } from "./action-types.js";

export const UI_ACTION_MAP = {
  // Navigation & Setup
  "home-new": ACTION_TYPES.GO_SETUP,
  "nav-setup": ACTION_TYPES.GO_SETUP,
  "home-continue": ACTION_TYPES.LOAD_SAVED_GAME,
  "home-howto": ACTION_TYPES.GO_HOW_TO,
  "nav-home": ACTION_TYPES.GO_HOME,
  
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

  // Summary
  "summary-replay": ACTION_TYPES.SUMMARY_REPLAY,
};
