export default class ChapterOneScene extends Phaser.Scene {
  constructor() {
    super("ChapterOneScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#090a0b");

    this.add
      .text(480, 176, "Chapter 1", {
        fontFamily: '"Silkscreen", "Pixelify Sans", system-ui, sans-serif',
        fontSize: "42px",
        color: "#f7ead4",
      })
      .setOrigin(0.5);

    this.add
      .text(480, 238, "Một ngày mới của Đen sẽ bắt đầu ở đây.", {
        fontFamily: '"Pixelify Sans", system-ui, sans-serif',
        fontSize: "24px",
        color: "#c9b797",
        align: "center",
        wordWrap: { width: 760 },
      })
      .setOrigin(0.5);

    const button = this.add
      .text(480, 330, "Chơi lại intro", {
        fontFamily: '"Silkscreen", "Pixelify Sans", system-ui, sans-serif',
        fontSize: "20px",
        color: "#100f0d",
        backgroundColor: "#d9b56f",
        padding: { x: 22, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on("pointerdown", () => this.scene.start("IntroScene", { forceReplay: true }));
  }
}

