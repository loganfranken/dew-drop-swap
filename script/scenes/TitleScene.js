export default class extends Phaser.Scene {

    constructor()
    {
        super('TitleScene');
    }

    preload()
    {
        this.load.image('background', 'assets/background.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('start', 'assets/start.png');
    }

    create()
    {
        const self = this;

        // Background
        this.add.image(400, 400, 'background');

        // Title
        this.add.image(400, 200, 'title');

        // "Start" Button
        const startBtn = this.add.image(400, 600, 'start');
        startBtn.setInteractive();

        startBtn.on('pointerover', () => { startBtn.setTintFill(0xffffff); });
        startBtn.on('pointerout', () => { startBtn.clearTint(); });

        startBtn.on('pointerdown', () => { self.scene.start('RoundScene', { level: 0 }); });
    }
    
}