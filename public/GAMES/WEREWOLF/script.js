let mode = "direct";
let players = [];
let assignedPlayers = [];
let currentRoleIndex = 0;
let phaseIndex = 0;
let selectedVote = null;

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

const phases = [
  {
    title: "🌙 Đêm Buông Xuống",
    text: "Ngôi làng chìm trong bóng tối.\nTất cả nhắm mắt lại."
  },
  {
    title: "🛡️ Bảo Vệ Thức Giấc",
    text: "Hỡi người Bảo Vệ, hãy chọn một người để che chở đêm nay..."
  },
  {
    title: "🐺 Sói Thức Giấc",
    text: "Bầy sói mở mắt.\nHãy chọn con mồi của đêm nay..."
  },
  {
    title: "🔮 Tiên Tri Thức Giấc",
    text: "Nhà Tiên Tri vĩ đại, ngài muốn soi rọi tâm hồn của ai?"
  },
  {
    title: "☀️ Bình Minh",
    text: "Trời đã sáng, mọi người mở mắt.\nHãy xem chuyện gì đã xảy ra đêm qua..."
  }
];

// Utility: Typewriter effect
function typeWriter(element, text, speed = 30) {
  element.innerHTML = "";
  element.classList.remove("typing");
  void element.offsetWidth; // trigger reflow
  
  let i = 0;
  // Xử lý xuống dòng cho text
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
  phaseIndex = 0;
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
    phaseIndex = 0;
    renderPhase();
    showScreen("gameScreen");
    return;
  }

  prepareRoleScreen();
}

function renderPhase() {
  const phase = phases[phaseIndex];

  document.getElementById("phaseTitle").textContent = phase.title;
  
  const textElement = document.getElementById("phaseText");
  typeWriter(textElement, phase.text);

  // Day / Night background logic
  if (phase.title.includes("Bình Minh")) {
    document.body.classList.remove("night-mode");
    document.body.classList.add("day-mode");
  } else {
    document.body.classList.remove("day-mode");
    document.body.classList.add("night-mode");
  }
}

function nextPhase() {
  phaseIndex++;

  if (phaseIndex >= phases.length) {
    renderVote();
    showScreen("voteScreen");
    return;
  }

  renderPhase();
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
        document.querySelectorAll(".vote-item").forEach(item => {
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

function restartGame() {
  players = [...players];
  assignedPlayers = [];
  currentRoleIndex = 0;
  phaseIndex = 0;
  selectedVote = null;
  document.body.classList.remove("day-mode");
  document.body.classList.add("night-mode");

  showScreen("setupScreen");
}