import LoadingScene from './scenes/LoadingScene';
import RoundScene from './scenes/RoundScene';
import TitleScene from './scenes/TitleScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 700,
    scene: [LoadingScene, TitleScene, RoundScene]
};

const game = new Phaser.Game(config);