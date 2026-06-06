import TextBox from "../ui/TextBox.js?v=game-fonts-1";

const INTRO_TEXT = {
  sceneOne: [
    "Trong một góc nhỏ của thành phố, một mèo mẹ đang cố gắng nuôi những đứa con cuối cùng của mình.",
    "Trên chiếc sofa xanh mint cũ, bốn đứa nhỏ lăn qua lăn lại như thể cả thế giới chỉ vừa mới bắt đầu.",
    "Ba đứa tranh nhau cuộn len, cắn món đồ chơi, gọi sự chú ý bằng tất cả sức sống bé xíu của chúng.",
    "Còn một đứa đen nhánh nằm nép hơn một chút. Nhỏ hơn. Im hơn. Nhưng đôi mắt thì không chịu tắt.",
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
    y: 300,
    scale: 0.82,
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
    y: 326,
    scale: 0.64,
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
    y: 292,
    scale: 0.78,
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
    y: 314,
    scale: 0.8,
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
    this.forceReplay = data.forceReplay === true;
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
    this.kittenNodes = new Map();
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
        fontFamily: '"Silkscreen", "Pixelify Sans", system-ui, sans-serif',
        fontSize: "22px",
        color: "#f7d995",
      })
      .setAlpha(0)
      .setDepth(45);

    this.textBox = new TextBox(this, { y: 348, height: 142 });
    this.layoutTextBox();

    this.fade = this.add.rectangle(480, 270, 960, 540, 0x020202, 1).setDepth(100);
    
    this.uiObjects.push(this.sceneTitle, this.textBox.container, this.selectionHint, this.description, this.denPortrait, this.fade);

    this.uiCamera = this.cameras.add(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.cameras.main.ignore(this.uiObjects);
    this.uiCamera.ignore(this.livingRoomObjects);

    this.input.on("pointerdown", this.handleSceneTap, this);
    this.scale.on("resize", this.layoutTextBox, this);

    if (!this.forceReplay && window.localStorage?.getItem("den-story:intro-seen") === "true") {
      this.fade.setAlpha(0);
      this.livingRoomObjects.forEach(obj => obj.setAlpha(1));
      this.showLoaoAndStart();
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
          rect(ctx, 21, 37, 19, 3, "#6c1c2e");
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
    ctx.font = "bold 24px Pixelify Sans, sans-serif";
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
    const feather = this.add.container(492, 386).setDepth(13).setAlpha(0);
    const stick = this.add.rectangle(0, 0, 90, 5, 0x7a5636, 1);
    stick.rotation = -0.3;
    const plumeA = this.add.triangle(45, -14, 0, 18, 18, 0, 34, 18, 0xf5d76e, 1);
    plumeA.rotation = -0.3;
    const plumeB = this.add.triangle(60, -6, 0, 18, 18, 0, 34, 18, 0xff8c86, 1);
    plumeB.rotation = -0.52;
    feather.add([stick, plumeA, plumeB]);

    const block = this.add.rectangle(610, 370, 28, 28, 0xf2c14e, 1).setDepth(13).setAlpha(0);
    block.rotation = 0.28;

    this.livingRoomObjects.push(yarnA, yarnB, feather, block);
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
    this.selectionHint = this.add
      .text(480, 68, "Hãy chọn một bé mèo", {
        fontFamily: '"Pixelify Sans", system-ui, sans-serif',
        fontSize: "30px",
        color: "#fff5df",
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(48);

    this.description = this.add
      .text(480, 114, "", {
        fontFamily: '"Pixelify Sans", system-ui, sans-serif',
        fontSize: "24px",
        color: "#ffe0a1",
        align: "center",
        lineSpacing: 8,
        wordWrap: { width: 720 },
      })
      .setOrigin(0.5, 0)
      .setAlpha(0)
      .setDepth(48);
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
        fontFamily: '"Pixelify Sans", system-ui, sans-serif',
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
    this.sceneTitle.setText("Lựa chọn");
    this.layoutTextBox();
    this.textBox.hide();
    this.tweens.add({ targets: [this.selectionHint, this.description], alpha: 1, duration: 450 });

    this.kittenNodes.forEach((node) => {
      node.setInteractive(node.input.hitArea, Phaser.Geom.Rectangle.Contains);
    });
  }

  describeKitten(kitten, node) {
    if (this.phase !== "selection" || this.selectionLocked) {
      return;
    }

    this.description.setText(`${kitten.name}: ${kitten.text}`);
    this.tweens.killTweensOf(node);
    this.tweens.add({ targets: node, scaleX: 1.1, scaleY: 1.1, duration: 140 });
  }

  clearDescription() {
    if (this.phase !== "selection" || this.selectionLocked) {
      return;
    }

    this.description.setText("");
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
      targets: [this.selectionHint, this.description, this.textBox.container],
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
    this.phase = "destiny";
    this.sceneTitle.setText("Định mệnh");
    this.selectionLocked = true;
    this.description.setText("");
    this.textBox.resize(610, 46);
    this.selectionHint.setAlpha(0);

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
    this.denPortrait.setX(724);

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

    let splashDelay = 0;
    let splashBg = null;
    if (this.textures.exists("background_1")) {
      splashBg = this.add.image(480, 270, "background_1").setDepth(79).setAlpha(0).setDisplaySize(960, 540);
      this.cameras.main.ignore(splashBg);
      this.uiObjects.push(splashBg);
      this.tweens.add({ targets: splashBg, alpha: 1, duration: 900, ease: "Sine.easeInOut" });
      splashDelay = 2200; 
      this.tweens.add({ targets: splashBg, alpha: 0, duration: 1000, delay: splashDelay + 200 });
    }

    const overlay = this.add.rectangle(480, 270, 960, 540, 0x050403, 0.86).setDepth(80).setAlpha(0);
    this.uiObjects.push(overlay);

    for (let i = 0; i < 24; i++) {
       const p = this.add.rectangle(Phaser.Math.Between(0, 960), Phaser.Math.Between(0, 540), 3, 3, 0xfce1b6, Phaser.Math.FloatBetween(0.08, 0.35)).setDepth(81).setAlpha(0);
       this.uiObjects.push(p);
       this.cameras.main.ignore(p);
       this.tweens.add({
         targets: p,
         y: p.y - Phaser.Math.Between(40, 110),
         alpha: { start: 0, to: p.alpha, yoyo: true },
         duration: Phaser.Math.Between(3500, 7000),
         delay: splashDelay + Phaser.Math.Between(0, 2000),
         repeat: -1
       });
    }

    const silhouette = this.add.image(620, 134, "kitten-den-0").setTintFill(0x000000).setAlpha(0).setDepth(81).setDisplaySize(72, 72);
    this.uiObjects.push(silhouette);

    const titleText = this.add.text(480, 160, "ĐEN", {
      fontFamily: '"Silkscreen", system-ui, sans-serif',
      fontSize: "116px",
      color: "#f5e6d3",
      shadow: { offsetX: 4, offsetY: 5, color: "#000000", blur: 0, fill: true },
    }).setOrigin(0.5).setDepth(82).setAlpha(0);

    const subtitleText = this.add.text(480, 244, "The Story of Tí Meo", {
      fontFamily: '"VT323", monospace',
      fontSize: "30px",
      color: "#d8b688",
      shadow: { offsetX: 2, offsetY: 2, color: "#000000", blur: 0, fill: true },
    }).setOrigin(0.5).setDepth(82).setAlpha(0);

    this.uiObjects.push(titleText, subtitleText);

    const hasStarted = window.localStorage?.getItem("den-story:has-started") === "true";
    let startY = 320;
    const buttons = [];

    if (hasStarted) {
      buttons.push(this.createMainMenuButton(480, startY, "Tiếp tục", () => this.scene.start("ChapterOneScene"), true));
      startY += 54;
      buttons.push(this.createMainMenuButton(480, startY, "Chơi mới", () => {
        window.localStorage?.removeItem("den-story:intro-seen");
        window.localStorage?.removeItem("den-story:has-started");
        this.scene.restart({ forceReplay: true });
      }, false));
      startY += 54;
    } else {
      buttons.push(this.createMainMenuButton(480, startY, "Bắt đầu", () => {
        window.localStorage?.setItem("den-story:has-started", "true");
        this.scene.start("ChapterOneScene");
      }, true));
      startY += 54;
    }

    buttons.push(this.createMainMenuButton(480, startY, "Cài đặt", () => this.showSettingsPanel(), false));
    
    this.cameras.main.ignore([overlay, silhouette, titleText, subtitleText, ...buttons]);
    this.uiObjects.push(...buttons);

    this.tweens.add({ targets: [overlay, silhouette], alpha: 1, duration: 800, delay: splashDelay, ease: "Sine.easeInOut" });
    this.tweens.add({ targets: [titleText, subtitleText], alpha: 1, y: "-=8", duration: 1000, delay: splashDelay + 300, ease: "Sine.easeOut" });
    
    buttons.forEach((b, index) => {
      this.tweens.add({ targets: b, alpha: 1, y: "-=6", duration: 600, delay: splashDelay + 650 + (index * 120), ease: "Sine.easeOut" });
    });
  }

  createMainMenuButton(x, y, label, onClick, isPrimary = false) {
    const container = this.add.container(x, y + 6).setDepth(83).setAlpha(0);
    const width = 230;
    const height = 42;
    
    const bg = this.add.rectangle(0, 0, width, height, 0x11100d, 0.85)
      .setStrokeStyle(2, isPrimary ? 0xffe0a1 : 0x5a5446, 1)
      .setInteractive({ useHandCursor: true });
      
    const text = this.add.text(0, 0, label, {
      fontFamily: '"Silkscreen", "Pixelify Sans", system-ui, sans-serif',
      fontSize: "17px",
      color: isPrimary ? "#ffe0a1" : "#cfc6b8",
    }).setOrigin(0.5);

    container.add([bg, text]);

    bg.on("pointerover", () => {
      bg.setFillStyle(0x1a1814, 0.98);
      bg.setStrokeStyle(2, 0xffe0a1, 1);
      text.setColor("#ffffff");
      this.tweens.add({ targets: container, scaleX: 1.05, scaleY: 1.05, duration: 120 });
    });
    
    bg.on("pointerout", () => {
      bg.setFillStyle(0x11100d, 0.85);
      bg.setStrokeStyle(2, isPrimary ? 0xffe0a1 : 0x5a5446, 1);
      text.setColor(isPrimary ? "#ffe0a1" : "#cfc6b8");
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 120 });
    });
    
    bg.on("pointerdown", (pointer, localX, localY, event) => {
      event?.stopPropagation();
      onClick();
    });

    return container;
  }

  showSettingsPanel() {
    if (this.settingsContainer) return;
    
    this.settingsContainer = this.add.container(480, 270).setDepth(100).setAlpha(0);
    const overlay = this.add.rectangle(0, 0, 960, 540, 0x000000, 0.76).setInteractive();
    const panel = this.add.rectangle(0, 0, 380, 220, 0x11100d, 0.96).setStrokeStyle(2, 0xffe0a1, 1);
    
    const title = this.add.text(0, -60, "CÀI ĐẶT", {
      fontFamily: '"Silkscreen", system-ui, sans-serif',
      fontSize: "22px",
      color: "#ffe0a1",
    }).setOrigin(0.5);
    
    const volText = this.add.text(0, -10, "Âm thanh: 100%", {
      fontFamily: '"Pixelify Sans", system-ui, sans-serif',
      fontSize: "20px",
      color: "#cfc6b8",
    }).setOrigin(0.5);

    const closeBtn = this.createMainMenuButton(0, 60, "Đóng", () => {
      this.tweens.add({
        targets: this.settingsContainer,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this.settingsContainer.destroy();
          this.settingsContainer = null;
        }
      });
    }, true);

    this.settingsContainer.add([overlay, panel, title, volText, closeBtn]);
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


