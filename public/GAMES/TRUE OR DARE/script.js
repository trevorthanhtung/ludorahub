document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // AUDIO SYSTEM (HOWLER.JS)
    // ==========================================
    const Sound = window.Howl ?? class {
        play() {}
        stop() {}
        mute() {}
    };
    const fireConfetti = window.confetti ?? (() => {});
    let isMuted = false;

    const sfx = {
        tick: new Sound({ src: ['https://actions.google.com/sounds/v1/alarms/beep_short.ogg'], volume: 0.3 }),
        whoosh: new Sound({ src: ['https://actions.google.com/sounds/v1/foley/whoosh.ogg'], volume: 0.4 }),
        tickFast: new Sound({ src: ['https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg'], volume: 0.4 }),
        heartbeat: new Sound({ src: ['https://actions.google.com/sounds/v1/foley/heartbeat.ogg'], loop: true, volume: 0.5 }),
        ding: new Sound({ src: ['https://actions.google.com/sounds/v1/alarms/din_din_din.ogg'], volume: 0.6 }),
        crowd: new Sound({ src: ['https://actions.google.com/sounds/v1/human_voices/crowd_cheer.ogg'], volume: 0.7 }),
        trueChime: new Sound({ src: ['https://actions.google.com/sounds/v1/water/water_drop.ogg'], volume: 0.6 }),
        dareBoom: new Sound({ src: ['https://actions.google.com/sounds/v1/impacts/crash.ogg'], volume: 0.6 }),
        success: new Sound({ src: ['https://actions.google.com/sounds/v1/alarms/din_din_din.ogg'], volume: 0.8 }),
        fail: new Sound({ src: ['https://actions.google.com/sounds/v1/alarms/mechanical_buzzer.ogg'], volume: 0.6 }),
        ambient: new Sound({ src: ['https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg'], loop: true, volume: 0.15 })
    };

    let ambientStarted = false;
    let synthContext = null;

    function getSynthContext() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return null;

        if (!synthContext || synthContext.state === "closed") {
            synthContext = new AudioContext();
        }

        if (synthContext.state === "suspended") {
            synthContext.resume();
        }

        return synthContext;
    }

    function playTone(frequency, duration = 0.08, volume = 0.12, type = "sine", delay = 0) {
        if (isMuted) return;

        const ctx = getSynthContext();
        if (!ctx) return;

        const now = ctx.currentTime + delay;
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        oscillator.connect(gain).connect(ctx.destination);
        oscillator.start(now);
        oscillator.stop(now + duration + 0.03);
    }

    function playUiSfx(name) {
        const patterns = {
            add: [[520, 0.07, 0.1], [760, 0.08, 0.09, "sine", 0.055]],
            remove: [[360, 0.08, 0.1], [220, 0.08, 0.08, "triangle", 0.055]],
            denied: [[130, 0.14, 0.14, "sawtooth"], [95, 0.16, 0.1, "sawtooth", 0.08]],
            toggle: [[440, 0.05, 0.08], [620, 0.05, 0.07, "sine", 0.045]],
            penaltyReveal: [[90, 0.18, 0.18, "triangle"], [48, 0.22, 0.16, "sine", 0.08]]
        };

        (patterns[name] || []).forEach(args => playTone(...args));
    }

    function playSfx(name) {
        if (isMuted) return;
        if (sfx[name]) sfx[name].play();
    }
    function stopSfx(name) {
        if (sfx[name]) sfx[name].stop();
    }

    function playImpactBoom() {
        if (isMuted) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            playSfx("dareBoom");
            return;
        }

        const ctx = new AudioContext();
        const now = ctx.currentTime;
        const master = ctx.createGain();
        const low = ctx.createOscillator();
        const lowGain = ctx.createGain();
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.18, ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        const noise = ctx.createBufferSource();
        const noiseFilter = ctx.createBiquadFilter();
        const noiseGain = ctx.createGain();

        for (let i = 0; i < noiseData.length; i++) {
            noiseData[i] = (Math.random() * 2 - 1) * (1 - i / noiseData.length);
        }

        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(0.85, now + 0.01);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
        master.connect(ctx.destination);

        low.type = "sine";
        low.frequency.setValueAtTime(92, now);
        low.frequency.exponentialRampToValueAtTime(38, now + 0.34);
        lowGain.gain.setValueAtTime(1, now);
        lowGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
        low.connect(lowGain).connect(master);

        noise.buffer = noiseBuffer;
        noiseFilter.type = "lowpass";
        noiseFilter.frequency.setValueAtTime(950, now);
        noiseFilter.frequency.exponentialRampToValueAtTime(160, now + 0.18);
        noiseGain.gain.setValueAtTime(0.38, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
        noise.connect(noiseFilter).connect(noiseGain).connect(master);

        low.start(now);
        noise.start(now);
        low.stop(now + 0.45);
        noise.stop(now + 0.2);

        setTimeout(() => ctx.close(), 650);
        playSfx("dareBoom");
    }

    // ==========================================
    // ANIMATION HELPERS
    // ==========================================
    const animate = window.Motion?.animate ?? (() => Promise.resolve());

    animate(".title",
        { opacity: [0, 1], scale: [0.8, 1], rotate: [0, 2] },
        { duration: 0.8, easing: "ease-out" }
    );

    animate("#btnStartGame",
        { y: [0, -4, 0] },
        { duration: 2, repeat: Infinity, easing: "ease-in-out" }
    );

    // ==========================================
    // GAMEPLAY DATA
    // ==========================================
    let players = [];
    const difficulties = ["easy", "medium", "hard", "insane"];
    const rarityWeights = {
        common: 55,
        rare: 25,
        epic: 15,
        legendary: 5
    };
    const difficultyLabels = {
        easy: "Dễ",
        medium: "Vừa",
        hard: "Khó",
        insane: "Căng"
    };
    const rarityLabels = {
        common: "Thường",
        rare: "Hiếm",
        epic: "Rất hiếm",
        legendary: "Huyền thoại"
    };

    const questionBank = window.DEFAULT_QUESTION_BANK || { truth: [], dare: [], penalty: [] };

    const usedQuestions = {
        truth: [],
        dare: [],
        penalty: []
    };

    const gameSettings = {
        mode: "normal",
        selectedDifficulties: ["easy", "medium"],
        useDefaultData: true,
        useCustomData: true,
        customText: {
            truth: "",
            dare: "",
            penalty: ""
        }
    };

    const playerStats = {};
    const gameHistory = [];

    const gameplayState = {
        totalTurns: 0,
        currentActionType: "",
        currentQuestion: null,
        currentQuestionSet: [],
        currentPenalty: null,
        currentChaosEvent: null,
        freePassActive: false,
        punishmentBoostActive: false,
        chaosEventChance: 0.15
    };

    let currentPlayer = "";

    // ==========================================
    // GAMEPLAY ENGINE
    // ==========================================
    function randomFrom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function normalizeType(type) {
        return type === "true" ? "truth" : type;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function hashText(value) {
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
            hash = ((hash << 5) - hash) + value.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(36);
    }

    function buildCustomQuestions(type) {
        const rawText = gameSettings.customText[type] || "";
        return rawText
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean)
            .map((text, index) => ({
                id: `custom_${type}_${index + 1}_${hashText(text)}`,
                text,
                type,
                difficulty: "medium",
                rarity: "common",
                source: "custom"
            }));
    }

    function getQuestionSource(type) {
        const defaultQuestions = gameSettings.useDefaultData ? [...(questionBank[type] || [])] : [];
        const customQuestions = gameSettings.useCustomData ? buildCustomQuestions(type) : [];
        const mixedQuestions = [...defaultQuestions, ...customQuestions];

        return mixedQuestions.length ? mixedQuestions : [...(questionBank[type] || [])];
    }

    function getActivePlayers() {
        return players.filter(Boolean);
    }

    function ensurePlayerStats(playerName) {
        if (!playerName) return;
        if (!playerStats[playerName]) {
            playerStats[playerName] = {
                completed: 0,
                punished: 0,
                combo: 0,
                maxCombo: 0
            };
        }
    }

    function applyDifficultyFilter(list, selected = gameSettings.selectedDifficulties) {
        if (!selected || selected.length === 0) return list;

        const filtered = list.filter(item => selected.includes(item.difficulty));
        return filtered.length ? filtered : list;
    }

    function resetUsedQuestions(type) {
        usedQuestions[type] = [];
    }

    function markQuestionUsed(type, questionId) {
        if (!questionId || usedQuestions[type].includes(questionId)) return;
        usedQuestions[type].push(questionId);
    }

    function getAvailableQuestions(type, options = {}) {
        const source = getQuestionSource(type);
        const difficultyPool = applyDifficultyFilter(source, options.difficulties || gameSettings.selectedDifficulties);
        let available = difficultyPool.filter(item => !usedQuestions[type].includes(item.id));

        if (!available.length) {
            resetUsedQuestions(type);
            available = difficultyPool;
        }

        return available;
    }

    function weightedPick(weights) {
        const entries = Object.entries(weights).filter(([, weight]) => weight > 0);
        const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
        let roll = Math.random() * total;

        for (const [key, weight] of entries) {
            roll -= weight;
            if (roll <= 0) return key;
        }

        return entries[entries.length - 1]?.[0];
    }

    function pickRarity(availableList = []) {
        const selectedRarity = weightedPick(rarityWeights);
        if (availableList.some(item => item.rarity === selectedRarity)) {
            return selectedRarity;
        }

        const fallbackWeights = Object.keys(rarityWeights).reduce((acc, rarity) => {
            if (availableList.some(item => item.rarity === rarity)) {
                acc[rarity] = rarityWeights[rarity];
            }
            return acc;
        }, {});

        return weightedPick(fallbackWeights) || "common";
    }

    function chooseDifficultyPool(list, weights) {
        const availableWeights = Object.entries(weights).reduce((acc, [difficulty, weight]) => {
            if (list.some(item => item.difficulty === difficulty)) {
                acc[difficulty] = weight;
            }
            return acc;
        }, {});

        const selectedDifficulty = weightedPick(availableWeights);
        const filtered = list.filter(item => item.difficulty === selectedDifficulty);
        return filtered.length ? filtered : list;
    }

    function applyModeDifficultyBias(list, type) {
        if (type === "penalty" && gameplayState.punishmentBoostActive) {
            const boosted = list.filter(item => ["hard", "insane"].includes(item.difficulty));
            return boosted.length ? boosted : list;
        }

        if (gameSettings.mode === "party") {
            return chooseDifficultyPool(list, {
                easy: 45,
                medium: 40,
                hard: 12,
                insane: 3
            });
        }

        return list;
    }

    function pickQuestion(type, options = {}) {
        let available = getAvailableQuestions(type, options);
        available = applyModeDifficultyBias(available, type);

        const rarity = pickRarity(available);
        let rarityPool = available.filter(item => item.rarity === rarity);
        if (!rarityPool.length) rarityPool = available;

        const question = randomFrom(rarityPool);
        markQuestionUsed(type, question?.id);
        return question;
    }

    function triggerChaosEvent() {
        gameplayState.currentChaosEvent = null;
        gameplayState.freePassActive = false;
        gameplayState.punishmentBoostActive = false;

        if (gameSettings.mode !== "chaos") return null;

        const turnNumber = gameplayState.totalTurns + 1;
        const guaranteedEvent = turnNumber % 3 === 0;
        const chanceEvent = Math.random() < gameplayState.chaosEventChance;
        if (!guaranteedEvent && !chanceEvent) return null;

        const events = [
            { id: "double_dare", name: "Thử thách đôi" },
            { id: "swap_turn", name: "Đổi lượt" },
            { id: "group_challenge", name: "Thử thách nhóm" },
            { id: "free_pass", name: "Vé bỏ qua" },
            { id: "punishment_boost", name: "Phạt tăng cấp" }
        ];

        const event = randomFrom(events);
        gameplayState.currentChaosEvent = event;
        console.log("[Sự kiện hỗn loạn]", event.name);
        return event;
    }

    function updatePlayerStats(playerName, result) {
        ensurePlayerStats(playerName);
        const stats = playerStats[playerName];
        if (!stats) return null;

        if (result === "completed") {
            stats.completed += 1;
            stats.combo += 1;
            stats.maxCombo = Math.max(stats.maxCombo, stats.combo);
        }

        if (result === "punished") {
            stats.punished += 1;
            stats.combo = 0;
        }

        return stats;
    }

    function getComboMessage(combo) {
        if (combo >= 10) return "Combo huyền thoại x10";
        if (combo >= 5) return "Combo vua x5";
        if (combo >= 3) return "Combo x3";
        return "";
    }

    function addGameHistory(entry) {
        gameHistory.push(entry);
        console.log("[Lịch sử lượt chơi]", entry);
    }

    function getMvp() {
        const entries = Object.entries(playerStats);
        if (!entries.length) return null;

        return entries.sort(([, a], [, b]) => {
            if (b.completed !== a.completed) return b.completed - a.completed;
            return b.maxCombo - a.maxCombo;
        })[0];
    }

    function flashStatus(message, duration = 1700) {
        winnerStrike.innerText = message;
        winnerStrike.classList.add("active");
        setTimeout(() => winnerStrike.classList.remove("active"), duration);
    }

    function removePlayerFromGame(playerName) {
        players = players.map(player => player === playerName ? null : player);
    }

    function buildHistoryEntry(result) {
        const mainQuestion = gameplayState.currentQuestion;
        const questionText = gameplayState.currentQuestionSet
            .map(item => item.text)
            .join(" / ");

        return {
            turn: gameplayState.totalTurns + 1,
            player: currentPlayer,
            actionType: gameplayState.currentActionType,
            question: questionText || mainQuestion?.text || "",
            result,
            rarity: mainQuestion?.rarity || "event",
            difficulty: mainQuestion?.difficulty || "event",
            chaosEvent: gameplayState.currentChaosEvent?.name || null,
            penalty: gameplayState.currentPenalty?.text || null
        };
    }

    function handleModeEndRules(result) {
        if (gameSettings.mode === "elimination" && result === "completed") {
            removePlayerFromGame(currentPlayer);
            const remaining = getActivePlayers();

            if (remaining.length === 1) {
                flashStatus(`${remaining[0]} CHIẾN THẮNG`, 2400);
                setTimeout(() => showPage("setup"), 2400);
                return false;
            }

            if (remaining.length === 0) {
                flashStatus("KHÔNG CÓ NGƯỜI THẮNG", 1800);
                setTimeout(() => showPage("setup"), 1800);
                return false;
            }
        }

        if (gameSettings.mode === "party" && gameplayState.totalTurns > 0 && gameplayState.totalTurns % 10 === 0) {
            const mvp = getMvp();
            if (mvp) {
                const [name, stats] = mvp;
                flashStatus(`Người nổi bật ${name} · ${stats.completed} lượt xong`, 2200);
                console.table(playerStats);
            }
        }

        if (gameSettings.mode === "chaos" && gameplayState.totalTurns > 0 && gameplayState.totalTurns % 5 === 0) {
            gameplayState.chaosEventChance = Math.min(0.75, gameplayState.chaosEventChance + 0.1);
            flashStatus(`Hỗn loạn ${Math.round(gameplayState.chaosEventChance * 100)}%`, 1800);
        }

        return true;
    }

    function clearTurnState() {
        gameplayState.currentActionType = "";
        gameplayState.currentQuestion = null;
        gameplayState.currentQuestionSet = [];
        gameplayState.currentPenalty = null;
        gameplayState.currentChaosEvent = null;
        gameplayState.freePassActive = false;
        gameplayState.punishmentBoostActive = false;
    }

    function endTurn(result) {
        const stats = updatePlayerStats(currentPlayer, result);
        addGameHistory(buildHistoryEntry(result));
        gameplayState.totalTurns += 1;

        const comboMessage = result === "completed" ? getComboMessage(stats?.combo || 0) : "";
        if (comboMessage) flashStatus(comboMessage);

        const shouldContinue = handleModeEndRules(result);
        clearTurnState();
        return shouldContinue;
    }

    // ==========================================
    // NAVIGATION & UI
    // ==========================================
    const pages = {
        home: document.getElementById("pageHome"),
        setup: document.getElementById("pageSetup"),
        slot: document.getElementById("pageSlot"),
        choice: document.getElementById("pageChoice")
    };

    function showPage(pageName) {
        Object.values(pages).forEach(page => page.classList.remove("active"));
        pages[pageName].classList.add("active");
    }

    document.getElementById("btnStartGame").addEventListener("click", () => {
        playSfx("tick");
        playSfx("whoosh");
        if (!ambientStarted) {
            sfx.ambient.play();
            ambientStarted = true;
        }
        showPage("setup");
        document.getElementById("inputPlayer").focus();
    });

    const inputPlayer = document.getElementById("inputPlayer");
    const btnAddPlayer = document.getElementById("btnAddPlayer");
    const tagsContainer = document.getElementById("tagsContainer");

    function addPlayer(name) {
        players.push(name);
        ensurePlayerStats(name);
        playSfx("tick");
        playUiSfx("add");

        const index = players.length - 1;
        const tag = document.createElement("div");
        tag.className = "player-tag";
        tag.id = `tag-${index}`;
        tag.innerHTML = `<span>${name}</span> <span class="remove" data-index="${index}">×</span>`;
        tagsContainer.appendChild(tag);

        animate(tag,
            { opacity: [0, 1], scale: [0.5, 1] },
            { type: "spring", stiffness: 300, damping: 20 }
        );

        tag.querySelector(".remove").addEventListener("click", event => {
            const idx = parseInt(event.target.getAttribute("data-index"), 10);
            players[idx] = null;
            playUiSfx("remove");

            animate(tag,
                { opacity: 0, scale: 0.5, y: -20, rotate: 10 },
                { duration: 0.3 }
            ).then(() => tag.remove());
        });
    }

    function submitPlayerFromInput() {
        if (inputPlayer.value.trim() !== "") {
            const name = inputPlayer.value.trim().toUpperCase();
            if (!players.includes(name)) {
                addPlayer(name);
                inputPlayer.value = "";
                inputPlayer.focus();
            }
        }
    }

    inputPlayer.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            submitPlayerFromInput();
        }
    });

    btnAddPlayer.addEventListener("click", () => {
        submitPlayerFromInput();
    });

    document.getElementById("btnGoSlot").addEventListener("click", () => {
        const activePlayers = getActivePlayers();
        if (activePlayers.length < 2) {
            playUiSfx("denied");
            alert("Cần ít nhất 2 người chơi!");
            return;
        }
        playSfx("tick");
        playSfx("whoosh");
        showPage("slot");
    });

    // ==========================================
    // SLOT MACHINE LOGIC
    // ==========================================
    const btnSpin = document.getElementById("btnSpin");
    const slotContainer = document.getElementById("slotContainer");
    const slotReel = document.getElementById("slotReel");
    const winnerStrike = document.getElementById("winnerStrike");

    function getSlotItemHeight() {
        return slotContainer.getBoundingClientRect().height || 150;
    }

    btnSpin.addEventListener("click", () => {
        const activePlayers = getActivePlayers();
        if (activePlayers.length < 2) {
            playUiSfx("denied");
            alert("Cần ít nhất 2 người chơi!");
            return;
        }

        btnSpin.style.display = "none";
        slotContainer.classList.remove("winner-locked");
        winnerStrike.classList.remove("active");

        playSfx("tick");
        playSfx("heartbeat");

        let slotItems = [];
        for (let i = 0; i < 20; i++) {
            slotItems = slotItems.concat(activePlayers);
        }

        const minSpins = activePlayers.length * 15;
        const randomTarget = minSpins + Math.floor(Math.random() * activePlayers.length);

        slotReel.innerHTML = "";
        slotItems.forEach(player => {
            const div = document.createElement("div");
            div.className = "slot-item";
            div.innerText = player;
            slotReel.appendChild(div);
        });

        const itemHeight = getSlotItemHeight();
        const targetY = -(randomTarget * itemHeight);
        slotReel.style.filter = "blur(5px)";

        animate(slotReel,
            { y: targetY },
            { duration: 6, easing: [0.15, 0.85, 0.1, 1] }
        ).then(() => {
            slotReel.style.filter = "blur(0px)";
            stopSfx("heartbeat");
            playSfx("ding");

            currentPlayer = slotItems[randomTarget];
            ensurePlayerStats(currentPlayer);

            setTimeout(() => {
                playImpactBoom();
                playSfx("crowd");

                winnerStrike.innerText = currentPlayer;
                slotContainer.classList.add("winner-locked");
                winnerStrike.classList.add("active");

                animate(document.body,
                    { x: [-10, 10, -10, 10, 0], y: [-10, 10, -5, 5, 0] },
                    { duration: 0.1 }
                );

                setTimeout(() => {
                    document.getElementById("choicePlayerName").innerText = currentPlayer;
                    showPage("choice");
                    btnSpin.style.display = "block";
                    slotContainer.classList.remove("winner-locked");
                    animate(slotReel, { y: 0 }, { duration: 0 });
                    winnerStrike.classList.remove("active");
                }, 2500);
            }, 300);
        });

        const tickTimings = [
            100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
            1150, 1300, 1500, 1700, 1950, 2200, 2500, 2850, 3200, 3600,
            4100, 4700, 5300, 5900
        ];

        tickTimings.forEach(time => {
            setTimeout(() => playSfx("tickFast"), time);
        });
    });

    // ==========================================
    // CHOICE & MODALS
    // ==========================================
    const modalQuestion = document.getElementById("modalQuestion");
    const modalPenalty = document.getElementById("modalPenalty");
    const qText = document.getElementById("qText");
    const qType = document.getElementById("qType");
    const btnComplete = document.getElementById("btnComplete");
    const btnFail = document.getElementById("btnFail");
    qText.style.whiteSpace = "pre-line";

    function setQuestionButtonsForEvent() {
        btnComplete.innerText = gameplayState.freePassActive ? "Bỏ qua lượt" : "Đã thực hiện";
        btnFail.style.display = gameplayState.freePassActive ? "none" : "";
    }

    function resetQuestionButtons() {
        btnComplete.innerText = "Đã thực hiện";
        btnFail.innerText = "Chịu phạt";
        btnFail.style.display = "";
    }

    function getSubstitutePlayer() {
        const candidates = getActivePlayers().filter(player => player !== currentPlayer);
        if (!candidates.length) return currentPlayer;

        const input = prompt(`Đổi lượt: ${currentPlayer} có thể chỉ định người làm thay.\nChọn: ${candidates.join(", ")}`);
        if (!input) return currentPlayer;

        const normalized = input.trim().toUpperCase();
        return candidates.includes(normalized) ? normalized : currentPlayer;
    }

    function applyChaosToQuestion(actionType) {
        const event = triggerChaosEvent();
        if (!event) return actionType;

        if (event.id === "swap_turn") {
            const originalPlayer = currentPlayer;
            currentPlayer = getSubstitutePlayer();
            document.getElementById("choicePlayerName").innerText = currentPlayer;
            if (currentPlayer !== originalPlayer) {
                flashStatus(`ĐỔI LƯỢT: ${currentPlayer}`, 1400);
            }
        }

        if (event.id === "group_challenge") {
            return "dare";
        }

        if (event.id === "double_dare") {
            return "dare";
        }

        if (event.id === "free_pass") {
            gameplayState.freePassActive = true;
        }

        if (event.id === "punishment_boost") {
            gameplayState.punishmentBoostActive = true;
        }

        return actionType;
    }

    function buildQuestionDisplay(actionType, questionSet) {
        const event = gameplayState.currentChaosEvent;

        if (gameplayState.freePassActive) {
            return {
                title: "VÉ BỎ QUA",
                text: `${currentPlayer} được bỏ qua lượt này.`
            };
        }

        const mainQuestion = questionSet[0];
        const titleBase = actionType === "truth" ? "SỰ THẬT" : "THỬ THÁCH";
        const title = event ? `${event.name.toUpperCase()} · ${titleBase}` : titleBase;

        if (event?.id === "double_dare") {
            return {
                title,
                text: questionSet.map((question, index) => `${index + 1}. ${question.text}`).join("\n")
            };
        }

        if (event?.id === "group_challenge") {
            return {
                title,
                text: `CẢ NHÓM CÙNG LÀM:\n${mainQuestion.text}`
            };
        }

        if (event?.id === "punishment_boost") {
            return {
                title,
                text: `${mainQuestion.text}\n\nNếu xin chịu phạt, hình phạt sẽ ưu tiên mức khó/căng.`
            };
        }

        return {
            title,
            text: mainQuestion.text
        };
    }

    function showQuestion(type) {
        let actionType = normalizeType(type);
        actionType = applyChaosToQuestion(actionType);

        gameplayState.currentActionType = actionType;

        let questionSet = [];
        if (gameplayState.freePassActive) {
            questionSet = [{
                id: `event_free_pass_${gameplayState.totalTurns + 1}`,
                text: `${currentPlayer} dùng vé bỏ qua.`,
                type: actionType,
                difficulty: "event",
                rarity: "event"
            }];
        } else {
            questionSet.push(pickQuestion(actionType));
            if (gameplayState.currentChaosEvent?.id === "double_dare") {
                questionSet.push(pickQuestion("dare"));
            }
        }

        gameplayState.currentQuestionSet = questionSet.filter(Boolean);
        gameplayState.currentQuestion = gameplayState.currentQuestionSet[0] || null;

        const cssType = actionType === "truth" ? "true" : "dare";
        qType.className = `question-type type-${cssType}`;

        const display = buildQuestionDisplay(actionType, gameplayState.currentQuestionSet);
        qType.innerText = display.title;
        qText.innerText = display.text;
        setQuestionButtonsForEvent();

        modalQuestion.classList.add("active");

        const card = modalQuestion.querySelector(".question-card");
        animate(card,
            { y: [100, 0], rotateX: [15, 0], opacity: [0, 1] },
            { duration: 0.4, easing: "ease-out" }
        );
    }

    function handleChoiceClick(event, type) {
        playSfx(type === "truth" ? "trueChime" : "dareBoom");
        const button = event.currentTarget;

        animate(button, { scale: [0.95, 1] }, { duration: 0.3 });
        setTimeout(() => showQuestion(type), 300);
    }

    document.getElementById("btnChooseTrue").addEventListener("click", event => handleChoiceClick(event, "truth"));
    document.getElementById("btnChooseDare").addEventListener("click", event => handleChoiceClick(event, "dare"));

    btnComplete.addEventListener("click", () => {
        playSfx("success");

        fireConfetti({
            particleCount: 20,
            spread: 70,
            origin: { y: 0.6 },
            ticks: 150
        });

        const result = gameplayState.freePassActive ? "free_pass" : "completed";
        const card = modalQuestion.querySelector(".question-card");
        animate(card, { scale: 0.8, opacity: 0 }, { duration: 0.3 }).then(() => {
            modalQuestion.classList.remove("active");
            resetQuestionButtons();
            if (endTurn(result)) showPage("slot");
        });
    });

    btnFail.addEventListener("click", () => {
        playSfx("fail");

        const card = modalQuestion.querySelector(".question-card");
        animate(card, { scale: 0.8, opacity: 0 }, { duration: 0.3 }).then(() => {
            modalQuestion.classList.remove("active");
            resetQuestionButtons();

            setTimeout(() => {
                const penalty = pickQuestion("penalty", gameplayState.punishmentBoostActive ? { difficulties: ["hard", "insane"] } : {});
                gameplayState.currentPenalty = penalty;

                document.getElementById("pText").innerText = gameplayState.punishmentBoostActive
                    ? `HÌNH PHẠT TĂNG CẤP:\n${penalty.text}`
                    : penalty.text;
                modalPenalty.classList.add("active");
                playUiSfx("penaltyReveal");

                const pCard = modalPenalty.querySelector(".question-card");
                animate(pCard,
                    { rotateY: [1080, 0], scale: [0.5, 1], opacity: [0, 1] },
                    { duration: 0.8, easing: [0.1, 0.9, 0.2, 1] }
                );
            }, 300);
        });
    });

    document.getElementById("btnPenaltyDone").addEventListener("click", () => {
        playSfx("tick");
        fireConfetti({ particleCount: 15, spread: 50, colors: ["#ff0000", "#000000"] });

        const pCard = modalPenalty.querySelector(".question-card");
        animate(pCard, { opacity: 0, scale: 0.8 }, { duration: 0.3 }).then(() => {
            modalPenalty.classList.remove("active");
            if (endTurn("punished")) showPage("slot");
        });
    });

    // ==========================================
    // SETTINGS & SOUND CONTROLS
    // ==========================================
    const btnToggleSound = document.getElementById("btnToggleSound");
    const btnSettings = document.getElementById("btnSettings");
    const modalSettings = document.getElementById("modalSettings");
    const btnCloseSettings = document.getElementById("btnCloseSettings");

    function injectGameplaySettings() {
        if (document.getElementById("gameplaySettings")) return;

        const wrapper = document.createElement("div");
        wrapper.id = "gameplaySettings";
        wrapper.className = "settings-gameplay";
        wrapper.innerHTML = `
            <div class="settings-section">
                <div class="settings-label">Nguồn dữ liệu sử dụng</div>
                <div class="data-source-grid">
                    <label class="data-source-option">
                        <input class="data-source-toggle" type="checkbox" value="default" ${gameSettings.useDefaultData ? "checked" : ""}>
                        <span>Dữ liệu có sẵn</span>
                    </label>
                    <label class="data-source-option">
                        <input class="data-source-toggle" type="checkbox" value="custom" ${gameSettings.useCustomData ? "checked" : ""}>
                        <span>Dữ liệu tự nhập</span>
                    </label>
                </div>
            </div>
            <div class="settings-section custom-data-section">
                <div class="settings-label">Tự nhập câu hỏi / thử thách / phạt</div>
                <div class="settings-hint">Mỗi dòng là 1 câu. Câu tự nhập được trộn vào lượt chơi nếu bật nguồn tự nhập.</div>
                <textarea class="custom-question-input" data-custom-type="truth" placeholder="Nhập Sự Thật...">${escapeHtml(gameSettings.customText.truth)}</textarea>
                <textarea class="custom-question-input" data-custom-type="dare" placeholder="Nhập Thử Thách...">${escapeHtml(gameSettings.customText.dare)}</textarea>
                <textarea class="custom-question-input" data-custom-type="penalty" placeholder="Nhập Hình Phạt...">${escapeHtml(gameSettings.customText.penalty)}</textarea>
            </div>
            <div class="settings-section">
                <div class="settings-label">Chế độ chơi</div>
                <div class="mode-grid">
                    ${[
                        ["normal", "Chơi thường"],
                        ["elimination", "Chơi loại"],
                        ["party", "Tiệc vui"],
                        ["chaos", "Hỗn loạn"]
                    ].map(([value, label]) => `
                        <label class="mode-option">
                            <input class="mode-toggle" type="radio" name="gameMode" value="${value}" ${gameSettings.mode === value ? "checked" : ""}>
                            <span>${label}</span>
                        </label>
                    `).join("")}
                </div>
            </div>
            <div class="settings-section">
                <div class="settings-label">Độ khó câu hỏi</div>
                <div class="difficulty-grid">
                    ${difficulties.map(difficulty => `
                        <label class="difficulty-option">
                            <input class="difficulty-toggle" type="checkbox" value="${difficulty}" ${gameSettings.selectedDifficulties.includes(difficulty) ? "checked" : ""}>
                            <span>${difficultyLabels[difficulty]}</span>
                        </label>
                    `).join("")}
                </div>
            </div>
        `;

        btnCloseSettings.parentNode.insertBefore(wrapper, btnCloseSettings);

        document.querySelectorAll(".data-source-toggle").forEach(toggle => {
            toggle.addEventListener("change", () => {
                playUiSfx("toggle");
                gameSettings.useDefaultData = document.querySelector('.data-source-toggle[value="default"]').checked;
                gameSettings.useCustomData = document.querySelector('.data-source-toggle[value="custom"]').checked;

                if (!gameSettings.useDefaultData && !gameSettings.useCustomData) {
                    gameSettings.useDefaultData = true;
                    document.querySelector('.data-source-toggle[value="default"]').checked = true;
                }

                resetUsedQuestions("truth");
                resetUsedQuestions("dare");
                resetUsedQuestions("penalty");
                console.log("[Nguồn dữ liệu]", {
                    useDefaultData: gameSettings.useDefaultData,
                    useCustomData: gameSettings.useCustomData
                });
            });
        });

        document.querySelectorAll(".custom-question-input").forEach(input => {
            input.addEventListener("input", event => {
                const type = event.target.dataset.customType;
                gameSettings.customText[type] = event.target.value;
                resetUsedQuestions(type);
            });
        });

        document.querySelectorAll(".mode-toggle").forEach(toggle => {
            toggle.addEventListener("change", event => {
                if (!event.target.checked) return;
                playUiSfx("toggle");
                gameSettings.mode = event.target.value;
                console.log("[Cài đặt trò chơi]", gameSettings);
            });
        });

        document.querySelectorAll(".difficulty-toggle").forEach(toggle => {
            toggle.addEventListener("change", () => {
                playUiSfx("toggle");
                gameSettings.selectedDifficulties = Array.from(document.querySelectorAll(".difficulty-toggle:checked"))
                    .map(item => item.value);
                console.log("[Cài đặt trò chơi]", gameSettings);
            });
        });
    }

    if (btnToggleSound) {
        btnToggleSound.addEventListener("click", () => {
            isMuted = !isMuted;
            btnToggleSound.innerText = isMuted ? "🔇" : "🔊";

            const sfxKeys = Object.keys(sfx).filter(key => key !== "ambient");
            sfxKeys.forEach(key => {
                sfx[key].mute(isMuted);
            });
            sfx.ambient.mute(isMuted);
            if (!isMuted) playUiSfx("toggle");
        });
    }

    if (btnSettings) {
        btnSettings.addEventListener("click", () => {
            injectGameplaySettings();
            playSfx("whoosh");
            modalSettings.classList.add("active");

            const card = modalSettings.querySelector(".question-card");
            animate(card,
                { y: [50, 0], scale: [0.9, 1], opacity: [0, 1] },
                { duration: 0.3, easing: "ease-out" }
            );
        });
    }

    btnCloseSettings.addEventListener("click", () => {
        playSfx("tick");
        const card = modalSettings.querySelector(".question-card");
        animate(card, { scale: 0.9, opacity: 0 }, { duration: 0.2 }).then(() => {
            modalSettings.classList.remove("active");
        });
    });

    window.BanCoDamChoiGameplay = {
        questionBank,
        usedQuestions,
        gameSettings,
        playerStats,
        gameHistory,
        get players() {
            return getActivePlayers();
        },
        get state() {
            return gameplayState;
        },
        getAvailableQuestions,
        pickRarity,
        pickQuestion,
        markQuestionUsed,
        resetUsedQuestions,
        applyDifficultyFilter,
        triggerChaosEvent,
        updatePlayerStats,
        addGameHistory,
        endTurn
    };
});
