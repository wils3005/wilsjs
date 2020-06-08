import { default as Phaser } from "phaser";

export default class Scene extends Phaser.Scene {
  score: number;

  bombs?: Phaser.Physics.Arcade.Group;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  platforms?: Phaser.Physics.Arcade.StaticGroup;
  player?: Phaser.Physics.Arcade.Sprite;
  scoreText?: Phaser.GameObjects.Text;
  stars?: Phaser.Physics.Arcade.Group;

  static settingsConfig: Phaser.Types.Scenes.SettingsConfig = {
    key: "Scene",
  };

  static textStyle = {
    fontSize: "16px",
    fill: "#000",
  };

  constructor() {
    super(Scene.settingsConfig);
    this.score = 0;
  }

  preload(): void {
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create(): void {
    this.scoreText = this.add.text(16, 16, "score: 0", Scene.textStyle);

    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    const graphics = this.add.graphics({ fillStyle: { color: 0xffff00 } });

    const circle = new Phaser.Geom.Circle(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      100
    );

    const gravityWell = new Phaser.GameObjects.Particles.GravityWell(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      4,
      0
    );

    console.log({ gravityWell });

    graphics.fillCircleShape(circle);

    this.player = this.physics.add.sprite(
      Phaser.Math.Between(0, this.game.canvas.width),
      Phaser.Math.Between(0, this.game.canvas.height),
      "dude"
    );

    this.player.setCollideWorldBounds(true);

    // this.player.setVelocity(
    //   Phaser.Math.Between(-64, 64),
    //   Phaser.Math.Between(-64, 64)
    // );
  }

  update(): void {
    if (this.player == undefined) return;
    if (this.cursors == undefined) return;

    // if (this.cursors.left && this.cursors.left.isDown) {
    //   this.player.setVelocityX(-100);
    //   this.player.anims.play("left", true);
    // } else

    if (this.player.body instanceof Phaser.Physics.Arcade.Body) {
      if (this.cursors.up && this.cursors.up.isDown) {
        this.player.body.setDrag(-0.1, -0.1);
        // this.player.body.setGravity(
        //   (clientWidth / 2 - this.player.body.x) * 2,
        //   (clientHeight / 2 - this.player.body.y) * 2
        // );
        // this.player.anims.play("up", true);
      } else if (this.cursors.down && this.cursors.down.isDown) {
        // this.player.anims.play("down", true);
      } else {
        this.player.body.setDrag(0, 0);

        this.player.anims.play("turn");
      }

      // this.player.body.setGravity(
      //   (this.game.canvas.width / 2 - this.player.body.x) * 8,
      //   (this.game.canvas.height / 2 - this.player.body.y) * 8
      // );
    }
  }
}
