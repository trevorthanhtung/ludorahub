(() => {
  // src/role-config.js
  var ROLE_ORDER = [
    "villager",
    "werewolf",
    "alpha_wolf",
    "seer",
    "guard",
    "witch",
    "hunter",
    "cupid",
    "fox",
    "jester"
  ];
  var ROLE_DEFINITIONS = {
    villager: {
      id: "villager",
      name: "D\xE2n l\xE0ng",
      team: "village",
      teamLabel: "Phe d\xE2n",
      icon: "\u{1F9D1}",
      summary: "\u1EA8n m\xECnh, th\u1EA3o lu\u1EADn v\xE0 t\xECm ra Ma S\xF3i."
    },
    werewolf: {
      id: "werewolf",
      name: "Ma s\xF3i",
      team: "wolf",
      teamLabel: "Phe s\xF3i",
      icon: "\u{1F43A}",
      summary: "Ph\u1ED1i h\u1EE3p b\xED m\u1EADt v\xE0 lo\u1EA1i d\u1EA7n phe d\xE2n."
    },
    alpha_wolf: {
      id: "alpha_wolf",
      name: "S\xF3i \u0111\u1EA7u \u0111\xE0n",
      team: "wolf",
      teamLabel: "Phe s\xF3i",
      icon: "\u{1F43A}\u{1F451}",
      summary: "S\xF3i quy\u1EC1n l\u1EF1c nh\u1EA5t, d\xF9ng nh\u01B0 s\xF3i th\u01B0\u1EDDng."
    },
    seer: {
      id: "seer",
      name: "Ti\xEAn tri",
      team: "village",
      teamLabel: "Phe d\xE2n",
      icon: "\u{1F52E}",
      summary: "M\u1ED7i \u0111\xEAm soi m\u1ED9t ng\u01B0\u1EDDi \u0111\u1EC3 bi\u1EBFt phe c\u1EE7a h\u1ECD."
    },
    guard: {
      id: "guard",
      name: "B\u1EA3o v\u1EC7",
      team: "village",
      teamLabel: "Phe d\xE2n",
      icon: "\u{1F6E1}\uFE0F",
      summary: "M\u1ED7i \u0111\xEAm ch\u1ECDn m\u1ED9t ng\u01B0\u1EDDi \u0111\u1EC3 b\u1EA3o v\u1EC7 kh\u1ECFi nguy hi\u1EC3m."
    },
    witch: {
      id: "witch",
      name: "Ph\xF9 th\u1EE7y",
      team: "village",
      teamLabel: "Phe d\xE2n",
      icon: "\u{1F9EA}",
      summary: "\u0110i\u1EC1u ph\u1ED1i c\u1EE9u ho\u1EB7c h\u1EA1 \u0111\u1ED9c theo lu\u1EADt nh\xF3m \u0111ang d\xF9ng."
    },
    hunter: {
      id: "hunter",
      name: "Th\u1EE3 s\u0103n",
      team: "village",
      teamLabel: "Phe d\xE2n",
      icon: "\u{1F3F9}",
      summary: "Khi b\u1ECB lo\u1EA1i c\xF3 th\u1EC3 ph\u1EA3n \u0111\xF2n (b\u1EAFn 1 ng\u01B0\u1EDDi)."
    },
    cupid: {
      id: "cupid",
      name: "Th\u1EA7n t\xECnh y\xEAu",
      team: "village",
      teamLabel: "Phe d\xE2n",
      icon: "\u{1F47C}",
      summary: "Gh\xE9p \u0111\xF4i 2 ng\u01B0\u1EDDi y\xEAu nhau. M\u1ED9t ng\u01B0\u1EDDi ch\u1EBFt, ng\u01B0\u1EDDi kia ch\u1EBFt theo."
    },
    fox: {
      id: "fox",
      name: "C\xE1o",
      team: "village",
      teamLabel: "Phe d\xE2n",
      icon: "\u{1F98A}",
      summary: "M\u1ED7i \u0111\xEAm soi 3 ng\u01B0\u1EDDi li\xEAn ti\u1EBFp. M\u1EA5t n\u0103ng l\u1EF1c n\u1EBFu kh\xF4ng c\xF3 s\xF3i."
    },
    jester: {
      id: "jester",
      name: "K\u1EBB ng\u1ED1c",
      team: "jester",
      teamLabel: "Phe ri\xEAng",
      icon: "\u{1F921}",
      summary: "Th\u1EAFng ngay l\u1EADp t\u1EE9c n\u1EBFu b\u1ECB d\xE2n l\xE0ng treo c\u1ED5 v\xE0o ban ng\xE0y."
    }
  };
  function createEmptyRoleConfig() {
    return ROLE_ORDER.reduce((config, roleId) => {
      config[roleId] = 0;
      return config;
    }, {});
  }
  function getRoleDefinition(roleId) {
    return ROLE_DEFINITIONS[roleId] ?? ROLE_DEFINITIONS.villager;
  }
  function normalizeRoleConfig(roleConfig = {}) {
    return ROLE_ORDER.reduce((config, roleId) => {
      const rawValue = Number(roleConfig[roleId] ?? 0);
      config[roleId] = Number.isFinite(rawValue) ? Math.max(0, Math.floor(rawValue)) : 0;
      return config;
    }, createEmptyRoleConfig());
  }
  function countRoles(roleConfig = {}) {
    return ROLE_ORDER.reduce((total, roleId) => total + Number(roleConfig[roleId] ?? 0), 0);
  }
  function expandRolePool(roleConfig = {}) {
    return ROLE_ORDER.flatMap(
      (roleId) => Array.from({ length: Number(roleConfig[roleId] ?? 0) }, () => roleId)
    );
  }

  // src/preset-builder.js
  function sanitizePlayerCount(playerCount) {
    const parsed = Number(playerCount);
    if (!Number.isFinite(parsed)) {
      return 5;
    }
    return Math.min(15, Math.max(5, Math.floor(parsed)));
  }
  function applyPreset(playerCount, mode = "basic") {
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
    if (mode === "balanced" || mode === "chaos") {
      if (safeCount >= 7) config.cupid = 1;
      if (safeCount >= 9) {
        config.werewolf -= 1;
        config.alpha_wolf = 1;
      }
    }
    if (mode === "chaos") {
      if (safeCount >= 6) config.jester = 1;
      if (safeCount >= 8) config.fox = 1;
    }
    config.villager = Math.max(0, safeCount - countRoles(config));
    return normalizeRoleConfig(config);
  }

  // src/phase-manager.js
  var PHASES = [
    {
      key: "night",
      label: "\u0110\xEAm",
      shortLabel: "\u0110\xEAm",
      description: "M\u1ECDi ng\u01B0\u1EDDi nh\u1EAFm m\u1EAFt, qu\u1EA3n tr\xF2 b\u1EAFt \u0111\u1EA7u chu k\u1EF3 \u0111\xEAm."
    },
    {
      key: "wolf",
      label: "S\xF3i th\u1EE9c",
      shortLabel: "S\xF3i",
      description: "M\u1EDDi Ma S\xF3i th\u1EE9c d\u1EADy v\xE0 th\u1ED1ng nh\u1EA5t m\u1EE5c ti\xEAu."
    },
    {
      key: "seer",
      label: "Ti\xEAn tri th\u1EE9c",
      shortLabel: "Ti\xEAn tri",
      description: "M\u1EDDi Ti\xEAn tri soi m\u1ED9t ng\u01B0\u1EDDi ch\u01A1i."
    },
    {
      key: "guard",
      label: "B\u1EA3o v\u1EC7 th\u1EE9c",
      shortLabel: "B\u1EA3o v\u1EC7",
      description: "M\u1EDDi B\u1EA3o v\u1EC7 ch\u1ECDn ng\u01B0\u1EDDi \u0111\u01B0\u1EE3c b\u1EA3o v\u1EC7."
    },
    {
      key: "witch",
      label: "Ph\xF9 th\u1EE7y th\u1EE9c",
      shortLabel: "Ph\xF9 th\u1EE7y",
      description: "M\u1EDDi Ph\xF9 th\u1EE7y d\xF9ng c\u1EE9u / \u0111\u1ED9c theo lu\u1EADt nh\xF3m."
    },
    {
      key: "morning",
      label: "S\xE1ng",
      shortLabel: "S\xE1ng",
      description: "Th\xF4ng b\xE1o k\u1EBFt qu\u1EA3 \u0111\xEAm v\xE0 m\u1EDF m\u1EAFt to\xE0n b\u1ED9."
    },
    {
      key: "discussion",
      label: "Th\u1EA3o lu\u1EADn",
      shortLabel: "Th\u1EA3o lu\u1EADn",
      description: "Ng\u01B0\u1EDDi ch\u01A1i tranh lu\u1EADn, suy lu\u1EADn v\xE0 b\u1EA3o v\u1EC7 m\xECnh."
    },
    {
      key: "voting",
      label: "Treo c\u1ED5",
      shortLabel: "B\u1ECF phi\u1EBFu",
      description: "Ch\u1ED1t ng\u01B0\u1EDDi b\u1ECB treo v\xE0 x\u1EED l\xFD h\u1EADu qu\u1EA3."
    }
  ];
  function createInitialPhase() {
    return {
      index: 0,
      key: PHASES[0].key,
      label: PHASES[0].label,
      cycle: 1,
      changedAt: Date.now()
    };
  }
  function getCurrentPhase(phaseState) {
    return PHASES[phaseState?.index ?? 0] ?? PHASES[0];
  }
  function getNextPhaseTransition(phaseState) {
    const currentIndex = phaseState?.index ?? 0;
    const nextIndex = (currentIndex + 1) % PHASES.length;
    const wrapped = nextIndex === 0;
    const nextPhase2 = PHASES[nextIndex];
    return {
      phase: {
        index: nextIndex,
        key: nextPhase2.key,
        label: nextPhase2.label,
        cycle: wrapped ? (phaseState?.cycle ?? 1) + 1 : phaseState?.cycle ?? 1,
        changedAt: Date.now()
      },
      wrapped
    };
  }

  // src/storage-adapter.js
  var STORAGE_KEY = "ludora:werewolf-offline:save";
  var PRESET_STORAGE_KEY = "ludora:werewolf-offline:presets";
  var STORAGE_VERSION = 1;
  var StorageAdapter = {
    save(gameState2) {
      try {
        const payload = JSON.stringify({
          version: STORAGE_VERSION,
          data: gameState2
        });
        localStorage.setItem(STORAGE_KEY, payload);
        return true;
      } catch (error) {
        console.warn("[Werewolf Offline] Save failed:", error);
        return false;
      }
    },
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return null;
        }
        const payload = JSON.parse(raw);
        if (!payload?.data) {
          return null;
        }
        return payload.data;
      } catch (error) {
        console.warn("[Werewolf Offline] Load failed:", error);
        return null;
      }
    },
    clear() {
      try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
      } catch (error) {
        console.warn("[Werewolf Offline] Clear failed:", error);
        return false;
      }
    },
    hasSave() {
      try {
        return Boolean(localStorage.getItem(STORAGE_KEY));
      } catch (error) {
        return false;
      }
    },
    // --- Custom Presets ---
    getCustomPresets() {
      try {
        const raw = localStorage.getItem(PRESET_STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) || [];
      } catch (error) {
        return [];
      }
    },
    saveCustomPreset(preset) {
      try {
        const presets = this.getCustomPresets();
        const existingIndex = presets.findIndex((p) => p.id === preset.id);
        if (existingIndex >= 0) {
          presets[existingIndex] = preset;
        } else {
          presets.push(preset);
        }
        localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));
        return true;
      } catch (error) {
        console.warn("[Werewolf Offline] Save preset failed:", error);
        return false;
      }
    },
    deleteCustomPreset(id) {
      try {
        const presets = this.getCustomPresets();
        const filtered = presets.filter((p) => p.id !== id);
        localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(filtered));
        return true;
      } catch (error) {
        console.warn("[Werewolf Offline] Delete preset failed:", error);
        return false;
      }
    }
  };

  // src/game-state.js
  function createDefaultPlayers(playerCount) {
    return Array.from({ length: playerCount }, (_, index) => ({
      id: `setup-${index + 1}`,
      order: index + 1,
      name: `Ng\u01B0\u1EDDi ch\u01A1i ${index + 1}`
    }));
  }
  function createValidation(playerCount, roleConfig) {
    const totalRoles = countRoles(roleConfig);
    return {
      totalRoles,
      expected: playerCount,
      isValid: totalRoles === playerCount,
      message: totalRoles === playerCount ? "T\u1ED5ng role h\u1EE3p l\u1EC7, s\u1EB5n s\xE0ng chia vai." : `T\u1ED5ng role hi\u1EC7n t\u1EA1i l\xE0 ${totalRoles}/${playerCount}.`
    };
  }
  function createSetupDraft(baseState, playerCount = 8, forcePreset = false, mode = "basic") {
    const safeCount = sanitizePlayerCount(playerCount);
    const previousPlayers = baseState?.setup?.players ?? [];
    const previousRoles = baseState?.setup?.roleConfig ?? {};
    const players = Array.from({ length: safeCount }, (_, index) => ({
      id: `setup-${index + 1}`,
      order: index + 1,
      name: previousPlayers[index]?.name?.trim() || `Ng\u01B0\u1EDDi ch\u01A1i ${index + 1}`
    }));
    const roleConfig = forcePreset || !baseState?.setup ? applyPreset(safeCount, mode) : normalizeRoleConfig({
      ...applyPreset(safeCount, mode),
      ...previousRoles
    });
    return {
      ...baseState,
      screen: "setup",
      setup: {
        playerCount: safeCount,
        players,
        roleConfig,
        validation: createValidation(safeCount, roleConfig)
      }
    };
  }
  function createBaseState() {
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
        validation: createValidation(playerCount, roleConfig)
      },
      reveal: {
        currentIndex: 0,
        stage: "handoff"
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
          foxLostPower: []
        },
        nightActions: {
          wolfTarget: null,
          seerTarget: null,
          guardTarget: null,
          witchHeal: false,
          witchPoisonTarget: null,
          foxTargets: []
        },
        nightResults: [],
        roleStates: {
          witch: { hasHealPotion: true, hasPoisonPotion: true },
          hunter: { hasShot: false, pendingShot: null }
        }
      },
      summary: {
        winnerTeam: null,
        winnerLabel: "",
        reason: "",
        finishedAt: null
      },
      previousSetup: null,
      stats: {
        nightsPlayed: 0,
        daysPlayed: 0,
        phaseTransitions: 0
      },
      storage: {
        hasSavedGame: StorageAdapter.hasSave(),
        lastSavedAt: null
      }
    };
  }
  function shuffleRoles(rolePool) {
    const cloned = [...rolePool];
    for (let index = cloned.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
    }
    return cloned;
  }
  function assignRoles(gameState2) {
    const rolePool = expandRolePool(gameState2.roleConfig);
    const shuffled = shuffleRoles(rolePool);
    return {
      ...gameState2,
      players: gameState2.players.map((player, index) => ({
        ...player,
        roleId: shuffled[index],
        alive: true
      }))
    };
  }
  function createGame({ baseState, playerCount, playerNames, roleConfig }) {
    const safeCount = sanitizePlayerCount(playerCount);
    const normalizedConfig = normalizeRoleConfig(roleConfig);
    const previousPlayers = baseState?.setup?.players || [];
    const players = Array.from({ length: safeCount }, (_, index) => {
      const prev = previousPlayers[index] || {};
      return {
        id: prev.id || `player-${Date.now()}-${index + 1}`,
        sessionId: prev.sessionId || null,
        order: index + 1,
        name: playerNames[index]?.trim() || `Ng\u01B0\u1EDDi ch\u01A1i ${index + 1}`,
        alive: true
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
        stage: "handoff"
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
          foxLostPower: []
        },
        nightActions: {
          wolfTarget: null,
          seerTarget: null,
          guardTarget: null,
          witchHeal: false,
          witchPoisonTarget: null,
          foxTargets: []
        },
        nightResults: [],
        roleStates: {
          witch: { hasHealPotion: true, hasPoisonPotion: true },
          hunter: { hasShot: false, pendingShot: null }
        }
      },
      summary: {
        winnerTeam: null,
        winnerLabel: "",
        reason: "",
        finishedAt: null
      },
      previousSetup: {
        playerCount: safeCount,
        playerNames: players.map((player) => player.name),
        roleConfig: normalizedConfig
      },
      stats: {
        nightsPlayed: 1,
        daysPlayed: 0,
        phaseTransitions: 0
      }
    };
    const withRoles = assignRoles(seededState);
    return addHistoryEntry(withRoles, "Kh\u1EDFi t\u1EA1o", "system", "V\xE1n m\u1EDBi \u0111\xE3 \u0111\u01B0\u1EE3c t\u1EA1o v\xE0 chia vai th\xE0nh c\xF4ng.");
  }
  function getCycleLabel(gameState2) {
    const isNight = ["night", "wolf", "seer", "guard", "witch"].includes(gameState2.phase.key);
    const number = isNight ? gameState2.stats.nightsPlayed : gameState2.stats.daysPlayed;
    return `${isNight ? "\u0110\xEAm" : "Ng\xE0y"} ${number || 1}`;
  }
  function addHistoryEntry(gameState2, action, type = "system", message = "", targetName = "") {
    return {
      ...gameState2,
      gm: {
        ...gameState2.gm,
        history: [
          {
            id: `history-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            type,
            cycleLabel: getCycleLabel(gameState2),
            phaseLabel: getCurrentPhase(gameState2.phase).label,
            action,
            targetName,
            message,
            timestamp: Date.now()
          },
          ...gameState2.gm.history
        ]
      }
    };
  }
  function nextPhase(gameState2) {
    if (gameState2.status === "finished") {
      return gameState2;
    }
    const transition = getNextPhaseTransition(gameState2.phase);
    const nextPhaseLabel = transition.phase.label;
    const nextPhaseKey = transition.phase.key;
    let nextState = {
      ...gameState2,
      phase: transition.phase,
      stats: {
        ...gameState2.stats,
        phaseTransitions: gameState2.stats.phaseTransitions + 1,
        nightsPlayed: gameState2.stats.nightsPlayed + (nextPhaseKey === "night" ? 1 : 0),
        daysPlayed: gameState2.stats.daysPlayed + (nextPhaseKey === "morning" ? 1 : 0)
      }
    };
    if (nextPhaseKey === "morning") {
      nextState = resolveNightActions(nextState);
    }
    nextState = addHistoryEntry(nextState, "Chuy\u1EC3n phase", "phase", `Sang phase "${nextPhaseLabel}".`);
    return checkWinCondition(nextState);
  }
  function resolveNightActions(gameState2) {
    let nextState = { ...gameState2 };
    const actions = nextState.gm.nightActions;
    let results = [];
    const { wolfTarget, witchHeal, guardTarget, witchPoisonTarget } = actions;
    if (wolfTarget) {
      if (witchHeal) {
        results.push("M\u1ED9t ng\u01B0\u1EDDi b\u1ECB c\u1EAFn nh\u01B0ng \u0111\xE3 \u0111\u01B0\u1EE3c Ph\xF9 th\u1EE7y c\u1EE9u.");
      } else if (guardTarget === wolfTarget) {
        results.push("M\u1ED9t ng\u01B0\u1EDDi b\u1ECB c\u1EAFn nh\u01B0ng \u0111\xE3 \u0111\u01B0\u1EE3c B\u1EA3o v\u1EC7 c\u1EE9u.");
      } else {
        const p = nextState.players.find((x) => x.id === wolfTarget);
        if (p && p.alive) {
          nextState = killPlayer(nextState, wolfTarget, "B\u1ECB s\xF3i c\u1EAFn ch\u1EBFt");
          results.push(`${p.name} \u0111\xE3 ch\u1EBFt trong \u0111\xEAm.`);
        }
      }
    } else {
      results.push("\u0110\xEAm qua S\xF3i kh\xF4ng c\u1EAFn ai.");
    }
    if (witchPoisonTarget) {
      const p = nextState.players.find((x) => x.id === witchPoisonTarget);
      if (p && p.alive) {
        nextState = killPlayer(nextState, witchPoisonTarget, "B\u1ECB Ph\xF9 th\u1EE7y \u0111\u1EA7u \u0111\u1ED9c");
        results.push(`${p.name} \u0111\xE3 ch\u1EBFt trong \u0111\xEAm (b\u1ECB \u0111\u1ED9c).`);
      }
    }
    nextState.gm = {
      ...nextState.gm,
      nightActions: {
        wolfTarget: null,
        seerTarget: null,
        guardTarget: null,
        witchHeal: false,
        witchPoisonTarget: null,
        foxTargets: []
      },
      nightResults: results.length === 1 && results[0].includes("kh\xF4ng c\u1EAFn ai") && !witchPoisonTarget ? ["\u0110\xEAm qua l\xE0 m\u1ED9t \u0111\xEAm b\xECnh y\xEAn, kh\xF4ng c\xF3 ai ch\u1EBFt."] : results
    };
    return nextState;
  }
  function killPlayer(gameState2, playerId, reason = "\u0110\xE1nh d\u1EA5u ch\u1EBFt") {
    if (gameState2.status === "finished") {
      return gameState2;
    }
    const player = gameState2.players.find((entry) => entry.id === playerId);
    if (!player || !player.alive) {
      return gameState2;
    }
    let nextState = {
      ...gameState2,
      players: gameState2.players.map(
        (entry) => entry.id === playerId ? { ...entry, alive: false } : entry
      )
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
    const links = nextState.gm.effects?.cupidLinks || [];
    if (links.includes(playerId)) {
      const partnerId = links.find((id) => id !== playerId);
      const partner = nextState.players.find((p) => p.id === partnerId);
      if (partner && partner.alive) {
        nextState = killPlayer(nextState, partnerId, "Ch\u1EBFt theo ng\u01B0\u1EDDi y\xEAu");
      }
    }
    return nextState;
  }
  function revivePlayer(gameState2, playerId) {
    if (gameState2.status === "finished") {
      return gameState2;
    }
    const player = gameState2.players.find((entry) => entry.id === playerId);
    if (!player || player.alive) {
      return gameState2;
    }
    const nextState = {
      ...gameState2,
      players: gameState2.players.map(
        (entry) => entry.id === playerId ? { ...entry, alive: true } : entry
      )
    };
    return addHistoryEntry(nextState, "H\u1ED3i sinh", "player", "", player.name);
  }
  function checkWinCondition(gameState2) {
    if (gameState2.status === "finished") {
      return gameState2;
    }
    const alivePlayers = gameState2.players.filter((player) => player.alive);
    const aliveWolves = alivePlayers.filter(
      (player) => getRoleDefinition(player.roleId).team === "wolf"
    ).length;
    const aliveVillage = alivePlayers.filter(
      (player) => getRoleDefinition(player.roleId).team === "village"
    ).length;
    if (aliveWolves === 0) {
      return {
        ...addHistoryEntry(gameState2, "K\u1EBFt th\xFAc", "win", "Phe d\xE2n chi\u1EBFn th\u1EAFng v\xEC kh\xF4ng c\xF2n Ma S\xF3i s\u1ED1ng."),
        screen: "summary",
        status: "finished",
        summary: {
          winnerTeam: "village",
          winnerLabel: "Phe d\xE2n th\u1EAFng",
          reason: "Kh\xF4ng c\xF2n Ma S\xF3i s\u1ED1ng.",
          finishedAt: Date.now()
        }
      };
    }
    if (aliveWolves >= aliveVillage) {
      return {
        ...addHistoryEntry(gameState2, "K\u1EBFt th\xFAc", "win", "Phe s\xF3i chi\u1EBFn th\u1EAFng v\xEC qu\xE2n s\u1ED1 \u0111\xE3 \xE1p \u0111\u1EA3o phe d\xE2n."),
        screen: "summary",
        status: "finished",
        summary: {
          winnerTeam: "wolf",
          winnerLabel: "Phe s\xF3i th\u1EAFng",
          reason: "S\u1ED1 S\xF3i c\xF2n s\u1ED1ng \u0111\xE3 l\u1EDBn h\u01A1n ho\u1EB7c b\u1EB1ng phe d\xE2n c\xF2n s\u1ED1ng.",
          finishedAt: Date.now()
        }
      };
    }
    return gameState2;
  }
  function saveGame(gameState2) {
    const nextState = {
      ...gameState2,
      updatedAt: Date.now(),
      storage: {
        hasSavedGame: true,
        lastSavedAt: Date.now()
      }
    };
    StorageAdapter.save(nextState);
    return nextState;
  }
  function loadGame() {
    const saved = StorageAdapter.load();
    if (!saved) {
      return null;
    }
    const base = createBaseState();
    const mergedGm = {
      ...base.gm,
      ...saved.gm || {},
      effects: {
        ...base.gm.effects,
        ...saved.gm?.effects || {}
      },
      nightActions: {
        ...base.gm.nightActions,
        ...saved.gm?.nightActions || {}
      },
      roleStates: {
        witch: {
          ...base.gm.roleStates.witch,
          ...saved.gm?.roleStates?.witch || {}
        },
        hunter: {
          ...base.gm.roleStates.hunter,
          ...saved.gm?.roleStates?.hunter || {}
        }
      }
    };
    return {
      ...base,
      ...saved,
      gm: mergedGm,
      storage: {
        hasSavedGame: true,
        lastSavedAt: saved.updatedAt ?? Date.now()
      }
    };
  }
  function loadSavedGame() {
    return loadGame();
  }
  function loadSavedGameIntoState() {
    return loadSavedGame() ?? createBaseState();
  }
  function updateSetupPlayerCount(gameState2, playerCount) {
    return createSetupDraft(gameState2, playerCount, true);
  }
  function updateSetupPlayerName(gameState2, playerIndex, name) {
    const players = gameState2.setup.players.map(
      (player, index) => index === playerIndex ? { ...player, name } : player
    );
    return {
      ...gameState2,
      setup: {
        ...gameState2.setup,
        players
      }
    };
  }
  function updateSetupRoleCount(gameState2, roleId, value) {
    if (!ROLE_ORDER.includes(roleId)) {
      return gameState2;
    }
    const safeValue = Math.max(0, Math.floor(Number(value) || 0));
    const roleConfig = {
      ...gameState2.setup.roleConfig,
      [roleId]: safeValue
    };
    return {
      ...gameState2,
      setup: {
        ...gameState2.setup,
        roleConfig,
        validation: createValidation(gameState2.setup.playerCount, roleConfig)
      }
    };
  }
  function applyCustomPreset(gameState2, presetId) {
    const customPresets = StorageAdapter.getCustomPresets();
    const preset = customPresets.find((p) => p.id === presetId);
    if (!preset) return gameState2;
    const roleConfig = normalizeRoleConfig(preset.roleConfig);
    return {
      ...gameState2,
      setup: {
        ...gameState2.setup,
        playerCount: preset.playerCount,
        roleConfig,
        validation: createValidation(preset.playerCount, roleConfig)
      }
    };
  }
  function updateRevealStage(gameState2, stage) {
    return {
      ...gameState2,
      reveal: {
        ...gameState2.reveal,
        stage
      }
    };
  }
  function updateNoteDraft(gameState2, noteDraft) {
    return {
      ...gameState2,
      gm: {
        ...gameState2.gm,
        noteDraft
      }
    };
  }
  function clearNoteDraft(gameState2) {
    return {
      ...gameState2,
      gm: {
        ...gameState2.gm,
        noteDraft: ""
      }
    };
  }
  function appendCurrentNoteToHistory(gameState2) {
    const note = gameState2.gm.noteDraft.trim();
    if (!note) {
      return gameState2;
    }
    const withNote = addHistoryEntry(gameState2, "Ghi ch\xFA", "note", note);
    return clearNoteDraft(withNote);
  }
  function toggleShowRoles(gameState2) {
    return {
      ...gameState2,
      gm: {
        ...gameState2.gm,
        showRoles: !gameState2.gm.showRoles
      }
    };
  }
  function updateGmFilter(gameState2, filter) {
    return {
      ...gameState2,
      gm: {
        ...gameState2.gm,
        filter
      }
    };
  }
  function addVote(gameState2, playerId, amount) {
    const currentVote = gameState2.gm.votes[playerId] || 0;
    const newVote = Math.max(0, currentVote + amount);
    return {
      ...gameState2,
      gm: {
        ...gameState2.gm,
        votes: {
          ...gameState2.gm.votes,
          [playerId]: newVote
        }
      }
    };
  }
  function resetVotes(gameState2) {
    return {
      ...gameState2,
      gm: {
        ...gameState2.gm,
        votes: {}
      }
    };
  }
  function executeVoteHanging(gameState2) {
    const votes = gameState2.gm.votes;
    const playerIds = Object.keys(votes);
    if (playerIds.length === 0) return gameState2;
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
      return addHistoryEntry(gameState2, "Treo c\u1ED5", "vote", "Kh\xF4ng c\xF3 ai b\u1ECB treo c\u1ED5 (h\xF2a phi\u1EBFu ho\u1EB7c kh\xF4ng c\xF3 phi\u1EBFu).");
    }
    let nextState = killPlayer(gameState2, targetId, "B\u1ECB treo c\u1ED5");
    const player = gameState2.players.find((p) => p.id === targetId);
    nextState = addHistoryEntry(nextState, "Treo c\u1ED5", "vote", `B\u1ECB treo c\u1ED5 v\u1EDBi ${maxVotes} phi\u1EBFu.`, player ? player.name : "");
    nextState = resetVotes(nextState);
    if (player && player.roleId === "jester") {
      return {
        ...addHistoryEntry(nextState, "K\u1EBFt th\xFAc", "win", "K\u1EBB ng\u1ED1c (Jester) chi\u1EBFn th\u1EAFng v\xEC b\u1ECB treo c\u1ED5."),
        screen: "summary",
        status: "finished",
        summary: {
          winnerTeam: "jester",
          winnerLabel: "K\u1EBB ng\u1ED1c th\u1EAFng",
          reason: "K\u1EBB ng\u1ED1c \u0111\xE3 l\u1EEBa \u0111\u01B0\u1EE3c l\xE0ng treo c\u1ED5 m\xECnh.",
          finishedAt: Date.now()
        }
      };
    }
    return checkWinCondition(nextState);
  }
  function finishGame(gameState2) {
    if (gameState2.status === "finished") {
      return gameState2;
    }
    const nextState = addHistoryEntry(
      gameState2,
      "K\u1EBFt th\xFAc th\u1EE7 c\xF4ng",
      "system",
      "Qu\u1EA3n tr\xF2 \u0111\xE3 ch\u1EE7 \u0111\u1ED9ng k\u1EBFt th\xFAc v\xE1n."
    );
    return {
      ...nextState,
      screen: "summary",
      status: "finished",
      summary: {
        winnerTeam: "manual",
        winnerLabel: "K\u1EBFt th\xFAc th\u1EE7 c\xF4ng",
        reason: "Qu\u1EA3n tr\xF2 \u0111\xE3 ch\u1EE7 \u0111\u1ED9ng k\u1EBFt th\xFAc v\xE1n.",
        finishedAt: Date.now()
      }
    };
  }
  function restartWithSameSetup(gameState2) {
    const setup = gameState2.previousSetup ?? {
      playerCount: gameState2.players.length || 8,
      playerNames: gameState2.players.map((player) => player.name),
      roleConfig: gameState2.roleConfig ?? applyPreset(gameState2.players.length || 8)
    };
    return createGame({
      baseState: createBaseState(),
      playerCount: setup.playerCount,
      playerNames: setup.playerNames,
      roleConfig: setup.roleConfig
    });
  }
  function goHome(gameState2) {
    return {
      ...gameState2,
      screen: "home",
      storage: {
        ...gameState2.storage,
        hasSavedGame: StorageAdapter.hasSave()
      }
    };
  }
  function goSetup(gameState2) {
    return {
      ...createSetupDraft(gameState2, gameState2.setup.playerCount, false),
      screen: "setup"
    };
  }
  function goHowTo(gameState2) {
    return {
      ...gameState2,
      screen: "howto"
    };
  }
  function createPlayerViewState(gameState2, playerId) {
    if (!gameState2 || !gameState2.players) return null;
    const player = gameState2.players.find((p) => p.id === playerId);
    if (!player) return null;
    const currentPhaseDef = getCurrentPhase(gameState2.phase);
    let publicAnnouncement = "";
    if (gameState2.gm?.history?.length > 0) {
      const lastHistory = gameState2.gm.history[gameState2.gm.history.length - 1];
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
      dayNightCounter: `\u0110\xEAm ${gameState2.phase.nightCount} / Ng\xE0y ${gameState2.phase.dayCount}`,
      announcement: publicAnnouncement,
      winState: gameState2.winState ? {
        winner: gameState2.winState.winner,
        reason: gameState2.winState.reason,
        revealedRoles: gameState2.players.map((p) => ({
          name: p.name,
          roleName: getRoleDefinition(p.roleId).name,
          icon: getRoleDefinition(p.roleId).icon
        }))
      } : null
    };
  }

  // src/ui/home-view.js
  function renderHome(gameState2) {
    return `
    <section class="screen home-screen">
      <div class="ambient-layer parallax-bg">
        <div class="moon"></div>
        <div class="fog-layer fog-1"></div>
        <div class="trees-bg"></div>
        <div class="fog-layer fog-2"></div>
        <div class="trees-fg">
          <svg class="wolf-silhouette" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet">
            <!-- Simple placeholder wolf howling -->
            <path d="M50 90 L40 60 L45 40 L60 30 L55 50 Z" fill="#0B0A1B"/>
            <path d="M45 40 L40 25 L50 20 L55 35 Z" fill="#0B0A1B"/>
          </svg>
        </div>
        <div class="fireflies">
          ${Array.from({ length: 12 }).map(() => `
            <div class="firefly" style="
              left: ${Math.random() * 100}%; 
              top: ${Math.random() * 80 + 20}%; 
              animation-delay: ${Math.random() * 5}s;
              animation-duration: ${4 + Math.random() * 3}s;
            "></div>
          `).join("")}
        </div>
      </div>

      <div class="parallax-fg">
        <div class="logo-container">
          <h1 class="logo-title">MA S\xD3I</h1>
        </div>
        <p class="tagline">"M\u1ED9t \u0111\xEAm. M\u1ED9t b\xED m\u1EADt. Kh\xF4ng ai \u0111\xE1ng tin."</p>

        <div class="button-grid wood-board">
          <button class="btn btn-wood btn-wood-primary" data-action="home-new">T\u1EA1o v\xE1n m\u1EDBi</button>
          ${StorageAdapter.hasSave() ? '<button class="btn btn-wood btn-wood-secondary" data-action="home-continue">Ti\u1EBFp t\u1EE5c v\xE1n c\u0169</button>' : ""}
          <div class="btn-row">
            <button class="btn btn-wood btn-wood-half" data-action="home-new-host">
              T\u1EA1o Local <span class="badge-beta">BETA</span>
            </button>
            <button class="btn btn-wood btn-wood-half" data-action="home-join-client">
              Tham gia Local
            </button>
          </div>
          <button class="btn btn-wood btn-wood-ghost" data-action="home-howto">H\u01B0\u1EDBng d\u1EABn</button>
        </div>

        <div class="info-panel wood-panel">
          <div class="info-item"><strong style="color: #F2C94C;">Offline:</strong> 1 Qu\u1EA3n tr\xF2 \u0111i\u1EC1u ph\u1ED1i to\xE0n b\u1ED9 v\xE1n ch\u01A1i.</div>
          <div class="info-item"><strong style="color: #fca5a5;">Local:</strong> M\u1ED7i ng\u01B0\u1EDDi s\u1EED d\u1EE5ng thi\u1EBFt b\u1ECB ri\xEAng qua Wi-Fi.</div>
          <div class="info-item"><strong style="color: #d8b4e2;">H\u1ED7 tr\u1EE3:</strong> 5\u201315 ng\u01B0\u1EDDi ch\u01A1i.</div>
        </div>
      </div>

      <button id="audio-toggle" class="btn-audio" title="B\u1EADt/T\u1EAFt \xE2m thanh" data-action="toggle-audio">\u{1F508}</button>
      <audio id="ambient-audio" loop preload="none">
         <source src="assets/ambient-night.mp3" type="audio/mpeg">
      </audio>
    </section>
  `;
  }
  function renderHowTo() {
    return `
    <section class="screen howto-screen">
      <div class="ambient-layer parallax-bg">
        <div class="moon"></div>
        <div class="fog-layer fog-1"></div>
        <div class="trees-bg"></div>
        <div class="fog-layer fog-2"></div>
        <div class="trees-fg">
          <svg class="wolf-silhouette" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet">
            <path d="M50 90 L40 60 L45 40 L60 30 L55 50 Z" fill="#0B0A1B"/>
            <path d="M45 40 L40 25 L50 20 L55 35 Z" fill="#0B0A1B"/>
          </svg>
        </div>
      </div>

      <div class="parallax-fg howto-fg">
        <article class="wood-panel howto-card">
          <div class="howto-header">
            <h2>C\xE1ch ch\u01A1i nhanh</h2>
            <p>D\xE0nh cho nh\xF3m 5\u201315 ng\u01B0\u1EDDi. M\u1ED9t ng\u01B0\u1EDDi l\xE0m Qu\u1EA3n tr\xF2 v\xE0 d\xF9ng thi\u1EBFt b\u1ECB n\xE0y \u0111\u1EC3 \u0111i\u1EC1u ph\u1ED1i v\xE1n ch\u01A1i.</p>
          </div>
          
          <div class="howto-steps">
            <div class="howto-step">
              <span class="step-num">1</span>
              <div class="step-content">
                <strong>T\u1EA1o v\xE1n</strong>
                <p>Ch\u1ECDn s\u1ED1 ng\u01B0\u1EDDi ch\u01A1i v\xE0 preset vai tr\xF2 ph\xF9 h\u1EE3p.</p>
              </div>
            </div>
            <div class="howto-step">
              <span class="step-num">2</span>
              <div class="step-content">
                <strong>Chia vai</strong>
                <p>L\u1EA7n l\u01B0\u1EE3t \u0111\u01B0a thi\u1EBFt b\u1ECB cho t\u1EEBng ng\u01B0\u1EDDi xem vai ri\xEAng c\u1EE7a m\xECnh.</p>
              </div>
            </div>
            <div class="howto-step">
              <span class="step-num">3</span>
              <div class="step-content">
                <strong>\u0110i\u1EC1u ph\u1ED1i \u0111\xEAm/ng\xE0y</strong>
                <p>Qu\u1EA3n tr\xF2 d\xF9ng m\xE0n h\xECnh GM \u0111\u1EC3 chuy\u1EC3n phase v\xE0 ghi nh\u1EADn h\xE0nh \u0111\u1ED9ng.</p>
              </div>
            </div>
            <div class="howto-step">
              <span class="step-num">4</span>
              <div class="step-content">
                <strong>K\u1EBFt th\xFAc v\xE1n</strong>
                <p>Game t\u1EF1 ki\u1EC3m tra \u0111i\u1EC1u ki\u1EC7n th\u1EAFng/thua khi s\u1ED1 ng\u01B0\u1EDDi s\u1ED1ng thay \u0111\u1ED5i.</p>
              </div>
            </div>
          </div>

          <div class="howto-tips">
            <strong>M\u1EB9o cho Qu\u1EA3n tr\xF2</strong>
            <ul>
              <li>\u0110\u1ECDc vai ch\u1EADm, r\xF5.</li>
              <li>Kh\xF4ng \u0111\u1EC3 ng\u01B0\u1EDDi ch\u01A1i kh\xE1c nh\xECn m\xE0n h\xECnh khi chia vai.</li>
              <li>Ghi ch\xFA c\xE1c h\xE0nh \u0111\u1ED9ng quan tr\u1ECDng trong \u0111\xEAm.</li>
            </ul>
          </div>

          <div class="button-grid wood-board howto-actions">
            <button class="btn btn-wood btn-wood-secondary" data-action="nav-home">Quay l\u1EA1i</button>
          </div>
        </article>
      </div>
    </section>
  `;
  }

  // src/ui/shared-components.js
  function escapeHtml(value = "") {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }
  function formatTime2(timestamp) {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(timestamp);
  }
  function renderNightActionButtons(player, gameState2, getRoleDefinition2) {
    if (!player.alive) return "";
    const phaseKey = gameState2.phase.key;
    const actions = gameState2.gm.nightActions;
    if (!actions) return "";
    if (phaseKey === "wolf") {
      const isTarget = actions.wolfTarget === player.id;
      return `<button class="btn ${isTarget ? "btn-danger" : "btn-secondary"}" data-action="gm-set-wolf-target" data-player-id="${player.id}">${isTarget ? "\u0110\xE3 ch\u1ECDn c\u1EAFn" : "C\u1EAFn"}</button>`;
    }
    if (phaseKey === "guard") {
      const isTarget = actions.guardTarget === player.id;
      return `<button class="btn ${isTarget ? "btn-success" : "btn-secondary"}" data-action="gm-set-guard-target" data-player-id="${player.id}">${isTarget ? "\u0110ang b\u1EA3o v\u1EC7" : "B\u1EA3o v\u1EC7"}</button>`;
    }
    if (phaseKey === "seer") {
      const isWolf = getRoleDefinition2(player.roleId).team === "wolf";
      return `<button class="btn btn-primary" onclick="alert('${escapeHtml(player.name)} l\xE0 ${isWolf ? "S\xD3I \u{1F43A}" : "D\xC2N \u{1F469}\u200D\u{1F33E}"}')">Soi</button>`;
    }
    if (phaseKey === "witch") {
      let buttons = [];
      const witchState = gameState2.gm.roleStates?.witch;
      if (!witchState) return "";
      if (actions.wolfTarget === player.id) {
        if (witchState.hasHealPotion) {
          const isHealed = actions.witchHeal;
          buttons.push(`<button class="btn ${isHealed ? "btn-success" : "btn-secondary"}" data-action="gm-witch-heal">${isHealed ? "\u0110\xE3 c\u1EE9u" : "C\u1EE9u"}</button>`);
        } else {
          buttons.push(`<span class="badge dead">H\u1EBFt thu\u1ED1c c\u1EE9u</span>`);
        }
      }
      if (witchState.hasPoisonPotion && actions.wolfTarget !== player.id) {
        const isTarget = actions.witchPoisonTarget === player.id;
        buttons.push(`<button class="btn ${isTarget ? "btn-danger" : "btn-secondary"}" data-action="gm-witch-poison" data-player-id="${player.id}">${isTarget ? "\u0110ang \u0111\u1EA7u \u0111\u1ED9c" : "\u0110\u1EA7u \u0111\u1ED9c"}</button>`);
      } else if (actions.witchPoisonTarget === player.id) {
        buttons.push(`<span class="badge dead">\u0110ang b\u1ECB \u0111\u1ED9c</span>`);
      }
      return buttons.join(" ");
    }
    return "";
  }
  function renderPlayerCard(player, gameState2, getRoleDefinition2, interactive = true, networkStatus = void 0) {
    const role = getRoleDefinition2(player.roleId);
    const isFinished = gameState2.status === "finished";
    const showRole = isFinished || gameState2.gm.showRoles && shouldShowByFilter(player, role, gameState2.gm.filter);
    const isCupidLinked = gameState2.gm.effects?.cupidLinks?.includes(player.id);
    const isFoxLost = gameState2.gm.effects?.foxLostPower?.includes(player.id);
    let networkBadge = "";
    if (networkStatus !== void 0) {
      if (networkStatus) {
        networkBadge = '<span class="badge" style="background: rgba(34, 197, 94, 0.2); color: #bef7cb;">\u{1F7E2} Online</span>';
      } else {
        networkBadge = '<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #fca5a5;">\u{1F534} Offline</span>';
      }
    }
    return `
    <article class="player-card ${player.alive ? "" : "dead"}">
      <div class="player-top">
        <div class="player-meta">
          <strong>${escapeHtml(player.name)}</strong>
          <span class="player-order">V\u1ECB tr\xED ${player.order}</span>
        </div>
        <div>
          ${networkBadge}
          ${isCupidLinked ? '<span class="badge" style="background: rgba(255, 0, 100, 0.2); color: #ff80b3;">\u2764\uFE0F Gh\xE9p \u0111\xF4i</span>' : ""}
          ${isFoxLost ? '<span class="badge" style="background: rgba(100, 100, 100, 0.4); color: #aaa;">\u274C M\u1EA5t n\u0103ng l\u1EF1c</span>' : ""}
          <span class="badge ${player.alive ? "alive" : "dead"}">${player.alive ? "S\u1ED1ng" : "Ch\u1EBFt"}</span>
        </div>
      </div>
      <div class="player-bottom">
        <span class="player-role">${showRole ? `<span style="font-weight: bold; color: #ddd1ff;">${role.icon} ${role.name}</span>` : "\u{1F512} \u0110ang \u1EA9n vai tr\xF2"}</span>
        ${interactive ? `
              <div class="player-actions">
                ${renderNightActionButtons(player, gameState2, getRoleDefinition2)}
                ${player.alive ? `<button class="btn btn-danger" data-action="gm-toggle-life" data-player-id="${player.id}">\u0110\xE1nh d\u1EA5u ch\u1EBFt</button>` : `<button class="btn btn-success" data-action="gm-toggle-life" data-player-id="${player.id}">S\u1ED1ng l\u1EA1i</button>`}
              </div>
            ` : ""}
      </div>
    </article>
  `;
  }
  function shouldShowByFilter(player, role, filter) {
    if (filter === "alive") return player.alive;
    if (filter === "dead") return !player.alive;
    if (filter === "wolf") return role.team === "wolf";
    if (filter === "village") return role.team === "village";
    return true;
  }

  // src/ui/setup-view.js
  function renderSetup(gameState2, roleOrder, getRoleDefinition2) {
    const { setup } = gameState2;
    const totalRoles = countRoles(setup.roleConfig);
    const customPresets = StorageAdapter.getCustomPresets();
    return `
    <section class="screen setup-screen table-setup">
      <div class="table-container">
        
        <div class="table-header">
          <h2>Thi\u1EBFt l\u1EADp v\xE1n</h2>
        </div>

        <div class="table-content wood-panel">
          
          <div class="table-section hero-section">
            <span class="hero-label">S\u1ED1 ng\u01B0\u1EDDi ch\u01A1i</span>
            <div class="hero-stepper">
              <button type="button" class="hero-btn" data-action="setup-decrease" aria-label="Gi\u1EA3m s\u1ED1 ng\u01B0\u1EDDi ch\u01A1i">\u2212</button>
              <input id="playerCount" class="hero-input" data-player-count type="number" min="5" max="15" value="${setup.playerCount}" readonly />
              <button type="button" class="hero-btn" data-action="setup-increase" aria-label="T\u0103ng s\u1ED1 ng\u01B0\u1EDDi ch\u01A1i">+</button>
            </div>
          </div>

          <div class="table-section">
            <div class="tab-list">
              <button type="button" class="tab-btn" data-action="setup-apply-preset" data-preset-mode="basic">C\u01A1 b\u1EA3n</button>
              <button type="button" class="tab-btn" data-action="setup-apply-preset" data-preset-mode="balanced">C\xE2n b\u1EB1ng</button>
              <button type="button" class="tab-btn" data-action="setup-apply-preset" data-preset-mode="chaos">H\u1ED7n lo\u1EA1n</button>
            </div>
            <div class="tab-desc">Khuy\xEAn d\xF9ng cho nh\xF3m ${setup.playerCount} ng\u01B0\u1EDDi. Nh\u1EA5n \u0111\u1EC3 t\u1EF1 \u0111\u1ED9ng chia vai tr\xF2.</div>
          </div>

          <div class="table-section">
            <div class="table-role-chips">
              ${roleOrder.filter((roleId) => setup.roleConfig[roleId] > 0).map((roleId) => {
      const role = getRoleDefinition2(roleId);
      const shortName = role.name.replace("D\xE2n l\xE0ng", "D\xE2n").replace("Ma s\xF3i", "S\xF3i");
      return `<span class="tbl-chip">${shortName} <strong>${setup.roleConfig[roleId]}</strong></span>`;
    }).join("")}
            </div>
          </div>

          <div class="table-section">
            <div class="player-grid">
              ${(setup.players || []).map(
      (player, index) => `
                    <label class="tbl-player-row">
                      <span class="tbl-player-num">${player.order}</span>
                      <input data-player-name="${index}" value="${escapeHtml(player.name)}" maxlength="32" placeholder="Ng\u01B0\u1EDDi ch\u01A1i ${player.order}" />
                    </label>
                  `
    ).join("")}
            </div>
          </div>

          <details class="func-accordion table-accordion">
            <summary>T\xF9y ch\u1ECDn n\xE2ng cao</summary>
            <div class="accordion-content p-0">
              <div class="adv-section">
                <h4 class="adv-title">T\xF9y ch\u1EC9nh vai tr\xF2</h4>
                <div class="role-tweak-list tbl-tweak-list">
                  ${roleOrder.map((roleId) => {
      const role = getRoleDefinition2(roleId);
      const count = setup.roleConfig[roleId];
      const dimmed = count === 0 ? "dimmed" : "";
      return `
                        <div class="tweak-row ${dimmed}">
                          <span class="tweak-name">${role.name}</span>
                          <input class="tweak-input" data-role-count="${roleId}" type="number" min="0" max="15" value="${count}" />
                        </div>
                      `;
    }).join("")}
                </div>
              </div>

              <div class="adv-section mt-2">
                <h4 class="adv-title">Preset c\u1EE7a t\xF4i</h4>
                ${customPresets.length > 0 ? `
                  <div class="custom-preset-list">
                    ${customPresets.map((preset) => `
                      <div class="custom-preset-item tbl-preset-item">
                        <span>${preset.playerCount} ng\u01B0\u1EDDi</span>
                        <div class="custom-preset-actions">
                          <button class="btn-sm func-btn-secondary" data-action="setup-load-preset" data-preset-id="${preset.id}">T\u1EA3i</button>
                          <button class="btn-sm func-btn-danger" data-action="setup-delete-preset" data-preset-id="${preset.id}">X\xF3a</button>
                        </div>
                      </div>
                    `).join("")}
                  </div>
                ` : `<div class="muted-text px-3 pb-2">Ch\u01B0a c\xF3 preset t\xF9y ch\u1EC9nh.</div>`}
                <div class="px-3 pb-3">
                  <button class="func-btn-ghost btn-sm w-100" data-action="setup-save-preset">L\u01B0u preset hi\u1EC7n t\u1EA1i</button>
                </div>
              </div>
            </div>
          </details>

        </div>

          <div class="table-validation-area">
            <div class="tbl-val-info">
              <div class="tbl-status-icon ${(setup.validation || { isValid: false }).isValid ? "ok" : "err"}">
                ${(setup.validation || { isValid: false }).isValid ? "\u2713" : "!"}
              </div>
              <div class="tbl-val-text">
                <strong class="${(setup.validation || { isValid: false }).isValid ? "text-ok" : "text-err"}">
                  ${(setup.validation || { isValid: false }).isValid ? "S\u1EB5n s\xE0ng chia vai" : "T\u1ED5ng vai tr\xF2 ph\u1EA3i b\u1EB1ng s\u1ED1 ng\u01B0\u1EDDi ch\u01A1i"}
                </strong>
                <span>${setup.playerCount} ng\u01B0\u1EDDi \u2022 ${totalRoles} vai</span>
              </div>
            </div>
            <div class="tbl-val-actions">
              <button class="btn tbl-btn-back" data-action="nav-home">Quay l\u1EA1i</button>
              <button class="btn tbl-btn-primary" data-action="setup-assign" ${!(setup.validation || { isValid: false }).isValid ? "disabled" : ""}>
                Chia vai
              </button>
            </div>
          </div>

      </div>
    </section>
  `;
  }

  // src/ui/reveal-view.js
  function renderReveal(gameState2, getRoleDefinition2) {
    const player = gameState2.players[gameState2.reveal.currentIndex];
    const role = getRoleDefinition2(player.roleId);
    const isReady = gameState2.reveal.stage !== "handoff";
    const isRevealed = gameState2.reveal.stage === "revealed";
    return `
    <section class="screen">
      <div class="reveal-wrap">
        <article class="panel handoff-card">
          <div class="eyebrow">\u{1F464} Reveal ${gameState2.reveal.currentIndex + 1}/${gameState2.players.length}</div>
          <h2>\u0110\u01B0a m\xE1y cho ${escapeHtml(player.name)}</h2>
          <p>Ch\u1EC9 ng\u01B0\u1EDDi n\xE0y nh\xECn m\xE0n h\xECnh. Xong r\u1ED3i h\xE3y che l\u1EA1i tr\u01B0\u1EDBc khi chuy\u1EC3n m\xE1y ti\u1EBFp.</p>
          <div class="highlight" style="margin-top: 14px; font-size: 0.9rem;">
            \u26A0\uFE0F <strong>C\u1EA3nh b\xE1o:</strong> Ch\u1EC9 ng\u01B0\u1EDDi \u0111ang c\u1EA7m m\xE1y \u0111\u01B0\u1EE3c xem vai n\xE0y.
          </div>
          ${!isReady ? '<div class="footer-actions"><button class="btn btn-primary" data-action="reveal-ready">T\xF4i \u0111\xE3 s\u1EB5n s\xE0ng</button></div>' : ""}
        </article>

        <article class="role-card ${isRevealed ? "" : "hidden"}">
          ${!isReady ? '<div class="role-content"><div class="role-icon">\u{1F319}</div><h3>Ch\u1EDD x\xE1c nh\u1EADn</h3><p class="muted">Qu\u1EA3n tr\xF2 h\xE3y \u0111\u01B0a m\xE1y cho \u0111\xFAng ng\u01B0\u1EDDi ch\u01A1i tr\u01B0\u1EDBc.</p></div>' : isRevealed ? `
                  <div class="role-content">
                    <div class="role-icon">${role.icon}</div>
                    <div class="role-team">${role.teamLabel}</div>
                    <h3 class="role-name">${role.name}</h3>
                    <p>${role.summary}</p>
                  </div>
                ` : `
                  <button type="button" data-action="reveal-show" aria-label="Xem vai">
                    <div class="role-content">
                      <div class="role-icon">\u{1F0A0}</div>
                      <h3>Ch\u1EA1m \u0111\u1EC3 xem vai</h3>
                      <p class="muted">Vai tr\xF2 s\u1EBD ch\u1EC9 hi\u1EC7n tr\xEAn m\xE0n h\xECnh n\xE0y cho ${escapeHtml(player.name)}.</p>
                    </div>
                  </button>
                `}
        </article>

        ${isRevealed ? `
              <div class="footer-actions">
                <button class="btn btn-primary" style="font-size: 1.1rem; min-height: 60px;" data-action="reveal-next">
                  \u0110\xE3 xem xong, chuy\u1EC3n m\xE1y \u27A1\uFE0F
                </button>
              </div>
            ` : ""}
      </div>
    </section>
  `;
  }

  // src/ui/gm-view.js
  function renderFilterPills(currentFilter) {
    const filters = [
      { id: "all", label: "T\u1EA5t c\u1EA3" },
      { id: "alive", label: "C\xF2n s\u1ED1ng" },
      { id: "dead", label: "\u0110\xE3 ch\u1EBFt" },
      { id: "village", label: "Phe d\xE2n" },
      { id: "wolf", label: "Phe s\xF3i" }
    ];
    return `
    <div class="filter-track">
      ${filters.map((f) => `
        <button class="filter-pill ${currentFilter === f.id ? "active" : ""}" data-action="gm-filter-change" data-filter="${f.id}">
          ${f.label}
        </button>
      `).join("")}
    </div>
  `;
  }
  function renderVotingSection(gameState2) {
    if (gameState2.phase.key !== "voting") return "";
    const alivePlayers = gameState2.players.filter((p) => p.alive);
    let maxVotes = 0;
    Object.values(gameState2.gm.votes).forEach((v) => {
      if (v > maxVotes) maxVotes = v;
    });
    return `
    <article class="panel voting-panel" style="grid-column: 1 / -1; border-color: rgba(245, 158, 11, 0.4);">
      <div class="panel-header">
        <div>
          <h2 style="color: var(--warning);">Khu v\u1EF1c B\u1ECF phi\u1EBFu (Treo c\u1ED5)</h2>
          <p>Qu\u1EA3n tr\xF2 c\u1ED9ng/tr\u1EEB phi\u1EBFu cho t\u1EEBng ng\u01B0\u1EDDi. Ng\u01B0\u1EDDi b\u1ECB treo c\u1ED5 s\u1EBD ch\u1EBFt ngay l\u1EADp t\u1EE9c.</p>
        </div>
      </div>
      <div class="voting-list">
        ${alivePlayers.map((p) => {
      const votes = gameState2.gm.votes[p.id] || 0;
      const isMax = votes > 0 && votes === maxVotes;
      return `
            <div class="vote-row ${isMax ? "highlight" : ""}">
              <span class="vote-name">${escapeHtml(p.name)}</span>
              <div class="stepper-row vote-stepper">
                <button type="button" data-action="gm-vote-sub" data-player-id="${p.id}">\u2212</button>
                <div class="vote-count">${votes}</div>
                <button type="button" data-action="gm-vote-add" data-player-id="${p.id}">+</button>
              </div>
            </div>
          `;
    }).join("")}
      </div>
      <div class="footer-actions three-col" style="margin-top: 16px;">
        <button class="btn btn-secondary" data-action="gm-vote-reset">Reset phi\u1EBFu</button>
        <button class="btn btn-danger" style="grid-column: span 2;" data-action="gm-vote-execute">Treo c\u1ED5 ng\u01B0\u1EDDi nhi\u1EC1u phi\u1EBFu nh\u1EA5t</button>
      </div>
    </article>
  `;
  }
  function renderRoleEffectsSection(gameState2) {
    const hasCupid = gameState2.players.some((p) => p.roleId === "cupid");
    const hasFox = gameState2.players.some((p) => p.roleId === "fox");
    if (!hasCupid && !hasFox) return "";
    const cupidLinks = gameState2.gm.effects?.cupidLinks || [];
    const foxLostPower = gameState2.gm.effects?.foxLostPower || [];
    return `
    <article class="panel" style="grid-column: 1 / -1; border-color: rgba(255, 128, 179, 0.4);">
      <div class="panel-header">
        <div>
          <h2 style="color: var(--primary);">Hi\u1EC7u \u1EE9ng Role \u0111\u1EB7c bi\u1EC7t</h2>
          <p>Qu\u1EA3n l\xFD c\xE1c tr\u1EA1ng th\xE1i \u0111\u1EB7c bi\u1EC7t c\u1EE7a Cupid, C\xE1o...</p>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px;">
        ${hasCupid ? `
          <div class="effect-row" style="background: var(--surface-hover); padding: 12px; border-radius: 8px;">
            <strong>\u{1F47C} Cupid (Gh\xE9p \u0111\xF4i)</strong>
            ${cupidLinks.length === 2 ? `
              <p style="margin-top: 4px; color: #ff80b3;">\u0110\xE3 gh\xE9p \u0111\xF4i 2 ng\u01B0\u1EDDi. M\u1ED9t ng\u01B0\u1EDDi ch\u1EBFt, ng\u01B0\u1EDDi kia s\u1EBD t\u1EF1 \u0111\u1ED9ng ch\u1EBFt theo.</p>
              <div style="margin-top: 8px;">
                <button class="btn btn-secondary" data-action="gm-set-cupid-link" data-p1-id="" data-p2-id="">H\u1EE7y gh\xE9p \u0111\xF4i</button>
              </div>
            ` : `
              <p style="margin-top: 4px;" class="muted">Ch\u01B0a gh\xE9p \u0111\xF4i. (Qu\u1EA3n tr\xF2 c\xF3 th\u1EC3 t\u1EF1 nh\u1EDB ho\u1EB7c s\u1EED d\u1EE5ng t\xEDnh n\u0103ng n\xE0y n\u1EBFu c\u1EA7n)</p>
              <div style="margin-top: 8px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <select id="cupid-p1" class="field" style="max-width: 150px; padding: 4px;">
                  <option value="">-- Ch\u1ECDn --</option>
                  ${gameState2.players.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("")}
                </select>
                <span>\u2764\uFE0F</span>
                <select id="cupid-p2" class="field" style="max-width: 150px; padding: 4px;">
                  <option value="">-- Ch\u1ECDn --</option>
                  ${gameState2.players.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("")}
                </select>
                <button class="btn btn-primary" data-action="gm-set-cupid-link" onclick="
                  const p1 = document.getElementById('cupid-p1').value;
                  const p2 = document.getElementById('cupid-p2').value;
                  if(p1 === p2 || !p1 || !p2) {
                    alert('Vui l\xF2ng ch\u1ECDn 2 ng\u01B0\u1EDDi kh\xE1c nhau.');
                    event.stopPropagation();
                    return false;
                  }
                  this.dataset.p1Id = p1;
                  this.dataset.p2Id = p2;
                ">Gh\xE9p \u0111\xF4i</button>
              </div>
            `}
          </div>
        ` : ""}
        
        ${hasFox ? `
          <div class="effect-row" style="background: var(--surface-hover); padding: 12px; border-radius: 8px;">
            <strong>\u{1F98A} C\xE1o (M\u1EA5t n\u0103ng l\u1EF1c)</strong>
            <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">
              ${gameState2.players.filter((p) => p.roleId === "fox").map((fox) => {
      const isLost = foxLostPower.includes(fox.id);
      return `
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${escapeHtml(fox.name)} ${isLost ? "\u274C \u0110\xE3 m\u1EA5t n\u0103ng l\u1EF1c" : "\u2705 C\xF2n n\u0103ng l\u1EF1c"}</span>
                    <button class="btn ${isLost ? "btn-secondary" : "btn-danger"}" data-action="gm-toggle-fox-power" data-player-id="${fox.id}">
                      ${isLost ? "Ph\u1EE5c h\u1ED3i" : "T\u01B0\u1EDBc n\u0103ng l\u1EF1c"}
                    </button>
                  </div>
                `;
    }).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    </article>
  `;
  }
  function renderHunterPendingShot(gameState2) {
    const pendingShotId = gameState2.gm.roleStates?.hunter?.pendingShot;
    if (!pendingShotId) return "";
    const hunter = gameState2.players.find((p) => p.id === pendingShotId);
    return `
    <article class="panel pulse-danger" style="grid-column: 1 / -1; border-color: red; background: rgba(255, 0, 0, 0.1);">
      <div class="panel-header">
        <div>
          <h2 style="color: #ff6b6b;">\u{1F6A8} Th\u1EE3 s\u0103n tr\u1EA3 \u0111\u0169a</h2>
          <p style="color: #fca5a5;">Th\u1EE3 s\u0103n (${escapeHtml(hunter?.name || "")}) \u0111\xE3 ch\u1EBFt v\xE0 c\xF3 th\u1EC3 b\u1EAFn 1 ng\u01B0\u1EDDi. Y\xEAu c\u1EA7u ch\u1ECDn ng\u01B0\u1EDDi b\u1ECB b\u1EAFn ngay!</p>
        </div>
      </div>
      <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
        ${gameState2.players.filter((p) => p.alive).map((p) => `
          <button class="btn btn-danger" data-action="gm-hunter-shoot" data-player-id="${p.id}">B\u1EAFn ${escapeHtml(p.name)}</button>
        `).join("")}
        <button class="btn btn-secondary" data-action="gm-hunter-shoot" data-player-id="skip">Kh\xF4ng b\u1EAFn ai</button>
      </div>
    </article>
  `;
  }
  function renderNightResults(gameState2) {
    const results = gameState2.gm.nightResults;
    if (!results || results.length === 0 || gameState2.phase.key !== "morning") return "";
    return `
    <article class="panel" style="grid-column: 1 / -1; border-color: var(--accent); background: rgba(139, 92, 246, 0.08);">
      <div class="panel-header">
        <div>
          <h2 style="color: #ddd1ff;">\u{1F305} T\xF3m t\u1EAFt \u0111\xEAm qua</h2>
          <p style="color: #b6a9d6;">Th\xF4ng b\xE1o cho L\xE0ng k\u1EBFt qu\u1EA3 sau khi \u0110\xEAm k\u1EBFt th\xFAc.</p>
        </div>
      </div>
      <ul style="margin-top: 12px; padding-left: 20px; font-size: 1.1rem; line-height: 1.6;">
        ${results.map((r) => `<li style="margin-bottom: 8px;">${escapeHtml(r)}</li>`).join("")}
      </ul>
    </article>
  `;
  }
  function renderGm(gameState2, phases, currentPhase, getRoleDefinition2, networkAdapter2 = null) {
    const visiblePlayers = gameState2.players.filter((player) => {
      const role = getRoleDefinition2(player.roleId);
      return shouldShowByFilter(player, role, gameState2.gm.filter);
    });
    return `
    <section class="screen two-col">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>B\u1EA3ng \u0111i\u1EC1u khi\u1EC3n qu\u1EA3n tr\xF2</h2>
            <p>\u0110i\u1EC1u ph\u1ED1i phase, ghi ch\xFA v\xE0 theo d\xF5i to\xE0n b\u1ED9 v\xE1n ch\u01A1i.</p>
          </div>
          <span class="tag">Chu k\u1EF3 ${gameState2.phase.cycle}</span>
        </div>

        <div class="summary-card" style="background: rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.4);">
          <p style="color: #ddd1ff; font-weight: bold; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em;">Phase hi\u1EC7n t\u1EA1i</p>
          <h3 style="font-size: 1.8rem; margin: 4px 0;">${currentPhase.label}</h3>
          <p style="color: #ddd1ff; opacity: 0.9;">${currentPhase.description}</p>
        </div>

        <div class="phase-track" style="margin-top: 14px;">
          ${phases.map(
      (phase, index) => `
                <span class="phase-pill ${index === gameState2.phase.index ? "active" : ""}">
                  ${phase.shortLabel}
                </span>
              `
    ).join("")}
        </div>

        <div class="footer-actions">
          <button class="btn btn-primary" data-action="gm-next-phase" ${gameState2.gm.roleStates?.hunter?.pendingShot ? 'disabled title="Ph\u1EA3i ch\u1ECDn ng\u01B0\u1EDDi b\u1ECB Th\u1EE3 s\u0103n b\u1EAFn"' : ""}>Phase ti\u1EBFp theo</button>
          <button class="btn btn-secondary" data-action="gm-toggle-roles">
            ${gameState2.gm.showRoles ? "\u1EA8n vai" : "Hi\u1EC7n vai"}
          </button>
          ${networkAdapter2 && networkAdapter2.isHost() ? `
          <button class="btn btn-secondary" data-action="GM_FORCE_BROADCAST" title="G\u1EEDi l\u1EA1i d\u1EEF li\u1EC7u cho ng\u01B0\u1EDDi ch\u01A1i">
            G\u1EEDi l\u1EA1i (Sync)
          </button>
          ` : ""}
          <button class="btn btn-danger" data-action="gm-end-game">K\u1EBFt th\xFAc v\xE1n</button>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Tr\u1EA1ng th\xE1i v\xE1n</h2>
            <p>T\u1EF1 ki\u1EC3m tra th\u1EAFng thua khi s\u1ED1 ng\u01B0\u1EDDi s\u1ED1ng thay \u0111\u1ED5i.</p>
          </div>
        </div>
        <div class="stats-grid">
          <div class="summary-card">
            <p class="muted">\u0110\xEAm \u0111\xE3 ch\u01A1i</p>
            <h3>${gameState2.stats.nightsPlayed}</h3>
          </div>
          <div class="summary-card">
            <p class="muted">Ng\xE0y \u0111\xE3 ch\u01A1i</p>
            <h3>${gameState2.stats.daysPlayed}</h3>
          </div>
        </div>
        <div class="divider"></div>
        <div class="status-row">
          <span class="badge alive">S\u1ED1ng: ${gameState2.players.filter((player) => player.alive).length}</span>
          <span class="badge dead">Ch\u1EBFt: ${gameState2.players.filter((player) => !player.alive).length}</span>
        </div>
      </article>

      ${renderVotingSection(gameState2)}
      
      ${renderRoleEffectsSection(gameState2)}
      
      ${renderHunterPendingShot(gameState2)}
      
      ${renderNightResults(gameState2)}

      <article class="panel" style="grid-column: 1 / -1;">
        <div class="panel-header">
          <div>
            <h2>Ng\u01B0\u1EDDi ch\u01A1i</h2>
            <p>Qu\u1EA3n tr\xF2 c\xF3 th\u1EC3 b\u1EADt role th\u1EADt ho\u1EB7c ch\u1EC9 nh\xECn tr\u1EA1ng th\xE1i s\u1ED1ng/ch\u1EBFt.</p>
          </div>
          ${renderFilterPills(gameState2.gm.filter)}
        </div>
        <div class="player-list">
          ${visiblePlayers.map((player) => {
      const networkStatus = networkAdapter2 && networkAdapter2.isHost() && !player.id.startsWith("p-") ? networkAdapter2.getConnectionStatus(player.id) : void 0;
      return renderPlayerCard(player, gameState2, getRoleDefinition2, true, networkStatus);
    }).join("")}
          ${visiblePlayers.length === 0 ? '<div class="empty-state">Kh\xF4ng c\xF3 ng\u01B0\u1EDDi ch\u01A1i n\xE0o kh\u1EDBp v\u1EDBi b\u1ED9 l\u1ECDc.</div>' : ""}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Ghi ch\xFA s\u1EF1 ki\u1EC7n</h2>
            <p>Draft n\xE0y t\u1EF1 l\u01B0u. Khi c\u1EA7n, b\u1EA5m th\xEAm v\xE0o l\u1ECBch s\u1EED \u0111\u1EC3 ch\u1ED1t ghi ch\xFA.</p>
          </div>
        </div>
        <label class="field">
          <span>N\u1ED9i dung ghi ch\xFA</span>
          <textarea data-note-draft placeholder="V\xED d\u1EE5: S\xF3i ch\u1ECDn Ng\u01B0\u1EDDi ch\u01A1i 4, B\u1EA3o v\u1EC7 gi\u1EEF Ng\u01B0\u1EDDi ch\u01A1i 4...">${escapeHtml(gameState2.gm.noteDraft)}</textarea>
        </label>
        <div class="footer-actions two-col">
          <button class="btn btn-secondary" data-action="gm-add-note">L\u01B0u l\u1ECBch s\u1EED</button>
          <button class="btn btn-ghost" data-action="gm-clear-note">X\xF3a nh\xE1p</button>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>L\u1ECBch s\u1EED v\xE1n ch\u01A1i</h2>
            <p>Ghi l\u1EA1i phase, thay \u0111\u1ED5i s\u1ED1ng/ch\u1EBFt v\xE0 ghi ch\xFA c\u1EE7a qu\u1EA3n tr\xF2.</p>
          </div>
        </div>
        ${gameState2.gm.history.length ? `
              <div class="history-list">
                <div class="history-timeline">
                  ${gameState2.gm.history.slice(0, 20).map(
      (item) => `
                        <article class="history-card-timeline">
                          <div class="history-top">
                            <strong>${escapeHtml(item.cycleLabel)} - ${escapeHtml(item.phaseLabel || "V\xE1n ch\u01A1i")}</strong>
                            <span class="history-time">${formatTime2(item.timestamp)}</span>
                          </div>
                          <div class="history-content" style="margin-top: 8px;">
                            <span class="badge" style="margin-right: 8px;">${escapeHtml(item.action)}</span>
                            ${item.targetName ? `<strong>${escapeHtml(item.targetName)}</strong> ` : ""}
                            <span class="muted">${escapeHtml(item.message)}</span>
                          </div>
                        </article>
                      `
    ).join("")}
                  
                  ${gameState2.gm.history.length > 20 ? `
                    <details style="margin-top: 10px;">
                      <summary style="cursor: pointer; color: var(--muted); padding: 8px 0; font-weight: bold;">Xem th\xEAm l\u1ECBch s\u1EED c\u0169 (${gameState2.gm.history.length - 20} s\u1EF1 ki\u1EC7n)</summary>
                      <div style="display: flex; flex-direction: column; gap: 0; margin-top: 12px;">
                        ${gameState2.gm.history.slice(20).map(
      (item) => `
                              <article class="history-card-timeline" style="opacity: 0.8;">
                                <div class="history-top">
                                  <strong>${escapeHtml(item.cycleLabel)} - ${escapeHtml(item.phaseLabel || "V\xE1n ch\u01A1i")}</strong>
                                  <span class="history-time">${formatTime2(item.timestamp)}</span>
                                </div>
                                <div class="history-content" style="margin-top: 8px;">
                                  <span class="badge" style="margin-right: 8px;">${escapeHtml(item.action)}</span>
                                  ${item.targetName ? `<strong>${escapeHtml(item.targetName)}</strong> ` : ""}
                                  <span class="muted">${escapeHtml(item.message)}</span>
                                </div>
                              </article>
                            `
    ).join("")}
                      </div>
                    </details>
                  ` : ""}
                </div>
              </div>
            ` : '<div class="empty-state">Ch\u01B0a c\xF3 l\u1ECBch s\u1EED n\xE0o. H\xE3y d\xF9ng phase v\xE0 ghi ch\xFA \u0111\u1EC3 theo d\xF5i v\xE1n.</div>'}
      </article>
    </section>
  `;
  }

  // src/ui/summary-view.js
  function renderSummary(gameState2, getRoleDefinition2) {
    return `
    <section class="screen two-col">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>K\u1EBFt th\xFAc v\xE1n</h2>
            <p>${escapeHtml(gameState2.summary.reason)}</p>
          </div>
          <span class="tag">${escapeHtml(gameState2.summary.winnerLabel || "Ch\u01B0a x\xE1c \u0111\u1ECBnh")}</span>
        </div>
        <div class="summary-grid">
          <div class="summary-card">
            <p class="muted">\u0110\xEAm \u0111\xE3 ch\u01A1i</p>
            <h3>${gameState2.stats.nightsPlayed}</h3>
          </div>
          <div class="summary-card">
            <p class="muted">Ng\xE0y \u0111\xE3 ch\u01A1i</p>
            <h3>${gameState2.stats.daysPlayed}</h3>
          </div>
        </div>
        <div class="footer-actions">
          <button class="btn btn-primary" data-action="summary-replay">Ch\u01A1i l\u1EA1i v\u1EDBi setup c\u0169</button>
          <button class="btn btn-ghost" data-action="nav-home">V\u1EC1 trang ch\u1EE7</button>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>L\u1ECBch s\u1EED v\xE1n ch\u01A1i</h2>
            <p>Nh\xECn l\u1EA1i to\xE0n b\u1ED9 di\u1EC5n bi\u1EBFn c\u1EE7a v\xE1n.</p>
          </div>
        </div>
        ${gameState2.gm.history.length ? `
              <div class="history-list" style="max-height: 400px; overflow-y: auto;">
                <div class="history-timeline">
                  ${gameState2.gm.history.map(
      (item) => `
                        <article class="history-card-timeline">
                          <div class="history-top">
                            <strong>${escapeHtml(item.cycleLabel)} - ${escapeHtml(item.phaseLabel || "V\xE1n ch\u01A1i")}</strong>
                            <span class="history-time">${formatTime(item.timestamp)}</span>
                          </div>
                          <div class="history-content" style="margin-top: 8px;">
                            <span class="badge" style="margin-right: 8px;">${escapeHtml(item.action)}</span>
                            ${item.targetName ? `<strong>${escapeHtml(item.targetName)}</strong> ` : ""}
                            <span class="muted">${escapeHtml(item.message)}</span>
                          </div>
                        </article>
                      `
    ).join("")}
                </div>
              </div>
            ` : '<p class="muted">Ch\u01B0a c\xF3 l\u1ECBch s\u1EED n\xE0o.</p>'}
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>To\xE0n b\u1ED9 ng\u01B0\u1EDDi ch\u01A1i</h2>
            <p>Hi\u1EC7n role th\u1EADt v\xE0 tr\u1EA1ng th\xE1i cu\u1ED1i v\xE1n.</p>
          </div>
        </div>
        <div class="player-list">
          ${gameState2.players.map((player) => renderPlayerCard(player, gameState2, getRoleDefinition2, false)).join("")}
        </div>
      </article>
    </section>
  `;
  }

  // src/ui/host-lobby-view.js
  function renderHostLobby(roomCode, players) {
    const isReady = roomCode !== null;
    const playerCount = players.length;
    return `
    <style>
      .ww-host-btn {
        background: #7a1f1f !important;
        color: #fdf5e6 !important;
        border: 1px solid #9c2a2a !important;
        padding: 12px 32px !important;
        font-size: 1.1rem !important;
        border-radius: 8px !important;
        font-family: 'DearPix', serif !important;
        letter-spacing: 1px !important;
        transition: all 0.2s !important;
      }
      .ww-host-btn:hover:not(:disabled) {
        background: #8f2525 !important;
      }
      .ww-host-btn:disabled {
        background: #2c2421 !important;
        color: #5e5048 !important;
        border-color: #3d302b !important;
        cursor: not-allowed !important;
        opacity: 1 !important;
      }
    </style>
    <section class="screen">
      <article class="panel" style="max-width: 540px; margin: 40px auto; background: #1a1210; border: 1px solid #4a2e1b; box-shadow: 0 25px 50px rgba(0,0,0,0.8); border-radius: 16px;">
        <div style="text-align: center; padding-bottom: 16px; margin-bottom: 24px; border-bottom: 1px solid #362214;">
          <h2 style="color: #d4af37; font-family: 'DearPix', serif; font-size: 2.2rem; margin-bottom: 6px;">T\u1EA1o ph\xF2ng Local</h2>
          <p style="color: #a39586; font-size: 0.95rem;">Chia m\xE3 ph\xF2ng cho ng\u01B0\u1EDDi ch\u01A1i c\xF9ng m\u1EA1ng Wi-Fi.</p>
        </div>
        
        <div style="text-align: center; margin-bottom: 32px;">
          ${isReady ? `
              <p style="color: #8c7a6b; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">M\xE3 ph\xF2ng</p>
              <h1 style="font-family: monospace; font-size: 4.5rem; color: #fdf5e6; text-shadow: 0 0 20px rgba(212, 175, 55, 0.3); margin: 0; letter-spacing: 6px;">${escapeHtml(roomCode)}</h1>
              <p style="margin-top: 12px; color: #5a825a; font-size: 0.95rem;">\u0110ang ch\u1EDD ng\u01B0\u1EDDi ch\u01A1i tham gia...</p>
            ` : `
              <div style="padding: 40px 20px;">
                <p style="color: #a39586;">\u0110ang t\u1EA1o ph\xF2ng...</p>
              </div>
            `}
        </div>

        <div style="background: rgba(0,0,0,0.4); border: 1px solid #2a1a12; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <h3 style="color: #c7b8a1; font-size: 1.1rem; margin-bottom: 12px; font-family: 'DearPix', serif;">Ng\u01B0\u1EDDi ch\u01A1i \u0111\xE3 tham gia (${playerCount}/15)</h3>
          
          ${playerCount === 0 ? `<div style="text-align: center; padding: 24px 10px; color: #7a6b5d; font-size: 0.95rem; line-height: 1.6;">
                 Ch\u01B0a c\xF3 ng\u01B0\u1EDDi ch\u01A1i n\xE0o.<br/>
                 H\xE3y \u0111\u01B0a m\xE3 ph\xF2ng cho ng\u01B0\u1EDDi ch\u01A1i nh\u1EADp \u1EDF m\xE0n h\xECnh Tham gia Local.
               </div>` : `
              <div style="display: grid; gap: 8px; max-height: 250px; overflow-y: auto;">
                ${players.map((p, index) => `
                  <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(212, 175, 55, 0.04); padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.1);">
                    <strong style="color: #e8dcc7; font-weight: 500;">${index + 1}. ${escapeHtml(p.name)}</strong>
                    <span style="color: #5a825a; font-size: 0.85rem;">\u0110\xE3 k\u1EBFt n\u1ED1i</span>
                  </div>
                `).join("")}
              </div>
            `}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 16px; border-top: 1px solid #362214;">
          <button class="btn btn-ghost" data-action="nav-home" style="color: #a39586; width: auto; padding: 10px 16px; font-size: 0.95rem;">Quay l\u1EA1i</button>
          
          <div style="text-align: right;">
            <button class="btn ww-host-btn" data-action="host-lobby-start" ${playerCount < 1 ? "disabled" : ""} style="width: auto;">
              \u0110i t\u1EDBi setup
            </button>
            ${playerCount < 1 ? `<div style="font-size: 0.8rem; color: #7a6b5d; margin-top: 8px;">C\u1EA7n \xEDt nh\u1EA5t 1 ng\u01B0\u1EDDi ch\u01A1i \u0111\u1EC3 setup</div>` : ""}
          </div>
        </div>
      </article>
    </section>
  `;
  }

  // src/ui/client-join-view.js
  function renderClientJoin(errorMsg = "") {
    let displayError = errorMsg;
    if (errorMsg) {
      if (errorMsg.includes("name") || errorMsg.includes("T\xEAn")) displayError = "Nh\u1EADp t\xEAn ng\u01B0\u1EDDi ch\u01A1i \u0111\u1EC3 ti\u1EBFp t\u1EE5c.";
      else if (errorMsg.includes("code") || errorMsg.includes("M\xE3")) displayError = "Nh\u1EADp m\xE3 ph\xF2ng \u0111\u1EC3 ti\u1EBFp t\u1EE5c.";
      else displayError = "Kh\xF4ng t\xECm th\u1EA5y ph\xF2ng. Ki\u1EC3m tra l\u1EA1i m\xE3 ho\u1EB7c m\u1EA1ng Wi-Fi.";
    }
    return `
    <style>
      .ww-input {
        padding: 14px 16px;
        background: rgba(0,0,0,0.4) !important;
        border: 1px solid #362214 !important;
        color: #fdf5e6 !important;
        border-radius: 8px;
        font-size: 1.05rem;
        outline: none;
        transition: all 0.2s;
        width: 100%;
      }
      .ww-input:focus {
        border-color: #d4af37 !important;
        box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15) !important;
      }
      .ww-btn-primary {
        background: #7a1f1f !important;
        color: #fdf5e6 !important;
        border: 1px solid #9c2a2a !important;
        padding: 12px 32px !important;
        font-size: 1.1rem !important;
        border-radius: 8px !important;
        font-family: 'DearPix', serif !important;
        letter-spacing: 1px !important;
        transition: all 0.2s !important;
      }
      .ww-btn-primary:hover:not(:disabled) {
        background: #8f2525 !important;
      }
    </style>
    <section class="screen">
      <article class="panel" style="max-width: 480px; margin: 40px auto; background: #1a1210; border: 1px solid #4a2e1b; box-shadow: 0 25px 50px rgba(0,0,0,0.8); border-radius: 16px;">
        <div style="text-align: center; padding-bottom: 16px; margin-bottom: 24px; border-bottom: 1px solid #362214;">
          <h2 style="color: #d4af37; font-family: 'DearPix', serif; font-size: 2.2rem; margin-bottom: 6px;">Tham gia ph\xF2ng Local</h2>
          <p style="color: #a39586; font-size: 0.95rem;">Nh\u1EADp m\xE3 ph\xF2ng t\u1EEB Qu\u1EA3n tr\xF2 v\xE0 t\xEAn c\u1EE7a b\u1EA1n.</p>
        </div>
        
        <form data-action="client-join-submit" style="display: flex; flex-direction: column; gap: 20px;">
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span style="color: #c7b8a1; font-weight: 500; font-size: 0.95rem;">M\xE3 ph\xF2ng</span>
            <input type="text" name="roomCode" required placeholder="VD: I18AF" class="ww-input" style="text-transform: uppercase; font-family: monospace; letter-spacing: 2px;" autocomplete="off" />
          </label>
          
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span style="color: #c7b8a1; font-weight: 500; font-size: 0.95rem;">T\xEAn ng\u01B0\u1EDDi ch\u01A1i</span>
            <input type="text" name="playerName" required placeholder="T\xEAn c\u1EE7a b\u1EA1n" class="ww-input" autocomplete="off" maxlength="15" />
          </label>
          
          ${displayError ? `<div style="padding: 12px 16px; background: rgba(122, 31, 31, 0.15); border: 1px solid rgba(122, 31, 31, 0.3); border-radius: 8px; color: #d97777; font-size: 0.9rem; text-align: center;">${escapeHtml(displayError)}</div>` : ""}
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 20px; border-top: 1px solid #362214;">
            <button type="button" class="btn btn-ghost" data-action="nav-home" style="color: #a39586; width: auto; padding: 10px 16px; font-size: 0.95rem;">Quay l\u1EA1i</button>
            <button type="submit" class="btn ww-btn-primary" style="width: auto;">V\xE0o ph\xF2ng</button>
          </div>
        </form>
      </article>
    </section>
  `;
  }

  // src/ui/client-wait-view.js
  function renderClientWait(clientStatus) {
    const roomCode = clientStatus?.roomCode || "???";
    return `
    <section class="screen" style="display: flex; align-items: center; justify-content: center; min-height: 80vh;">
      <article class="panel" style="max-width: 400px; text-align: center; padding: 40px 20px;">
        <div class="role-icon" style="font-size: 4rem; animation: pulse 2s infinite;">\u23F3</div>
        <h2 style="margin-top: 16px;">\u0110\xE3 v\xE0o ph\xF2ng ${escapeHtml(roomCode)}</h2>
        <p class="muted" style="margin-top: 12px; line-height: 1.5;">Vui l\xF2ng \u0111\u1EE3i Qu\u1EA3n tr\xF2 thi\u1EBFt l\u1EADp v\xE1n ch\u01A1i v\xE0 chia vai...</p>
        <div class="divider" style="margin: 20px 0;"></div>
        <p class="helper">Kh\xF4ng t\u1EAFt tr\xECnh duy\u1EC7t ho\u1EB7c t\u1EA3i l\u1EA1i trang.</p>
        <div style="margin-top: 20px;">
          <button class="btn btn-ghost" data-action="client-disconnect">Tho\xE1t ph\xF2ng</button>
        </div>
      </article>

      ${clientStatus?.error ? `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999; padding: 20px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 16px;">\u26A0\uFE0F</div>
        <h2 style="color: #fca5a5; margin-bottom: 8px;">M\u1EA5t k\u1EBFt n\u1ED1i</h2>
        <p style="color: #ddd; margin-bottom: 24px;">${escapeHtml(clientStatus.error)}</p>
        <button class="btn btn-primary" data-action="client-reconnect-submit" ${clientStatus.isReconnecting ? "disabled" : ""}>
          ${clientStatus.isReconnecting ? "\u0110ang th\u1EED l\u1EA1i..." : "Th\u1EED k\u1EBFt n\u1ED1i l\u1EA1i"}
        </button>
        <button class="btn btn-ghost" data-action="client-disconnect" style="margin-top: 16px;">Tho\xE1t</button>
      </div>
      ` : ""}
    </section>
  `;
  }

  // src/ui/client-play-view.js
  function renderClientPlay(clientState) {
    if (!clientState) return "";
    const { role, alive, publicPhase, dayNightCounter, announcement, winState } = clientState;
    return `
    <section class="screen" style="display: flex; flex-direction: column; gap: 16px;">
      
      ${winState ? `
      <article class="panel" style="text-align: center; background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3);">
        <div class="panel-header" style="justify-content: center; padding-bottom: 0;">
          <h2 style="color: #bef7cb; font-size: 2rem;">\u{1F3C6} ${escapeHtml(winState.winner)}</h2>
        </div>
        <p style="margin: 8px 0;">${escapeHtml(winState.reason)}</p>
      </article>
      ` : `
      <article class="panel" style="text-align: center; background: ${alive ? "rgba(139, 92, 246, 0.1)" : "rgba(239, 68, 68, 0.1)"}; border-color: ${alive ? "rgba(139, 92, 246, 0.3)" : "rgba(239, 68, 68, 0.3)"};">
        <div class="panel-header" style="justify-content: center; padding-bottom: 0;">
          <h2 style="color: ${alive ? "#ddd1ff" : "#fca5a5"};">${alive ? "S\u1ED0NG" : "\u0110\xC3 CH\u1EBET"}</h2>
        </div>
        <p class="muted" style="margin-top: 8px;">${escapeHtml(dayNightCounter)}</p>
      </article>
      `}

      <article class="role-card">
        <div class="role-content">
          <div class="role-icon">${role.icon}</div>
          <div class="role-team">${role.teamLabel}</div>
          <h3 class="role-name">${role.name}</h3>
          <p>${role.summary}</p>
        </div>
      </article>

      ${winState ? `
      <article class="panel">
        <div class="panel-header">
          <h2>Danh s\xE1ch vai tr\xF2</h2>
        </div>
        <div class="player-list">
          ${winState.revealedRoles.map((r) => `
            <div class="vote-row">
              <div class="player-meta">
                <strong>${escapeHtml(r.name)}</strong>
              </div>
              <span class="badge" style="background: rgba(255,255,255,0.1)">${r.icon} ${r.roleName}</span>
            </div>
          `).join("")}
        </div>
      </article>
      ` : `
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2 style="color: var(--accent-3);">\u{1F4E2} Th\xF4ng b\xE1o L\xE0ng</h2>
          </div>
        </div>
        <div style="padding: 16px 0; font-size: 1.1rem; line-height: 1.5; text-align: center;">
          ${announcement ? `<div style="margin-bottom: 12px; font-weight: bold; color: var(--accent-1);">${escapeHtml(announcement)}</div>` : ""}
          ${escapeHtml(publicPhase)}
        </div>
      </article>
      `}
      
      <div class="footer-actions">
        <button class="btn btn-ghost" data-action="client-disconnect" style="opacity: 0.7;">Tho\xE1t v\xE1n ch\u01A1i</button>
      </div>

      ${clientState.error ? `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999; padding: 20px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 16px;">\u26A0\uFE0F</div>
        <h2 style="color: #fca5a5; margin-bottom: 8px;">M\u1EA5t k\u1EBFt n\u1ED1i</h2>
        <p style="color: #ddd; margin-bottom: 24px;">${escapeHtml(clientState.error)}</p>
        <button class="btn btn-primary" data-action="client-reconnect-submit" ${clientState.isReconnecting ? "disabled" : ""}>
          ${clientState.isReconnecting ? "\u0110ang th\u1EED l\u1EA1i..." : "Th\u1EED k\u1EBFt n\u1ED1i l\u1EA1i"}
        </button>
        <button class="btn btn-ghost" data-action="client-disconnect" style="margin-top: 16px;">Tho\xE1t</button>
      </div>
      ` : ""}
    </section>
  `;
  }

  // src/ui-renderer.js
  function render(root, context) {
    const { gameState: gameState2, roleOrder, getRoleDefinition: getRoleDefinition2, phases, currentPhase } = context;
    switch (gameState2.screen) {
      case "home":
      case "hub":
        root.innerHTML = renderHome();
        return;
      case "howto":
        root.innerHTML = renderHowTo();
        return;
      case "setup":
        try {
          root.innerHTML = renderSetup(gameState2, roleOrder, getRoleDefinition2);
        } catch (err) {
          root.innerHTML = `<div style="color:red; padding: 20px;">L\u1ED7i render Setup: ${err.message}<br/>${err.stack}</div>`;
          console.error(err);
        }
        return;
      case "reveal":
        root.innerHTML = renderReveal(gameState2, getRoleDefinition2);
        return;
      case "gm":
        root.innerHTML = renderGm(gameState2, phases, currentPhase, getRoleDefinition2, context.networkAdapter);
        return;
      case "summary":
        root.innerHTML = renderSummary(gameState2, getRoleDefinition2);
        return;
      case "host-lobby":
        root.innerHTML = renderHostLobby(gameState2.hostLobby?.roomCode, gameState2.hostLobby?.players || []);
        return;
      case "client-join":
        root.innerHTML = renderClientJoin(gameState2.clientStatus?.error);
        return;
      case "client-wait":
        root.innerHTML = renderClientWait(gameState2.clientStatus);
        return;
      case "client-play":
        root.innerHTML = renderClientPlay(gameState2.clientStatus);
        return;
      case "home":
      default:
        root.innerHTML = renderHome(gameState2);
    }
  }

  // src/app-modes.js
  var APP_MODES = {
    OFFLINE: "offline",
    HOST: "host",
    CLIENT: "client"
  };
  var currentMode = APP_MODES.OFFLINE;
  function getAppMode() {
    return currentMode;
  }
  function setAppMode(mode) {
    if (Object.values(APP_MODES).includes(mode)) {
      currentMode = mode;
    }
  }

  // src/action-types.js
  var ACTION_TYPES = {
    // Navigation & General
    GO_SETUP: "GO_SETUP",
    LOAD_SAVED_GAME: "LOAD_SAVED_GAME",
    GO_HOW_TO: "GO_HOW_TO",
    GO_HOME: "GO_HOME",
    HOME_NEW_HOST: "HOME_NEW_HOST",
    HOME_JOIN_CLIENT: "HOME_JOIN_CLIENT",
    // Network
    CLIENT_JOIN_SUBMIT: "CLIENT_JOIN_SUBMIT",
    HOST_LOBBY_START: "HOST_LOBBY_START",
    CLIENT_DISCONNECT: "CLIENT_DISCONNECT",
    GM_FORCE_BROADCAST: "GM_FORCE_BROADCAST",
    // Setup
    SETUP_DECREASE_PLAYER: "SETUP_DECREASE_PLAYER",
    SETUP_INCREASE_PLAYER: "SETUP_INCREASE_PLAYER",
    SETUP_APPLY_PRESET: "SETUP_APPLY_PRESET",
    SETUP_LOAD_PRESET: "SETUP_LOAD_PRESET",
    SETUP_ASSIGN_ROLES: "SETUP_ASSIGN_ROLES",
    SETUP_UPDATE_PLAYER_NAME: "SETUP_UPDATE_PLAYER_NAME",
    SETUP_UPDATE_ROLE_COUNT: "SETUP_UPDATE_ROLE_COUNT",
    SETUP_UPDATE_PLAYER_COUNT: "SETUP_UPDATE_PLAYER_COUNT",
    // Reveal Phase
    REVEAL_READY: "REVEAL_READY",
    REVEAL_SHOW: "REVEAL_SHOW",
    REVEAL_NEXT: "REVEAL_NEXT",
    // GM Dashboard
    GM_TOGGLE_ROLES: "GM_TOGGLE_ROLES",
    GM_FILTER_CHANGE: "GM_FILTER_CHANGE",
    GM_VOTE_ADD: "GM_VOTE_ADD",
    GM_VOTE_SUB: "GM_VOTE_SUB",
    GM_VOTE_RESET: "GM_VOTE_RESET",
    GM_VOTE_EXECUTE: "GM_VOTE_EXECUTE",
    GM_NEXT_PHASE: "GM_NEXT_PHASE",
    GM_TOGGLE_LIFE: "GM_TOGGLE_LIFE",
    GM_ADD_NOTE: "GM_ADD_NOTE",
    GM_CLEAR_NOTE: "GM_CLEAR_NOTE",
    GM_END_GAME: "GM_END_GAME",
    GM_UPDATE_NOTE_DRAFT: "GM_UPDATE_NOTE_DRAFT",
    GM_SET_CUPID_LINK: "GM_SET_CUPID_LINK",
    GM_TOGGLE_FOX_POWER: "GM_TOGGLE_FOX_POWER",
    // Night Actions
    GM_SET_WOLF_TARGET: "GM_SET_WOLF_TARGET",
    GM_SET_GUARD_TARGET: "GM_SET_GUARD_TARGET",
    GM_WITCH_HEAL: "GM_WITCH_HEAL",
    GM_WITCH_POISON: "GM_WITCH_POISON",
    GM_HUNTER_SHOOT: "GM_HUNTER_SHOOT",
    // Summary
    SUMMARY_REPLAY: "SUMMARY_REPLAY"
  };

  // src/role-effects.js
  function applyCupidLink(gameState2, p1Id, p2Id) {
    if (!p1Id || !p2Id || p1Id === p2Id) return gameState2;
    const p1 = gameState2.players.find((p) => p.id === p1Id);
    const p2 = gameState2.players.find((p) => p.id === p2Id);
    if (!p1 || !p2) return gameState2;
    let nextState = {
      ...gameState2,
      gm: {
        ...gameState2.gm,
        effects: {
          ...gameState2.gm.effects,
          cupidLinks: [p1Id, p2Id]
        }
      }
    };
    return addHistoryEntry(nextState, "Gh\xE9p \u0111\xF4i", "role_effect", `${p1.name} v\xE0 ${p2.name} \u0111\xE3 \u0111\u01B0\u1EE3c gh\xE9p \u0111\xF4i.`);
  }
  function toggleFoxPower(gameState2, foxId) {
    if (!foxId) return gameState2;
    const currentLost = gameState2.gm.effects?.foxLostPower || [];
    const hasLost = currentLost.includes(foxId);
    const nextLost = hasLost ? currentLost.filter((id) => id !== foxId) : [...currentLost, foxId];
    let nextState = {
      ...gameState2,
      gm: {
        ...gameState2.gm,
        effects: {
          ...gameState2.gm.effects,
          foxLostPower: nextLost
        }
      }
    };
    const foxPlayer = gameState2.players.find((p) => p.id === foxId);
    const statusMsg = hasLost ? "ph\u1EE5c h\u1ED3i n\u0103ng l\u1EF1c" : "m\u1EA5t n\u0103ng l\u1EF1c";
    return addHistoryEntry(nextState, "C\xE1o thay \u0111\u1ED5i", "role_effect", `C\xE1o (${foxPlayer?.name || "???"}) \u0111\xE3 ${statusMsg}.`);
  }
  function setNightAction(gameState2, actionKey, value) {
    return {
      ...gameState2,
      gm: {
        ...gameState2.gm,
        nightActions: {
          ...gameState2.gm.nightActions,
          [actionKey]: value
        }
      }
    };
  }
  function witchUsePotion(gameState2, potionType, targetId) {
    let nextState = { ...gameState2 };
    if (potionType === "heal") {
      nextState.gm.roleStates.witch.hasHealPotion = false;
      nextState = setNightAction(nextState, "witchHeal", true);
    } else if (potionType === "poison") {
      nextState.gm.roleStates.witch.hasPoisonPotion = false;
      nextState = setNightAction(nextState, "witchPoisonTarget", targetId);
    }
    return nextState;
  }
  function hunterShoot(gameState2, targetId) {
    if (!targetId) return gameState2;
    let nextState = { ...gameState2 };
    const target = nextState.players.find((p) => p.id === targetId);
    if (!target || !target.alive) return gameState2;
    nextState.gm.roleStates.hunter.hasShot = true;
    nextState.gm.roleStates.hunter.pendingShot = null;
    nextState = killPlayer(nextState, targetId, "B\u1ECB Th\u1EE3 s\u0103n b\u1EAFn");
    return addHistoryEntry(nextState, "Th\u1EE3 s\u0103n b\u1EAFn", "role_effect", `Th\u1EE3 s\u0103n \u0111\xE3 b\u1EAFn ch\u1EBFt ${target.name}.`);
  }

  // src/action-dispatcher.js
  function advanceReveal(gameState2) {
    const nextIndex = gameState2.reveal.currentIndex + 1;
    if (nextIndex >= gameState2.players.length) {
      return addHistoryEntry(
        {
          ...gameState2,
          screen: "gm",
          reveal: {
            ...gameState2.reveal,
            currentIndex: gameState2.players.length - 1,
            stage: "done"
          }
        },
        "B\u1EAFt \u0111\u1EA7u game",
        "system",
        "T\u1EA5t c\u1EA3 ng\u01B0\u1EDDi ch\u01A1i \u0111\xE3 nh\u1EADn vai. Qu\u1EA3n tr\xF2 b\u1EAFt \u0111\u1EA7u \u0111i\u1EC1u ph\u1ED1i."
      );
    }
    return {
      ...gameState2,
      reveal: {
        currentIndex: nextIndex,
        stage: "handoff"
      }
    };
  }
  function togglePlayerLife(gameState2, playerId) {
    const player = gameState2.players.find((entry) => entry.id === playerId);
    if (!player) {
      return gameState2;
    }
    const updatedState = player.alive ? killPlayer(gameState2, playerId) : revivePlayer(gameState2, playerId);
    return checkWinCondition(updatedState);
  }
  function dispatchAction(gameState2, action) {
    const { type, payload, source } = action;
    const mode = getAppMode();
    if (!Object.values(ACTION_TYPES).includes(type)) {
      console.warn(`[Action Dispatcher] Unknown action type: "${type}". State was not mutated.`);
      return gameState2;
    }
    if (type === ACTION_TYPES.HOME_NEW_HOST) {
      return { ...gameState2, screen: "host-lobby", hostLobby: { roomCode: null, players: [] } };
    }
    if (type === ACTION_TYPES.HOME_JOIN_CLIENT) {
      return { ...gameState2, screen: "client-join", clientStatus: { error: "" } };
    }
    if (type === ACTION_TYPES.HOST_LOBBY_START) {
      const newState = createSetupDraft(gameState2, gameState2.hostLobby.players.length, true, "basic");
      newState.setup.players = gameState2.hostLobby.players.map((p, i) => ({ id: p.id, name: p.name, sessionId: p.sessionId, order: i + 1 }));
      return newState;
    }
    if (type === ACTION_TYPES.CLIENT_JOIN_SUBMIT) {
      return { ...gameState2, screen: "client-wait", clientStatus: { roomCode: payload.roomCode, playerName: payload.playerName } };
    }
    if (type === ACTION_TYPES.CLIENT_DISCONNECT) {
      return goHome(gameState2);
    }
    if (mode === APP_MODES.OFFLINE || source === "offline") {
      return processOfflineAction(gameState2, action);
    }
    if (mode === APP_MODES.HOST) {
      return processOfflineAction(gameState2, action);
    }
    return gameState2;
  }
  function processOfflineAction(gameState2, { type, payload }) {
    switch (type) {
      case ACTION_TYPES.GO_SETUP:
        return goSetup(gameState2);
      case ACTION_TYPES.LOAD_SAVED_GAME:
        return loadSavedGameIntoState();
      case ACTION_TYPES.GO_HOW_TO:
        return goHowTo(gameState2);
      case ACTION_TYPES.GO_HOME:
        return goHome(gameState2);
      case ACTION_TYPES.SETUP_DECREASE_PLAYER:
        return updateSetupPlayerCount(gameState2, gameState2.setup.playerCount - 1);
      case ACTION_TYPES.SETUP_INCREASE_PLAYER:
        return updateSetupPlayerCount(gameState2, gameState2.setup.playerCount + 1);
      case ACTION_TYPES.SETUP_APPLY_PRESET:
        return createSetupDraft(gameState2, gameState2.setup.playerCount, true, payload.presetMode);
      case ACTION_TYPES.SETUP_LOAD_PRESET:
        return applyCustomPreset(gameState2, payload.presetId);
      case ACTION_TYPES.SETUP_ASSIGN_ROLES: {
        let newState = createGame({
          baseState: gameState2,
          playerCount: gameState2.setup.playerCount,
          playerNames: gameState2.setup.players.map((player) => player.name),
          roleConfig: gameState2.setup.roleConfig
        });
        if (getAppMode() === APP_MODES.HOST) {
          newState = addHistoryEntry(
            {
              ...newState,
              screen: "gm",
              reveal: {
                ...newState.reveal,
                stage: "done"
              }
            },
            "B\u1EAFt \u0111\u1EA7u game",
            "system",
            "T\u1EA5t c\u1EA3 ng\u01B0\u1EDDi ch\u01A1i \u0111\xE3 nh\u1EADn vai tr\xEAn m\xE1y c\xE1 nh\xE2n. Qu\u1EA3n tr\xF2 b\u1EAFt \u0111\u1EA7u \u0111i\u1EC1u ph\u1ED1i."
          );
        }
        return newState;
      }
      case ACTION_TYPES.REVEAL_READY:
        return updateRevealStage(gameState2, "ready");
      case ACTION_TYPES.REVEAL_SHOW:
        return updateRevealStage(gameState2, "revealed");
      case ACTION_TYPES.REVEAL_NEXT:
        return advanceReveal(gameState2);
      case ACTION_TYPES.GM_TOGGLE_ROLES:
        return toggleShowRoles(gameState2);
      case ACTION_TYPES.GM_FILTER_CHANGE:
        return updateGmFilter(gameState2, payload.filter);
      case ACTION_TYPES.GM_VOTE_ADD:
        return addVote(gameState2, payload.playerId, 1);
      case ACTION_TYPES.GM_VOTE_SUB:
        return addVote(gameState2, payload.playerId, -1);
      case ACTION_TYPES.GM_VOTE_RESET:
        return resetVotes(gameState2);
      case ACTION_TYPES.GM_VOTE_EXECUTE:
        return executeVoteHanging(gameState2);
      case ACTION_TYPES.GM_NEXT_PHASE:
        return nextPhase(gameState2);
      case ACTION_TYPES.GM_TOGGLE_LIFE:
        return togglePlayerLife(gameState2, payload.playerId);
      case ACTION_TYPES.GM_ADD_NOTE:
        return appendCurrentNoteToHistory(gameState2);
      case ACTION_TYPES.GM_CLEAR_NOTE:
        return clearNoteDraft(gameState2);
      case ACTION_TYPES.GM_END_GAME:
        return finishGame(gameState2);
      case ACTION_TYPES.GM_SET_CUPID_LINK:
        return applyCupidLink(gameState2, payload.p1Id, payload.p2Id);
      case ACTION_TYPES.GM_TOGGLE_FOX_POWER:
        return toggleFoxPower(gameState2, payload.playerId);
      // Night Actions
      case ACTION_TYPES.GM_SET_WOLF_TARGET:
        return setNightAction(gameState2, "wolfTarget", payload.playerId);
      case ACTION_TYPES.GM_SET_GUARD_TARGET:
        return setNightAction(gameState2, "guardTarget", payload.playerId);
      case ACTION_TYPES.GM_WITCH_HEAL:
        return witchUsePotion(gameState2, "heal");
      case ACTION_TYPES.GM_WITCH_POISON:
        return witchUsePotion(gameState2, "poison", payload.playerId);
      case ACTION_TYPES.GM_HUNTER_SHOOT:
        return hunterShoot(gameState2, payload.playerId);
      case ACTION_TYPES.SUMMARY_REPLAY:
        return restartWithSameSetup(gameState2);
      // Input actions
      case ACTION_TYPES.SETUP_UPDATE_PLAYER_NAME:
        return updateSetupPlayerName(gameState2, payload.playerIndex, payload.value);
      case ACTION_TYPES.SETUP_UPDATE_ROLE_COUNT:
        return updateSetupRoleCount(gameState2, payload.roleId, payload.value);
      case ACTION_TYPES.SETUP_UPDATE_PLAYER_COUNT:
        return updateSetupPlayerCount(gameState2, payload.value);
      case ACTION_TYPES.GM_UPDATE_NOTE_DRAFT:
        return updateNoteDraft(gameState2, payload.value);
      default:
        console.warn(`[Action Dispatcher] Unhandled action type: "${type}" in processOfflineAction.`);
        return gameState2;
    }
  }

  // src/action-map.js
  var UI_ACTION_MAP = {
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
    "summary-replay": ACTION_TYPES.SUMMARY_REPLAY
  };

  // src/network-message-types.js
  var NETWORK_MESSAGES = {
    JOIN_REQUEST: "JOIN_REQUEST",
    JOIN_ACCEPTED: "JOIN_ACCEPTED",
    JOIN_REJECTED: "JOIN_REJECTED",
    RECONNECT_SUCCESS: "RECONNECT_SUCCESS",
    PLAYER_VIEW_STATE: "PLAYER_VIEW_STATE",
    HOST_ANNOUNCEMENT: "HOST_ANNOUNCEMENT",
    DISCONNECT: "DISCONNECT",
    ERROR: "ERROR"
  };

  // src/network-adapter.js
  var peer = null;
  var connections = {};
  var isHost = false;
  function generateRoomCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return "LUDORA_" + result;
  }
  var networkAdapter = {
    isHost() {
      return isHost;
    },
    getRoomCode() {
      if (peer) {
        return peer.id.replace("LUDORA_", "");
      }
      return null;
    },
    initHost({ onReady, onClientJoin, onClientLeave, onData }) {
      this.disconnect();
      isHost = true;
      connections = {};
      const fullPeerId = generateRoomCode();
      peer = new Peer(fullPeerId, {
        debug: 2
      });
      peer.on("open", (id) => {
        console.log("Host created room:", id);
        if (onReady) onReady(id.replace("LUDORA_", ""));
      });
      peer.on("connection", (conn) => {
        conn.on("data", (data) => {
          if (data.type === NETWORK_MESSAGES.JOIN_REQUEST) {
            connections[conn.peer] = conn;
            if (onClientJoin) {
              onClientJoin(conn.peer, data.payload.name, data.payload.sessionId, data.payload.isReconnect);
            }
          } else {
            if (onData) onData(conn.peer, data);
          }
        });
        conn.on("close", () => {
          delete connections[conn.peer];
          if (onClientLeave) onClientLeave(conn.peer);
        });
        conn.on("error", (err) => {
          console.error("Connection error with client:", err);
        });
      });
      peer.on("error", (err) => {
        console.error("Host peer error:", err);
      });
    },
    initClient(roomCode, playerName, sessionId, isReconnect, { onConnected, onData, onDisconnected, onError, onRejected }) {
      this.disconnect();
      isHost = false;
      const fullHostId = "LUDORA_" + roomCode.toUpperCase();
      peer = new Peer({
        debug: 2
      });
      peer.on("open", (id) => {
        console.log("Client initialized:", id);
        const conn = peer.connect(fullHostId, { reliable: true });
        conn.on("open", () => {
          console.log("Connected to host:", fullHostId);
          connections["HOST"] = conn;
          conn.send({
            type: NETWORK_MESSAGES.JOIN_REQUEST,
            payload: { name: playerName, sessionId, isReconnect }
          });
        });
        conn.on("data", (data) => {
          if (data.type === NETWORK_MESSAGES.JOIN_ACCEPTED || data.type === NETWORK_MESSAGES.RECONNECT_SUCCESS) {
            if (onConnected) onConnected();
          } else if (data.type === NETWORK_MESSAGES.JOIN_REJECTED) {
            if (onRejected) onRejected(data.payload?.reason);
            peer.destroy();
          } else {
            if (onData) onData(data);
          }
        });
        conn.on("close", () => {
          console.log("Disconnected from host");
          if (onDisconnected) onDisconnected();
        });
        conn.on("error", (err) => {
          console.error("Client connection error:", err);
          if (onError) onError(err);
        });
      });
      peer.on("error", (err) => {
        console.error("Client peer error:", err);
        if (onError) onError(err);
      });
    },
    sendToClient(clientId, data) {
      const conn = connections[clientId];
      if (conn && conn.open) {
        if (this._isDataUnsafe(data)) {
          console.error("SECURITY WARNING: Attempted to send unsafe data to client", clientId);
          return;
        }
        conn.send(data);
      }
    },
    sendToHost(data) {
      const conn = connections["HOST"];
      if (conn && conn.open) {
        conn.send(data);
      }
    },
    broadcast(data) {
      if (!isHost) return;
      if (this._isDataUnsafe(data)) {
        console.error("SECURITY WARNING: Attempted to broadcast unsafe data");
        return;
      }
      Object.values(connections).forEach((conn) => {
        if (conn.open) {
          conn.send(data);
        }
      });
    },
    disconnect() {
      if (peer) {
        peer.destroy();
        peer = null;
      }
      connections = {};
      isHost = false;
    },
    getConnectionStatus(clientId) {
      const conn = connections[clientId];
      return conn && conn.open;
    },
    _isDataUnsafe(data) {
      if (!data || !data.payload) return false;
      const payload = data.payload;
      if (payload.players && Array.isArray(payload.players) && payload.players.length > 1) return true;
      if (payload.nightActions) return true;
      if (payload.history && Array.isArray(payload.history) && payload.history.length > 5) return true;
      if (payload.gm) return true;
      return false;
    }
  };

  // app.js
  var isAudioMuted = true;
  var isAudioPlaying = false;
  var parallaxTicking = false;
  var app = document.getElementById("app");
  var savedGame = loadSavedGame();
  var gameState = savedGame ?? createBaseState();
  persistAndRender(Boolean(savedGame));
  app.addEventListener("click", (event) => {
    try {
      const target = event.target.closest("[data-action]");
      if (!target) {
        return;
      }
      const { action, playerId, filter, presetId, p1Id, p2Id, presetMode } = target.dataset;
      const source = getAppMode();
      const mappedActionType = UI_ACTION_MAP[action];
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
        } else if (action === "toggle-audio") {
          isAudioMuted = !isAudioMuted;
          initAmbientEffects();
          return;
        } else {
          console.warn(`[UI] Unknown or unmapped data-action: "${action}"`);
        }
        return;
      }
      if (mappedActionType === ACTION_TYPES.GO_SETUP) {
        if (gameState.status === "active" || gameState.status === "finished") {
          if (!window.confirm("B\u1EAFt \u0111\u1EA7u setup v\xE1n m\u1EDBi s\u1EBD ghi \u0111\xE8 v\xE1n hi\u1EC7n t\u1EA1i. Ti\u1EBFp t\u1EE5c?")) return;
        }
      } else if (mappedActionType === ACTION_TYPES.GM_VOTE_EXECUTE) {
        if (!window.confirm("B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n treo c\u1ED5 ng\u01B0\u1EDDi nhi\u1EC1u phi\u1EBFu nh\u1EA5t? H\xE0nh \u0111\u1ED9ng n\xE0y kh\xF4ng th\u1EC3 ho\xE0n t\xE1c.")) return;
      } else if (mappedActionType === ACTION_TYPES.GM_END_GAME) {
        if (!window.confirm("B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n k\u1EBFt th\xFAc v\xE1n ngay l\u1EADp t\u1EE9c?")) return;
      } else if (mappedActionType === ACTION_TYPES.SETUP_ASSIGN_ROLES) {
        if (!gameState.setup.validation.isValid) return;
      } else if (mappedActionType === ACTION_TYPES.SETUP_LOAD_PRESET && !presetId) {
        return;
      } else if ((mappedActionType === ACTION_TYPES.GM_VOTE_ADD || mappedActionType === ACTION_TYPES.GM_VOTE_SUB || mappedActionType === ACTION_TYPES.GM_TOGGLE_LIFE) && !playerId) {
        return;
      } else if (mappedActionType === ACTION_TYPES.GM_FILTER_CHANGE && !filter) {
        return;
      }
      const payload = {};
      if (playerId) payload.playerId = playerId;
      if (filter) payload.filter = filter;
      if (presetId) payload.presetId = presetId;
      if (p1Id) payload.p1Id = p1Id;
      if (p2Id) payload.p2Id = p2Id;
      if (presetMode) payload.presetMode = presetMode;
      gameState = dispatchAction(gameState, { type: mappedActionType, payload, source });
      if (mappedActionType === ACTION_TYPES.HOME_NEW_HOST) {
        setAppMode(APP_MODES.HOST);
        networkAdapter.initHost({
          onReady: (roomCode) => {
            gameState.hostLobby.roomCode = roomCode;
            persistAndRender(false);
          },
          onClientJoin: (peerId, name, sessionId, isReconnect) => {
            if (isReconnect && gameState.status === "active") {
              const player = gameState.players?.find((p) => p.sessionId === sessionId);
              if (player) {
                player.id = peerId;
                networkAdapter.sendToClient(peerId, { type: NETWORK_MESSAGES.RECONNECT_SUCCESS });
                broadcastGameState();
              } else {
                networkAdapter.sendToClient(peerId, { type: NETWORK_MESSAGES.JOIN_REJECTED, payload: { reason: "Phi\xEAn k\u1EBFt n\u1ED1i kh\xF4ng h\u1EE3p l\u1EC7." } });
              }
            } else if (!isReconnect && gameState.screen === "host-lobby") {
              gameState.hostLobby.players.push({ id: peerId, name, sessionId });
              networkAdapter.sendToClient(peerId, { type: NETWORK_MESSAGES.JOIN_ACCEPTED, payload: { playerId: peerId } });
            } else {
              networkAdapter.sendToClient(peerId, { type: NETWORK_MESSAGES.JOIN_REJECTED, payload: { reason: "Ph\xF2ng \u0111ang ch\u01A1i ho\u1EB7c kh\xF4ng cho ph\xE9p tham gia l\xFAc n\xE0y." } });
            }
            persistAndRender(false);
          },
          onClientLeave: (peerId) => {
            if (gameState.screen === "host-lobby") {
              gameState.hostLobby.players = gameState.hostLobby.players.filter((p) => p.id !== peerId);
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
        "GM_FORCE_BROADCAST"
      ];
      persistAndRender(!noSaveActions.includes(mappedActionType));
      if (getAppMode() === APP_MODES.HOST && gameState.screen === "gm") {
        if (mappedActionType !== "GM_FORCE_BROADCAST" && noSaveActions.includes(mappedActionType)) {
        } else {
          broadcastGameState();
        }
      }
    } catch (error) {
      console.error(error);
      alert("L\u1ED7i JS: " + error.message);
    }
  });
  function doClientJoin(isReconnect, form = null) {
    const roomCode = isReconnect ? gameState.clientStatus?.roomCode || localStorage.getItem("ludora:werewolf:lastRoomCode") : form.elements.roomCode.value.trim().toUpperCase();
    const playerName = isReconnect ? gameState.clientStatus?.playerName || localStorage.getItem("ludora:werewolf:lastPlayerName") : form.elements.playerName.value.trim();
    let sessionId = localStorage.getItem("ludora:werewolf:clientSessionId");
    if (!sessionId) {
      sessionId = "session-" + Date.now() + "-" + Math.random().toString(36).substring(2);
      localStorage.setItem("ludora:werewolf:clientSessionId", sessionId);
    }
    if (!isReconnect) {
      localStorage.setItem("ludora:werewolf:lastRoomCode", roomCode);
      localStorage.setItem("ludora:werewolf:lastPlayerName", playerName);
    }
    gameState = dispatchAction(gameState, {
      type: ACTION_TYPES.CLIENT_JOIN_SUBMIT,
      payload: { roomCode, playerName },
      source: getAppMode()
    });
    if (isReconnect) {
      gameState.clientStatus = { ...gameState.clientStatus, error: "\u0110ang k\u1EBFt n\u1ED1i l\u1EA1i...", isReconnecting: true };
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
        alert("K\u1EBFt n\u1ED1i th\u1EA5t b\u1EA1i: " + (reason || "L\u1ED7i kh\xF4ng x\xE1c \u0111\u1ECBnh"));
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
        gameState.clientStatus = { ...gameState.clientStatus, error: "\u0110\xE3 m\u1EA5t k\u1EBFt n\u1ED1i v\u1EDBi qu\u1EA3n tr\xF2." };
        persistAndRender(false);
      },
      onError: (err) => {
        gameState.clientStatus = { ...gameState.clientStatus, error: "L\u1ED7i k\u1EBFt n\u1ED1i. Vui l\xF2ng ki\u1EC3m tra l\u1EA1i m\xE3 ph\xF2ng.", isReconnecting: false };
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
      networkAdapter
    });
    if (gameState.screen === "home" || !gameState.screen) {
      initAmbientEffects();
    }
  }
  function saveOnly() {
    if (getAppMode() !== APP_MODES.CLIENT) {
      gameState = saveGame(gameState);
    }
  }
  function broadcastGameState() {
    if (!networkAdapter.isHost() || !gameState.players) return;
    gameState.players.forEach((player) => {
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
  function initAmbientEffects() {
    const audio = document.getElementById("ambient-audio");
    const audioToggle = document.getElementById("audio-toggle");
    if (audio && audioToggle) {
      audio.volume = 0.2;
      audioToggle.textContent = isAudioMuted ? "\u{1F507}" : "\u{1F508}";
      if (!isAudioMuted && !isAudioPlaying) {
        audio.play().then(() => {
          isAudioPlaying = true;
        }).catch((e) => console.warn("Auto-play prevented", e));
      } else if (isAudioMuted && isAudioPlaying) {
        audio.pause();
        isAudioPlaying = false;
      }
    }
    const bg = document.querySelector(".parallax-bg");
    if (bg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.removeEventListener("mousemove", handleParallax);
      document.addEventListener("mousemove", handleParallax);
    }
  }
  function handleParallax(e) {
    if (parallaxTicking) return;
    window.requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      const moon = document.querySelector(".moon");
      const treesFg = document.querySelector(".trees-fg");
      const treesBg = document.querySelector(".trees-bg");
      if (moon) moon.style.transform = `translate(calc(-50% + ${x * 0.2}px), ${y * 0.2}px)`;
      if (treesBg) treesBg.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
      if (treesFg) treesFg.style.transform = `translate(${x * 1.5}px, ${y * 1.5}px)`;
      parallaxTicking = false;
    });
    parallaxTicking = true;
  }
})();
