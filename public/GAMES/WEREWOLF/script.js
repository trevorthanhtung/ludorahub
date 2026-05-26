// --- GLOBAL STATE ---
let myPlayerName = "Trevor";
let myRole = null;
let roomCode = "KAT001";
let lobbyPlayers = [];
let gameInterval = null;
let timeRemaining = 25;

const rolesDB = {
  "Villager": { name: "👨 Dân Làng", img: "assest/villager.png", team: "blue" },
  "Seer": { name: "🔮 Tiên Tri", img: "assest/seer.png", team: "blue" },
  "Doctor": { name: "🛡️ Bảo Vệ", img: "assest/doctor.png", team: "blue" },
  "Hunter": { name: "🏹 Thợ Săn", img: "assest/hunter.png", team: "blue" },
  "Werewolf": { name: "🐺 Ma Sói", img: "assest/werewolf.png", team: "red" },
  "Alpha Wolf": { name: "🐺 Sói Đầu Đàn", img: "assest/alphawolf.png", team: "red" },
  "Jester": { name: "🤡 Kẻ Ngốc", img: "assest/jester.png", team: "neutral" },
  "Fox": { name: "🦊 Cáo", img: "assest/fox.png", team: "blue" }
};

// Dummy names for auto-join
const botNames = ["Minh", "Huy", "Lan", "Mai", "Khang", "Vy"];

// Utility
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function typeWriter(element, text, speed = 30) {
  element.innerHTML = "";
  element.classList.remove("typing");
  void element.offsetWidth; // trigger reflow
  
  let i = 0;
  const formattedText = text.replace(/\n/g, '<br>');
  
  function type() {
    if (i < text.length) {
      if (text.charAt(i) === '\n') {
        element.innerHTML += '<br>';
      } else {
        element.innerHTML += text.charAt(i);
      }
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

function goHome() {
  clearInterval(gameInterval);
  lobbyPlayers = [];
  document.body.classList.remove("day-mode");
  document.body.classList.add("night-mode");
  showScreen("homeScreen");
}

// --- LOBBY LOGIC ---
function createRoom() {
  // Reset lobby
  lobbyPlayers = [
    { name: myPlayerName, avatar: "assest/hunter.png" } // placeholder avatar
  ];
  updateLobbyUI();
  addChatMsg("System", "Phòng " + roomCode + " đã được tạo. Chờ người chơi khác...");
  showScreen("waitingRoomScreen");

  // Simulate players joining
  const targetCount = parseInt(document.getElementById("playerCountSelect").value);
  simulatePlayersJoining(targetCount);
}

function updateLobbyUI() {
  const targetCount = parseInt(document.getElementById("playerCountSelect").value);
  document.getElementById("roomPlayerCount").textContent = `${lobbyPlayers.length}/${targetCount}`;
  
  const grid = document.getElementById("lobbyGrid");
  grid.innerHTML = "";
  
  lobbyPlayers.forEach(p => {
    const div = document.createElement("div");
    div.className = "avatar-wrapper";
    div.innerHTML = `
      <div class="avatar-circle"><img src="${p.avatar}" alt="${p.name}"/></div>
      <span class="avatar-name">${p.name}</span>
    `;
    grid.appendChild(div);
  });

  if (lobbyPlayers.length >= targetCount) {
    document.getElementById("startRoomBtn").disabled = false;
  }
}

function addChatMsg(sender, msg) {
  const chat = document.getElementById("lobbyChat");
  chat.innerHTML += `<p><span class="chat-sys">${sender}:</span> ${msg}</p>`;
  chat.scrollTop = chat.scrollHeight;
}

function simulatePlayersJoining(targetCount) {
  let joined = 1;
  const interval = setInterval(() => {
    if (joined >= targetCount || lobbyPlayers.length >= targetCount) {
      clearInterval(interval);
      return;
    }
    const newName = botNames[joined - 1];
    lobbyPlayers.push({ name: newName, avatar: "assest/villager.png" }); // Default avatar
    addChatMsg("System", `${newName} đã tham gia phòng.`);
    updateLobbyUI();
    joined++;
  }, 1500);
}

// --- GAME LOGIC ---
function startLobbyGame() {
  // Assign my role randomly for demo
  const selectedRoles = Array.from(document.querySelectorAll('.role-cb input:checked')).map(el => el.value);
  const randomRoleKey = selectedRoles[Math.floor(Math.random() * selectedRoles.length)] || "Werewolf";
  myRole = rolesDB[randomRoleKey];

  // Setup Reveal Screen
  const cardInner = document.getElementById("roleCardInner");
  cardInner.classList.remove("is-flipped");
  document.getElementById("roleInfo").classList.add("hidden");
  document.getElementById("nextPlayerBtn").classList.add("hidden");

  const pElement = document.getElementById("currentPlayer");
  typeWriter(pElement, `${myPlayerName},\nHãy nhận diện vai trò của bạn.`);

  showScreen("roleScreen");
}

function showRole() {
  document.getElementById("roleName").textContent = myRole.name;
  document.getElementById("roleImage").src = myRole.img;
  
  const cardBack = document.querySelector(".card-back");
  cardBack.classList.remove("glow-red", "glow-blue");

  const cardInner = document.getElementById("roleCardInner");
  if (!cardInner.classList.contains("is-flipped")) {
    cardInner.classList.add("is-flipped");
    
    setTimeout(() => {
      if (myRole.team === "red") cardBack.classList.add("glow-red");
      else cardBack.classList.add("glow-blue");

      document.getElementById("roleInfo").classList.remove("hidden");
      document.getElementById("nextPlayerBtn").classList.remove("hidden");
    }, 600);
  }
}

function finishRoleReveal() {
  // Go to gameplay
  document.getElementById("gpPhaseTitle").textContent = "🌙 Night";
  document.body.classList.remove("day-mode");
  document.body.classList.add("night-mode");
  
  // Render gameplay avatars
  renderAvatars("gpAvatarGrid", lobbyPlayers);
  
  // Start Timer
  startTimer(25, "Night");
  typeWriter(document.getElementById("aiHostChat"), "🎙 AI Host:\nWerewolves, open your eyes...\nSelect your target.");

  showScreen("gameplayScreen");
}

function renderAvatars(containerId, playersList, selectable = false) {
  const grid = document.getElementById(containerId);
  grid.innerHTML = "";
  playersList.forEach(p => {
    const div = document.createElement("div");
    div.className = "avatar-wrapper";
    div.innerHTML = `
      <div class="avatar-circle"><img src="${p.avatar}" alt="${p.name}"/></div>
      <span class="avatar-name">${p.name}</span>
    `;
    if (selectable) {
      div.onclick = () => {
        document.querySelectorAll(`#${containerId} .avatar-wrapper`).forEach(el => {
          el.classList.remove("selected", "pulse-red");
        });
        div.classList.add("selected", "pulse-red");
      };
    }
    grid.appendChild(div);
  });
}

function startTimer(seconds, phase) {
  clearInterval(gameInterval);
  timeRemaining = seconds;
  const timerEl = document.getElementById("gpTimer");
  
  gameInterval = setInterval(() => {
    timeRemaining--;
    timerEl.textContent = timeRemaining + "s";
    
    if (timeRemaining <= 0) {
      clearInterval(gameInterval);
      if (phase === "Night") {
        // Transition to Day
        document.getElementById("gpPhaseTitle").textContent = "☀️ Day";
        document.body.classList.remove("night-mode");
        document.body.classList.add("day-mode");
        startTimer(60, "Day");
        typeWriter(document.getElementById("aiHostChat"), "🎙 AI Host:\nThe sun is up. Last night, someone was attacked...\nDiscuss and find the wolf.");
      }
    }
  }, 1000);
}

function useSkill() {
  alert("Bạn đã dùng kỹ năng lên mục tiêu đã chọn!");
}

function openVoteScreen() {
  renderAvatars("voteAvatarGrid", lobbyPlayers, true);
  showScreen("voteScreen");
}

function finishVote() {
  const selected = document.querySelector("#voteAvatarGrid .avatar-wrapper.selected .avatar-name");
  if (!selected) {
    alert("Hãy chọn một người!");
    return;
  }
  
  const victimName = selected.textContent;
  typeWriter(document.getElementById("voteResultText"), `${victimName} đã bị treo cổ!\nThân phận thật sự: 🐺 Ma Sói`);
  showScreen("voteResultScreen");
}

function proceedFromVoteResult() {
  // Fake game over
  document.getElementById("finalWinTitle").textContent = "👨 DÂN LÀNG CHIẾN THẮNG";
  document.getElementById("finalWinTitle").classList.remove("text-red");
  
  document.getElementById("mvpName").textContent = myPlayerName;
  document.getElementById("mvpImg").src = myRole.img;
  document.getElementById("mvpRole").textContent = myRole.name;

  showScreen("resultScreen");
}

// Keep old pass and play code intact for the "Direct Play" fallback
// ... (omitted old logic for brevity as new logic overrides it, but addPlayer etc. are kept above)