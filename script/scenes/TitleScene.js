export default class extends Phaser.Scene {

    constructor()
    {
        super('TitleScene');
    }

    create()
    {
        const self = this;

        // Title
        this.add.text(50, 50, 'Match Three!');

        // "Start" Button
        const startBtn = this.add.text(50, 70, 'Start Game');
        startBtn.setInteractive();
        startBtn.on('pointerdown', () => { self.scene.start('RoundScene'); });
    }
    
}