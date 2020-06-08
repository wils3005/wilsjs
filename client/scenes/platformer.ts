import { default as Phaser } from "phaser";

const { clientWidth, clientHeight } = window.document.documentElement;

export default class Scene extends Phaser.Scene {
  score: number;

  origin: {
    x: number;
    y: number;
  };

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
    this.origin = { x: clientWidth / 2, y: clientHeight / 2 };
  }

  preload(): void {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");

    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create(): void {
    // this.add.image(400, 300, "sky");
    this.scoreText = this.add.text(16, 16, "score: 0", Scene.textStyle);

    // this.platforms = this.physics.add.staticGroup();
    // this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
    // this.platforms.create(600, 400, "ground");
    // this.platforms.create(50, 250, "ground");
    // this.platforms.create(750, 220, "ground");

    // if (this.player.body instanceof Phaser.Physics.Arcade.Body)
    //   this.player.body.setGravityY(300);

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

    // this.physics.add.collider(this.player, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    // this.stars = this.physics.add.group({
    //   key: "star",
    //   repeat: 7,
    //   setXY: { x: 50, y: 0, stepX: 100 },
    // });

    // this.stars.children.iterate((child: any) => {
    //   child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    // });

    // this.physics.add.collider(this.stars, this.platforms);

    // this.physics.add.overlap(
    //   this.player,
    //   this.stars,
    //   this.collectStar.bind(this),
    //   undefined,
    //   this
    // );

    // this.bombs = this.physics.add.group();
    // this.physics.add.collider(this.bombs, this.platforms);

    // this.physics.add.collider(
    //   this.player,
    //   this.bombs,
    //   this.hitBomb.bind(this),
    //   undefined,
    //   this
    // );

    this.player = this.physics.add.sprite(
      Phaser.Math.Between(-this.origin.x / 2, this.origin.x / 2),
      Phaser.Math.Between(-this.origin.y / 2, this.origin.y / 2),
      "dude"
    );

    // this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.player.setVelocity(
      Phaser.Math.Between(-16, 16),
      Phaser.Math.Between(-16, 16)
    );
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

      this.player.body.setGravity(
        (clientWidth / 2 - this.player.body.x) * 8,
        (clientHeight / 2 - this.player.body.y) * 8
      );
    }
  }

  collectStar(_player: any, star: any): void {
    star.disableBody(true, true);
    this.score += 1;

    if (this.scoreText == undefined) {
      this.scoreText = new Phaser.GameObjects.Text(
        this,
        16,
        16,
        "score: 0",
        Scene.textStyle
      );
    }

    this.scoreText.setText("Score: " + this.score);
    if (this.stars == undefined) return;

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child: any) => {
        child.enableBody(true, child.x, 0, true, true);
      });

      if (this.bombs instanceof Phaser.Physics.Arcade.Group) {
        const bomb = this.bombs.create(this.bombX(), 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }
  }

  bombX(): number {
    if (this.player instanceof Phaser.Physics.Arcade.Sprite) {
      return this.player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);
    } else {
      return 0;
    }
  }

  hitBomb(): void {
    this.physics.pause();

    if (this.player instanceof Phaser.Physics.Arcade.Sprite) {
      this.player.setTint(0xff0000);
      this.player.anims.play("turn");
    }
  }
}
