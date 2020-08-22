import TitleScene from './scenes/TitleScene';
import RoundScene from './scenes/RoundScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 700,
    scene: [TitleScene, RoundScene]
};

const game = new Phaser.Game(config);