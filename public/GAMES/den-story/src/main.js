import IntroScene from "./scenes/IntroScene.js?v=one-time-intro-1";
import ChapterOneScene from "./scenes/ChapterOneScene.js?v=one-time-intro-1";

const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#050505",
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [IntroScene, ChapterOneScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 },
      debug: false,
    },
  },
};

async function bootGame() {
  if (document.fonts?.ready) {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => window.setTimeout(resolve, 1600)),
    ]);
  }

  const loadingNode = document.querySelector(".den-loading");
  if (loadingNode) {
    loadingNode.remove();
  }

  window.DEN_STORY_GAME = new Phaser.Game(config);
}

if (document.readyState === "complete") {
  bootGame();
} else {
  window.addEventListener("load", bootGame, { once: true });
}


