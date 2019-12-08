import TitleScene from './scenes/TitleScene';
import RoundScene from './scenes/RoundScene';
import GameOverScene from './scenes/GameOverScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 1200, // 600
    scene: [TitleScene, RoundScene, GameOverScene]
};

const game = new Phaser.Game(config);