export default class TextBox {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.width = options.width ?? 820;
    this.height = options.height ?? 118;
    this.x = options.x ?? 70;
    this.y = options.y ?? 372;
    this.padding = options.padding ?? 24;
    this.typingEvent = null;
    this.fullText = "";
    this.visibleText = "";
    this.isTyping = false;

    this.container = scene.add.container(this.x, this.y).setDepth(options.depth ?? 90).setScrollFactor(0);
    this.panel = scene.add
      .rectangle(0, 0, this.width, this.height, 0x080908, 0.86)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0xf0d8a8, 0.55);
    this.shadow = scene.add
      .rectangle(6, 6, this.width, this.height, 0x000000, 0.35)
      .setOrigin(0, 0);
    this.text = scene.add.text(this.padding, this.padding, "", {
      fontFamily: '"DearPix", system-ui, sans-serif',
      fontSize: "22px",
      color: "#f8eedc",
      lineSpacing: 6,
      wordWrap: { width: this.width - this.padding * 2 },
    });
    this.prompt = scene.add
      .text(this.width - this.padding, this.height - 18, "tiếp tục ▸", {
        fontFamily: '"VT323", "DearPix", monospace',
        fontSize: "15px",
        color: "#d9b56f",
      })
      .setOrigin(1, 1)
      .setAlpha(0);

    this.container.add([this.shadow, this.panel, this.text, this.prompt]);
    this.container.setAlpha(0);

    scene.tweens.add({
      targets: this.prompt,
      alpha: { from: 0.25, to: 1 },
      duration: 650,
      yoyo: true,
      repeat: -1,
    });
  }

  resize(width = this.width, x = this.x) {
    this.width = width;
    this.x = x;
    this.container.setX(x);
    this.panel.setSize(width, this.height);
    this.shadow.setSize(width, this.height);
    this.text.setWordWrapWidth(width - this.padding * 2);
    this.prompt.setX(width - this.padding);
  }

  show() {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: 350,
      ease: "Sine.easeOut",
    });
  }

  hide() {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      duration: 250,
      ease: "Sine.easeIn",
    });
  }

  showLine(line, speed = 24) {
    this.show();
    this.stopTyping();
    this.fullText = line;
    this.visibleText = "";
    this.isTyping = true;
    this.prompt.setAlpha(0);
    this.text.setText("");

    let baseSpeed = speed;
    if (this.scene.gameSettings) {
      if (this.scene.gameSettings.textSpeed === 0) baseSpeed = 55;
      else if (this.scene.gameSettings.textSpeed === 1) baseSpeed = 35;
      else if (this.scene.gameSettings.textSpeed === 2) baseSpeed = 15;
    }

    let index = 0;
    this.typingEvent = this.scene.time.addEvent({
      delay: baseSpeed,
      loop: true,
      callback: () => {
        this.visibleText += this.fullText[index] ?? "";
        this.text.setText(this.visibleText);
        index += 1;

        if (index >= this.fullText.length) {
          this.stopTyping(false);
          this.prompt.setAlpha(1);
          
          if (this.scene.gameSettings?.autoAdvance) {
            this.scene.time.delayedCall(1800, () => {
              if (this.fullText === line && this.visibleText === this.fullText) {
                if (this.scene.handleSceneTap) this.scene.handleSceneTap();
              }
            });
          }
        }
      },
    });
  }

  completeLine() {
    if (!this.isTyping) {
      return false;
    }

    this.stopTyping(false);
    this.text.setText(this.fullText);
    this.prompt.setAlpha(1);
    return true;
  }

  setInstant(line, showPrompt = false) {
    this.show();
    this.stopTyping();
    this.fullText = line;
    this.text.setText(line);
    this.prompt.setAlpha(showPrompt ? 1 : 0);
  }

  stopTyping(clear = true) {
    if (this.typingEvent) {
      this.typingEvent.remove(false);
      this.typingEvent = null;
    }

    this.isTyping = false;
    if (clear) {
      this.prompt.setAlpha(0);
    }
  }
}

