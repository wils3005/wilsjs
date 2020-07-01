// import Phaser from "phaser";

// const settingsConfig: Phaser.Types.Scenes.SettingsConfig = {
//   key: "Scene",
// };

// const createBrickGroupConfig: Phaser.Types.GameObjects.Group.GroupCreateConfig = {
//   key: "assets",
//   frame: ["blue1", "red1", "green1", "yellow1", "silver1", "purple1"],
//   frameQuantity: 16,
//   gridAlign: {
//     width: 16,
//     height: 6,
//     cellWidth: 64,
//     cellHeight: 32,
//     x: 112,
//     y: 100,
//   },
// };

// function hitPaddle(
//   ball: Phaser.Physics.Arcade.Image,
//   paddle: Phaser.Physics.Arcade.Image
// ): void {
//   let diff = 0;

//   if (ball.x < paddle.x) {
//     diff = paddle.x - ball.x;
//     ball.setVelocityX(-10 * diff);
//   } else if (ball.x > paddle.x) {
//     diff = ball.x - paddle.x;
//     ball.setVelocityX(10 * diff);
//   } else {
//     ball.setVelocityX(2 + Math.random() * 8);
//   }
// }

// function resetBrick(brick: Phaser.Physics.Arcade.Image) {
//   brick.enableBody(false, 0, 0, true, true);
// }

// export default class Scene extends Phaser.Scene {
//   bricks: Phaser.Physics.Arcade.StaticGroup;
//   paddle: Phaser.Physics.Arcade.Image;
//   ball: Phaser.Physics.Arcade.Image;

//   constructor() {
//     super(settingsConfig);
//     this.bricks;
//     this.paddle;
//     this.ball;
//   }

//   preload(): void {
//     this.load.atlas("assets", "breakout.png", "breakout.json");
//   }

//   create(): void {
//     this.physics.world.setBoundsCollision(true, true, true, false);
//     this.bricks = this.physics.add.staticGroup(createBrickGroupConfig);

//     this.ball = this.physics.add
//       .image(
//         this.game.canvas.width / 2,
//         this.game.canvas.height / 2,
//         "assets",
//         "ball1"
//       )
//       .setCollideWorldBounds(true)
//       .setBounce(1);

//     this.ball.setData("onPaddle", true);

//     this.paddle = this.physics.add
//       .image(
//         this.game.canvas.width / 2,
//         this.game.canvas.height - 100,
//         "assets",
//         "paddle1"
//       )
//       .setImmovable();

//     const hitBrick = (
//       _ball: Phaser.Physics.Arcade.Image,
//       brick: Phaser.Physics.Arcade.Image
//     ) => {
//       brick.disableBody(true, true);
//       if (this.bricks.countActive() === 0) this.resetLevel();
//     };

//     this.physics.add.collider(this.ball, this.bricks, hitBrick, null, this);
//     this.physics.add.collider(this.ball, this.paddle, hitPaddle, null, this);

//     const handlePointerMove = (pointer: Phaser.Input.Pointer) => {
//       this.paddle.x = Phaser.Math.Clamp(
//         pointer.x,
//         52,
//         this.game.canvas.width - 52
//       );

//       if (this.ball.getData("onPaddle")) {
//         this.ball.x = this.paddle.x;
//       }
//     };

//     this.input.on("pointermove", handlePointerMove, this);

//     const handlePointerUp = () => {
//       if (this.ball.getData("onPaddle")) {
//         this.ball.setVelocity(-75, -300);
//         this.ball.setData("onPaddle", false);
//       }
//     };

//     this.input.on("pointerup", handlePointerUp, this);
//   }

//   update(): void {
//     if (this.ball.y > 1200) this.resetBall();
//   }

//   resetBall(): void {
//     this.ball.setVelocity(0);
//     this.ball.setPosition(this.paddle.x, this.game.canvas.height / 2);
//     this.ball.setData("onPaddle", true);
//   }

//   resetLevel(): void {
//     this.resetBall();
//     this.bricks.children.each(resetBrick);
//   }
// }
