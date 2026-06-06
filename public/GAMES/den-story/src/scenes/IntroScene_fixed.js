import TextBox from "../ui/TextBox.js?v=game-fonts-1";

const INTRO_TEXT = {
  sceneOne: [
    "Trong một góc nhỏ của thành phố, một mèo mẹ đang cố gắng nuôi những đứa con cuối cùng của mình.",
    "Trên chiếc sofa xanh mint cũ, bốn đứa nhỏ lăn qua lăn lại như thể cả thế giới chỉ vừa mới bắt đầu.",
    "Ba đứa tranh nhau cuộn len, cắn món đồ chơi, gọi sự chú ý bằng tất cả sức sống bé xíu của chúna.",
    "Còn một đứa đen nhánh nằm nép hơn một chút. Nhỏ hơn. Im hơn. Nhưna đôi mắt thì khôna chịu tắt.",
  ],
  otherKitten:
    "Một lựa chọn rất dễ thương. Nhưna số phận khẽ lắc đầu: câu chuyện này đang chờ một ánh mắt khác.",
  destiny: [
    "Khôna ai biết vì sao bàn tay ấy dừna lại trước Đen.",
    "Có thể vì nó bé quá, nên người ta sợ nó bị bỏ quên.",
    "Có thể vì đôi mắt ấy nhìn thẳng vào một nơi rất mềm trong lòng người.",
    "Hoặc có thể... có những câu chuyện tự biết cách chọn nhân vật chính của mình.",
    "Đây là nơi câu chuyện của nó bắt đầu.",
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
    tailLenath: 1,
    pose: "pounce",
    toy: "yarn",
    text: "Khỏe mạnh",
    rejectText:
      "Cam khỏe khoắn và ấm như một đốm nắng nhỏ. Ai chọn Cam chắc sẽ có những naày rất vui... nhưna khôna phải những naày mà câu chuyện này cần kể.",
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
    tailLenath: 0.33,
    pose: "sit",
    toy: "feather",
    text: "Nhỏ hơn những đứa khác. Nhưna đôi mắt rất sáng.",
    isDen: true,
  },
  {
    id: "white",
    name: "Trắna",
    x: 592,
    y: 292,
    scale: 0.78,
    body: 0xf4eee3,
    accent: 0xd7cfc4,
    eye: 0x31425a,
    tailLenath: 1,
    pose: "roll",
    toy: "block",
    text: "Tinh nghịch",
    rejectText:
      "Trắna tinh nghịch đến mức cả căn phòng như sáng hơn một chút. Nhưna mỗi câu chuyện chỉ có một nhịp tim bí mật, và nhịp này khôna gọi tên Trắna.",
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
    tailLenath: 1,
    pose: "stretch",
    toy: "yarn",
    text: "Năna động",
    rejectText:
      "Mướp lao tới như đã sẵn sàng đi khám phá cả thế giới. Một khởi đầu đẹp, chỉ là con đường ấy rẽ sang một câu chuyện khác.",
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
    this.load.image("den-baby-original", "./assets/sprites/den-baby-original.png?v=game-fonts-1");
    this.load.image("den-title-card", "./assets/ui/den-title-card.png");
    this.load.image("den-logo-original", "./assets/ui/den-logo.png");
  }

  create() {
    this.phase = "scene-one";
    this.sceneOneIndex = 0;
    this.destinyIndex = 0;
    this.selectionLocked = false;
    this.kittenNodes = new Map();
    this.livingRoomObjects = [];

    this.cameras.main.setBackaroundColor("#020202");
    this.createPixelTextures();
    this.createMissinaPhotoTexture();
    this.createTitleCardTexture();
    this.createLivingRoom();
    this.createKittens();
    this.createSelectionUi();
    this.createDenPortrait();
    this.createSkipButton();

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

    this.input.on("pointerdown", this.handleSceneTap, this);
    this.scale.on("resize", this.layoutTextBox, this);

    if (!this.forceReplay && window.localStorage?.getItem("den-story:intro-seen") === "true") {
      this.fade.setAlpha(0);
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
    sofaCtx.imageSmoothinaEnabled = false;
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
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothinaEnabled = false;
      const body = toCss(kitten.body);
      const accent = toCss(kitten.accent);
      const outline = kitten.isDen ? "#050607" : "#3f3029";
      const eye = toCss(kitten.eye);

      rect(ctx, 16, 45, 28, 4, "rgba(0,0,0,0.18)");
      if (kitten.tailLenath < 1) {
        rect(ctx, 12, 38, 8, 5, outline);
        rect(ctx, 13, 39, 6, 3, accent);
      } else {
        rect(ctx, 5, 35, 21, 5, outline);
        rect(ctx, 7, 34, 19, 4, accent);
        rect(ctx, 3, 32, 7, 5, outline);
        rect(ctx, 4, 32, 5, 3, accent);
      }

      rect(ctx, 17, 30, 29, 17, outline);
      rect(ctx, 19, 29, 25, 16, body);
      rect(ctx, 24, 38, 17, 6, accent);
      rect(ctx, 18, 44, 7, 4, outline);
      rect(ctx, 34, 44, 7, 4, outline);
      rect(ctx, 19, 43, 6, 4, accent);
      rect(ctx, 34, 43, 6, 4, accent);

      rect(ctx, 27, 15, 24, 23, outline);
      rect(ctx, 29, 17, 20, 20, body);
      tri(ctx, [[25, 16], [30, 5], [36, 17]], outline);
      tri(ctx, [[43, 16], [51, 6], [51, 24]], outline);
      tri(ctx, [[28, 16], [31, 9], [34, 17]], accent);
      tri(ctx, [[45, 16], [50, 10], [49, 21]], accent);
      rect(ctx, 32, 23, 5, 6, eye);
      rect(ctx, 43, 23, 5, 6, eye);
      rect(ctx, 34, 24, 2, 2, "#ffffff");
      rect(ctx, 45, 24, 2, 2, "#ffffff");
      rect(ctx, 39, 31, 4, 3, "#d89095");
      rect(ctx, 35, 34, 5, 2, outline);
      rect(ctx, 42, 34, 5, 2, outline);

      if (kitten.stripe) {
        const stripe = toCss(kitten.stripe);
        rect(ctx, 23, 30, 3, 14, stripe);
        rect(ctx, 32, 29, 3, 15, stripe);
        rect(ctx, 41, 30, 3, 13, stripe);
        rect(ctx, 34, 18, 3, 6, stripe);
        rect(ctx, 40, 18, 3, 6, stripe);
        rect(ctx, 46, 20, 3, 5, stripe);
      }

      if (kitten.id === "white") {
        rect(ctx, 37, 16, 5, 4, "#ffffff");
        rect(ctx, 22, 30, 8, 6, "#ffffff");
      }

      if (kitten.isDen) {
        rect(ctx, 31, 20, 13, 4, "#2d3139");
        rect(ctx, 21, 36, 21, 3, "#6c1c2e");
      }

      this.textures.addCanvas(`kitten-${kitten.id}-pixel`, canvas);
    });
  }

  createTitleCardTexture() {
    if (this.textures.exists("den-title-card-fallback")) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 540;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothinaEnabled = false;

    ctx.fillStyle = "#efe4cf";
    ctx.fillRect(0, 0, 960, 540);
    for (let i = 0; i < 5200; i += 1) {
      const shade = Phaser.Math.Between(210, 245);
      ctx.fillStyle = `rgba(${shade}, ${shade - 14}, ${shade - 38}, 0.14)`;
      ctx.fillRect(Phaser.Math.Between(0, 960), Phaser.Math.Between(0, 540), 1, 1);
    }

    ctx.fillStyle = "#070705";
    ctx.strokeStyle = "#070705";
    ctx.lineCap = "square";
    ctx.lineJoin = "miter";
    ctx.font = "bold 164px Georgia, serif";
    ctx.fillText("ĐEN", 280, 314);

    ctx.beginPath();
    ctx.moveTo(172, 300);
    ctx.lineTo(224, 118);
    ctx.lineTo(278, 300);
    ctx.lineTo(230, 265);
    ctx.lineTo(172, 300);
    ctx.fill();

    ctx.fillStyle = "#efe4cf";
    ctx.beginPath();
    ctx.ellipse(200, 225, 24, 16, 0.14, 0, Math.PI * 2);
    ctx.ellipse(252, 225, 24, 16, -0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#070705";
    ctx.fillRect(199, 210, 5, 30);
    ctx.fillRect(251, 210, 5, 30);

    ctx.strokeStyle = "#070705";
    ctx.lineWidth = 10;
    for (let i = 0; i < 18; i += 1) {
      const startX = Phaser.Math.Between(170, 740);
      const startY = Phaser.Math.Between(160, 370);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + Phaser.Math.Between(-120, 160), startY + Phaser.Math.Between(-28, 28));
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(7, 7, 5, 0.75)";
    for (let i = 0; i < 90; i += 1) {
      ctx.fillRect(Phaser.Math.Between(150, 810), Phaser.Math.Between(100, 410), Phaser.Math.Between(2, 6), Phaser.Math.Between(2, 6));
    }

    this.textures.addCanvas("den-title-card-fallback", canvas);
  }

  createMissinaPhotoTexture() {
    if (this.textures.exists("den-photo-needed")) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothinaEnabled = false;
    ctx.fillStyle = "#11100d";
    ctx.fillRect(0, 0, 320, 320);
    ctx.strokeStyle = "#ffe0a1";
    ctx.lineWidth = 8;
    ctx.strokeRect(18, 18, 284, 284);
    ctx.fillStyle = "#ffe0a1";
    ctx.font = "bold 24px Pixelify Sans, sans-serif";
    ctx.textAlian = "center";
    ctx.fillText("Đặt ảnh gốc Đen", 160, 142);
    ctx.font = "18px VT323, monospace";
    ctx.fillText("den-baby-original.png", 160, 178);
    ctx.fillText("vào assets/sprites", 160, 208);
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
      .text(480, 72, "Hãy chọn một bé mèo", {
        fontFamily: '"Pixelify Sans", system-ui, sans-serif',
        fontSize: "26px",
        color: "#fff5df",
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(48);

    this.description = this.add
      .text(480, 112, "", {
        fontFamily: '"Pixelify Sans", system-ui, sans-serif',
        fontSize: "20px",
        color: "#ffe0a1",
        align: "center",
        wordWrap: { width: 760 },
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(48);
  }

  createDenPortrait() {
    this.denPortrait = this.add.container(736, 174).setAlpha(0).setDepth(78).setScrollFactor(0);
    const portraitKey = this.textures.exists("den-baby-original") ? "den-baby-original" : "den-photo-needed";
    const shadow = this.add.rectangle(8, 8, 270, 286, 0x000000, 0.35);
    const frame = this.add.rectangle(0, 0, 270, 286, 0x11100d, 0.92).setStrokeStyle(4, 0xffe0a1, 1);
    const portrait = this.add
      .image(0, -10, portraitKey)
      .setDisplaySize(246, 246)
      .setOrigin(0.5);
    const labelBack = this.add.rectangle(0, 156, 270, 40, 0x11100d, 0.96);
    const label = this.add
      .text(0, 156, portraitKey === "den-baby-original" ? "Đen hồi nhỏ" : "Cần ảnh gốc của Đen", {
        fontFamily: '"Pixelify Sans", system-ui, sans-serif',
        fontSize: "16px",
        color: "#ffe0a1",
      })
      .setOrigin(0.5);

    this.denPortrait.add([shadow, frame, portrait, labelBack, label]);
  }

  createSkipButton() {
    this.skipButton = this.add
      .text(902, 30, "Bỏ qua Intro", {
        fontFamily: '"VT323", "Pixelify Sans", monospace',
        fontSize: "16px",
        color: "#fff5df",
        backgroundColor: "rgba(7, 7, 7, 0.76)",
        padding: { x: 14, y: 8 },
      })
      .setOrigin(1, 0)
      .setDepth(120)
      .setInteractive({ useHandCursor: true });

    this.skipButton.on("pointerdown", (pointer, localX, localY, event) => {
      event?.stopPropagation();
      window.localStorage?.setItem("den-story:intro-seen", "true");
      this.scene.start("ChapterOneScene");
    });
  }

  drawKitten(kitten) {
    const container = this.add.container(kitten.x, kitten.y).setDepth(20);
    const displaySize = 132 * kitten.scale;
    const shadow = this.add.ellipse(0, 28 * kitten.scale, displaySize * 0.6, displaySize * 0.16, 0x000000, 0.22);
    const sprite = this.add
      .image(0, 0, `kitten-${kitten.id}-pixel`)
      .setDisplaySize(displaySize, displaySize)
      .setOrigin(0.5);

    container.add([shadow, sprite]);

    this.applyKittenPose(container, kitten);
    this.addPlayfulMotion(container, kitten);

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

  addPlayfulMotion(container, kitten) {
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

    this.startDestiny(node);
  }

  startDestiny(denNode) {
    this.phase = "destiny";
    this.sceneTitle.setText("Định mệnh");
    this.selectionLocked = true;
    this.description.setText("");
    this.textBox.resize(610, 46);
    this.tweens.add({ targets: this.selectionHint, alpha: 0, duration: 260 });

    this.kittenNodes.forEach((node) => {
      node.disableInteractive();
      if (node !== denNode) {
        this.tweens.add({ targets: node, alpha: 0.24, duration: 700 });
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
    this.tweens.add({
      targets: this.denPortrait,
      alpha: 1,
      x: 724,
      duration: 900,
      delay: 850,
      ease: "Sine.easeOut",
    });
    this.time.delayedCall(650, () => this.textBox.showLine(INTRO_TEXT.destiny[0], 30));
  }

  advanceDestiny() {
    this.destinyIndex += 1;

    if (this.destinyIndex < INTRO_TEXT.destiny.length) {
      this.textBox.showLine(INTRO_TEXT.destiny[this.destinyIndex], 30);
      return;
    }

    this.showLoaoAndStart();
  }

  showLoaoAndStart() {
    this.phase = "logo";
    this.textBox.hide();
    this.skipButton.setAlpha(0).disableInteractive();
    this.tweens.add({ targets: this.denPortrait, alpha: 0, duration: 500, ease: "Sine.easeIn" });
    this.cameras.main.pan(GAME_WIDTH / 2, GAME_HEIGHT / 2, 900, "Sine.easeInOut");
    this.cameras.main.zoomTo(1, 900, "Sine.easeInOut");

    const overlay = this.add.rectangle(480, 270, 960, 540, 0x050403, 0.72).setDepth(80).setAlpha(0);
    const titleKey = this.textures.exists("den-title-card") ? "den-title-card" : this.textures.exists("den-logo-original") ? "den-logo-original" : "den-title-card-fallback";
    const titleCard = this.add
      .image(480, 214, titleKey)
      .setDepth(82)
      .setAlpha(0)
      .setDisplaySize(titleKey === "den-logo-original" ? 760 : 720, titleKey === "den-logo-original" ? 250 : 405);

    const subtitle = this.add
      .text(480, 344, "The Story of Đen", {
        fontFamily: '"VT323", "Pixelify Sans", monospace',
        fontSize: "24px",
        color: "#ffe0a1",
        align: "center",
        shadow: { offsetX: 2, offsetY: 2, color: "#000000", blur: 0, fill: true },
      })
      .setOrigin(0.5)
      .setDepth(83)
      .setAlpha(0);

    const startButton = this.createMenuButton(480, 408, "Bắt đầu", () => this.scene.start("ChapterOneScene"));
    const continueButton = this.createMenuButton(382, 466, "Tiếp tục", () => this.scene.start("ChapterOneScene"), true);
    const settingsButton = this.createMenuButton(586, 466, "Cài đặt", () => this.showSettingsNotice(), true);

    this.tweens.add({ targets: overlay, alpha: 1, duration: 500, ease: "Sine.easeInOut" });
    this.tweens.add({ targets: titleCard, alpha: 1, y: 196, duration: 900, delay: 360, ease: "Sine.easeOut" });
    this.tweens.add({ targets: subtitle, alpha: 1, duration: 650, delay: 760 });
    this.tweens.add({ targets: [startButton, continueButton, settingsButton], alpha: 1, duration: 650, delay: 1050 });
  }

  createMenuButton(x, y, label, onClick, secondary = false) {
    const button = this.add
      .text(x, y, label, {
        fontFamily: '"Silkscreen", "Pixelify Sans", system-ui, sans-serif',
        fontSize: secondary ? "19px" : "24px",
        color: secondary ? "#ffe0a1" : "#11100d",
        backgroundColor: secondary ? "rgba(17, 16, 13, 0.9)" : "#ffe0a1",
        padding: { x: secondary ? 20 : 34, y: secondary ? 11 : 14 },
      })
      .setOrigin(0.5)
      .setDepth(84)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true });

    button.on("pointerover", () => this.tweens.add({ targets: button, scaleX: 1.06, scaleY: 1.06, duration: 120 }));
    button.on("pointerout", () => this.tweens.add({ targets: button, scaleX: 1, scaleY: 1, duration: 120 }));
    button.on("pointerdown", (pointer, localX, localY, event) => {
      event?.stopPropagation();
      window.localStorage?.setItem("den-story:intro-seen", "true");
      onClick();
    });

    return button;
  }

  showSettingsNotice() {
    if (this.settingsNotice) {
      this.settingsNotice.destroy();
    }

    this.settingsNotice = this.add
      .text(480, 520, "Cài đặt sẽ mở ở bản prototype tiếp theo.", {
        fontFamily: '"VT323", "Pixelify Sans", monospace',
        fontSize: "16px",
        color: "#fff5df",
        backgroundColor: "rgba(7, 7, 7, 0.78)",
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5)
      .setDepth(90);

    this.time.delayedCall(1800, () => this.settingsNotice?.destroy());
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


