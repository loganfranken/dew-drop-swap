import TitleScene from './scenes/TitleScene';
import RoundScene from './scenes/RoundScene';
import RoundTransitionScene from './scenes/RoundTransitionScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 700,
    scene: [TitleScene, RoundScene, RoundTransitionScene]
};

const game = new Phaser.Game(config);