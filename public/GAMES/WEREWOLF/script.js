let mode = "direct";
let players = [];
let assignedPlayers = [];
let currentRoleIndex = 0;
let selectedVote = null;

// Pass-and-play night state
let nightActionQueue = [];
let currentNightPlayerIndex = 0;
let killedByWolf = null;
let savedByDoc = null;
let selectedActionTarget = null;

const roles = [
  {
    name: "🐺 Ma Sói",
    desc: "Mỗi đêm thức dậy cùng đồng bọn để sát hại một người.",
    img: "assest/werewolf.png"
  },
  {
    name: "🔮 Tiên Tri",
    desc: "Mỗi đêm có thể soi vai trò của một người bí ẩn.",
    img: "assest/seer.png"
  },
  {
    name: "🛡️ Bảo Vệ",
    desc: "Mỗi đêm chọn một người để bảo vệ khỏi nanh vuốt ma sói.",
    img: "assest/doctor.png"
  },
  {
    name: "👨 Dân Làng",
    desc: "Không có khả năng đặc biệt. Cố gắng sinh tồn và tìm ra Kẻ Phản Bội.",
    img: "assest/villager.png"
  }
];

// Utility: Typewriter effect
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

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
}

function selectMode(selectedMode) {
  mode = selectedMode;
  showScreen("setupScreen");
}

function goHome() {
  players = [];
  assignedPlayers = [];
  currentRoleIndex = 0;
  selectedVote = null;
  document.body.classList.remove("day-mode");
  document.body.classList.add("night-mode");

  renderPlayers();
  showScreen("homeScreen");
}

function addPlayer() {
  const input = document.getElementById("playerName");
  const name = input.value.trim();

  if (!name) return;

  players.push(name);
  input.value = "";
  renderPlayers();
}

function renderPlayers() {
  const list = document.getElementById("playerList");
  list.innerHTML = "";

  players.forEach((player, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${player}`;
    list.appendChild(li);
  });
}

function startGame() {
  if (players.length < 4) {
    alert("Cần ít nhất 4 dân làng để bắt đầu trò chơi.");
    return;
  }

  assignedPlayers = assignRoles(players);
  currentRoleIndex = 0;

  prepareRoleScreen();
  showScreen("roleScreen");
}

function assignRoles(playerList) {
  let gameRoles = [];

  if (playerList.length <= 5) {
    gameRoles = ["🐺 Ma Sói", "🔮 Tiên Tri", "🛡️ Bảo Vệ"];
  } else {
    gameRoles = ["🐺 Ma Sói", "🐺 Ma Sói", "🔮 Tiên Tri", "🛡️ Bảo Vệ"];
  }

  while (gameRoles.length < playerList.length) {
    gameRoles.push("👨 Dân Làng");
  }

  gameRoles = shuffle(gameRoles);

  return playerList.map((name, index) => ({
    name,
    role: gameRoles[index],
    alive: true
  }));
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function prepareRoleScreen() {
  const player = assignedPlayers[currentRoleIndex];
  const pElement = document.getElementById("currentPlayer");
  typeWriter(pElement, `${player.name},\nHãy bước lên để nhận diện vai trò của mình.`);

  const cardInner = document.getElementById("roleCardInner");
  cardInner.classList.remove("is-flipped");
  
  document.getElementById("roleInfo").classList.add("hidden");
  document.getElementById("nextPlayerBtn").classList.add("hidden");
}

function showRole() {
  const player = assignedPlayers[currentRoleIndex];
  const roleInfo = roles.find(r => r.name === player.role);

  document.getElementById("roleName").textContent = player.role;
  document.getElementById("roleDesc").textContent = roleInfo ? roleInfo.desc : "Vai trò bí mật.";

  const roleImage = document.getElementById("roleImage");
  if (roleInfo && roleInfo.img) {
    roleImage.src = roleInfo.img;
    roleImage.style.display = "block";
  } else {
    roleImage.style.display = "none";
  }

  const cardInner = document.getElementById("roleCardInner");
  if (!cardInner.classList.contains("is-flipped")) {
    cardInner.classList.add("is-flipped");
    setTimeout(() => {
      document.getElementById("roleInfo").classList.remove("hidden");
      document.getElementById("nextPlayerBtn").classList.remove("hidden");
    }, 600);
  }
}

function nextPlayer() {
  currentRoleIndex++;

  if (currentRoleIndex >= assignedPlayers.length) {
    // All roles viewed, start night phase
    document.getElementById("phaseTitle").textContent = "🌙 Đêm Buông Xuống";
    const textElement = document.getElementById("phaseText");
    typeWriter(textElement, "Ngôi làng chìm trong bóng tối.\nTất cả nhắm mắt lại.\nTrò chơi sinh tử bắt đầu...");
    
    document.body.classList.remove("day-mode");
    document.body.classList.add("night-mode");
    
    showScreen("gameScreen");
    return;
  }

  prepareRoleScreen();
}

// ---- NIGHT PHASE LOGIC ----

function startNightPhases() {
  killedByWolf = null;
  savedByDoc = null;
  currentNightPlayerIndex = 0;
  
  // Chỉ những người còn sống mới hành động ban đêm
  nightActionQueue = assignedPlayers.filter(p => p.alive);
  
  showNightTransferScreen();
}

function showNightTransferScreen() {
  if (currentNightPlayerIndex >= nightActionQueue.length) {
    endNight();
    return;
  }

  const nextPlayer = nightActionQueue[currentNightPlayerIndex];
  
  document.getElementById("transferPlayerName").textContent = nextPlayer.name;
  const transferText = document.getElementById("transferText");
  typeWriter(transferText, `Tất cả vẫn nhắm mắt.\nHãy bí mật đưa điện thoại cho:\n[ ${nextPlayer.name} ]`);
  
  showScreen("nightTransferScreen");
}

function startPlayerAction() {
  const player = nightActionQueue[currentNightPlayerIndex];
  selectedActionTarget = null;
  
  const titleEl = document.getElementById("actionRoleTitle");
  const descEl = document.getElementById("actionDesc");
  const listEl = document.getElementById("actionTargetList");
  const seerResEl = document.getElementById("seerResult");
  const confirmBtn = document.getElementById("confirmActionBtn");

  listEl.innerHTML = "";
  listEl.classList.remove("hidden");
  seerResEl.classList.add("hidden");
  confirmBtn.classList.add("hidden");
  confirmBtn.classList.remove("btn-primary");
  confirmBtn.classList.add("btn-danger");
  confirmBtn.textContent = "Xác Nhận";

  titleEl.textContent = player.role;
  
  const alivePlayers = assignedPlayers.filter(p => p.alive);

  if (player.role === "🐺 Ma Sói") {
    descEl.textContent = "Chọn một người để sát hại đêm nay:";
    const targets = alivePlayers.filter(p => p.role !== "🐺 Ma Sói");
    renderActionList(targets, listEl, confirmBtn);
  } 
  else if (player.role === "🛡️ Bảo Vệ") {
    descEl.textContent = "Chọn một người để bảo vệ đêm nay (kể cả bản thân):";
    renderActionList(alivePlayers, listEl, confirmBtn);
  } 
  else if (player.role === "🔮 Tiên Tri") {
    descEl.textContent = "Chọn một người để soi thân phận:";
    const targets = alivePlayers.filter(p => p.name !== player.name);
    renderActionList(targets, listEl, confirmBtn);
  } 
  else {
    // Dân làng hoặc các vai không có chức năng đêm
    descEl.textContent = "Đêm nay bạn không có hành động đặc biệt nào. Hãy cố gắng không tạo ra tiếng động.";
    listEl.classList.add("hidden");
    confirmBtn.textContent = "Tiếp Tục (Giả Vờ Xác Nhận)";
    confirmBtn.classList.remove("btn-danger");
    confirmBtn.classList.add("btn-primary");
    
    // Yêu cầu chờ 3s để giả vờ thao tác
    setTimeout(() => {
      confirmBtn.classList.remove("hidden");
    }, 3000);
  }

  showScreen("nightActionScreen");
}

function renderActionList(targets, container, confirmBtn) {
  targets.forEach(target => {
    const div = document.createElement("div");
    div.className = "vote-item";
    div.textContent = target.name;

    div.onclick = () => {
      document.querySelectorAll("#actionTargetList .vote-item").forEach(item => {
        item.classList.remove("selected");
        item.classList.remove("pulse-red-active");
      });
      div.classList.add("selected");
      
      const player = nightActionQueue[currentNightPlayerIndex];
      if (player.role === "🐺 Ma Sói") div.classList.add("pulse-red-active");

      selectedActionTarget = target.name;
      confirmBtn.classList.remove("hidden");
    };
    container.appendChild(div);
  });
}

function confirmNightAction() {
  const player = nightActionQueue[currentNightPlayerIndex];

  if (player.role === "🐺 Ma Sói" && selectedActionTarget) {
    killedByWolf = selectedActionTarget;
  } 
  else if (player.role === "🛡️ Bảo Vệ" && selectedActionTarget) {
    savedByDoc = selectedActionTarget;
  } 
  else if (player.role === "🔮 Tiên Tri" && selectedActionTarget) {
    const seerResEl = document.getElementById("seerResult");
    if (seerResEl.classList.contains("hidden")) {
      // First click: show result instead of going to next player
      const targetObj = assignedPlayers.find(p => p.name === selectedActionTarget);
      document.getElementById("actionTargetList").classList.add("hidden");
      
      const isWolf = targetObj.role === "🐺 Ma Sói" ? "LÀ MA SÓI" : "LÀ DÂN LÀNG";
      typeWriter(document.getElementById("seerResultText"), `Thân phận thật sự của ${selectedActionTarget}\n${isWolf}`);
      seerResEl.classList.remove("hidden");
      
      const confirmBtn = document.getElementById("confirmActionBtn");
      confirmBtn.textContent = "Hoàn Tất";
      confirmBtn.classList.remove("btn-danger");
      confirmBtn.classList.add("btn-primary");
      return; // Stop here, require second click to finish
    }
  }

  // Next player
  currentNightPlayerIndex++;
  showNightTransferScreen();
}

function endNight() {
  let deadPlayer = null;
  if (killedByWolf && killedByWolf !== savedByDoc) {
    deadPlayer = assignedPlayers.find(p => p.name === killedByWolf);
    if (deadPlayer) deadPlayer.alive = false;
  }

  document.body.classList.remove("night-mode");
  document.body.classList.add("day-mode");

  const dayResultText = document.getElementById("dayResultText");
  if (deadPlayer) {
    typeWriter(dayResultText, `Đêm qua không hề bình yên.\n${deadPlayer.name} đã bị sát hại một cách dã man.`);
  } else {
    typeWriter(dayResultText, `Đêm qua là một đêm bình yên.\nKhông có ai mất mạng.`);
  }

  showScreen("dayResultScreen");
}

function startVotePhase() {
  // Check win condition before voting
  if (checkWinCondition()) return;

  renderVote();
  showScreen("voteScreen");
}

function renderVote() {
  const voteList = document.getElementById("voteList");
  voteList.innerHTML = "";
  selectedVote = null;

  assignedPlayers
    .filter(player => player.alive)
    .forEach(player => {
      const div = document.createElement("div");
      div.className = "vote-item";
      div.textContent = player.name;

      div.onclick = () => {
        document.querySelectorAll("#voteList .vote-item").forEach(item => {
          item.classList.remove("selected");
          item.classList.remove("pulse-red-active");
        });

        div.classList.add("selected");
        div.classList.add("pulse-red-active");
        selectedVote = player.name;
      };

      voteList.appendChild(div);
    });
}

function finishVote() {
  if (!selectedVote) {
    alert("Làng phải chọn ra một người để hành quyết.");
    return;
  }

  const votedPlayer = assignedPlayers.find(player => player.name === selectedVote);

  if (votedPlayer) {
    votedPlayer.alive = false;
  }

  const textElement = document.getElementById("resultText");
  const roleName = votedPlayer ? votedPlayer.role : "Ai đó";
  
  typeWriter(textElement, `${selectedVote} đã bị đưa lên đoạn đầu đài.\nThân phận thật sự của hắn là...\n${roleName}.`);

  showScreen("resultScreen");
}

function checkWinCondition() {
  const alivePlayers = assignedPlayers.filter(p => p.alive);
  const wolves = alivePlayers.filter(p => p.role === "🐺 Ma Sói");
  const villagers = alivePlayers.filter(p => p.role !== "🐺 Ma Sói");

  const resultText = document.getElementById("resultText");

  if (wolves.length === 0) {
    typeWriter(resultText, `Làng đã tiêu diệt hết Ma Sói!\nDÂN LÀNG CHIẾN THẮNG!`);
    showScreen("resultScreen");
    return true;
  } else if (wolves.length >= villagers.length) {
    typeWriter(resultText, `Sói đã áp đảo dân làng!\nMA SÓI CHIẾN THẮNG!`);
    showScreen("resultScreen");
    return true;
  }
  return false;
}

// After viewing result (from vote), check win condition again
const originalRestartGame = restartGame;
function proceedFromVoteResult() {
  if (checkWinCondition()) return;
  // If game is not over, go to next night
  startNightPhases();
}

function restartGame() {
  players = [...players];
  assignedPlayers = [];
  currentRoleIndex = 0;
  selectedVote = null;
  document.body.classList.remove("day-mode");
  document.body.classList.add("night-mode");

  showScreen("setupScreen");
}