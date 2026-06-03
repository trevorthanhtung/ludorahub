const I18N = {
  vi: {
    gameTitle: "Memory Match",
    subtitle: "Lật thẻ và tìm cặp giống nhau",
    start: "Bắt đầu chơi",
    restart: "Chơi lại",
    backToHub: "Về Hub",
    settings: "Cài đặt",
    close: "Đóng",
    sound: "Âm thanh",
    soundOn: "Bật",
    soundOff: "Tắt",
    volume: "Âm lượng",
    language: "Ngôn ngữ",
    vietnamese: "Tiếng Việt",
    english: "English",
    moves: "Lượt",
    time: "Thời gian",
    pairs: "Cặp",
    mistakes: "Lỗi sai",
    difficulty: "Độ khó",
    theme: "Chủ đề",
    easy: "Dễ",
    normal: "Vừa",
    hard: "Khó",
    nightmare: "Nightmare",
    nightmareWarning: "🔥 90s • Max 8 sai • Chaos Shuffle",
    animals: "Động vật",
    food: "Đồ ăn",
    cosmic: "Vũ trụ",
    youWin: "Chiến thắng!",
    youWinNightmare: "Sống sót Nightmare!",
    gameOver: "Bạn đã thua!",
    timeout: "Hết giờ!",
    playAgain: "Chơi lại ngay",
    bestScore: "Best Score",
    score: "Điểm",
    rank: "Hạng",
    player1: "1 Người chơi",
    offline: "Offline",
    puzzle: "Puzzle",
    setup: "Đổi cài đặt",
    chaosShuffle: "Chaos Shuffle!",
    previewText: "Ghi nhớ trong",
    foundPairs: "Cặp đã tìm",
    flipCount: "Lượt lật"
  },
  en: {
    gameTitle: "Memory Match",
    subtitle: "Flip cards and find pairs",
    start: "Start Game",
    restart: "Restart",
    backToHub: "Back to Hub",
    settings: "Settings",
    close: "Close",
    sound: "Sound",
    soundOn: "On",
    soundOff: "Off",
    volume: "Volume",
    language: "Language",
    vietnamese: "Tiếng Việt",
    english: "English",
    moves: "Moves",
    time: "Time",
    pairs: "Pairs",
    mistakes: "Mistakes",
    difficulty: "Difficulty",
    theme: "Theme",
    easy: "Easy",
    normal: "Normal",
    hard: "Hard",
    nightmare: "Nightmare",
    nightmareWarning: "🔥 90s • Max 8 misses • Chaos Shuffle",
    animals: "Animals",
    food: "Food",
    cosmic: "Cosmic",
    youWin: "You Win!",
    youWinNightmare: "Nightmare Survived!",
    gameOver: "Game Over!",
    timeout: "Time's Up!",
    playAgain: "Play Again",
    bestScore: "Best Score",
    score: "Score",
    rank: "Rank",
    player1: "1 Player",
    offline: "Offline",
    puzzle: "Puzzle",
    setup: "Setup",
    chaosShuffle: "Chaos Shuffle!",
    previewText: "Memorize in",
    foundPairs: "Pairs Found",
    flipCount: "Total Flips"
  }
};

const THEMES = {
  animals: ["🐱", "🐶", "🐸", "🐵", "🐼", "🦊", "🐯", "🐰", "🦁", "🐮", "🐷", "🐔"],
  food: ["🍕", "🍔", "🍟", "🌭", "🍩", "🍪", "🍓", "🍉", "🍒", "🍎", "🥑", "🥕"],
  cosmic: ["🌙", "⭐", "☄️", "🪐", "🌍", "🚀", "👽", "🛸", "🌌", "☀️", "🔭", "🌠"]
};

const DIFFICULTIES = {
  easy: { pairs: 4, grid: 'easy', timeLimit: null, maxMistakes: null, previewSeconds: 0, chaos: false },
  normal: { pairs: 6, grid: 'normal', timeLimit: null, maxMistakes: null, previewSeconds: 0, chaos: false },
  hard: { pairs: 8, grid: 'hard', timeLimit: null, maxMistakes: null, previewSeconds: 0, chaos: false },
  nightmare: { pairs: 12, grid: 'nightmare', timeLimit: 90, maxMistakes: 8, previewSeconds: 2, chaos: true }
};

const state = {
  difficulty: "normal",
  theme: "animals",
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  mistakes: 0,
  timer: 0,
  timeLeft: 0,
  timerInterval: null,
  lockBoard: false,
  gameStarted: false,
  gameOver: false,
  chaosCounter: 0,
  previewing: false,
  hasUserInteracted: false,
  nightmareBestScore: localStorage.getItem('memoryFlipCardNightmareBestScore') || 0,
  nightmareBestRank: localStorage.getItem('memoryFlipCardNightmareBestRank') || '-',
  settings: {
    soundEnabled: true,
    volume: 0.7,
    language: "vi"
  }
};

let audioCtx = null;

// DOM Elements
const screens = {
  menu: document.getElementById('menuScreen'),
  game: document.getElementById('gameScreen'),
  win: document.getElementById('winScreen'),
  settings: document.getElementById('settingsModal')
};

const difficultyBtns = document.querySelectorAll('#difficultyOptions .segment-btn');
const themeBtns = document.querySelectorAll('#themeOptions .theme-btn');
const startBtn = document.getElementById('startBtn');
const gameBoard = document.getElementById('gameBoard');
const movesCountEl = document.getElementById('movesCount');
const timeCountEl = document.getElementById('timeCount');
const pairsCountEl = document.getElementById('pairsCount');
const mistakesCountEl = document.getElementById('mistakesCount');
const timePill = document.getElementById('timePill');
const mistakesPill = document.getElementById('mistakesPill');

const winTimeEl = document.getElementById('winTime');
const winMovesEl = document.getElementById('winMoves');
const winPairsEl = document.getElementById('winPairs');
const winMistakesEl = document.getElementById('winMistakes');
const winScoreEl = document.getElementById('winScore');
const winRankEl = document.getElementById('winRank');
const resultTitle = document.getElementById('resultTitle');
const resultSubtitle = document.getElementById('resultSubtitle');

const replayBtn = document.getElementById('replayBtn');
const menuBtn = document.getElementById('menuBtn');
const backToHubBtn = document.getElementById('backToHubBtn');
const winBackToHubBtn = document.getElementById('winBackToHubBtn');
const settingsBtn = document.getElementById('settingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');

const soundOnBtn = document.getElementById('soundOnBtn');
const soundOffBtn = document.getElementById('soundOffBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValueDisplay = document.getElementById('volumeValueDisplay');
const languageOptionsBtns = document.querySelectorAll('#languageOptions .segment-btn');

const confettiContainer = document.getElementById('confettiContainer');
const previewOverlay = document.getElementById('previewOverlay');
const countdownText = document.getElementById('countdownText');
const chaosNotification = document.getElementById('chaosNotification');
const nightmareInfo = document.getElementById('nightmareInfo');

function initGame() {
  loadSettings();
  applyTheme(state.theme);
  updateSetupUI();

  // Setup user interaction for audio context initialization
  const handleFirstInteraction = () => {
    state.hasUserInteracted = true;
    initAudio();
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
  };
  document.addEventListener('click', handleFirstInteraction);
  document.addEventListener('touchstart', handleFirstInteraction, { passive: true });

  // Setup Difficulty Options
  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('button');
      difficultyBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      state.difficulty = btn.dataset.difficulty;
      updateSetupUI();
    });
  });

  // Setup Theme Options
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('button');
      themeBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      state.theme = btn.dataset.theme;
      applyTheme(state.theme);
    });
  });

  // Action Buttons
  startBtn.addEventListener('click', () => { playSound('button'); startGame(); });
  replayBtn.addEventListener('click', () => { playSound('button'); startGame(); });
  menuBtn.addEventListener('click', () => { 
    playSound('button'); 
    resetGameStats(); 
    showScreen('menu'); 
  });
  
  settingsBtn.addEventListener('click', () => {
    playSound('button');
    screens.settings.classList.add('active');
  });

  closeSettingsBtn.addEventListener('click', () => {
    playSound('button');
    screens.settings.classList.remove('active');
  });

  screens.settings.addEventListener('click', (e) => {
    if (e.target === screens.settings) screens.settings.classList.remove('active');
  });

  // Settings Logic
  soundOnBtn.addEventListener('click', () => updateSoundSetting(true));
  soundOffBtn.addEventListener('click', () => updateSoundSetting(false));
  
  volumeSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    state.settings.volume = val / 100;
    volumeValueDisplay.textContent = `${val}%`;
    saveSettings();
  });
  volumeSlider.addEventListener('change', () => playSound('button')); // test sound

  languageOptionsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('button');
      state.settings.language = btn.dataset.lang;
      saveSettings();
      updateSettingsUI();
      applyLanguage();
    });
  });

  // Hub Navigation
  const goBackToHub = () => {
    playSound('button');
    window.location.href = '/'; 
  };
  backToHubBtn.addEventListener('click', goBackToHub);
  winBackToHubBtn.addEventListener('click', goBackToHub);
}

// Settings & i18n
function loadSettings() {
  try {
    const saved = localStorage.getItem('memoryFlipCardSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      state.settings = { ...state.settings, ...parsed };
    }
  } catch (e) { console.warn('Could not load settings', e); }
  
  updateSettingsUI();
  applyLanguage();
}

function saveSettings() {
  try {
    localStorage.setItem('memoryFlipCardSettings', JSON.stringify(state.settings));
  } catch (e) {}
}

function updateSettingsUI() {
  volumeSlider.value = Math.round(state.settings.volume * 100);
  volumeValueDisplay.textContent = `${volumeSlider.value}%`;
  
  soundOnBtn.classList.toggle('active', state.settings.soundEnabled);
  soundOffBtn.classList.toggle('active', !state.settings.soundEnabled);
  
  languageOptionsBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === state.settings.language);
  });
}

function updateSoundSetting(enabled) {
  playSound('button');
  state.settings.soundEnabled = enabled;
  saveSettings();
  updateSettingsUI();
}

function t(key) {
  const lang = state.settings.language || "vi";
  return I18N[lang]?.[key] || I18N.vi[key] || key;
}

function applyLanguage() {
  document.documentElement.lang = state.settings.language;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.dataset.i18nAria;
    el.setAttribute('aria-label', t(key));
  });
  
  // Re-render difficulty and dynamic strings if active
  if (state.gameOver) {
    // If it's visible, the translations updated automatically via data-i18n, except some dynamic titles
  }
}

function applyTheme(themeName) {
  document.body.setAttribute('data-active-theme', themeName);
}

function updateSetupUI() {
  document.body.setAttribute('data-difficulty', state.difficulty);
  if (state.difficulty === 'nightmare') {
    nightmareInfo.style.display = 'block';
    document.getElementById('bestScoreNightmare').textContent = state.nightmareBestScore;
    const badge = document.getElementById('bestRankNightmare');
    badge.textContent = state.nightmareBestRank;
    badge.className = `rank-badge rank-${state.nightmareBestRank}`;
  } else {
    nightmareInfo.style.display = 'none';
  }
}

// Audio System (Web Audio API)
function initAudio() {
  if (audioCtx) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  } catch (e) {
    console.warn('Web Audio API not supported', e);
  }
}

function playSound(type) {
  if (!state.settings.soundEnabled || !state.hasUserInteracted || !audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  const now = audioCtx.currentTime;
  const vol = state.settings.volume;
  
  switch(type) {
    case 'flip':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      gainNode.gain.setValueAtTime(0.3 * vol, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * vol, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'match':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(800, now + 0.1);
      gainNode.gain.setValueAtTime(0.2 * vol, now);
      gainNode.gain.linearRampToValueAtTime(0.01 * vol, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 'wrong':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
      gainNode.gain.setValueAtTime(0.2 * vol, now);
      gainNode.gain.linearRampToValueAtTime(0.01 * vol, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    case 'win':
      osc.type = 'sine';
      gainNode.gain.setValueAtTime(0.2 * vol, now);
      [440, 554, 659, 880].forEach((freq, i) => {
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
      });
      gainNode.gain.linearRampToValueAtTime(0.01 * vol, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
      break;
    case 'lose':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.6);
      gainNode.gain.setValueAtTime(0.2 * vol, now);
      gainNode.gain.linearRampToValueAtTime(0.01 * vol, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
      break;
    case 'chaos':
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.4);
      gainNode.gain.setValueAtTime(0.15 * vol, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * vol, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
      break;
    case 'countdown':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gainNode.gain.setValueAtTime(0.2 * vol, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * vol, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'button':
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, now);
      gainNode.gain.setValueAtTime(0.05 * vol, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * vol, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
  }
}

// Screen Management
function showScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenName].classList.add('active');
}

// Core Game Logic
function startGame() {
  resetGameStats();
  generateCards();
  renderCards();
  showScreen('game');

  const diff = DIFFICULTIES[state.difficulty];
  if (diff.previewSeconds > 0) {
    startPreview(diff.previewSeconds);
  } else {
    // Normal start waits for first click to start timer
  }
}

function startPreview(seconds) {
  state.previewing = true;
  previewOverlay.classList.add('active');
  
  // Flip all cards open
  document.querySelectorAll('.card').forEach(c => c.classList.add('flipped'));
  
  let left = seconds;
  countdownText.textContent = left;
  playSound('countdown');
  
  const iv = setInterval(() => {
    left--;
    if (left > 0) {
      countdownText.textContent = left;
      playSound('countdown');
      // trigger animation restart
      countdownText.style.animation = 'none';
      countdownText.offsetHeight;
      countdownText.style.animation = 'popIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
    } else {
      clearInterval(iv);
      previewOverlay.classList.remove('active');
      document.querySelectorAll('.card').forEach(c => c.classList.remove('flipped'));
      state.previewing = false;
      state.gameStarted = true;
      startTimer(); // start nightmare timer immediately
    }
  }, 1000);
}

function resetGameStats() {
  stopTimer();
  state.cards = [];
  state.flippedCards = [];
  state.matchedPairs = 0;
  state.moves = 0;
  state.mistakes = 0;
  state.timer = 0;
  state.chaosCounter = 0;
  state.lockBoard = false;
  state.gameStarted = false;
  state.gameOver = false;
  state.previewing = false;
  state.lastClickTime = 0;
  
  const diff = DIFFICULTIES[state.difficulty];
  state.timeLeft = diff.timeLimit || 0;
  
  mistakesPill.style.display = diff.maxMistakes ? 'flex' : 'none';
  timePill.classList.remove('warning-pulse');
  mistakesPill.classList.remove('warning-pulse');
  
  updateStats();
  confettiContainer.innerHTML = '';
}

function generateCards() {
  const numPairs = DIFFICULTIES[state.difficulty].pairs;
  const themeEmojis = THEMES[state.theme];
  
  const selectedEmojis = themeEmojis.slice(0, numPairs);
  state.cards = [...selectedEmojis, ...selectedEmojis];
  shuffleCards();
}

function shuffleCards() {
  for (let i = state.cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.cards[i], state.cards[j]] = [state.cards[j], state.cards[i]];
  }
}

function renderCards() {
  gameBoard.innerHTML = '';
  gameBoard.setAttribute('data-difficulty', DIFFICULTIES[state.difficulty].grid);
  
  state.cards.forEach((emoji, index) => {
    const cardEl = document.createElement('div');
    cardEl.classList.add('card');
    cardEl.dataset.index = index;
    cardEl.dataset.emoji = emoji;
    
    cardEl.setAttribute('role', 'button');
    cardEl.setAttribute('tabindex', '0');
    cardEl.setAttribute('aria-label', 'Thẻ đang úp');
    
    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front"></div>
        <div class="card-face card-back">${emoji}</div>
      </div>
    `;
    
    cardEl.addEventListener('click', () => handleCardClick(cardEl));
    cardEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardClick(cardEl);
      }
    });
    
    gameBoard.appendChild(cardEl);
  });
}

function handleCardClick(cardEl) {
  if (state.lockBoard || state.previewing || state.gameOver) return;
  if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

  const now = Date.now();
  if (now - state.lastClickTime < 120) return; // Anti-spam
  state.lastClickTime = now;

  if (!state.gameStarted) {
    state.gameStarted = true;
    startTimer();
  }

  playSound('flip');
  cardEl.classList.add('flipped');
  cardEl.setAttribute('aria-label', `Thẻ ${cardEl.dataset.emoji} đã mở`);
  state.flippedCards.push(cardEl);

  if (state.flippedCards.length === 2) {
    state.moves++;
    updateStats();
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = state.flippedCards;
  const isMatch = card1.dataset.emoji === card2.dataset.emoji;

  const diff = DIFFICULTIES[state.difficulty];

  if (isMatch) {
    playSound('match');
    card1.classList.add('matched');
    card2.classList.add('matched');
    
    card1.setAttribute('aria-label', `Thẻ ${card1.dataset.emoji} đã ghép đúng`);
    card2.setAttribute('aria-label', `Thẻ ${card2.dataset.emoji} đã ghép đúng`);
    
    state.matchedPairs++;
    updateStats();
    resetFlippedCards();
    
    if (state.matchedPairs === diff.pairs) {
      setTimeout(() => triggerGameOver('win'), 500);
    }
  } else {
    state.lockBoard = true;
    state.mistakes++;
    updateStats();
    
    card1.classList.add('wrong');
    card2.classList.add('wrong');
    playSound('wrong');
    
    if (diff.maxMistakes) {
      if (state.mistakes >= diff.maxMistakes - 2) mistakesPill.classList.add('warning-pulse');
      if (state.mistakes >= diff.maxMistakes) {
        setTimeout(() => triggerGameOver('mistakes'), 700);
        return;
      }
    }
    
    let willChaos = false;
    if (diff.chaos) {
      state.chaosCounter++;
      if (state.chaosCounter >= 3) {
        willChaos = true;
        state.chaosCounter = 0;
      }
    }

    setTimeout(() => {
      card1.classList.remove('flipped', 'wrong');
      card2.classList.remove('flipped', 'wrong');
      
      card1.setAttribute('aria-label', 'Thẻ đang úp');
      card2.setAttribute('aria-label', 'Thẻ đang úp');
      
      resetFlippedCards();

      if (willChaos) {
        state.lockBoard = true;
        executeChaosShuffle();
        setTimeout(() => { state.lockBoard = false; }, 800);
      }
    }, 700);
  }
}

function executeChaosShuffle() {
  playSound('chaos');
  chaosNotification.classList.add('show');
  setTimeout(() => chaosNotification.classList.remove('show'), 1500);
  
  const unmatchedCards = Array.from(gameBoard.querySelectorAll('.card:not(.matched)'));
  const emojis = unmatchedCards.map(c => c.dataset.emoji);
  
  for (let i = emojis.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [emojis[i], emojis[j]] = [emojis[j], emojis[i]];
  }
  
  unmatchedCards.forEach((card, i) => {
    const inner = card.querySelector('.card-inner');
    inner.classList.add('chaos-shuffle');
    
    setTimeout(() => {
      card.dataset.emoji = emojis[i];
      card.querySelector('.card-back').textContent = emojis[i];
    }, 300);
    
    setTimeout(() => {
      inner.classList.remove('chaos-shuffle');
    }, 600);
  });
}

function resetFlippedCards() {
  state.flippedCards = [];
  state.lockBoard = false;
}

function updateStats() {
  const diff = DIFFICULTIES[state.difficulty];
  movesCountEl.textContent = state.moves;
  pairsCountEl.textContent = `${state.matchedPairs}/${diff.pairs}`;
  
  if (diff.maxMistakes) {
    mistakesCountEl.textContent = `${state.mistakes}/${diff.maxMistakes}`;
  }
  
  if (diff.timeLimit) {
    formatTime(state.timeLeft, timeCountEl);
  } else {
    formatTime(state.timer, timeCountEl);
  }
}

function formatTime(seconds, el) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  el.textContent = `${m}:${s}`;
}

function startTimer() {
  const diff = DIFFICULTIES[state.difficulty];
  state.timerInterval = setInterval(() => {
    if (diff.timeLimit) {
      state.timeLeft--;
      if (state.timeLeft <= 15) timePill.classList.add('warning-pulse');
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        triggerGameOver('timeout');
      }
    } else {
      state.timer++;
    }
    updateStats();
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function triggerGameOver(reason) {
  state.gameOver = true;
  stopTimer();
  state.lockBoard = true;
  
  const isNightmare = state.difficulty === 'nightmare';
  
  document.querySelectorAll('.nightmare-only').forEach(el => el.style.display = 'none');
  winPairsEl.parentElement.style.display = 'flex';
  
  if (reason === 'win') {
    playSound('win');
    triggerConfetti();
    resultTitle.textContent = isNightmare ? t('youWinNightmare') : t('youWin');
    resultSubtitle.textContent = "Perfect Memory";
    winPairsEl.parentElement.style.display = 'none'; // hide pairs if win
    
    if (isNightmare) {
      const score = Math.max(0, 1000 + state.timeLeft * 10 - state.moves * 5 - state.mistakes * 50);
      let rank = 'C';
      if (score >= 1300) rank = 'S';
      else if (score >= 1000) rank = 'A';
      else if (score >= 700) rank = 'B';
      
      document.querySelectorAll('.nightmare-only').forEach(el => el.style.display = 'flex');
      winScoreEl.textContent = score;
      winRankEl.textContent = rank;
      winRankEl.className = `stat-value accent-text rank-text rank-${rank}`;
      
      if (score > state.nightmareBestScore) {
        state.nightmareBestScore = score;
        state.nightmareBestRank = rank;
        localStorage.setItem('memoryFlipCardNightmareBestScore', score);
        localStorage.setItem('memoryFlipCardNightmareBestRank', rank);
      }
    }
  } else {
    playSound('lose');
    resultTitle.textContent = reason === 'timeout' ? t('timeout') : t('gameOver');
    resultSubtitle.textContent = reason === 'timeout' ? t('timeout') : "Too many mistakes";
    winPairsEl.textContent = `${state.matchedPairs}/${DIFFICULTIES[state.difficulty].pairs}`;
  }
  
  winTimeEl.textContent = timeCountEl.textContent;
  winMovesEl.textContent = state.moves;
  winMistakesEl.textContent = state.mistakes;
  
  showScreen('win');
}

function triggerConfetti() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const colors = getThemeColors();
  
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animation = `confettiFall ${Math.random() * 1.5 + 1}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
    confetti.style.animationDelay = Math.random() * 0.2 + 's';
    
    if (Math.random() > 0.5) confetti.style.borderRadius = '50%';
    confettiContainer.appendChild(confetti);
  }
}

function getThemeColors() {
  if (state.difficulty === 'nightmare') return ['#ef4444', '#f43f5e', '#e11d48', '#fff'];
  switch (state.theme) {
    case 'animals': return ['#10b981', '#34d399', '#f59e0b', '#fff'];
    case 'food': return ['#f97316', '#fbbf24', '#ef4444', '#fff'];
    case 'cosmic': return ['#8b5cf6', '#c084fc', '#3b82f6', '#fff'];
    default: return ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  }
}

// Start
document.addEventListener('DOMContentLoaded', initGame);
