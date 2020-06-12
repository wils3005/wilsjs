import { default as scene } from "./scenes/breakout";

const foo =
  window.innerWidth > window.innerHeight
    ? window.innerHeight
    : window.innerWidth;

const gameConfig: Phaser.Types.Core.GameConfig = {
  backgroundColor: "#000",
  physics: {
    arcade: {
      debug: true,
    },
    default: "arcade",
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "game",
    height: foo,
    width: foo,
  },
  scene,
  type: Phaser.AUTO,
};

new Phaser.Game(gameConfig);
