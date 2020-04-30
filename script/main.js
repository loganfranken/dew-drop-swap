import TitleScene from './scenes/TitleScene';
import RoundScene from './scenes/RoundScene';
import RoundTransitionScene from './scenes/RoundTransitionScene';
import GameOverScene from './scenes/GameOverScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    scene: [TitleScene, RoundScene, RoundTransitionScene, GameOverScene]
};

const game = new Phaser.Game(config);