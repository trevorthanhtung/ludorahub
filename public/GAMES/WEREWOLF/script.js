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

const roleImages = [
  "assest/hunter.png",
  "assest/villager.png",
  "assest/seer.png",
  "assest/doctor.png",
  "assest/werewolf.png",
  "assest/alphawolf.png"
];

const roles = ["Hunter", "Villager", "Seer", "Doctor", "Werewolf", "Alpha Wolf"];

let players = ["Trevor", "Minh", "Huy", "Lan"];
let votes = {};
let eliminated = new Set();
let currentMode = "direct";
let phase = "night";
let timeLeft = 30;
let timerId = null;
let audioCtx = null;
let ambienceNodes = [];

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

function chooseMode(mode) {
  currentMode = mode;

  if (mode === "direct") {
    setupTitle.textContent = "🎭 Direct Play";
    setupSubtitle.textContent = "Play with a human game master";
    modeBadge.textContent = "Direct Play";
  } else {
    setupTitle.textContent = "📡 Local WiFi";
    setupSubtitle.textContent = "Device acts as AI game master";
    modeBadge.textContent = "Local WiFi";
  }

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
    alert("Cần ít nhất 4 người chơi để bắt đầu.");
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
  alert(`Role Card: ${role}`);
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
    phaseTitle.textContent = "☀ DAY";
    phaseLabel.textContent = "☀ Day";
    phaseText.textContent = "Discuss and vote";
    hostText.textContent = "The sun rises. Read the room, discuss clues, and choose carefully.";
    softSound("whoosh");
  } else {
    phaseTitle.textContent = "🌙 NIGHT";
    phaseLabel.textContent = "🌙 Night";
    phaseText.textContent = "Werewolves are hunting...";
    hostText.textContent = currentMode === "wifi"
      ? "AI Host is guiding the night cycle. Special roles may act now."
      : "The moderator may call roles in order. Keep your eyes closed.";
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
  const voteText = votable ? `<em>${votes[name] || 0} votes</em>` : "";
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
    alert("Hãy chọn một người để vote.");
    return;
  }

  const [victim] = entries.sort((a, b) => b[1] - a[1])[0];
  eliminated.add(victim);
  softSound("thump");
  alert(`${victim} has been eliminated.`);
  showScreen("gameScreen");
}

function playSpecialRole() {
  softSound("magic");
  hostText.textContent = "A special role effect has been triggered.";
}

function initAudio() {
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  audioCtx = new AudioContext();
  startAmbience();
}

function startAmbience() {
  if (!audioCtx || ambienceNodes.length) return;

  const master = audioCtx.createGain();
  master.gain.value = 0.028;
  master.connect(audioCtx.destination);

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
  gain.gain.exponentialRampToValueAtTime(preset[2], now + 0.012);
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

renderPlayers();
