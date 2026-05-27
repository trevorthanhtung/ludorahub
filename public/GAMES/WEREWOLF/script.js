const screens = document.querySelectorAll(".screen");
const phaseTransition = document.getElementById("phaseTransition");
const playerNameInput = document.getElementById("playerName");
const playerList = document.getElementById("playerList");
const gamePlayers = document.getElementById("gamePlayers");
const voteGrid = document.getElementById("voteGrid");
const timerEl = document.getElementById("timer");
const phaseTitle = document.getElementById("phaseTitle");
const phaseText = document.getElementById("phaseText");
const phaseLabel = document.getElementById("phaseLabel");
const hostText = document.getElementById("hostText");
const setupTitle = document.getElementById("setupTitle");
const setupSubtitle = document.getElementById("setupSubtitle");
const modeBadge = document.getElementById("modeBadge");
const langEnBtn = document.getElementById("langEnBtn");
const langViBtn = document.getElementById("langViBtn");
const soundToggle = document.getElementById("soundToggle");
const soundToggleText = document.getElementById("soundToggleText");
const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");
const roleSummary = document.getElementById("roleSummary");
const wolfPlanText = document.getElementById("wolfPlanText");
const wolfRuleText = document.getElementById("wolfRuleText");
const discussionTimeInput = document.getElementById("discussionTime");
const rebuttalTimeInput = document.getElementById("rebuttalTime");
const voteTimeInput = document.getElementById("voteTime");
const roleToggleButtons = {
  seer: document.getElementById("seerToggle"),
  doctor: document.getElementById("doctorToggle"),
  hunter: document.getElementById("hunterToggle"),
  fox: document.getElementById("foxToggle"),
  jester: document.getElementById("jesterToggle")
};

const roleImages = [
  "assest/hunter.png",
  "assest/villager.png",
  "assest/seer.png",
  "assest/doctor.png",
  "assest/werewolf.png",
  "assest/alphawolf.png",
  "assest/fox.png",
  "assest/jester.png"
];

const roles = ["Hunter", "Villager", "Seer", "Doctor", "Werewolf", "Alpha Wolf", "Fox", "Jester"];

const maxPlayers = 15;
const wolfRules = {
  4: { werewolf: 1, alphaWolf: 0 },
  5: { werewolf: 1, alphaWolf: 0 },
  6: { werewolf: 2, alphaWolf: 0 },
  7: { werewolf: 2, alphaWolf: 0 },
  8: { werewolf: 1, alphaWolf: 1 },
  9: { werewolf: 1, alphaWolf: 1 },
  10: { werewolf: 2, alphaWolf: 1 },
  11: { werewolf: 2, alphaWolf: 1 },
  12: { werewolf: 2, alphaWolf: 1 },
  13: { werewolf: 3, alphaWolf: 1 },
  14: { werewolf: 3, alphaWolf: 1 },
  15: { werewolf: 3, alphaWolf: 1 }
};
const specialRoleOrder = ["seer", "doctor", "hunter", "fox", "jester"];

const dictionary = {
  en: {
    directTitle: "Direct Play",
    directSubtitle: "Play with a human game master",
    directDescription: "Players gather together and one person acts as the moderator. Set the first-game roles, timers and player list before starting.",
    playDirect: "Play Direct",
    wifiTitle: "Local WiFi",
    wifiSubtitle: "Device acts as AI game master",
    wifiDescription: "Players connect through the same Wi-Fi network. The system manages roles, day/night cycle, voting and game flow.",
    playLocal: "Play Local",
    add: "Add",
    emptyPlayers: "Add players manually to start the game.",
    firstGameConfig: "First Game Setup",
    firstGameHint: "Set roles and speaking timers before starting.",
    werewolfCount: "Werewolves",
    wolfTeam: "Wolf Team",
    wolfWaiting: "Add 4-15 players",
    wolfRuleHint: "Auto-locked by player count.",
    wolfRole: "Werewolf",
    alphaWolf: "Alpha Wolf",
    seer: "Seer",
    doctor: "Doctor",
    hunter: "Hunter",
    fox: "Fox",
    jester: "Jester",
    villagerAuto: "Villagers auto-fill the remaining seats.",
    timingConfig: "Speaking Time",
    timingHint: "Used for discussion, rebuttal and voting.",
    discussionTime: "Discussion",
    rebuttalTime: "Rebuttal",
    voteTime: "Voting",
    roleCard: "Role Card",
    timer: "Timer",
    vote: "Vote",
    startGame: "Start Game",
    specialRole: "Special Role",
    nextPhase: "Next Phase",
    villageVote: "Village Vote",
    voteDescription: "Choose the player the village suspects most.",
    confirmVote: "Confirm Vote",
    settings: "Settings",
    settingsTitle: "Game Settings",
    settingsSubtitle: "Tune language and sound for the table before the night begins.",
    language: "Language",
    languageHint: "Switch interface text between English and Vietnamese.",
    sound: "Sound",
    soundHint: "Forest ambience, soft clicks, whoosh transitions and role effects.",
    volume: "Volume",
    saveSettings: "Save Settings",
    on: "On",
    off: "Off",
    playerPlaceholder: "Enter player name",
    needMinPlayers: "Need at least 4 players to start.",
    maxPlayers: "Maximum 15 players for this role table.",
    rolesTooMany: "Selected roles exceed the player count. Keep at least 1 villager.",
    rolesAdjusted: "Some roles were turned off because there are not enough seats.",
    roleCardAlert: "Role Card",
    noVote: "Choose a player to vote.",
    eliminated: "has been eliminated.",
    votes: "votes",
    nightLabel: "🌙 Night",
    dayLabel: "☀ Day",
    discussionLabel: "☀ Discussion",
    rebuttalLabel: "☀ Rebuttal",
    voteLabel: "☀ Vote",
    nightTitle: "🌙 NIGHT",
    dayTitle: "☀ DAY",
    discussionTitle: "☀ DISCUSSION",
    rebuttalTitle: "☀ REBUTTAL",
    votePhaseTitle: "☀ VOTE",
    nightText: "Werewolves are hunting...",
    dayText: "Discuss and vote",
    discussionText: "Discuss and read the table.",
    rebuttalText: "Final defense before voting.",
    votePhaseText: "Choose who the village suspects most.",
    hostWifiNight: "AI Host is guiding the night cycle. Special roles may act now.",
    hostDirectNight: "The moderator may call roles in order. Keep your eyes closed.",
    hostDay: "The sun rises. Read the room, discuss clues, and choose carefully.",
    hostDiscussion: "Discussion timer is running. Let the table speak.",
    hostRebuttal: "Each suspect gets a short defense before the vote.",
    hostVote: "Voting is open. Confirm the village decision when ready.",
    specialRoleTriggered: "A special role effect has been triggered.",
    playersCount: "{n} Players",
    roleGuideBtn: "Guide",
    roleGuideTitle: "Role Guide",
    closeBtn: "Close",
    revealTitle: "Receive Role",
    revealInstructions: "Pass the device to the player above.",
    holdToReveal: "Hold to reveal",
    understoodNext: "Got it, next player",
    startNightPhase: "Start Night Phase"
  },
  vi: {
    directTitle: "Chơi Trực Tiếp",
    directSubtitle: "Quản trò thủ công",
    directDescription: "Người chơi ngồi cùng nhau và một người làm quản trò. Thiết lập vai ván đầu, thời gian và danh sách người chơi trước khi bắt đầu.",
    playDirect: "Chơi Trực Tiếp",
    wifiTitle: "WiFi Nội Bộ",
    wifiSubtitle: "Quản trò máy",
    wifiDescription: "Người chơi kết nối cùng mạng Wi-Fi. Hệ thống tự động quản lý vai trò, chu kỳ ngày/đêm, bỏ phiếu và toàn bộ tiến trình trò chơi.",
    playLocal: "Chơi WiFi",
    add: "Thêm",
    emptyPlayers: "Danh sách người chơi sẽ hiển thị tại đây.",
    firstGameConfig: "Thiết Lập Ván Chơi",
    firstGameHint: "Tùy chỉnh vai trò và các thiết lập trước khi bắt đầu trò chơi.",
    werewolfCount: "Ma Sói",
    wolfTeam: "Phe Sói",
    wolfWaiting: "Yêu cầu từ 4-15 người chơi",
    wolfRuleHint: "Tự động mở khóa theo số lượng người chơi ·",
    wolfRole: "Ma Sói",
    alphaWolf: "Sói Alpha",
    seer: "Tiên Tri",
    doctor: "Bảo Vệ",
    hunter: "Thợ Săn",
    fox: "Cáo",
    jester: "Hề",
    villagerAuto: "Các vai trò còn lại sẽ là Dân Làng.",
    timingConfig: "Thiết Lập Thời Gian",
    timingHint: "Cài đặt thời lượng cho từng giai đoạn thảo luận.",
    discussionTime: "Thảo Luận Chung",
    rebuttalTime: "Phản Biện",
    voteTime: "Bỏ Phiếu",
    roleCard: "Thẻ Vai",
    timer: "Hẹn Giờ",
    vote: "Bỏ Phiếu",
    startGame: "Bắt Đầu",
    specialRole: "Vai Đặc Biệt",
    nextPhase: "Chuyển Pha",
    villageVote: "Bỏ Phiếu Làng",
    voteDescription: "Chọn người mà cả làng nghi ngờ nhất.",
    confirmVote: "Xác Nhận",
    settings: "Cài Đặt",
    settingsTitle: "Cài Đặt Game",
    settingsSubtitle: "Chỉnh ngôn ngữ và âm thanh trước khi màn đêm bắt đầu.",
    language: "Ngôn Ngữ",
    languageHint: "Đổi giao diện giữa tiếng Việt và tiếng Anh.",
    sound: "Âm Thanh",
    soundHint: "Ambience rừng, click nhẹ, whoosh chuyển cảnh và hiệu ứng vai.",
    volume: "Âm Lượng",
    saveSettings: "Lưu Thay Đổi",
    on: "Bật",
    off: "Tắt",
    playerPlaceholder: "Nhập tên người chơi...",
    needMinPlayers: "Cần ít nhất 4 người chơi để bắt đầu.",
    maxPlayers: "Bảng vai hiện hỗ trợ tối đa 15 người chơi.",
    rolesTooMany: "Số vai đã chọn vượt quá số người chơi. Cần chừa ít nhất 1 Dân làng.",
    rolesAdjusted: "Một vài vai đã được tắt vì không đủ chỗ.",
    roleCardAlert: "Thẻ vai",
    noVote: "Hãy chọn một người để vote.",
    eliminated: "đã bị loại.",
    votes: "phiếu",
    nightLabel: "🌙 Đêm",
    dayLabel: "☀ Ngày",
    discussionLabel: "☀ Tranh Luận",
    rebuttalLabel: "☀ Phản Biện",
    voteLabel: "☀ Bỏ Phiếu",
    nightTitle: "🌙 ĐÊM",
    dayTitle: "☀ NGÀY",
    discussionTitle: "☀ TRANH LUẬN",
    rebuttalTitle: "☀ PHẢN BIỆN",
    votePhaseTitle: "☀ BỎ PHIẾU",
    nightText: "Ma sói đang săn mồi...",
    dayText: "Thảo luận và bỏ phiếu",
    discussionText: "Cả làng tranh luận và đọc tình hình.",
    rebuttalText: "Người bị nghi ngờ có lượt phản biện cuối.",
    votePhaseText: "Chọn người mà cả làng nghi ngờ nhất.",
    hostWifiNight: "AI Host đang dẫn pha đêm. Các vai đặc biệt có thể hành động.",
    hostDirectNight: "Quản trò gọi từng vai theo lượt. Mọi người nhắm mắt.",
    hostDay: "Mặt trời lên. Hãy đọc tình hình, thảo luận manh mối và chọn cẩn thận.",
    hostDiscussion: "Đồng hồ tranh luận đang chạy. Cả bàn cùng nói và lắng nghe.",
    hostRebuttal: "Cho người bị nghi ngờ phản biện ngắn trước khi bỏ phiếu.",
    hostVote: "Đã tới lượt bỏ phiếu. Xác nhận quyết định của làng khi sẵn sàng.",
    specialRoleTriggered: "Hiệu ứng vai đặc biệt đã được kích hoạt.",
    playersCount: "{n}/15 Người Chơi",
    roleGuideBtn: "Hướng dẫn",
    roleGuideTitle: "Hướng Dẫn Vai Trò",
    closeBtn: "Đóng",
    revealTitle: "Nhận Vai Trò",
    revealInstructions: "Hãy đưa máy cho người có tên ở trên.",
    holdToReveal: "Nhấn giữ để xem",
    understoodNext: "Đã hiểu, chuyển máy",
    startNightPhase: "Bắt đầu Đêm Đầu Tiên"
  }
};

let players = [];
let votes = {};
let eliminated = new Set();
let playerRoles = {};
let currentPlayerRevealIndex = 0;
let currentMode = "direct";
let phase = "night";
let timeLeft = 30;
let firstGameConfig = {
  werewolf: 0,
  alphaWolf: 0,
  seer: true,
  doctor: true,
  hunter: false,
  fox: false,
  jester: false,
  discussion: 180,
  rebuttal: 45,
  vote: 60
};
let timerId = null;
let audioCtx = null;
let ambienceNodes = [];
let ambienceMaster = null;
let settingsReturnScreen = "homeScreen";
let settings = loadSettings();

function showScreen(id) {
  screens.forEach(screen => screen.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  softSound("click");

  if (id === "setupScreen") renderPlayers();
  if (id === "gameScreen") renderGamePlayers();
  if (id === "voteScreen") {
    votes = {};
    renderVotePlayers();
  }
}

function t(key) {
  return dictionary[settings.language][key] || dictionary.en[key] || key;
}

function loadSettings() {
  const fallback = { language: "vi", sound: true, volume: 0.8 };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem("werewolfSettings")) };
  } catch (error) {
    return fallback;
  }
}

function saveSettings() {
  localStorage.setItem("werewolfSettings", JSON.stringify(settings));
}

function openSettings(fromScreen = "homeScreen") {
  settingsReturnScreen = fromScreen;
  showScreen("settingsScreen");
}

function closeSettings() {
  saveSettings();
  showScreen(settingsReturnScreen);
}

function setLanguage(language) {
  settings.language = language;
  saveSettings();
  applySettings();
  softSound("click");
}

function toggleSound() {
  settings.sound = !settings.sound;
  saveSettings();
  if (settings.sound) initAudio();
  applySettings();
  softSound("click");
}

function setVolume(value) {
  settings.volume = Number(value) / 100;
  saveSettings();
  applySettings();
}

function applySettings() {
  document.documentElement.lang = settings.language === "vi" ? "vi" : "en";
  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });

  playerNameInput.placeholder = t("playerPlaceholder");
  langEnBtn.classList.toggle("active", settings.language === "en");
  langViBtn.classList.toggle("active", settings.language === "vi");

  soundToggle.classList.toggle("is-on", settings.sound);
  soundToggle.setAttribute("aria-pressed", String(settings.sound));
  soundToggleText.textContent = settings.sound ? t("on") : t("off");
  volumeSlider.value = Math.round(settings.volume * 100);
  volumeValue.textContent = `${volumeSlider.value}%`;

  if (ambienceMaster) {
    ambienceMaster.gain.value = settings.sound ? 0.028 * settings.volume : 0;
  }

  updateModeText();
  updatePhaseCopy();
  updateFirstGameUI();
  renderPlayers();
  if (document.getElementById("voteScreen").classList.contains("active")) renderVotePlayers();
}

function updateModeText() {
  if (currentMode === "direct") {
    setupTitle.textContent = t("directTitle");
    setupSubtitle.textContent = t("directSubtitle");
    modeBadge.textContent = t("directTitle");
  } else {
    setupTitle.textContent = t("wifiTitle");
    setupSubtitle.textContent = t("wifiSubtitle");
    modeBadge.textContent = t("wifiTitle");
  }
}

function updatePhaseCopy() {
  if (phase === "night") {
    phaseTitle.textContent = t("nightTitle");
    phaseLabel.textContent = t("nightLabel");
    phaseText.textContent = t("nightText");
    hostText.textContent = currentMode === "wifi" ? t("hostWifiNight") : t("hostDirectNight");
    return;
  }

  if (phase === "rebuttal") {
    phaseTitle.textContent = t("rebuttalTitle");
    phaseLabel.textContent = t("rebuttalLabel");
    phaseText.textContent = t("rebuttalText");
    hostText.textContent = t("hostRebuttal");
    return;
  }

  if (phase === "vote") {
    phaseTitle.textContent = t("votePhaseTitle");
    phaseLabel.textContent = t("voteLabel");
    phaseText.textContent = t("votePhaseText");
    hostText.textContent = t("hostVote");
    return;
  }

  phaseTitle.textContent = t("discussionTitle");
  phaseLabel.textContent = t("discussionLabel");
  phaseText.textContent = t("discussionText");
  hostText.textContent = t("hostDiscussion");
}

function chooseMode(mode) {
  currentMode = mode;
  updateModeText();
  softSound(mode === "direct" ? "wolf" : "magic");
  showScreen("setupScreen");
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function getWolfRule(playerCount = players.length) {
  return wolfRules[playerCount] || { werewolf: 0, alphaWolf: 0 };
}

function getRequiredWolfCount(playerCount = players.length) {
  const rule = getWolfRule(playerCount);
  return rule.werewolf + rule.alphaWolf;
}

function wolfRoleCount() {
  return firstGameConfig.werewolf + firstGameConfig.alphaWolf;
}

function autoAllocateWolves() {
  const required = getRequiredWolfCount();
  const current = wolfRoleCount();
  if (required === 0) {
    firstGameConfig.werewolf = 0;
    firstGameConfig.alphaWolf = 0;
    return;
  }
  
  if (current !== required) {
    const rule = getWolfRule();
    firstGameConfig.werewolf = rule.werewolf;
    firstGameConfig.alphaWolf = rule.alphaWolf;
  }
}

function changeWolf(role, delta) {
  const otherRole = role === 'werewolf' ? 'alphaWolf' : 'werewolf';
  const required = getRequiredWolfCount();
  if (required === 0) return;
  
  const newVal = firstGameConfig[role] + delta;
  const newOtherVal = firstGameConfig[otherRole] - delta;
  
  if (newVal >= 0 && newOtherVal >= 0 && (newVal + newOtherVal === required)) {
    firstGameConfig[role] = newVal;
    firstGameConfig[otherRole] = newOtherVal;
    updateFirstGameUI();
    softSound("click");
  } else {
    softSound("thump");
  }
}

function enforceRoleLimits(changedRole = "") {
  const wolfCount = wolfRoleCount();
  const maxSpecialRoles = Math.max(0, players.length - wolfCount - 1);

  if (changedRole && firstGameConfig[changedRole] && selectedSpecialRoles().length > maxSpecialRoles) {
    firstGameConfig[changedRole] = false;
    alert(t("rolesTooMany"));
    return;
  }

  let adjusted = false;
  for (const role of [...specialRoleOrder].reverse()) {
    if (selectedSpecialRoles().length <= maxSpecialRoles) break;
    if (firstGameConfig[role]) {
      firstGameConfig[role] = false;
      adjusted = true;
    }
  }

  if (adjusted && players.length > 0) softSound("thump");
}

function selectedSpecialRoles() {
  return specialRoleOrder.filter(role => firstGameConfig[role]);
}

function selectedRoleCount() {
  if (!wolfRules[players.length]) return 0;
  return wolfRoleCount() + selectedSpecialRoles().length;
}

function updateFirstGameUI() {
  autoAllocateWolves();
  enforceRoleLimits();

  const hasWolfRule = Boolean(wolfRules[players.length]);
  const wolfCount = wolfRoleCount();
  const specialSlotsLeft = Math.max(0, players.length - wolfCount - 1 - selectedSpecialRoles().length);
  
  const manualConfig = document.getElementById("wolfManualConfig");
  if (hasWolfRule) {
    wolfPlanText.style.display = "none";
    wolfRuleText.style.display = "none";
    manualConfig.style.display = "block";
    document.getElementById("wwCount").textContent = firstGameConfig.werewolf;
    document.getElementById("awCount").textContent = firstGameConfig.alphaWolf;
  } else {
    wolfPlanText.style.display = "inline";
    wolfRuleText.style.display = "inline";
    manualConfig.style.display = "none";
    wolfPlanText.textContent = t("wolfWaiting");
    wolfRuleText.textContent = `${t("wolfRuleHint")} ${players.length}/${maxPlayers}`;
  }

  discussionTimeInput.value = firstGameConfig.discussion;
  rebuttalTimeInput.value = firstGameConfig.rebuttal;
  voteTimeInput.value = firstGameConfig.vote;

  Object.entries(roleToggleButtons).forEach(([role, button]) => {
    const isOn = firstGameConfig[role];
    const isDisabled = !hasWolfRule || (!isOn && specialSlotsLeft <= 0);
    button.classList.toggle("is-on", isOn);
    button.classList.toggle("is-disabled", isDisabled);
    button.disabled = isDisabled;
    button.setAttribute("aria-pressed", String(isOn));
  });

  roleSummary.textContent = t("playersCount").replace("{n}", players.length);
  roleSummary.classList.toggle("is-warning", selectedRoleCount() > players.length || !wolfRules[players.length]);
}

function updateFirstGameConfig(key, value) {
  const limits = {
    discussion: [30, 900],
    rebuttal: [15, 300],
    vote: [15, 300]
  }[key];

  if (!limits) return;
  firstGameConfig[key] = clampNumber(value, limits[0], limits[1]);
  updateFirstGameUI();
}

function toggleRole(role) {
  if (!specialRoleOrder.includes(role)) return;
  firstGameConfig[role] = !firstGameConfig[role];
  enforceRoleLimits(role);
  updateFirstGameUI();
  softSound("click");
}

function addPlayer() {
  const name = playerNameInput.value.trim();
  if (!name) return;
  if (players.length >= maxPlayers) {
    alert(t("maxPlayers"));
    return;
  }

  players.push(name);
  playerNameInput.value = "";
  renderPlayers();
  softSound("click");
}

function removePlayer(index) {
  players.splice(index, 1);
  renderPlayers();
  softSound("click");
}

function renderPlayers() {
  updateFirstGameUI();
  if (!players.length) {
    playerList.innerHTML = `<div class="empty-list">${t("emptyPlayers")}</div>`;
    return;
  }

  playerList.innerHTML = players.map((name, index) => `
    <button class="player-chip" type="button" onclick="removePlayer(${index})">
      <span>👤</span>
      <span>${escapeHTML(name)}</span>
    </button>
  `).join("");
}

function startGame() {
  if (players.length < 4) {
    alert(t("needMinPlayers"));
    return;
  }

  if (!wolfRules[players.length] || selectedRoleCount() > players.length) {
    alert(t("rolesTooMany"));
    return;
  }

  // Generate Deck
  let deck = [];
  for (let i = 0; i < firstGameConfig.werewolf; i++) deck.push("wolfRole");
  for (let i = 0; i < firstGameConfig.alphaWolf; i++) deck.push("alphaWolf");
  selectedSpecialRoles().forEach(role => deck.push(role));
  
  while (deck.length < players.length) deck.push("villager");
  
  // Shuffle Deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  playerRoles = {};
  players.forEach((name, i) => {
    playerRoles[name] = deck[i];
  });

  currentPlayerRevealIndex = 0;
  showRoleReveal();
}

function showRoleReveal() {
  showScreen("roleRevealScreen");
  renderRoleReveal();
}

function renderRoleReveal() {
  if (currentPlayerRevealIndex >= players.length) {
    startNightPhase();
    return;
  }
  
  const playerName = players[currentPlayerRevealIndex];
  document.getElementById("revealPlayerName").textContent = playerName;
  
  const roleId = playerRoles[playerName];
  const roleObj = roleGuides.find(r => r.id === roleId);
  const roleTitle = roleObj && roleObj.title ? roleObj.title[settings.language] : t(roleId);
  
  const imageMap = {
    villager: "assest/villager.png",
    seer: "assest/seer.png",
    doctor: "assest/doctor.png",
    hunter: "assest/hunter.png",
    fox: "assest/fox.png",
    wolfRole: "assest/werewolf.png",
    alphaWolf: "assest/alphawolf.png",
    jester: "assest/jester.png"
  };
  
  document.getElementById("revealRoleImg").src = imageMap[roleId] || "assest/villager.png";
  document.getElementById("revealRoleName").textContent = roleTitle;
  
  document.getElementById("roleRevealCard").classList.remove("is-revealed");
  
  const nextBtn = document.getElementById("nextRevealBtn");
  if (currentPlayerRevealIndex === players.length - 1) {
    nextBtn.innerHTML = `<span data-i18n="startNightPhase">${t("startNightPhase")}</span>`;
  } else {
    nextBtn.innerHTML = `<span data-i18n="understoodNext">${t("understoodNext")}</span>`;
  }
}

function startReveal(event) {
  event.preventDefault();
  document.getElementById("roleRevealCard").classList.add("is-revealed");
  softSound("magic");
}

function stopReveal(event) {
  event.preventDefault();
  document.getElementById("roleRevealCard").classList.remove("is-revealed");
}

function nextRoleReveal() {
  currentPlayerRevealIndex++;
  softSound("click");
  renderRoleReveal();
}

function startNightPhase() {
  eliminated = new Set();
  phase = "night";
  timeLeft = 30;
  announcePhase("night");
  showScreen("gameScreen");
  startTimer();
}

function drawRole() {
  const role = roles[Math.floor(Math.random() * roles.length)];
  softSound(role.includes("Werewolf") || role.includes("Wolf") ? "wolf" : "magic");
  alert(`${t("roleCardAlert")}: ${role}`);
}

function toggleTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    startTimer();
  }
  softSound("click");
}

function startTimer() {
  clearInterval(timerId);
  timerEl.textContent = timeLeft;
  timerId = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) nextPhase();
  }, 1000);
}

function nextPhase() {
  const flow = {
    night: ["discussion", firstGameConfig.discussion],
    discussion: ["rebuttal", firstGameConfig.rebuttal],
    rebuttal: ["vote", firstGameConfig.vote],
    vote: ["night", 30]
  };
  const [next, seconds] = flow[phase] || flow.night;
  phase = next;
  timeLeft = seconds;
  announcePhase(phase);
  renderGamePlayers();
  startTimer();
}

function announcePhase(next) {
  const isNight = next === "night";
  document.body.classList.toggle("day", !isNight);
  document.body.classList.toggle("night", isNight);

  phaseTransition.textContent = isNight ? "NIGHT" : "DAY";
  phaseTransition.className = `phase-transition show-${isNight ? "night" : "day"}`;
  setTimeout(() => {
    phaseTransition.className = "phase-transition";
  }, 1300);

  updatePhaseCopy();
  softSound(isNight ? "wolf" : "whoosh");
}

function renderGamePlayers() {
  gamePlayers.innerHTML = players.map((name, index) => avatarCard(name, index)).join("");
}

function renderVotePlayers() {
  voteGrid.innerHTML = players.map((name, index) => avatarCard(name, index, true)).join("");
}

function avatarCard(name, index, votable = false) {
  const image = roleImages[index % roleImages.length];
  const deadClass = eliminated.has(name) ? " eliminated" : "";
  const voteText = votable ? `<em>${votes[name] || 0} ${t("votes")}</em>` : "";
  const click = votable ? `onclick="voteFor('${escapeAttr(name)}')"` : "";

  return `
    <button class="avatar-card${deadClass}" type="button" ${click}>
      <img src="${image}" alt="${escapeHTML(name)}">
      <strong>${escapeHTML(name)}</strong>
      ${voteText}
    </button>
  `;
}

function voteFor(name) {
  if (eliminated.has(name)) return;

  votes[name] = (votes[name] || 0) + 1;
  renderVotePlayers();

  const cards = [...voteGrid.querySelectorAll(".avatar-card")];
  const card = cards.find(item => item.textContent.includes(name));
  if (card) card.classList.add("selected");

  softSound("vote");
}

function confirmVote() {
  const entries = Object.entries(votes);
  if (!entries.length) {
    alert(t("noVote"));
    return;
  }

  const [victim] = entries.sort((a, b) => b[1] - a[1])[0];
  eliminated.add(victim);
  softSound("thump");
  alert(`${victim} ${t("eliminated")}`);
  showScreen("gameScreen");
}

function playSpecialRole() {
  softSound("magic");
  hostText.textContent = t("specialRoleTriggered");
}

function initAudio() {
  if (!settings.sound) return;
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  audioCtx = new AudioContext();
  startAmbience();
}

function startAmbience() {
  if (!audioCtx || ambienceNodes.length) return;

  const master = audioCtx.createGain();
  master.gain.value = settings.sound ? 0.028 * settings.volume : 0;
  master.connect(audioCtx.destination);
  ambienceMaster = master;

  const wind = audioCtx.createOscillator();
  const windGain = audioCtx.createGain();
  wind.type = "sine";
  wind.frequency.value = 72;
  windGain.gain.value = 0.2;
  wind.connect(windGain).connect(master);
  wind.start();

  const air = audioCtx.createOscillator();
  const airGain = audioCtx.createGain();
  air.type = "triangle";
  air.frequency.value = 190;
  airGain.gain.value = 0.025;
  air.connect(airGain).connect(master);
  air.start();

  ambienceNodes = [wind, air, master];
}

function softSound(type) {
  if (!settings.sound) return;
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const gain = audioCtx.createGain();
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const preset = {
    click: [420, 0.04, 0.04, "triangle"],
    vote: [720, 0.09, 0.06, "square"],
    whoosh: [220, 0.34, 0.045, "sawtooth"],
    wolf: [74, 0.5, 0.09, "sawtooth"],
    magic: [880, 0.18, 0.05, "sine"],
    thump: [92, 0.18, 0.08, "sine"]
  }[type] || [420, 0.04, 0.04, "triangle"];

  osc.type = preset[3];
  osc.frequency.setValueAtTime(preset[0], now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(36, preset[0] * 0.48), now + preset[1]);

  filter.type = "lowpass";
  filter.frequency.value = type === "magic" ? 1600 : 760;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(preset[2] * settings.volume, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + preset[1]);

  osc.connect(filter).connect(gain).connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + preset[1] + 0.02);
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHTML(String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'"));
}

document.addEventListener("pointerdown", initAudio, { once: true });
document.addEventListener("pointerover", event => {
  if (event.target.closest("button, .mode-card, .avatar-card")) softSound("click");
});
playerNameInput.addEventListener("keydown", event => {
  if (event.key === "Enter") addPlayer();
});

applySettings();
renderPlayers();

const roleGuides = [
  { id: "villager", desc: { vi: "Phe Dân làng. Không có kỹ năng. Chỉ suy luận, thảo luận và vote treo cổ.", en: "Village faction. No special abilities. Only deduces, discusses, and votes." }, title: { vi: "Dân Làng", en: "Villager" } },
  { id: "seer", desc: { vi: "Phe Dân làng. Mỗi đêm chọn 1 người để soi. Biết người đó thuộc phe Sói hay không phải Sói.", en: "Village faction. Checks 1 player each night to see if they are a Wolf or not." } },
  { id: "doctor", desc: { vi: "Phe Dân làng. Mỗi đêm chọn 1 người để bảo vệ. Nếu người đó bị Sói cắn thì không chết.", en: "Village faction. Protects 1 player each night. That player won't die if bitten by Wolves." } },
  { id: "hunter", desc: { vi: "Phe Dân làng. Khi bị giết hoặc bị treo cổ, được chọn 1 người bắn theo.", en: "Village faction. If eliminated or voted out, can choose 1 player to shoot and kill." } },
  { id: "fox", desc: { vi: "Phe Dân làng. Mỗi đêm soi 1 người và 2 người bên cạnh. Nếu trong 3 người có Sói, báo \"Có Sói\". Nếu không có Sói, mất kỹ năng.", en: "Village faction. Checks 3 adjacent players. If there is a Wolf, reports \"Has Wolf\". If not, loses ability." } },
  { id: "wolfRole", desc: { vi: "Phe Sói. Cả đàn Sói cùng chọn 1 người để giết. Ban ngày giả làm dân để đánh lừa.", en: "Wolf faction. Wolves together choose 1 player to eliminate. Pretends to be a villager." } },
  { id: "alphaWolf", desc: { vi: "Phe Sói. Sói mạnh hơn. Miễn bị Tiên Tri soi ra Sói 1 lần. Lần đầu bị soi sẽ hiện \"Không phải Sói\".", en: "Wolf faction. Immune to Seer once. First time checked, appears as \"Not a Wolf\"." } },
  { id: "jester", desc: { vi: "Phe riêng. Thắng riêng nếu bị dân làng treo cổ. Nếu bị Sói giết ban đêm thì không thắng.", en: "Independent faction. Wins if voted out by the village. Loses if killed by Wolves at night." } }
];

function openRoleGuide() {
  const list = document.getElementById("roleGuideList");
  list.innerHTML = "";
  const imageMap = {
    villager: "assest/villager.png",
    seer: "assest/seer.png",
    doctor: "assest/doctor.png",
    hunter: "assest/hunter.png",
    fox: "assest/fox.png",
    wolfRole: "assest/werewolf.png",
    alphaWolf: "assest/alphawolf.png",
    jester: "assest/jester.png"
  };

  roleGuides.forEach(role => {
    const title = role.title ? role.title[settings.language] : t(role.id);
    const desc = role.desc[settings.language];
    const imgSrc = imageMap[role.id];
    list.innerHTML += `
      <div class="role-guide-item" style="display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
        <img src="${imgSrc}" alt="${title}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: rgba(0,0,0,0.2);">
        <div>
          <h3 style="margin: 0 0 4px 0; color: var(--text); font-size: 16px; font-weight: 600;">${title}</h3>
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: rgba(255, 255, 255, 0.75);">${desc}</p>
        </div>
      </div>
    `;
  });
  document.getElementById("roleGuideModal").style.display = "flex";
  softSound("click");
}

function closeRoleGuide() {
  document.getElementById("roleGuideModal").style.display = "none";
  softSound("click");
}
