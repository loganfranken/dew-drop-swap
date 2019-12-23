export default class extends Phaser.Scene {

    constructor()
    {
        super('GameOverScene');

        this.finalScore = 0;
    }

    init(data)
    {
        this.finalScore = data.score;
    }

    create()
    {
        const self = this;

        // Title
        this.add.text(50, 50, 'Game Over!');

        // Score
        this.add.text(50, 100, `Final Score: ${this.finalScore}`);

        // "Return to Main Menu" Button
        const startOverBtn = this.add.text(50, 150, 'Return to Main Menu');
        startOverBtn.setInteractive();
        startOverBtn.on('pointerdown', () => { self.scene.start('TitleScene'); });
    }
    
}