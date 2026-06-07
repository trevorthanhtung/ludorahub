import TextBox from "../ui/TextBox.js?v=game-fonts-2";
import SettingsManager from "../systems/SettingsManager.js";

const INTRO_TEXT = {
  sceneOne: [
    "Một ngày mưa rả rích...",
    "Tiếng sấm thỉnh thoảng vang lên ngoài cửa sổ.",
    "Bên trong, một căn phòng nhỏ nhưng ấm áp.",
  ],
  otherKitten:
    "Có nhiều lựa chọn tốt hơn... nhưng câu chuyện này không thuộc về nó.",
  destiny: [
    "Nó không phải đứa mạnh nhất.",
    "Không phải đứa đẹp nhất.",
    "Cũng chẳng phải đứa nổi bật nhất.",
    "Nhưng bằng một cách nào đó...",
    "bàn tay ấy đã chọn nó.",
    "Không ai biết vì sao bàn tay ấy dừng lại trước Đen.",
  ],
};


const KITTENS = [
  {
    id: "orange",
    name: "Cam",
    x: 292,
    y: 310,
    scale: 0.68,
    body: 0xe59645,
    accent: 0xffc177,
    eye: 0x28313a,
    tailLength: 1,
    pose: "pounce",
    toy: "yarn",
    text: "Khỏe mạnh.",
  },
  {
    id: "den",
    name: "Đen",
    x: 452,
    y: 330,
    scale: 0.56,
    body: 0x111317,
    accent: 0x252932,
    eye: 0xb9f7ff,
    tailLength: 0.33,
    pose: "sit",
    toy: "feather",
    text: "Nhỏ hơn những đứa khác.\nNhưng đôi mắt rất sáng.\n\nChiếc đuôi nhỏ ấy cũng chẳng giống ai.",
    isDen: true,
  },
  {
    id: "white",
    name: "Trắng",
    x: 592,
    y: 300,
    scale: 0.66,
    body: 0xf4eee3,
    accent: 0xd7cfc4,
    eye: 0x31425a,
    tailLength: 1,
    pose: "roll",
    toy: "block",
    text: "Tinh nghịch.",
  },
  {
    id: "tabby",
    name: "Mướp",
    x: 720,
    y: 322,
    scale: 0.67,
    body: 0x8d745c,
    accent: 0xc2a07b,
    stripe: 0x4f3b2d,
    eye: 0x243138,
    tailLength: 1,
    pose: "stretch",
    toy: "yarn",
    text: "Năng động.",
  },
];

const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  init(data = {}) {
    this.phase = "intro";
    this.uiObjects = [];
    this.kittenNodes = new Map();
    this.gameSettings = SettingsManager.load();
    SettingsManager.applyToScene(this, this.gameSettings);
    this.forceReplay = data.forceReplay === true;
  }

  saveSettings() {
    SettingsManager.save(this.gameSettings);
    SettingsManager.applyToScene(this, this.gameSettings);
  }

  preload() {
    this.load.image("den-kitten", "./img/den_kitten.webp");
    this.load.image("den-title-card", "./assets/ui/den-title-card.png");
    this.load.image("den-logo-original", "./assets/ui/den-logo.png");
    this.load.image("background_1", "./img/background_1.webp");
  }

  create() {
    this.phase = "scene-one";
    this.sceneOneIndex = 0;
    this.destinyIndex = 0;
    this.selectionLocked = false;
    this.livingRoomObjects = [];
    this.uiObjects = [];

    this.cameras.main.setBackgroundColor("#020202");
    this.createPixelTextures();
    this.createMissingPhotoTexture();
    this.createLivingRoom();
    this.createKittens();
    this.createSelectionUi();
    this.createDenPortrait();

    this.sceneTitle = this.add
      .text(54, 44, "Đàn mèo", {
        fontFamily: '"DearPix", system-ui, sans-serif',
        fontSize: "24px",
        fontStyle: "700",
        color: "#f7d995",
      })
      .setAlpha(0)
      .setDepth(45);

    this.textBox = new TextBox(this, { y: 348, height: 142 });
    this.layoutTextBox();

    this.fade = this.add.rectangle(480, 270, 960, 540, 0x020202, 1).setDepth(100);
    
    this.uiObjects.push(this.sceneTitle, this.textBox.container, this.descCard, this.denPortrait, this.fade);

    this.uiCamera = this.cameras.add(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.cameras.main.ignore(this.uiObjects);
    this.uiCamera.ignore(this.livingRoomObjects);

    this.input.on("pointerdown", this.handleSceneTap, this);
    this.scale.on("resize", this.layoutTextBox, this);

    if (!this.forceReplay && window.localStorage?.getItem("den-story:intro-seen") === "true") {
      this.scene.start("ChapterOneScene");
      return;
    }

    this.playMeowHook();
    this.tweens.add({ targets: this.fade, alpha: 0, duration: 900, ease: "Sine.easeOut" });
    this.tweens.add({ targets: this.sceneTitle, alpha: 1, duration: 800, delay: 450 });
    this.time.delayedCall(450, () => this.textBox.showLine(INTRO_TEXT.sceneOne[0], 30));
    this.time.delayedCall(1250, () => this.revealLivingRoom());
  }

  layoutTextBox() {
    if (!this.textBox) {
      return;
    }

    this.textBox.resize(820, 70);
  }

  createLivingRoom() {
    const wall = this.add.rectangle(480, 198, 960, 396, 0x24312f, 1).setDepth(1).setAlpha(0);
    const floor = this.add.rectangle(480, 466, 960, 148, 0x3a2b24, 1).setDepth(1).setAlpha(0);
    const rua = this.add.rectangle(500, 450, 680, 74, 0x8a4d55, 1).setDepth(2).setAlpha(0);
    const windowFrame = this.add.rectangle(170, 112, 122, 86, 0x6f8f88, 1).setDepth(2).setAlpha(0);
    const windowGlass = this.add.rectangle(170, 112, 104, 68, 0xd9f6f0, 1).setDepth(3).setAlpha(0);
    const lampStem = this.add.rectangle(820, 184, 12, 126, 0x7a5a3d, 1).setDepth(2).setAlpha(0);
    const lampShade = this.add.triangle(820, 106, 0, 60, 72, 60, 52, 0, 0xf0c978, 1).setDepth(3).setAlpha(0);

    this.sofa = this.add.container(480, 294).setAlpha(0).setDepth(5);
    const sofaShadow = this.add.rectangle(12, 116, 690, 34, 0x000000, 0.28);
    const sofaSprite = this.add.image(0, 24, "sofa-mint-pixel").setDisplaySize(760, 250);
    this.sofa.add([sofaShadow, sofaSprite]);

    this.livingRoomObjects.push(wall, floor, rua, windowFrame, windowGlass, lampStem, lampShade, this.sofa);
    this.createToys();
    this.createDustPixels();
  }

  createPixelTextures() {
    if (this.textures.exists("sofa-mint-pixel")) {
      return;
    }

    const toCss = (color) => `#${color.toString(16).padStart(6, "0")}`;
    const rect = (ctx, x, y, width, height, color) => {
      ctx.fillStyle = typeof color === "number" ? toCss(color) : color;
      ctx.fillRect(x, y, width, height);
    };
    const tri = (ctx, points, color) => {
      ctx.fillStyle = typeof color === "number" ? toCss(color) : color;
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      points.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.closePath();
      ctx.fill();
    };

    const sofa = document.createElement("canvas");
    sofa.width = 190;
    sofa.height = 80;
    const sofaCtx = sofa.getContext("2d");
    sofaCtx.imageSmoothingEnabled = false;
    rect(sofaCtx, 10, 35, 170, 28, "#66b99f");
    rect(sofaCtx, 20, 14, 150, 40, "#85d9bd");
    rect(sofaCtx, 2, 29, 20, 38, "#58a98d");
    rect(sofaCtx, 168, 29, 20, 38, "#58a98d");
    rect(sofaCtx, 4, 24, 18, 7, "#9be7d0");
    rect(sofaCtx, 168, 24, 18, 7, "#9be7d0");
    rect(sofaCtx, 27, 28, 47, 28, "#9ce4cf");
    rect(sofaCtx, 77, 29, 47, 28, "#9ce4cf");
    rect(sofaCtx, 127, 28, 47, 28, "#9ce4cf");
    rect(sofaCtx, 27, 28, 47, 3, "#c6fff0");
    rect(sofaCtx, 77, 29, 47, 3, "#c6fff0");
    rect(sofaCtx, 127, 28, 47, 3, "#c6fff0");
    rect(sofaCtx, 25, 56, 150, 7, "#4e9d83");
    rect(sofaCtx, 18, 64, 15, 12, "#4a3027");
    rect(sofaCtx, 157, 64, 15, 12, "#4a3027");
    rect(sofaCtx, 30, 19, 138, 3, "#bffff1");
    rect(sofaCtx, 10, 35, 3, 28, "#2f6c5c");
    rect(sofaCtx, 177, 35, 3, 28, "#2f6c5c");
    this.textures.addCanvas("sofa-mint-pixel", sofa);

    KITTENS.forEach((kitten) => {
      for (let frame = 0; frame < 2; frame++) {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        const body = toCss(kitten.body);
        const accent = toCss(kitten.accent);
        const outline = kitten.isDen ? "#050607" : "#3f3029";
        const eyeColorOriginal = toCss(kitten.eye);

        rect(ctx, 16, 45, 28, 4, "rgba(0,0,0,0.18)");
        
        let tailOffsetY = 0;
        if (kitten.id === "orange" && frame === 1) tailOffsetY = -2;
        if (kitten.id === "den" && frame === 1) tailOffsetY = 1;
        
        if (kitten.tailLength < 1) {
          rect(ctx, 15, 37 + tailOffsetY, 6, 5, outline);
          rect(ctx, 16, 38 + tailOffsetY, 4, 3, accent);
        } else {
          rect(ctx, 7, 34 + tailOffsetY, 14, 5, outline);
          rect(ctx, 9, 33 + tailOffsetY, 12, 4, accent);
          rect(ctx, 3, 30 + tailOffsetY, 6, 5, outline);
          rect(ctx, 4, 30 + tailOffsetY, 4, 3, accent);
        }

        let headOffsetX = 0;
        let headOffsetY = 0;
        if (kitten.id === "tabby" && frame === 1) { headOffsetX = 1; headOffsetY = 1; }
        if (kitten.id === "white" && frame === 1) { headOffsetY = -2; }
        if (kitten.id === "orange" && frame === 1) { headOffsetY = 1; }

        rect(ctx, 19, 32, 23, 14, outline);
        rect(ctx, 21, 31, 19, 13, body);
        rect(ctx, 24, 38, 14, 6, accent);
        rect(ctx, 20, 45, 6, 3, outline);
        rect(ctx, 33, 45, 6, 3, outline);
        rect(ctx, 21, 44, 4, 3, accent);
        rect(ctx, 34, 44, 4, 3, accent);

        let hx = headOffsetX;
        let hy = headOffsetY;
        rect(ctx, 27+hx, 15+hy, 24, 23, outline);
        rect(ctx, 29+hx, 17+hy, 20, 20, body);
        tri(ctx, [[25+hx, 16+hy], [30+hx, 5+hy], [36+hx, 17+hy]], outline);
        tri(ctx, [[43+hx, 16+hy], [51+hx, 6+hy], [51+hx, 24+hy]], outline);
        tri(ctx, [[28+hx, 16+hy], [31+hx, 9+hy], [34+hx, 17+hy]], accent);
        tri(ctx, [[45+hx, 16+hy], [50+hx, 10+hy], [49+hx, 21+hy]], accent);
        
        let eyeColor = eyeColorOriginal;
        if (kitten.id === "den" && frame === 1) eyeColor = outline;

        rect(ctx, 32+hx, 23+hy, 5, 6, eyeColor);
        rect(ctx, 43+hx, 23+hy, 5, 6, eyeColor);
        
        if (eyeColor !== outline) {
          rect(ctx, 34+hx, 24+hy, 2, 2, "#ffffff");
          rect(ctx, 45+hx, 24+hy, 2, 2, "#ffffff");
        }
        
        rect(ctx, 39+hx, 31+hy, 4, 3, "#d89095");
        rect(ctx, 35+hx, 34+hy, 5, 2, outline);
        rect(ctx, 42+hx, 34+hy, 5, 2, outline);

        if (kitten.stripe) {
          const stripe = toCss(kitten.stripe);
          rect(ctx, 24, 32, 3, 11, stripe);
          rect(ctx, 31, 31, 3, 12, stripe);
          rect(ctx, 38, 32, 3, 10, stripe);
          rect(ctx, 34+hx, 18+hy, 3, 6, stripe);
          rect(ctx, 40+hx, 18+hy, 3, 6, stripe);
          rect(ctx, 46+hx, 20+hy, 3, 5, stripe);
        }

        if (kitten.id === "white") {
          rect(ctx, 37+hx, 16+hy, 5, 4, "#ffffff");
          rect(ctx, 22, 32, 6, 5, "#ffffff");
        }

        if (kitten.isDen) {
          rect(ctx, 31+hx, 20+hy, 13, 4, "#2d3139");
        }

        this.textures.addCanvas(`kitten-${kitten.id}-${frame}`, canvas);
      }
    });
  }


  createMissingPhotoTexture() {
    if (this.textures.exists("den-photo-needed")) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#11100d";
    ctx.fillRect(0, 0, 320, 320);
    ctx.strokeStyle = "#ffe0a1";
    ctx.lineWidth = 8;
    ctx.strokeRect(18, 18, 284, 284);
    ctx.fillStyle = "#ffe0a1";
    ctx.font = "bold 24px DearPix, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Đặt ảnh gốc Đen", 160, 142);
    ctx.font = "18px VT323, monospace";
    ctx.fillText("den_kitten.webp", 160, 178);
    ctx.fillText("vào img/", 160, 208);
    this.textures.addCanvas("den-photo-needed", canvas);
  }

  createDustPixels() {
    for (let i = 0; i < 36; i += 1) {
      const speck = this.add
        .rectangle(
          Phaser.Math.Between(20, 940),
          Phaser.Math.Between(34, 430),
          Phaser.Math.Between(2, 5),
          Phaser.Math.Between(2, 5),
          0xffffff,
          Phaser.Math.FloatBetween(0.025, 0.065),
        )
        .setDepth(4)
        .setAlpha(0);
      this.livingRoomObjects.push(speck);
    }
  }

  createToys() {
    const yarnA = this.drawYarnBall(352, 374, 0xff7d8c);
    const yarnB = this.drawYarnBall(745, 382, 0x77c6ff);

    const block = this.add.rectangle(610, 370, 28, 28, 0xf2c14e, 1).setDepth(13).setAlpha(0);
    block.rotation = 0.28;

    this.livingRoomObjects.push(yarnA, yarnB, block);
  }

  drawYarnBall(x, y, color) {
    const ball = this.add.container(x, y).setDepth(13).setAlpha(0);
    const base = this.add.rectangle(0, 0, 34, 34, color, 1);
    const lineA = this.add.rectangle(0, -7, 28, 4, 0xffffff, 0.28);
    const lineB = this.add.rectangle(0, 4, 30, 4, 0xffffff, 0.24);
    const tail = this.add.rectangle(24, 14, 34, 4, color, 1);
    tail.rotation = 0.28;
    ball.add([tail, base, lineA, lineB]);
    return ball;
  }

  createKittens() {
    KITTENS.forEach((kitten) => {
      const node = this.drawKitten(kitten);
      node.setAlpha(0);
      this.kittenNodes.set(kitten.id, node);
      this.livingRoomObjects.push(node);
    });
  }

  createSelectionUi() {
    this.descCard = this.add.container(480, 464).setDepth(48).setAlpha(0);
    
    const descBg = this.add.graphics();
    descBg.fillStyle(0x0a0908, 0.90);
    descBg.fillRoundedRect(-340, -64, 680, 128, 12);
    descBg.lineStyle(2, 0xffe0a1, 0.4);
    descBg.strokeRoundedRect(-340, -64, 680, 128, 12);
      
    this.description = this.add
      .text(0, 0, "", {
        fontFamily: '"DearPix", system-ui, sans-serif',
        fontSize: "21px",
        color: "#ffe0a1",
        align: "center",
        lineSpacing: 6,
        wordWrap: { width: 620 },
      })
      .setOrigin(0.5, 0.5);
      
    this.descCard.add([descBg, this.description]);
  }

  createDenPortrait() {
    this.denPortrait = this.add.container(736, 174).setAlpha(0).setDepth(78).setScrollFactor(0);
    const portraitKey = this.textures.exists("den-kitten") ? "den-kitten" : "den-photo-needed";
    const shadow = this.add.rectangle(8, 8, 270, 286, 0x000000, 0.35);
    const frame = this.add.rectangle(0, 0, 270, 286, 0x11100d, 0.92).setStrokeStyle(4, 0xffe0a1, 1);
    const portrait = this.add
      .image(0, -10, portraitKey)
      .setDisplaySize(246, 246)
      .setOrigin(0.5);
    const labelBack = this.add.rectangle(0, 156, 270, 40, 0x11100d, 0.96);
    const label = this.add
      .text(0, 156, portraitKey === "den-kitten" ? "Đen hồi nhỏ" : "Cần ảnh gốc của Đen", {
        fontFamily: '"DearPix", system-ui, sans-serif',
        fontSize: "16px",
        color: "#ffe0a1",
      })
      .setOrigin(0.5);

    this.denPortrait.add([shadow, frame, portrait, labelBack, label]);
  }


  drawKitten(kitten) {
    const container = this.add.container(kitten.x, kitten.y).setDepth(20);
    const displaySize = 132 * kitten.scale;
    const shadow = this.add.ellipse(0, 28 * kitten.scale, displaySize * 0.6, displaySize * 0.16, 0x000000, 0.22);
    const sprite = this.add
      .image(0, 0, `kitten-${kitten.id}-0`)
      .setDisplaySize(displaySize, displaySize)
      .setOrigin(0.5);

    container.add([shadow, sprite]);

    this.applyKittenPose(container, kitten);
    this.addPlayfulMotion(container, kitten, sprite);

    container.setInteractive(
      new Phaser.Geom.Rectangle(-displaySize * 0.48, -displaySize * 0.5, displaySize * 0.96, displaySize * 0.94),
      Phaser.Geom.Rectangle.Contains,
    );
    container.on("pointerover", () => this.describeKitten(kitten, container));
    container.on("pointerout", () => this.clearDescription());
    container.on("pointerdown", (pointer, localX, localY, event) => {
      event?.stopPropagation();
      this.selectKitten(kitten, container);
    });

    return container;
  }

  applyKittenPose(container, kitten) {
    if (kitten.pose === "pounce") {
      container.rotation = -0.08;
    }

    if (kitten.pose === "roll") {
      container.rotation = 0.1;
      container.setY(container.y + 10);
    }

    if (kitten.pose === "stretch") {
      container.rotation = 0.06;
    }
  }

  addPlayfulMotion(container, kitten, sprite) {
    const delay = KITTENS.findIndex((item) => item.id === kitten.id) * 160;
    this.tweens.add({
      targets: container,
      y: container.y - (kitten.isDen ? 4 : 7),
      duration: kitten.isDen ? 1250 : 950,
      delay,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.time.addEvent({
      delay: kitten.isDen ? 2400 : 800 + Phaser.Math.Between(0, 400),
      loop: true,
      callback: () => {
        if (!sprite.active) return;
        sprite.setTexture(`kitten-${kitten.id}-1`);
        this.time.delayedCall(kitten.isDen ? 180 : 250, () => {
          if (sprite.active) sprite.setTexture(`kitten-${kitten.id}-0`);
        });
      }
    });
  }

  revealLivingRoom() {
    this.tweens.add({
      targets: this.livingRoomObjects,
      alpha: 1,
      duration: 1300,
      ease: "Sine.easeOut",
    });

    this.kittenNodes.forEach((node, id) => {
      node.setAlpha(0);
      this.tweens.add({
        targets: node,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 750,
        delay: id === "den" ? 820 : Phaser.Math.Between(260, 660),
        ease: "Sine.easeOut",
      });
    });
  }

  handleSceneTap() {
    if (this.textBox.completeLine()) {
      return;
    }

    if (this.phase === "scene-one") {
      this.sceneOneIndex += 1;
      if (this.sceneOneIndex < INTRO_TEXT.sceneOne.length) {
        this.textBox.showLine(INTRO_TEXT.sceneOne[this.sceneOneIndex], 28);
        return;
      }

      this.startSelection();
      return;
    }

    if (this.phase === "destiny") {
      this.advanceDestiny();
    }
  }

  startSelection() {
    this.phase = "selection";
    this.sceneTitle.setAlpha(0);
    this.layoutTextBox();
    this.textBox.hide();

    this.kittenNodes.forEach((node) => {
      node.setInteractive(node.input.hitArea, Phaser.Geom.Rectangle.Contains);
    });
  }

  describeKitten(kitten, node) {
    if (this.phase !== "selection" || this.selectionLocked) {
      return;
    }

    this.description.setText(kitten.text);
    this.tweens.killTweensOf(this.descCard);
    this.descCard.setAlpha(1);

    this.tweens.killTweensOf(node);
    this.tweens.add({ targets: node, scaleX: 1.1, scaleY: 1.1, duration: 140 });
  }

  clearDescription() {
    if (this.phase !== "selection" || this.selectionLocked) {
      return;
    }

    this.tweens.add({ targets: this.descCard, alpha: 0, duration: 250 });
    
    this.kittenNodes.forEach((node) => {
      this.tweens.add({ targets: node, scaleX: 1, scaleY: 1, duration: 140 });
    });
  }

  selectKitten(kitten, node) {
    if (this.phase !== "selection" || this.selectionLocked) {
      return;
    }

    this.describeKitten(kitten, node);

    if (!kitten.isDen) {
      this.selectionLocked = true;
      this.textBox.setInstant(kitten.rejectText ?? INTRO_TEXT.otherKitten);
      this.time.delayedCall(2600, () => {
        this.textBox.hide();
        this.clearDescription();
        this.selectionLocked = false;
      });
      return;
    }

    this.selectionLocked = true;
    
    // Fade out UI
    this.tweens.add({
      targets: [this.descCard, this.textBox.container],
      alpha: 0,
      duration: 300,
    });
    
    const blackFade = this.add.rectangle(480, 270, 960, 540, 0x000000, 1)
      .setDepth(99)
      .setAlpha(0);
      
    // Emotional pause then fade to black
    this.tweens.add({
      targets: blackFade,
      alpha: 1,
      duration: 1000,
      delay: 600,
      onComplete: () => {
        blackFade.destroy();
        this.startDestiny(node);
      }
    });
  }


  startDestiny(denNode) {
    window.localStorage?.setItem("den-story:intro-seen", "true");
    this.phase = "destiny";
    this.sceneTitle.setText("Định mệnh");
    this.selectionLocked = true;
    this.textBox.resize(560, 60);
    this.descCard.setAlpha(0);

    const introFade = this.add.rectangle(480, 270, 960, 540, 0x000000, 1).setDepth(99);
    this.tweens.add({ targets: introFade, alpha: 0, duration: 1500, delay: 200 });

    // Lower the background music volume
    this.tweens.add({
      targets: this.sound,
      volume: 0.15,
      duration: 3000
    });

    this.kittenNodes.forEach((node) => {
      node.disableInteractive();
      if (node !== denNode) {
        node.setAlpha(0.24);
      }
    });

    this.tweens.killTweensOf(denNode);
    this.tweens.add({
      targets: denNode,
      rotation: 0,
      scaleX: 1.28,
      scaleY: 1.28,
      duration: 900,
      ease: "Sine.easeInOut",
    });

    this.cameras.main.pan(denNode.x, denNode.y - 10, 1700, "Sine.easeInOut");
    this.cameras.main.zoomTo(1.45, 2100, "Sine.easeInOut");
    
    // Defer showing the portrait until the last text line
    this.denPortrait.setAlpha(0);
    this.denPortrait.setX(760);

    this.time.delayedCall(1650, () => this.textBox.showLine(INTRO_TEXT.destiny[0], 30));
  }

  advanceDestiny() {
    this.destinyIndex += 1;

    if (this.destinyIndex === INTRO_TEXT.destiny.length - 1) {
      // Reveal portrait on the last line
      this.tweens.add({
        targets: this.denPortrait,
        alpha: 1,
        duration: 1200,
        ease: "Sine.easeOut",
      });
    }

    if (this.destinyIndex < INTRO_TEXT.destiny.length) {
      this.textBox.showLine(INTRO_TEXT.destiny[this.destinyIndex], 30);
      return;
    }

    this.showLoaoAndStart();
  }

  showLoaoAndStart() {
    this.phase = "logo";
    if (this.textBox) this.textBox.hide();
    if (this.sceneTitle) this.sceneTitle.setAlpha(0);
    
    if (this.denPortrait) {
      this.tweens.add({ targets: this.denPortrait, alpha: 0, duration: 500, ease: "Sine.easeIn" });
    }
    this.cameras.main.pan(GAME_WIDTH / 2, GAME_HEIGHT / 2, 900, "Sine.easeInOut");
    this.cameras.main.zoomTo(1, 900, "Sine.easeInOut");

    let splashDelay = 1000;
    
    // Solid dark elegant background
    const overlay = this.add.rectangle(480, 270, 960, 540, 0x0a0908, 1).setDepth(80).setAlpha(0);
    this.uiObjects.push(overlay);

    const titleX = 480;
    const titleY = 220;

    const titleText = this.add.text(titleX, titleY, "ĐEN", {
      fontFamily: '"DearPix", system-ui, sans-serif',
      fontSize: "132px",
      fontStyle: "700",
      color: "#f5e6d3",
      shadow: { offsetX: 0, offsetY: 0, color: "#ffe0a1", blur: 15, fill: true },
    }).setOrigin(0.5).setDepth(82).setAlpha(0);

    this.uiObjects.push(titleText);

    const hasStarted = window.localStorage?.getItem("den-story:has-started") === "true";
    let startY = 360;
    const btnX = 480;
    const buttons = [];

    if (hasStarted) {
      buttons.push(this.createMainMenuButton(btnX, startY, "Tiếp tục", () => this.scene.start("ChapterOneScene"), true));
      startY += 54;
      buttons.push(this.createMainMenuButton(btnX, startY, "Chơi mới", () => {
        window.localStorage?.removeItem("den-story:intro-seen");
        window.localStorage?.removeItem("den-story:has-started");
        this.scene.restart({ forceReplay: true });
      }, false));
      startY += 54;
    } else {
      buttons.push(this.createMainMenuButton(btnX, startY, "Bắt đầu", () => {
        window.localStorage?.setItem("den-story:intro-seen", "true");
        window.localStorage?.setItem("den-story:has-started", "true");
        this.scene.start("ChapterOneScene");
      }, true));
      startY += 54;
    }

    buttons.push(this.createMainMenuButton(btnX, startY, "Cài đặt", () => this.showSettingsPanel(), false));
    
    this.cameras.main.ignore([overlay, titleText, ...buttons]);
    this.uiObjects.push(...buttons);

    this.tweens.add({ targets: overlay, alpha: 1, duration: 1500, ease: "Sine.easeInOut" });
    this.tweens.add({ targets: titleText, alpha: 1, y: "-=12", duration: 2000, delay: 500, ease: "Sine.easeOut" });
    
    buttons.forEach((b, index) => {
      this.tweens.add({ targets: b, alpha: 1, y: "-=6", duration: 800, delay: 1800 + (index * 150), ease: "Sine.easeOut" });
    });
  }

  createMainMenuButton(x, y, label, onClick, isPrimary = false) {
    const container = this.add.container(x, y + 6).setDepth(83).setAlpha(0);
    
    const text = this.add.text(0, 0, label, {
      fontFamily: '"DearPix", system-ui, sans-serif',
      fontSize: "22px",
      fontStyle: "500",
      color: isPrimary ? "#ffe0a1" : "#cfc6b8",
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    const indicator = this.add.text(-(text.width / 2) - 16, 0, ">", {
      fontFamily: '"DearPix", system-ui, sans-serif',
      fontSize: "22px",
      color: "#ffe0a1",
    }).setOrigin(0.5).setAlpha(0);

    container.add([indicator, text]);

    text.on("pointerover", () => {
      text.setColor("#ffffff");
      indicator.setAlpha(1);
      indicator.x = -(text.width / 2) - 18;
      this.tweens.add({ targets: container, scaleX: 1.08, scaleY: 1.08, duration: 150 });
      this.playUIHook();
    });
    
    text.on("pointerout", () => {
      text.setColor(isPrimary ? "#ffe0a1" : "#cfc6b8");
      indicator.setAlpha(0);
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 150 });
    });
    
    text.on("pointerdown", (pointer, localX, localY, event) => {
      event?.stopPropagation();
      this.playUIHook();
      onClick();
    });

    return container;
  }

  playUIHook() {
    if (this.cache.audio.exists("ui-click")) {
      this.sound.play("ui-click", { volume: 0.25 });
    } else {
      window.dispatchEvent(new CustomEvent("den-story:ui-click"));
    }
  }

  showSettingsPanel() {
    if (this.settingsContainer) return;
    
    this.settingsContainer = this.add.container(480, 270).setDepth(100).setAlpha(0);
    const overlay = this.add.rectangle(0, 0, 960, 540, 0x000000, 0.76).setInteractive();
    const panel = this.add.rectangle(0, 0, 440, 360, 0x11100d, 0.96).setStrokeStyle(2, 0xffe0a1, 1);
    
    const title = this.add.text(0, -140, "CÀI ĐẶT", {
      fontFamily: '"DearPix", system-ui, sans-serif',
      fontSize: "26px",
      fontStyle: "700",
      color: "#ffe0a1",
    }).setOrigin(0.5);
    
    const closePanel = () => {
      this.saveSettings();
      this.tweens.add({
        targets: this.settingsContainer,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this.settingsContainer.destroy();
          this.settingsContainer = null;
        }
      });
    };

    const closeIcon = this.add.text(190, -150, "[X]", {
      fontFamily: '"DearPix", system-ui, sans-serif',
      fontSize: "19px",
      fontStyle: "700",
      color: "#cfc6b8"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    closeIcon.on("pointerover", () => closeIcon.setColor("#ff4444").setScale(1.2));
    closeIcon.on("pointerout", () => closeIcon.setColor("#cfc6b8").setScale(1));
    closeIcon.on("pointerdown", () => {
      this.playUIHook();
      closePanel();
    });
    
    this.settingsContainer.add([overlay, panel, title, closeIcon]);

    const options = [
      { key: "soundVol", label: "Âm thanh", type: "number", min: 0, max: 10, format: (v) => `${v * 10}%` },
      { key: "musicVol", label: "Nhạc nền", type: "number", min: 0, max: 10, format: (v) => `${v * 10}%` },
      { key: "textSpeed", label: "Tốc độ chữ", type: "enum", values: ["Chậm", "Bình thường", "Nhanh"] },
      { key: "autoAdvance", label: "Tự động thoại", type: "bool", values: ["Tắt", "Bật"] }
    ];

    let startY = -80;
    options.forEach((opt) => {
      const lbl = this.add.text(-40, startY, opt.label, {
        fontFamily: '"DearPix", system-ui, sans-serif',
        fontSize: "20px",
        color: "#cfc6b8",
      }).setOrigin(1, 0.5);
      
      const valText = this.add.text(100, startY, "", {
        fontFamily: '"DearPix", system-ui, sans-serif',
        fontSize: "18px",
        fontStyle: "600",
        color: "#ffe0a1",
      }).setOrigin(0.5, 0.5);

      const updateValText = () => {
        let val = this.gameSettings[opt.key];
        if (opt.type === "number") valText.setText(opt.format(val));
        else if (opt.type === "enum") valText.setText(opt.values[val]);
        else if (opt.type === "bool") valText.setText(opt.values[val ? 1 : 0]);
      };
      updateValText();

      const btnLeft = this.add.text(35, startY, "<", {
        fontFamily: '"DearPix", system-ui, sans-serif',
        fontSize: "20px",
        fontStyle: "600",
        color: opt.values && opt.values.length === 1 ? "#5a5446" : "#cfc6b8",
      }).setOrigin(0.5).setInteractive({ useHandCursor: opt.values?.length !== 1 });
      
      btnLeft.on("pointerdown", () => {
        if (opt.values && opt.values.length === 1) return;
        this.playUIHook();
        if (opt.type === "number" && this.gameSettings[opt.key] > opt.min) this.gameSettings[opt.key]--;
        else if (opt.type === "enum" && this.gameSettings[opt.key] > 0) this.gameSettings[opt.key]--;
        else if (opt.type === "bool") this.gameSettings[opt.key] = !this.gameSettings[opt.key];
        updateValText();
        this.saveSettings();
      });

      const btnRight = this.add.text(165, startY, ">", {
        fontFamily: '"DearPix", system-ui, sans-serif',
        fontSize: "20px",
        fontStyle: "600",
        color: opt.values && opt.values.length === 1 ? "#5a5446" : "#cfc6b8",
      }).setOrigin(0.5).setInteractive({ useHandCursor: opt.values?.length !== 1 });
      
      btnRight.on("pointerdown", () => {
        if (opt.values && opt.values.length === 1) return;
        this.playUIHook();
        if (opt.type === "number" && this.gameSettings[opt.key] < opt.max) this.gameSettings[opt.key]++;
        else if (opt.type === "enum" && this.gameSettings[opt.key] < opt.values.length - 1) this.gameSettings[opt.key]++;
        else if (opt.type === "bool") this.gameSettings[opt.key] = !this.gameSettings[opt.key];
        updateValText();
        this.saveSettings();
      });
      
      if (opt.values?.length !== 1) {
        [btnLeft, btnRight].forEach(b => {
          b.on("pointerover", () => b.setColor("#ffffff").setScale(1.2));
          b.on("pointerout", () => b.setColor("#cfc6b8").setScale(1));
        });
      }

      this.settingsContainer.add([lbl, valText, btnLeft, btnRight]);
      startY += 40;
    });



    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    const xKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    const closeOnKey = () => {
      this.playUIHook();
      escKey.destroy();
      xKey.destroy();
      closePanel();
    };
    escKey.once("down", closeOnKey);
    xKey.once("down", closeOnKey);

    let deleteConfirmSteps = 0;
    const deleteBtn = this.createMainMenuButton(0, startY + 54, "Xóa tiến trình", () => {
      this.playUIHook();
      if (deleteConfirmSteps === 0) {
        deleteConfirmSteps = 1;
        deleteBtn.list[1].setText("Xác nhận xóa?");
        deleteBtn.list[1].setColor("#ff4444");
        deleteBtn.list[0].setStrokeStyle(2, 0xff4444, 1);
        
        this.time.delayedCall(3000, () => {
          if (deleteConfirmSteps === 1 && this.settingsContainer) {
            deleteConfirmSteps = 0;
            deleteBtn.list[1].setText("Xóa tiến trình");
            deleteBtn.list[1].setColor("#cfc6b8");
            deleteBtn.list[0].setStrokeStyle(2, 0x5a5446, 1);
          }
        });
      } else {
        localStorage.removeItem("den-story-has-started");
        window.location.reload();
      }
    }, false);
    
    this.settingsContainer.add([deleteBtn]);
    this.cameras.main.ignore(this.settingsContainer);
    
    this.tweens.add({ targets: this.settingsContainer, alpha: 1, duration: 250 });
  }

  playMeowHook() {
    if (this.cache.audio.exists("kitten-meow")) {
      this.sound.play("kitten-meow", { volume: 0.35 });
      return;
    }

    window.dispatchEvent(new CustomEvent("den-story:kitten-meow"));

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return;
    }

    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(620, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(360, context.currentTime + 0.22);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.28);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.3);
    } catch {
      console.info("den-story: kitten meow placeholder hook");
    }
  }
}


