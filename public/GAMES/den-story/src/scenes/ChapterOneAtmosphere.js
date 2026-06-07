const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

export default class ChapterOneAtmosphere {
  static install(scene) {
    scene.atmosphereLayers = {
      contactShadows: [],
      dust: [],
      tubeGlow: null,
    };

    this.addWallAndFloorDepth(scene);
    this.addEnvironmentalShadows(scene);
    this.addSurfaceTexture(scene);
    this.addMirrorDetail(scene);
    this.addLightFalloff(scene);
    this.addMemoryOverlay(scene);
    this.addDust(scene);
  }

  static addCharacterLighting(scene, player, otis) {
    const playerShadow = this.blockShadow(scene, player.x, 416, 58, 14, 19, 0x120b08, 0.28);
    const otisShadow = this.blockShadow(scene, otis.x, 416, 94, 20, 19, 0x120b08, 0.25);

    scene.atmosphereLayers.contactShadows.push(
      { shadow: playerShadow, target: player, groundY: 416 },
      { shadow: otisShadow, target: otis, groundY: 416 },
    );

    player.preFX?.addGlow(0xf5d9b0, 0.9, 0, false, 0.08, 8);
    otis.preFX?.addGlow(0xffd39a, 0.65, 0, false, 0.06, 8);
  }

  static update(scene, time) {
    scene.atmosphereLayers?.contactShadows?.forEach(({ shadow, target, groundY }) => {
      shadow.setX(target.x);
      shadow.setY(groundY);
      shadow.setAlpha(target.visible === false || target.alpha <= 0.05 ? 0 : target.alpha * shadow.baseAlpha);
    });

    scene.atmosphereLayers?.dust?.forEach((dust, index) => {
      dust.x += dust.driftX;
      dust.y += dust.driftY;
      dust.setAlpha(dust.baseAlpha + Math.sin(time * 0.0007 + index) * 0.025);

      if (dust.y < dust.minY) {
        dust.y = dust.maxY;
      }

      if (dust.x > dust.maxX) {
        dust.x = dust.minX;
      }
    });

    if (scene.atmosphereLayers?.tubeGlow && !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      const flicker = Math.sin(time * 0.00046) > 0.994 ? 0.02 : 0;
      scene.atmosphereLayers.tubeGlow.setAlpha(0.055 + flicker);
    }
  }

  static addWallAndFloorDepth(scene) {
    scene.add.rectangle(480, 292, 960, 210, 0x8d816e, 0.12).setDepth(1.12);
    scene.add.rectangle(480, 410, 960, 36, 0x4b3729, 0.16).setDepth(1.18);
    scene.add.rectangle(480, 530, 960, 80, 0x1f1510, 0.22).setDepth(1.19);
    scene.add.rectangle(36, 270, 72, 540, 0x2a1a12, 0.08).setDepth(1.2);
    scene.add.rectangle(924, 270, 72, 540, 0x2a1a12, 0.08).setDepth(1.2);

    for (let i = 0; i < 52; i += 1) {
      const x = Phaser.Math.Between(24, 936);
      const y = Phaser.Math.Between(382, 426);
      const w = Phaser.Math.Between(2, 10);
      const h = Phaser.Math.Between(1, 4);
      scene.add.rectangle(x, y, w, h, 0x9d8b78, Phaser.Math.FloatBetween(0.08, 0.2)).setDepth(1.21);
    }

    for (let i = 0; i < 24; i += 1) {
      const x = i % 2 === 0 ? Phaser.Math.Between(18, 110) : Phaser.Math.Between(860, 940);
      const y = Phaser.Math.Between(110, 410);
      scene.add.rectangle(x, y, Phaser.Math.Between(2, 8), Phaser.Math.Between(2, 8), 0xb8ad9b, 0.08).setDepth(1.21);
    }
  }

  static addEnvironmentalShadows(scene) {
    this.blockShadow(scene, 335, 432, 154, 18, 2.65, 0x21140c, 0.24);
    this.blockShadow(scene, 645, 414, 118, 22, 2.65, 0x1a1512, 0.22);
    this.blockShadow(scene, 120, 423, 126, 16, 2.65, 0x23160f, 0.2);
    this.blockShadow(scene, 850, 434, 148, 18, 2.65, 0x17120f, 0.22);
    this.blockShadow(scene, 810, 415, 56, 14, 2.65, 0x17120f, 0.18);
    this.blockShadow(scene, 500, 430, 198, 12, 2.55, 0x2f231a, 0.15);

    this.blockShadow(scene, 80, 420, 16, 14, 2.7, 0x17100c, 0.2);
    this.blockShadow(scene, 160, 420, 16, 14, 2.7, 0x17100c, 0.2);
    this.blockShadow(scene, 800, 432, 18, 12, 2.7, 0x17100c, 0.18);
    this.blockShadow(scene, 900, 432, 18, 12, 2.7, 0x17100c, 0.18);
  }

  static addSurfaceTexture(scene) {
    for (let y = 452; y < 540; y += 18) {
      scene.add.rectangle(480, y, 920, 2, 0x7a5947, 0.16).setDepth(1.3);
      scene.add.rectangle(480, y + 7, 900, 1, 0x2e211b, 0.12).setDepth(1.3);
    }

    this.pixelLine(scene, 270, 328, 130, 0x5f3d22, 3.15);
    this.pixelLine(scene, 270, 410, 130, 0x5f3d22, 3.15);
    this.pixelLine(scene, 615, 310, 88, 0x437596, 3.15);
    this.pixelLine(scene, 615, 345, 88, 0x437596, 3.15);
    this.pixelLine(scene, 615, 380, 88, 0x437596, 3.15);
    this.pixelLine(scene, 815, 374, 52, 0x6b5033, 3.15);
    this.pixelLine(scene, 805, 340, 42, 0x544330, 3.15);

    for (const chip of [
      [268, 410], [402, 399], [616, 252], [684, 367], [797, 405], [876, 302], [500, 426],
    ]) {
      scene.add.rectangle(chip[0], chip[1], 5, 3, 0x2b211b, 0.18).setDepth(3.2);
    }
  }

  static addMirrorDetail(scene) {
    scene.add.ellipse(642, 240, 22, 80, 0x8fb2bd, 0.16).setDepth(3.25);
    scene.add.rectangle(645, 222, 3, 54, 0xeaf7ff, 0.36).setAngle(20).setDepth(3.3);
    scene.add.rectangle(116, 324, 4, 34, 0xf2ffff, 0.34).setAngle(16).setDepth(3.3);
    scene.add.ellipse(120, 325, 38, 48, 0x8fb2bd, 0.12).setDepth(3.24);
  }

  static addLightFalloff(scene) {
    const warmLamp = scene.add.ellipse(156, 330, 310, 220, 0xffc276, 0.07).setDepth(45);
    const coolTube = scene.add.rectangle(850, 228, 290, 240, 0xbdeeff, 0.045).setDepth(44);
    const warmFloor = scene.add.ellipse(200, 460, 340, 90, 0xffb36c, 0.045).setDepth(46);
    const coolWall = scene.add.rectangle(850, 132, 210, 80, 0xe3fbff, 0.055).setDepth(46);

    warmLamp.setBlendMode(Phaser.BlendModes.ADD);
    coolTube.setBlendMode(Phaser.BlendModes.ADD);
    warmFloor.setBlendMode(Phaser.BlendModes.ADD);
    coolWall.setBlendMode(Phaser.BlendModes.ADD);
    scene.atmosphereLayers.tubeGlow = coolWall;
  }

  static addMemoryOverlay(scene) {
    scene.add.rectangle(480, 270, GAME_WIDTH, GAME_HEIGHT, 0xc0824a, 0.045).setDepth(82).setScrollFactor(0);
    scene.add.rectangle(480, 270, GAME_WIDTH, GAME_HEIGHT, 0x090807, 0.48).setDepth(82.5).setScrollFactor(0);

    const top = scene.add.rectangle(480, 0, GAME_WIDTH, 120, 0x100806, 0.18).setOrigin(0.5, 0).setDepth(83).setScrollFactor(0);
    const bottom = scene.add.rectangle(480, GAME_HEIGHT, GAME_WIDTH, 130, 0x100806, 0.2).setOrigin(0.5, 1).setDepth(83).setScrollFactor(0);
    const left = scene.add.rectangle(0, 270, 90, GAME_HEIGHT, 0x100806, 0.16).setOrigin(0, 0.5).setDepth(83).setScrollFactor(0);
    const right = scene.add.rectangle(GAME_WIDTH, 270, 90, GAME_HEIGHT, 0x100806, 0.16).setOrigin(1, 0.5).setDepth(83).setScrollFactor(0);

    top.setInteractive(false);
    bottom.setInteractive(false);
    left.setInteractive(false);
    right.setInteractive(false);
  }

  static addDust(scene) {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      return;
    }

    const lightZones = [
      { minX: 70, maxX: 245, minY: 210, maxY: 400, color: 0xfff0c2 },
      { minX: 770, maxX: 900, minY: 140, maxY: 320, color: 0xdffbff },
    ];

    lightZones.forEach((zone) => {
      for (let i = 0; i < 10; i += 1) {
        const dust = scene.add
          .rectangle(
            Phaser.Math.Between(zone.minX, zone.maxX),
            Phaser.Math.Between(zone.minY, zone.maxY),
            Phaser.Math.Between(1, 2),
            Phaser.Math.Between(1, 2),
            zone.color,
            Phaser.Math.FloatBetween(0.08, 0.18),
          )
          .setDepth(47);
        dust.baseAlpha = dust.alpha;
        dust.driftX = Phaser.Math.FloatBetween(0.006, 0.018);
        dust.driftY = Phaser.Math.FloatBetween(-0.018, -0.006);
        dust.minX = zone.minX;
        dust.maxX = zone.maxX;
        dust.minY = zone.minY;
        dust.maxY = zone.maxY;
        scene.atmosphereLayers.dust.push(dust);
      }
    });
  }

  static blockShadow(scene, x, y, width, height, depth, color, alpha) {
    const shadow = scene.add.ellipse(x, y, width, height, color, alpha).setDepth(depth);
    shadow.scaleY = 0.72;
    shadow.baseAlpha = alpha;
    return shadow;
  }

  static pixelLine(scene, x, y, width, color, depth) {
    scene.add.rectangle(x, y, width, 2, color, 0.24).setDepth(depth);
  }
}
