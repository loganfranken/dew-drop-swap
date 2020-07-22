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
        this.load.image('start-glow', 'assets/start_glow.png');
        this.load.image('start-active', 'assets/start_active.png');
    }

    create()
    {
        const self = this;

        // Background
        this.add.image(400, 400, 'background');

        // Title
        this.add.image(400, 200, 'title');

        // "Start" Button
        const startBtnGlow = this.add.image(400, 550, 'start-glow');
        startBtnGlow.setAlpha(0);

        this.tweens.add({
            targets: startBtnGlow,
            alpha: 1,
            duration: 1000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        const startBtn = this.add.image(400, 550, 'start');
        startBtn.setInteractive({ cursor: 'pointer' });

        const startBtnOverlay = this.add.image(400, 550, 'start-active');
        startBtnOverlay.setAlpha(0);

        startBtn.on('pointerover', () => {
            self.tweens.add({
                targets: startBtnOverlay,
                alpha: 1,
                duration: 100,
                ease: 'Sine.easeInOut'
            });
        });

        startBtn.on('pointerout', () => {
            self.tweens.add({
                targets: startBtnOverlay,
                alpha: 0,
                duration: 100,
                ease: 'Sine.easeInOut'
            });
        });

        startBtn.on('pointerdown', () => { self.scene.start('RoundScene', { level: 0 }); });
    }
    
}