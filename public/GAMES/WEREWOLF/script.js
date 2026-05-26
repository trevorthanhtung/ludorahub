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

const roleImages = [
  "assest/hunter.png",
  "assest/villager.png",
  "assest/seer.png",
  "assest/doctor.png",
  "assest/werewolf.png",
  "assest/alphawolf.png"
];

const roles = ["Hunter", "Villager", "Seer", "Doctor", "Werewolf", "Alpha Wolf"];

const dictionary = {
  en: {
    directTitle: "Direct Play",
    directSubtitle: "Play with a human game master",
    directDescription: "Players gather together and one person acts as the moderator. The system supports role cards, timer, player list and game tools.",
    playDirect: "Play Direct",
    wifiTitle: "Local WiFi",
    wifiSubtitle: "Device acts as AI game master",
    wifiDescription: "Players connect through the same Wi-Fi network. The system manages roles, day/night cycle, voting and game flow.",
    playLocal: "Play Local",
    add: "Add",
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
    roleCardAlert: "Role Card",
    noVote: "Choose a player to vote.",
    eliminated: "has been eliminated.",
    votes: "votes",
    nightLabel: "🌙 Night",
    dayLabel: "☀ Day",
    nightTitle: "🌙 NIGHT",
    dayTitle: "☀ DAY",
    nightText: "Werewolves are hunting...",
    dayText: "Discuss and vote",
    hostWifiNight: "AI Host is guiding the night cycle. Special roles may act now.",
    hostDirectNight: "The moderator may call roles in order. Keep your eyes closed.",
    hostDay: "The sun rises. Read the room, discuss clues, and choose carefully.",
    specialRoleTriggered: "A special role effect has been triggered."
  },
  vi: {
    directTitle: "Chơi Trực Tiếp",
    directSubtitle: "Chơi cùng quản trò thật",
    directDescription: "Người chơi ngồi cùng nhau và một người làm quản trò. Hệ thống hỗ trợ thẻ vai, hẹn giờ, danh sách người chơi và công cụ chơi.",
    playDirect: "Chơi Trực Tiếp",
    wifiTitle: "WiFi Nội Bộ",
    wifiSubtitle: "Thiết bị làm quản trò AI",
    wifiDescription: "Người chơi kết nối cùng mạng Wi-Fi. Hệ thống tự quản lý vai trò, ngày/đêm, bỏ phiếu và luồng ván chơi.",
    playLocal: "Chơi WiFi",
    add: "Thêm",
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
    saveSettings: "Lưu Cài Đặt",
    on: "Bật",
    off: "Tắt",
    playerPlaceholder: "Nhập tên người chơi",
    needMinPlayers: "Cần ít nhất 4 người chơi để bắt đầu.",
    roleCardAlert: "Thẻ vai",
    noVote: "Hãy chọn một người để vote.",
    eliminated: "đã bị loại.",
    votes: "phiếu",
    nightLabel: "🌙 Đêm",
    dayLabel: "☀ Ngày",
    nightTitle: "🌙 ĐÊM",
    dayTitle: "☀ NGÀY",
    nightText: "Ma sói đang săn mồi...",
    dayText: "Thảo luận và bỏ phiếu",
    hostWifiNight: "AI Host đang dẫn pha đêm. Các vai đặc biệt có thể hành động.",
    hostDirectNight: "Quản trò gọi từng vai theo lượt. Mọi người nhắm mắt.",
    hostDay: "Mặt trời lên. Hãy đọc tình hình, thảo luận manh mối và chọn cẩn thận.",
    specialRoleTriggered: "Hiệu ứng vai đặc biệt đã được kích hoạt."
  }
};

let players = ["Trevor", "Minh", "Huy", "Lan"];
let votes = {};
let eliminated = new Set();
let currentMode = "direct";
let phase = "night";
let timeLeft = 30;
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
  if (document.getElementById("voteScreen").classList.contains("active")) renderVotePlayers();
}

function updateModeText() {
  if (currentMode === "direct") {
    setupTitle.textContent = `🎭 ${t("directTitle")}`;
    setupSubtitle.textContent = t("directSubtitle");
    modeBadge.textContent = t("directTitle");
  } else {
    setupTitle.textContent = `📡 ${t("wifiTitle")}`;
    setupSubtitle.textContent = t("wifiSubtitle");
    modeBadge.textContent = t("wifiTitle");
  }
}

function updatePhaseCopy() {
  if (phase === "day") {
    phaseTitle.textContent = t("dayTitle");
    phaseLabel.textContent = t("dayLabel");
    phaseText.textContent = t("dayText");
    hostText.textContent = t("hostDay");
  } else {
    phaseTitle.textContent = t("nightTitle");
    phaseLabel.textContent = t("nightLabel");
    phaseText.textContent = t("nightText");
    hostText.textContent = currentMode === "wifi" ? t("hostWifiNight") : t("hostDirectNight");
  }
}

function chooseMode(mode) {
  currentMode = mode;
  updateModeText();
  softSound(mode === "direct" ? "wolf" : "magic");
  showScreen("setupScreen");
}

function addPlayer() {
  const name = playerNameInput.value.trim();
  if (!name) return;

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
  phase = phase === "night" ? "day" : "night";
  timeLeft = phase === "night" ? 30 : 60;
  announcePhase(phase);
  renderGamePlayers();
  startTimer();
}

function announcePhase(next) {
  document.body.classList.toggle("day", next === "day");
  document.body.classList.toggle("night", next !== "day");

  phaseTransition.textContent = next === "day" ? "DAY" : "NIGHT";
  phaseTransition.className = `phase-transition show-${next}`;
  setTimeout(() => {
    phaseTransition.className = "phase-transition";
  }, 1300);

  if (next === "day") {
    phaseTitle.textContent = t("dayTitle");
    phaseLabel.textContent = t("dayLabel");
    phaseText.textContent = t("dayText");
    hostText.textContent = t("hostDay");
    softSound("whoosh");
  } else {
    phaseTitle.textContent = t("nightTitle");
    phaseLabel.textContent = t("nightLabel");
    phaseText.textContent = t("nightText");
    hostText.textContent = currentMode === "wifi" ? t("hostWifiNight") : t("hostDirectNight");
    softSound("wolf");
  }
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
