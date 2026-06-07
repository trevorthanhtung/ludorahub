import TextBox from "../ui/TextBox.js?v=game-fonts-2";
import ChapterOneAtmosphere from "./ChapterOneAtmosphere.js?v=space-dialogue-1";

export default class ChapterOneScene extends Phaser.Scene {
  constructor() {
    super("ChapterOneScene");
    
    // Core state
    this.bond = 0; // Bond meter 0 to 100
    this.otisState = "calm"; // calm, watching, annoyed, hiss
    
    // Progression flags
    this.flags = {
      hasObserved: false,
      hasHidden: false,
      hasBlinked: false,
      chapterEnded: false
    };

    this.settings = {
      textSpeed: 1,
      autoDialogue: true,
      audioVolume: 1,
      musicVolume: 1
    };

    this.chapterRules = {
      foodInteractionUnlocked: false,
    };
  }

  preload() {}

  create() {
    this.loadSettings();
    
    this.cameras.main.setBackgroundColor("#090a0b");
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    this.createLivingRoom();
    ChapterOneAtmosphere.install(this);
    this.createCharacters();
    ChapterOneAtmosphere.addCharacterLighting(this, this.player, this.otis);
    this.createUI();
    this.createTextBox();

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.dialogueAdvanceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.showChapterIntro(() => {
      this.playDialogue([
        "Đen bước vào một căn phòng mới...",
        "Có một mùi hương lạ...",
        "Có vẻ như nơi này đã có chủ."
      ]);
    });
  }

  loadSettings() {
    const saved = window.localStorage?.getItem("den-story:settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.settings = { ...this.settings, ...parsed };
      } catch (e) {}
    }
  }

  createLivingRoom() {
    // Background wall
    this.add.rectangle(480, 215, 960, 430, 0xe8e5df, 1).setDepth(1);
    
    // Top wall trim
    this.add.rectangle(480, 40, 960, 80, 0xdbd8d0, 1).setDepth(1);
    this.add.rectangle(480, 82, 960, 4, 0x333333, 0.4).setDepth(1); // shadow line

    // Center Pillar
    this.add.rectangle(500, 215, 190, 430, 0xf0ede6, 1).setDepth(2);
    this.add.rectangle(405, 215, 6, 430, 0xd0cdc6, 1).setDepth(2); // Left edge shading
    this.add.rectangle(595, 215, 6, 430, 0xffffff, 0.5).setDepth(2); // Right edge highlight
    this.add.rectangle(500, 426, 190, 8, 0xcccccc, 1).setDepth(2); // Baseboard
    this.createControlsPoster();

    // Baseboard for the rest of the wall
    this.add.rectangle(480, 420, 960, 12, 0xdcd8d0, 1).setDepth(1);
    
    // Floor
    // Make tiles with slight variations
    const floorY = 485;
    for(let i = 0; i < 960; i += 80) {
      for(let j = 430; j < 540; j += 55) {
        // slight color variation
        const color = (i/80 + j/55) % 2 === 0 ? 0x5e4539 : 0x62483b;
        this.add.rectangle(i + 40, j + 27.5, 80, 55, color, 1).setDepth(1);
      }
    }
    
    // Floor Collision Object (Invisible, top edge exactly at 485 so cats stand on the visible line)
    this.floor = this.add.rectangle(480, 515, 960, 60, 0x000000, 0).setDepth(1);
    this.physics.add.existing(this.floor, true);

    // Bed (Left side - Flush against Center Pillar)
    const bedGroup = this.add.container(335, 360).setDepth(3);
    const headboard = this.add.rectangle(0, -50, 140, 80, 0x8a6336, 1);
    const mattress = this.add.rectangle(0, 30, 130, 110, 0x3b779e, 1);
    const mattressHighlight = this.add.rectangle(0, 20, 120, 90, 0x478dbb, 1);
    const pillow1 = this.add.rectangle(-30, -10, 50, 25, 0xeeeeee, 1);
    const pillow2 = this.add.rectangle(30, -10, 50, 25, 0xeeeeee, 1);
    const footboard = this.add.rectangle(0, 80, 140, 40, 0x8a6336, 1);
    bedGroup.add([headboard, mattress, mattressHighlight, pillow1, pillow2, footboard]);

    // Dresser (Right side - Flush against Center Pillar)
    const dresserGroup = this.add.container(645, 310).setDepth(3);
    const sidePanel = this.add.rectangle(-30, 50, 40, 120, 0x5a8cb0, 1); 
    const frontPanel = this.add.rectangle(20, 50, 60, 120, 0x6ca3c9, 1); 
    const drawer1 = this.add.rectangle(20, 10, 50, 25, 0xeef1f4, 1);
    const drawer2 = this.add.rectangle(20, 45, 50, 25, 0xeef1f4, 1);
    const drawer3 = this.add.rectangle(20, 80, 50, 25, 0xeef1f4, 1);
    const handle1 = this.add.rectangle(35, 10, 8, 8, 0x888888, 1); // knob
    const handle2 = this.add.rectangle(35, 45, 8, 8, 0x888888, 1);
    const handle3 = this.add.rectangle(35, 80, 8, 8, 0x888888, 1);
    
    // Mirror (On top of dresser)
    const mirrorBase = this.add.rectangle(-15, -15, 30, 10, 0x333333, 1);
    const mirrorStem = this.add.rectangle(-15, -30, 8, 30, 0x333333, 1);
    const mirrorFrame = this.add.ellipse(-5, -70, 30, 90, 0x222222, 1);
    const mirrorGlass = this.add.ellipse(-3, -70, 20, 80, 0xaaaaaa, 1);
    const mirrorReflection = this.add.rectangle(2, -70, 4, 50, 0xdddddd, 0.4).setAngle(20);
    dresserGroup.add([sidePanel, frontPanel, drawer1, drawer2, drawer3, handle1, handle2, handle3, mirrorBase, mirrorStem, mirrorFrame, mirrorGlass, mirrorReflection]);

    // Makeup Desk (Far Left) - Cute Version
    const makeupDesk = this.add.container(120, 350).setDepth(3);
    // Desk legs (white)
    const deskLeg1 = this.add.rectangle(-40, 60, 6, 80, 0xffffff, 1);
    const deskLeg2 = this.add.rectangle(40, 60, 6, 80, 0xffffff, 1);
    // Desk top (pastel pinkish)
    const deskTop = this.add.rectangle(0, 20, 100, 15, 0xffe4e1, 1);
    
    // Stool (under the desk)
    const stoolLeg1 = this.add.rectangle(-15, 75, 4, 50, 0xffffff, 1);
    const stoolLeg2 = this.add.rectangle(15, 75, 4, 50, 0xffffff, 1);
    const stoolCushion = this.add.ellipse(0, 50, 45, 20, 0xff69b4, 1); // Hot pink cushion
    
    // Vanity Mirror (small, on the desk)
    const vanityBase = this.add.rectangle(0, 10, 30, 4, 0xdddddd, 1);
    const vanityStem = this.add.rectangle(0, -5, 4, 30, 0xdddddd, 1);
    const vanityGlass = this.add.ellipse(0, -25, 40, 50, 0xadd8e6, 1);
    const vanityReflect = this.add.ellipse(-5, -25, 10, 35, 0xffffff, 0.4).setAngle(15);
    
    // Makeup stuff (scattered)
    const bottle1 = this.add.rectangle(-30, 8, 8, 10, 0xffb6c1, 1);
    const bottle2 = this.add.rectangle(-20, 5, 6, 15, 0x98fb98, 1);
    const bottle3 = this.add.rectangle(30, 8, 10, 10, 0xdda0dd, 1);
    
    // Cute Round Lamp
    const lampBase = this.add.rectangle(40, 10, 15, 4, 0x333333, 1);
    const lampStem = this.add.rectangle(40, 0, 3, 20, 0x333333, 1);
    const lampBulb = this.add.ellipse(40, -15, 25, 25, 0xfffab3, 1);
    const lampGlow = this.add.ellipse(40, -15, 40, 40, 0xfffab3, 0.3);
    
    // Small potted plant
    const pot = this.add.rectangle(-40, 10, 12, 10, 0xd2b48c, 1);
    const leaf1 = this.add.ellipse(-45, 0, 8, 15, 0x32cd32, 1).setAngle(-30);
    const leaf2 = this.add.ellipse(-35, 0, 8, 15, 0x32cd32, 1).setAngle(30);
    const leaf3 = this.add.ellipse(-40, -5, 8, 15, 0x32cd32, 1);
    
    makeupDesk.add([
      deskLeg1, deskLeg2, stoolLeg1, stoolLeg2, stoolCushion, deskTop, 
      vanityBase, vanityStem, vanityGlass, vanityReflect,
      bottle1, bottle2, bottle3, 
      lampBase, lampStem, lampGlow, lampBulb,
      pot, leaf1, leaf2, leaf3
    ]);

    // Clothing Rack & Storage (Far Right)
    const storageGroup = this.add.container(850, 320).setDepth(3);
    // Rack
    const rackBase = this.add.rectangle(0, 110, 120, 6, 0x666666, 1);
    const rackPole1 = this.add.rectangle(-50, 20, 6, 180, 0x888888, 1);
    const rackPole2 = this.add.rectangle(50, 20, 6, 180, 0x888888, 1);
    const rackTop = this.add.rectangle(0, -70, 130, 6, 0xaaaaaa, 1);
    // Clothes
    const cloth1 = this.add.rectangle(-30, -10, 25, 110, 0xcd5c5c, 1);
    const cloth2 = this.add.rectangle(0, -20, 30, 90, 0x4682b4, 1);
    const cloth3 = this.add.rectangle(30, 0, 25, 130, 0x2e8b57, 1);
    storageGroup.add([rackBase, rackPole1, rackPole2, rackTop, cloth1, cloth2, cloth3]);
    
    // Boxes (Clutter)
    const box1 = this.add.rectangle(-50, 90, 50, 40, 0xaf8a54, 1); // Moved boxes slightly left to fit near rack
    const box1Tape = this.add.rectangle(-50, 90, 50, 6, 0xcdb79e, 1);
    const box2 = this.add.rectangle(-40, 55, 40, 30, 0x8b7355, 1); 
    storageGroup.add([box1, box1Tape, box2]);

    // Fluorescent Tube Light (Far Right Wall)
    const tubeGroup = this.add.container(850, 120).setDepth(2);
    const tubeFixture = this.add.rectangle(0, 0, 140, 12, 0xdddddd, 1);
    const tubeBulb = this.add.rectangle(0, 0, 130, 6, 0xffffff, 1);
    const tubeGlow = this.add.rectangle(0, 10, 160, 40, 0xe0f7fa, 0.2); // subtle blue-ish glow
    tubeGroup.add([tubeFixture, tubeGlow, tubeBulb]);

    // Food Bowl (Invisible zone near dresser)
    this.foodBowl = this.add.rectangle(645, 430, 40, 20, 0xc0c0c0, 0).setDepth(10);
    this.physics.add.existing(this.foodBowl, true);

    // Hiding Spot (Invisible zone under the bed)
    this.cartonBox = this.add.rectangle(335, 430, 150, 40, 0xaf8a54, 0).setDepth(15);
    this.physics.add.existing(this.cartonBox, true);
  }

  createControlsPoster() {
    const poster = this.add.container(500, 190).setDepth(2.8);
    const shadow = this.add.rectangle(5, 5, 158, 130, 0x000000, 0.12);
    const paper = this.add.rectangle(0, 0, 158, 130, 0xf2dfb8, 0.92).setStrokeStyle(2, 0x8a6a42, 0.9);
    const tapeLeft = this.add.rectangle(-58, -60, 28, 8, 0xd9b56f, 0.86).setAngle(-8);
    const tapeRight = this.add.rectangle(58, -60, 28, 8, 0xd9b56f, 0.86).setAngle(8);
    const title = this.add.text(0, -50, "CÁCH CHƠI", {
      fontFamily: '"Silkscreen", "DearPix", system-ui',
      fontSize: "13px",
      color: "#4f3826",
    }).setOrigin(0.5);

    const lines = [
      ["←  →", "di chuyển"],
      ["↑", "nhảy"],
      ["X", "tương tác"],
      ["SPACE", "qua thoại"],
    ];

    const rowNodes = lines.flatMap(([key, text], index) => {
      const y = -26 + index * 26;
      const keyBack = this.add.rectangle(-42, y, key === "SPACE" ? 58 : 44, 18, 0x2b211b, 0.88);
      const keyText = this.add.text(-42, y - 1, key, {
        fontFamily: '"Silkscreen", "DearPix", system-ui',
        fontSize: key === "SPACE" ? "9px" : "12px",
        color: "#ffe0a1",
      }).setOrigin(0.5);
      const hint = this.add.text(-2, y - 8, text, {
        fontFamily: '"DearPix", system-ui',
        fontSize: "17px",
        color: "#4f3826",
      });
      return [keyBack, keyText, hint];
    });

    const crease = this.add.rectangle(18, 0, 2, 112, 0x8a6a42, 0.12).setAngle(-4);
    const smudgeA = this.add.rectangle(-62, 42, 8, 3, 0x6f573d, 0.16);
    const smudgeB = this.add.rectangle(50, 32, 12, 3, 0x6f573d, 0.12);

    poster.add([shadow, paper, tapeLeft, tapeRight, title, ...rowNodes, crease, smudgeA, smudgeB]);
  }

  createCharacters() {
    // Player: Đen (Right side, empty space between dresser and rack)
    this.player = this.physics.add.sprite(730, 300, "kitten-den-0").setDepth(20);
    this.player.setDisplaySize(132 * 0.56, 132 * 0.56);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.floor);
    // Adjust body box to stand exactly on floor line
    this.player.body.setSize(40, 40);
    this.player.body.setOffset(12, 24);
    this.player.isHiding = false;
    this.player.canMove = true;
    this.player.flipX = true; // face left (center)

    // NPC: Otis (Calico) (Left side, empty space between desk and bed)
    this.createOtisTexture();
    this.otis = this.physics.add.sprite(220, 300, "cat-otis-0").setDepth(20);
    this.otis.setDisplaySize(132 * 0.9, 132 * 0.9);
    this.otis.setCollideWorldBounds(true);
    this.physics.add.collider(this.otis, this.floor);
    this.otis.body.setSize(40, 40);
    this.otis.body.setOffset(12, 24);
    this.otis.flipX = false; // face right (center)
    
    // Otis reaction zone
    this.otisZone = this.add.zone(this.otis.x, this.otis.y, 400, 200);
    this.physics.add.existing(this.otisZone, true);
  }

  createOtisTexture() {
    if (this.textures.exists("cat-otis-0")) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    
    const rect = (ctx, x, y, width, height, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    };
    
    const tri = (ctx, points, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      points.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.closePath();
      ctx.fill();
    };

    const outline = "#2e241d";
    const deepOutline = "#18110d";
    const white = "#fff8ea";
    const cream = "#f1dfbd";
    const shadowFur = "#d9c6aa";
    const orange = "#d99336";
    const orangeLight = "#f0b061";
    const tabby = "#5a4935";
    const tabbyDark = "#2c241c";
    const eyeColor = "#d8a63c";
    const collar = "#17191c";
    const bell = "#d8c28a";

    // Ground shadow inside the sprite keeps Otis settled when atmosphere is disabled.
    rect(ctx, 8, 49, 46, 5, "rgba(0,0,0,0.2)");
    rect(ctx, 14, 47, 36, 3, "rgba(0,0,0,0.14)");

    // Curled, striped tail inspired by the mirror photo.
    rect(ctx, 6, 39, 8, 8, deepOutline);
    rect(ctx, 8, 38, 8, 7, tabby);
    rect(ctx, 12, 36, 10, 6, deepOutline);
    rect(ctx, 14, 35, 10, 5, tabby);
    rect(ctx, 18, 34, 8, 5, tabbyDark);
    rect(ctx, 22, 35, 7, 5, cream);
    rect(ctx, 10, 42, 4, 5, cream);

    // Soft lounging body: mostly white chest with orange/tabby saddle.
    rect(ctx, 17, 32, 30, 17, outline);
    rect(ctx, 19, 31, 26, 16, white);
    rect(ctx, 18, 36, 12, 10, cream);
    rect(ctx, 31, 31, 14, 12, tabby);
    rect(ctx, 27, 31, 8, 10, orange);
    rect(ctx, 35, 33, 4, 11, tabbyDark);
    rect(ctx, 40, 35, 3, 8, orangeLight);
    rect(ctx, 21, 43, 18, 4, shadowFur);

    // Long white front legs, like the bed photo.
    rect(ctx, 15, 45, 16, 5, outline);
    rect(ctx, 16, 44, 15, 4, white);
    rect(ctx, 11, 47, 15, 4, outline);
    rect(ctx, 12, 46, 14, 4, white);
    rect(ctx, 31, 45, 10, 5, outline);
    rect(ctx, 32, 44, 9, 4, white);

    // Rounded face and muzzle.
    const hx = 0;
    const hy = 0;
    rect(ctx, 25 + hx, 15 + hy, 27, 24, deepOutline);
    rect(ctx, 27 + hx, 17 + hy, 23, 21, white);
    rect(ctx, 31 + hx, 29 + hy, 15, 8, cream);
    rect(ctx, 35 + hx, 34 + hy, 7, 3, shadowFur);

    // Calico head markings: orange left, tabby crown/right, white blaze.
    rect(ctx, 27 + hx, 17 + hy, 9, 13, orangeLight);
    rect(ctx, 30 + hx, 17 + hy, 8, 10, orange);
    rect(ctx, 38 + hx, 17 + hy, 10, 13, tabby);
    rect(ctx, 42 + hx, 19 + hy, 6, 11, tabbyDark);
    rect(ctx, 36 + hx, 17 + hy, 4, 16, white);
    rect(ctx, 34 + hx, 18 + hy, 2, 8, cream);
    rect(ctx, 40 + hx, 20 + hy, 3, 3, cream);

    // Tall ears, pale inner fur.
    tri(ctx, [[24 + hx, 17 + hy], [29 + hx, 4 + hy], [37 + hx, 18 + hy]], deepOutline);
    tri(ctx, [[42 + hx, 17 + hy], [50 + hx, 5 + hy], [53 + hx, 24 + hy]], deepOutline);
    tri(ctx, [[28 + hx, 16 + hy], [30 + hx, 8 + hy], [35 + hx, 18 + hy]], orangeLight);
    tri(ctx, [[45 + hx, 17 + hy], [49 + hx, 10 + hy], [50 + hx, 22 + hy]], "#f4c8bd");
    rect(ctx, 31 + hx, 14 + hy, 3, 6, tabbyDark);
    rect(ctx, 44 + hx, 15 + hy, 4, 6, cream);

    // Big cautious golden eyes.
    rect(ctx, 31 + hx, 25 + hy, 7, 6, outline);
    rect(ctx, 43 + hx, 25 + hy, 7, 6, outline);
    rect(ctx, 32 + hx, 25 + hy, 5, 5, eyeColor);
    rect(ctx, 44 + hx, 25 + hy, 5, 5, eyeColor);
    rect(ctx, 34 + hx, 26 + hy, 2, 4, deepOutline);
    rect(ctx, 46 + hx, 26 + hy, 2, 4, deepOutline);
    rect(ctx, 33 + hx, 25 + hy, 1, 1, "#fff4b8");
    rect(ctx, 45 + hx, 25 + hy, 1, 1, "#fff4b8");

    // Pink nose, tiny mouth, whiskers.
    rect(ctx, 39 + hx, 31 + hy, 4, 3, "#ef9aaa");
    rect(ctx, 38 + hx, 34 + hy, 3, 1, outline);
    rect(ctx, 43 + hx, 34 + hy, 3, 1, outline);
    rect(ctx, 24 + hx, 31 + hy, 7, 1, cream);
    rect(ctx, 24 + hx, 35 + hy, 8, 1, cream);
    rect(ctx, 49 + hx, 31 + hy, 7, 1, cream);
    rect(ctx, 48 + hx, 35 + hy, 8, 1, cream);

    // Black collar and bell from the reference.
    rect(ctx, 31, 39, 18, 3, collar);
    rect(ctx, 38, 41, 5, 5, deepOutline);
    rect(ctx, 39, 42, 4, 4, bell);
    rect(ctx, 40, 43, 1, 1, "#fff1b8");
    
    this.textures.addCanvas("cat-otis-0", canvas);
  }

  createUI() {
    const uiContainer = this.add.container(0, 0).setDepth(100).setScrollFactor(0);
    
    // Bond Meter
    const bondBg = this.add.rectangle(150, 40, 200, 16, 0x111111, 0.8).setStrokeStyle(2, 0xffe0a1);
    this.bondFill = this.add.rectangle(52, 40, 0, 12, 0xffa500, 1); // width will update
    this.bondFill.setOrigin(0, 0.5);
    
    const bondText = this.add.text(150, 18, "GẮN KẾT: OTIS", {
      fontFamily: '"Silkscreen", "DearPix", system-ui',
      fontSize: "15px",
      color: "#ffe0a1"
    }).setOrigin(0.5);
    
    this.bondStatusText = this.add.text(150, 62, "Kẻ xâm nhập", {
      fontFamily: '"DearPix", system-ui',
      fontSize: "18px",
      color: "#ff7777"
    }).setOrigin(0.5);

    const objectivePanel = this.add
      .rectangle(750, 64, 270, 94, 0x080908, 0.68)
      .setStrokeStyle(2, 0xffe0a1, 0.35);

    const objectiveTitle = this.add.text(750, 28, "MỤC TIÊU", {
      fontFamily: '"Silkscreen", "DearPix", system-ui',
      fontSize: "15px",
      color: "#ffe0a1",
    }).setOrigin(0.5);

    this.objectiveTexts = [
      this.add.text(630, 48, "", {
        fontFamily: '"DearPix", system-ui',
        fontSize: "18px",
        color: "#f8eedc",
      }),
      this.add.text(630, 70, "", {
        fontFamily: '"DearPix", system-ui',
        fontSize: "18px",
        color: "#f8eedc",
      }),
      this.add.text(630, 92, "", {
        fontFamily: '"DearPix", system-ui',
        fontSize: "18px",
        color: "#f8eedc",
      }),
    ];

    // Prompt Text
    this.promptText = this.add.text(480, 480, "", {
      fontFamily: '"DearPix", system-ui',
      fontSize: "24px",
      color: "#ffffff",
      backgroundColor: "#000000aa",
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setAlpha(0);

    uiContainer.add([
      bondBg,
      this.bondFill,
      bondText,
      this.bondStatusText,
      objectivePanel,
      objectiveTitle,
      ...this.objectiveTexts,
      this.promptText,
    ]);
    this.updateObjectiveChecklist();
  }

  showChapterIntro(onComplete) {
    this.player.canMove = false;

    const intro = this.add.container(480, 270).setDepth(180).setScrollFactor(0);
    const back = this.add.rectangle(0, 0, 960, 540, 0x050403, 0.96);
    const chapter = this.add.text(0, -26, "CHAPTER 1", {
      fontFamily: '"Silkscreen", "DearPix", system-ui',
      fontSize: "34px",
      color: "#f7ead4",
      align: "center",
    }).setOrigin(0.5);
    const name = this.add.text(0, 36, "OTIS", {
      fontFamily: '"Silkscreen", "DearPix", system-ui',
      fontSize: "54px",
      color: "#ffe0a1",
      align: "center",
    }).setOrigin(0.5);
    const line = this.add.rectangle(0, 88, 220, 3, 0xd9b56f, 0.8);

    intro.add([back, chapter, name, line]);

    this.time.delayedCall(1300, () => {
      this.tweens.add({
        targets: intro,
        alpha: 0,
        duration: 700,
        ease: "Sine.easeInOut",
        onComplete: () => {
          intro.destroy();
          this.player.canMove = true;
          onComplete?.();
        },
      });
    });
  }

  createTextBox() {
    this.textBox = new TextBox(this, {
      x: 480 - 410,
      y: 420,
      width: 820,
      height: 100,
      depth: 110
    });
    this.dialogueQueue = [];
    this.dialogueCallback = null;
    this.isDialogueActive = false;
  }

  playDialogue(lines, callback = null) {
    this.promptText?.setAlpha(0);
    this.dialogueQueue = [...lines];
    this.dialogueCallback = callback;
    this.isDialogueActive = true;
    this.player.canMove = false;
    this.player.setVelocityX(0);
    this.advanceDialogue();
  }

  advanceDialogue() {
    if (this.dialogueQueue.length > 0) {
      const line = this.dialogueQueue.shift();
      const speed = this.settings.textSpeed === 2 ? 10 : this.settings.textSpeed === 0 ? 60 : 30;
      this.textBox.showLine(line, speed);
    } else {
      this.textBox.hide();
      this.isDialogueActive = false;
      this.player.canMove = true;
      if (this.dialogueCallback) {
        this.dialogueCallback();
        this.dialogueCallback = null;
      }
    }
  }

  handleTextBoxClick() {
    if (!this.isDialogueActive) return;
    if (this.textBox.completeLine()) {
      // Line completed early
    } else {
      this.advanceDialogue();
    }
  }

  update(time, delta) {
    if (this.flags.chapterEnded) {
      this.handleDialogueAdvanceInput();
      ChapterOneAtmosphere.update(this, time);
      return;
    }

    this.handlePlayerMovement();
    this.handleDialogueAdvanceInput();
    this.updateOtisState();
    this.handleInteractions();
    this.updateUI();
    ChapterOneAtmosphere.update(this, time);
    this.checkEndCondition();
  }

  handlePlayerMovement() {
    if (!this.player.canMove) {
      this.player.setVelocityX(0);
      return;
    }

    const speed = 160;
    
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.flipX = false;
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-350);
    }
  }

  handleDialogueAdvanceInput() {
    if (!this.isDialogueActive) {
      return;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.interactKey) ||
      Phaser.Input.Keyboard.JustDown(this.dialogueAdvanceKey)
    ) {
      this.handleTextBoxClick();
    }
  }

  updateOtisState() {
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.otis.x, this.otis.y);
    
    // Face player
    this.otis.flipX = this.player.x < this.otis.x;

    if (this.player.isHiding) {
      this.otisState = "calm";
      return;
    }

    if (dist < 80) {
      if (this.bond < 10) {
        this.otisState = "hiss";
        this.triggerHiss();
      } else {
        this.otisState = "annoyed";
      }
    } else if (dist < 200) {
      this.otisState = "annoyed";
    } else if (dist < 350) {
      this.otisState = "watching";
      // If player stays in watching zone without getting closer, bond increases over time (Observe)
      if (!this.player.body.velocity.x && !this.flags.hasObserved) {
        if (!this.observeTimer) this.observeTimer = 0;
        this.observeTimer++;
        if (this.observeTimer > 150) { // ~2.5 seconds
          this.flags.hasObserved = true;
          this.increaseBond(2);
          this.showPrompt("Otis có vẻ bớt cảnh giác hơn một chút.");
        }
      }
    } else {
      this.otisState = "calm";
      this.observeTimer = 0;
    }
  }

  handleInteractions() {
    // Hide prompt
    this.promptText.setAlpha(0);
    
    if (!this.player.canMove && !this.player.isHiding) return;
    if (this.textBox.isTyping || this.textBox.container.alpha > 0) return;

    const distToOtis = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.otis.x, this.otis.y);
    const distToBox = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.cartonBox.x, this.cartonBox.y);
    const distToFood = this.chapterRules.foodInteractionUnlocked
      ? Phaser.Math.Distance.Between(this.player.x, this.player.y, this.foodBowl.x, this.foodBowl.y)
      : Number.POSITIVE_INFINITY;

    // Hiding
    if (distToBox < 50) {
      if (this.player.isHiding) {
        this.promptText.setText("[X] Bò ra ngoài").setAlpha(1);
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
          this.player.isHiding = false;
          this.player.setAlpha(1);
          this.player.canMove = true;
          this.player.y -= 10;
        }
      } else {
        this.promptText.setText("[X] Nấp dưới gầm giường").setAlpha(1);
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
          this.player.isHiding = true;
          this.player.setAlpha(0.3);
          this.player.canMove = false;
          this.player.setVelocityX(0);
          this.player.x = this.cartonBox.x;
          this.flags.hasHidden = true;
        }
      }
      return;
    }

    if (this.player.isHiding) return;

    // Slow Blink
    if (distToOtis < 350 && distToOtis > 150 && (this.otisState === "watching" || this.otisState === "calm")) {
      this.promptText.setText("[X] Chớp mắt chậm").setAlpha(1);
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        this.player.canMove = false;
        this.player.setVelocityX(0);
        this.showPrompt("Bạn chớp mắt chậm với Otis...");
        this.time.delayedCall(1500, () => {
          this.flags.hasBlinked = true;
          this.increaseBond(3);
          this.showPrompt("Otis chỉ nhìn rồi quay đi chỗ khác.");
          this.player.canMove = true;
        });
      }
      return;
    }

    // Food Bowl
    if (distToFood < 40) {
      this.promptText.setText("[X] Ăn").setAlpha(1);
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        if (distToOtis < 250) {
          this.showPrompt("Đây có lẽ là chỗ của Otis. Tốt nhất chưa nên động vào.");
        } else {
          this.player.canMove = false;
          this.player.setVelocityX(0);
          this.showPrompt("Đen ăn một chút hạt. Rất ngon.");
          this.time.delayedCall(1500, () => {
            this.player.canMove = true;
          });
        }
      }
      return;
    }
  }

  triggerHiss() {
    if (this.hissCooldown) return;
    this.hissCooldown = true;
    
    this.showPrompt("Hissssss!");
    this.increaseBond(-1);
    
    // Push player back
    this.player.canMove = false;
    const pushDir = this.player.x < this.otis.x ? -1 : 1;
    this.player.setVelocity(pushDir * 300, -150);
    
    this.time.delayedCall(800, () => {
      this.player.canMove = true;
      this.hissCooldown = false;
    });
  }

  increaseBond(amount) {
    this.bond = Phaser.Math.Clamp(this.bond + amount, 0, 100);
  }

  updateUI() {
    // Bond fill width (max 196)
    this.bondFill.width = (this.bond / 100) * 196;

    if (this.bond >= 15) {
      this.bondStatusText.setText("Được chấp nhận");
      this.bondStatusText.setColor("#77ff77");
    } else if (this.bond >= 5) {
      this.bondStatusText.setText("Đang theo dõi");
      this.bondStatusText.setColor("#ffff77");
    } else {
      this.bondStatusText.setText("Kẻ xâm nhập");
      this.bondStatusText.setColor("#ff7777");
    }

    this.updateObjectiveChecklist();
  }

  updateObjectiveChecklist() {
    if (!this.objectiveTexts) {
      return;
    }

    const objectives = [
      { done: this.flags.hasObserved, text: "Quan sát Otis" },
      { done: this.flags.hasHidden, text: "Nấp dưới gầm giường" },
      { done: this.flags.hasBlinked, text: "Chớp mắt chậm" },
    ];

    objectives.forEach((objective, index) => {
      this.objectiveTexts[index]
        .setText(`${objective.done ? "☑" : "☐"} ${objective.text}`)
        .setColor(objective.done ? "#77ff77" : "#f8eedc");
    });
  }

  showPrompt(text) {
    this.promptText.setAlpha(0);
    this.textBox.setInstant(text, false);
    this.time.delayedCall(2000, () => {
      if (this.textBox.fullText === text) {
        this.textBox.hide();
      }
    });
  }

  checkEndCondition() {
    if (this.bond >= 5 && this.flags.hasObserved && this.flags.hasHidden && this.flags.hasBlinked) {
      this.triggerEndCutscene();
    }
  }

  triggerEndCutscene() {
    this.flags.chapterEnded = true;
    this.player.canMove = false;
    this.player.setVelocityX(0);
    this.promptText.setAlpha(0);
    this.textBox.hide();

    // Fade to dark
    this.tweens.add({
      targets: this.cameras.main,
      backgroundColor: "#000000",
      duration: 3000
    });

    this.time.delayedCall(3000, () => {
      this.player.x = 200; // Curled up in corner
      this.otis.x = 250; // Otis approaches
      this.player.flipX = false;
      this.otis.flipX = true;

      this.playDialogue([
        "Có lẽ...",
        "Mình chưa thuộc về nơi này.",
        "Nhưng ít nhất...",
        "Mình đã được chấp nhận tồn tại."
      ], () => {
        this.cameras.main.fadeOut(1500, 0, 0, 0);
        this.time.delayedCall(1600, () => {
          this.showChapterResult();
        });
      });
    });
  }

  showChapterResult() {
    this.add.rectangle(480, 270, 960, 540, 0x000000, 1).setDepth(200);
    
    this.add.text(480, 230, "CHAPTER 1 CLEAR", {
      fontFamily: '"Silkscreen", "DearPix", system-ui',
      fontSize: "42px",
      color: "#f7ead4"
    }).setOrigin(0.5).setDepth(201);

    this.add.text(480, 290, `Gắn kết: Otis +${this.bond}%`, {
      fontFamily: '"DearPix", system-ui',
      fontSize: "28px",
      color: "#ffc177"
    }).setOrigin(0.5).setDepth(201);

    const btn = this.add.text(480, 380, "Về màn hình chính", {
      fontFamily: '"Silkscreen", "DearPix", system-ui',
      fontSize: "20px",
      color: "#100f0d",
      backgroundColor: "#d9b56f",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(201).setInteractive({ useHandCursor: true });

    btn.on("pointerdown", () => this.scene.start("IntroScene", { forceReplay: true }));
  }
}
